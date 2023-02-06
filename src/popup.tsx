import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { Alert, AlertTitle, Box, Paper } from "@mui/material";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppBar } from "./components/AppBar";
import { Timeline } from "@mui/lab";
import { Footer } from "./components/Footer";
import { UnauthorizedAlert } from "./components/UnauthorizedAlert";
import { EventTimelineItem } from "./components/EventTimelineItem";
import { useAuth } from "./hooks/useAuth";
import { useEvents } from "./hooks/useEvents";
import { useNetworkState } from "./hooks/useNetworkState";
import { useI18n } from "./hooks/useI18n";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function App() {
  const { t } = useI18n();
  const { isAuthenticated, signIn, signOut } = useAuth();
  const { events, refresh } = useEvents();
  const { onLine } = useNetworkState();
  const [mountedAt] = useState(Date.now());
  const todaysOrUpcomingEvents = useMemo(() => {
    return events
      .filter(
        (e) =>
          startOfDay(e.endsAt).getTime() >=
          startOfDay(new Date(mountedAt)).getTime()
      )
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }, [mountedAt, events]);

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
        onRefresh={refresh}
        onSignOut={signOut}
      />
      {isAuthenticated ? (
        <Box my={2} mt={8}>
          <Timeline sx={{ padding: 0 }}>
            {todaysOrUpcomingEvents.map((event) => (
              <EventTimelineItem
                past={event.startsAt.getTime() < mountedAt}
                event={event}
              />
            ))}
          </Timeline>
          {onLine ? null : (
            <Box m={1} position="fixed" bottom={10}>
              <Paper>
                <Alert severity="warning">
                  <AlertTitle>{t("offlineNoticeTitle")}</AlertTitle>
                  {t("offlineNoticeDescription")}
                </Alert>
              </Paper>
            </Box>
          )}
        </Box>
      ) : (
        <Box my={2} pt={8}>
          <UnauthorizedAlert onSignIn={signIn} />
        </Box>
      )}
      <Footer />
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
