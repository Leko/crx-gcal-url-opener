import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Grid, IconButton, Typography } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { useI18n } from "../hooks/useI18n";
import { ParsedEvent } from "../types/Event";

type Props = {
  past: boolean;
  event: ParsedEvent;
};

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

export function EventTimelineItem(props: Props) {
  const { past, event } = props;
  const { timeFormatter } = useI18n();

  return (
    <TimelineItem className={past ? undefined : "upcoming"}>
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ width: 80, flex: "none", paddingLeft: 0 }}
      >
        <Typography>{timeFormatter.format(event.startsAt)}</Typography>
        {past ? null : (
          <Typography>{relativeDuration(event.startsIn)}</Typography>
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
              {(event.endsAt.getTime() - event.startsAt.getTime()) / 1000 / 60}
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
}
