import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import RepeatIcon from "@mui/icons-material/Repeat";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Event = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  url: string;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function relativeDuration(duration: number) {
  const mins = duration / 1000 / 60;
  if (mins < 60) {
    return `${mins.toFixed(0)} mins`;
  }
  if (mins / 60 < 24) {
    return `${(mins / 60).toFixed(1)} hours`;
  }
  return `${(mins / 60 / 24).toFixed(1)} days`;
}

function App() {
  const [mountedAt] = useState(new Date());
  const [eventMap, setEventMap] = useState(new Map<string, Event>());
  const events = useMemo(
    () =>
      Array.from(eventMap.values())
        .map((event: Event) => ({
          ...event,
          startsAt: new Date(event.startsAt),
          endsAt: new Date(event.endsAt),
          startsIn: new Date(event.startsAt).getTime() - Date.now(),
        }))
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime()),
    [eventMap]
  );
  const eventsOnToday = useMemo(
    () =>
      events.filter(
        (event) =>
          isSameDay(event.startsAt, mountedAt) &&
          event.startsAt.getTime() > mountedAt.getTime()
      ),
    [events, mountedAt]
  );
  const eventsOnTodayIds = useMemo(
    () => new Set(eventsOnToday.map((event) => event.id)),
    [eventsOnToday]
  );
  const upcomingEvents = useMemo(
    () => events.filter((event) => !eventsOnTodayIds.has(event.id)),
    [events, eventsOnTodayIds]
  );

  const handleSignIn = useCallback(() => {
    chrome.runtime.sendMessage({ type: "SignInRequest" });
  }, []);
  const handleSignOut = useCallback(() => {
    chrome.runtime.sendMessage({ type: "SignOutRequest" });
  }, []);
  const listReminders = useCallback(() => {
    chrome.runtime.sendMessage({ type: "ListReminders" }).then((res) => {
      setEventMap(
        res.reduce(
          (map: Map<string, unknown>, event: Event) => map.set(event.id, event),
          new Map()
        )
      );
    });
  }, []);
  const handleRefresh = useCallback(() => {
    chrome.runtime
      .sendMessage({ type: "RefreshRequest" })
      .then(() => listReminders());
  }, [listReminders]);

  useEffect(() => {
    listReminders();
  }, []);

  return (
    <div style={{ width: 320 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="subtitle1">gcal-url-opener</Typography>
          <div style={{ flexGrow: 1 }} />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RepeatIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign in with Google">
            <IconButton onClick={handleSignIn}>
              <LoginIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={handleSignOut}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container>
        <Typography variant="subtitle1">{events.length} events</Typography>
      </Container>
      <Box my={2}>
        <List dense subheader={<ListSubheader>Events on today</ListSubheader>}>
          {eventsOnToday.map((e) => (
            <ListItem
              key={e.id}
              dense
              secondaryAction={
                <IconButton
                  edge="end"
                  href={e.url}
                  target="_blank"
                  rel="noreferer"
                >
                  <OpenInNew />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${e.title} in ${relativeDuration(e.startsIn)}`}
                secondary={e.url}
              />
            </ListItem>
          ))}
          {eventsOnToday.length === 0 ? (
            <ListItem dense>
              <ListItemText primary={`No more events today.`} />
            </ListItem>
          ) : null}
        </List>
        <List dense subheader={<ListSubheader>Upcoming events</ListSubheader>}>
          {upcomingEvents.map((e) => (
            <ListItem
              key={e.id}
              dense
              secondaryAction={
                <IconButton
                  edge="end"
                  href={e.url}
                  target="_blank"
                  rel="noreferer"
                >
                  <OpenInNew />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${e.title} in ${relativeDuration(e.startsIn)}`}
                secondary={e.url}
              />
            </ListItem>
          ))}
          {upcomingEvents.length === 0 ? (
            <ListItem dense>
              <ListItemText primary={`No more upcoming events.`} />
            </ListItem>
          ) : null}
        </List>
      </Box>
    </div>
  );
}

function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
