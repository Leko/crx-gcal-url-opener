import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { getAuthToken } from "./auth";
import { AppBar } from "./components/AppBar";
import { EventList } from "./components/EventList";

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

function App() {
  const [mountedAt] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    setIsAuthenticated(false);
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
    getAuthToken(false)
      .then(
        () => true,
        () => false
      )
      .then(setIsAuthenticated);
  }, []);
  useEffect(() => {
    listReminders();
  }, [isAuthenticated]);

  return (
    <div style={{ width: 320 }}>
      <AppBar
        isAuthenticated={isAuthenticated}
        onRefresh={handleRefresh}
        onSignOut={handleSignOut}
      />
      <Container>
        <Typography variant="subtitle1">{events.length} events</Typography>
      </Container>
      {isAuthenticated ? (
        <Box my={2}>
          <EventList subheader={"Events on today"} events={eventsOnToday} />
          <EventList subheader={"Upcoming events"} events={upcomingEvents} />
        </Box>
      ) : (
        <Box my={2} pt={2}>
          <Alert color="warning">
            You are not logged in to Google. Please log in with the Google
            account you wish to link your calendar to.
            <Button onClick={handleSignIn} variant="text">
              <img
                src="btn_google_signin_dark_normal_web@2x.png"
                height="48"
                style={{ maxWidth: "100%", marginTop: 8 }}
              />
            </Button>
          </Alert>
        </Box>
      )}
      <Container component="footer">
        <Typography variant="body2">
          &copy; Leko{" | "}
          <a
            href="https://leko.jp/crx-gcal-url-opener/#%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC%E3%81%B8%E3%81%AE%E5%8F%96%E3%82%8A%E7%B5%84%E3%81%BF"
            target="_blank"
            rel="noopener"
          >
            Privacy Policy
          </a>
        </Typography>
      </Container>
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

// @ts-expect-error createRoot is experimental
ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
