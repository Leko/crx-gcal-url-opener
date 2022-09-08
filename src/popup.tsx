import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { getAuthToken } from "./auth";
import { AppBar } from "./components/AppBar";
// import { EventList } from "./components/EventList";
import { URL_PRIVACY_POLICY } from "./constants";
import googleSigninDarkNormal from "./images/btn_google_signin_dark_normal_web@2x.png";
import pkg from "../package.json";
import { t } from "./i18n";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import OpenInNew from "@mui/icons-material/OpenInNew";

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
  if (Math.abs(mins) < 60) {
    return chrome.i18n.getMessage("inNMinutes", [mins.toFixed(0)]);
  }
  if (Math.abs(mins) / 60 < 24) {
    return chrome.i18n.getMessage("inNHours", [(mins / 60).toFixed(1)]);
  }
  return chrome.i18n.getMessage("inNDays", [(mins / 60 / 24).toFixed(1)]);
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
  const timeFormatter = new Intl.DateTimeFormat(chrome.i18n.getUILanguage(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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
  useLayoutEffect(() => {
    document
      .querySelector(".upcoming")
      ?.previousElementSibling?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, [events]);

  return (
    <div style={{ width: 360 }}>
      <AppBar
        isAuthenticated={isAuthenticated}
        onRefresh={handleRefresh}
        onSignOut={handleSignOut}
      />
      {isAuthenticated ? (
        <Box my={2} mt={8}>
          <Timeline sx={{ padding: 0 }}>
            {events.map((event) => {
              const past = event.startsAt.getTime() < mountedAt.getTime();
              return (
                <TimelineItem className={past ? undefined : "upcoming"}>
                  <TimelineOppositeContent
                    color="text.secondary"
                    sx={{ width: 80, flex: "none", paddingLeft: 0 }}
                  >
                    <Typography>
                      {timeFormatter.format(event.startsAt)}
                    </Typography>
                    {past ? null : (
                      <Typography>
                        {relativeDuration(event.startsIn)}
                      </Typography>
                    )}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      variant={past ? "outlined" : "filled"}
                      color={past ? "grey" : "primary"}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Grid container>
                      <Grid item flex={1} sx={{ overflow: "hidden" }}>
                        <Typography color={past ? "text.secondary" : undefined}>
                          {event.title}
                        </Typography>
                        <Typography color="text.secondary">
                          {timeFormatter.format(event.startsAt)}~
                          {timeFormatter.format(event.endsAt)} (
                          {(event.endsAt.getTime() - event.startsAt.getTime()) /
                            1000 /
                            60}
                          m)
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton
                          edge="end"
                          href={event.url}
                          target="_blank"
                          rel="noreferer"
                        >
                          <OpenInNew />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </Box>
      ) : (
        <Box my={2} pt={8}>
          <Alert color="warning">
            {t("unAuthorized")}
            <Button onClick={handleSignIn} variant="text">
              <img
                src={chrome.runtime.getURL(googleSigninDarkNormal)}
                height="48"
                style={{ maxWidth: "100%", marginTop: 8 }}
              />
            </Button>
          </Alert>
        </Box>
      )}
      <Container component="footer">
        <Typography variant="body2">
          &copy;{` Leko | v${pkg.version} | `}
          <a href={URL_PRIVACY_POLICY} target="_blank" rel="noopener">
            {t("privacyPolicy")}
          </a>
        </Typography>
      </Container>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
