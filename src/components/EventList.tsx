import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import ExpandMore from "@mui/icons-material/ExpandMore";

type Event = {
  id: string;
  title: string;
  url: string;
  startsAt: Date;
  endsAt: Date;
  startsIn: number; // ms
};

type Props = {
  subheader: string;
  events: Event[];
};

function relativeDuration(duration: number) {
  const mins = duration / 1000 / 60;
  if (Math.abs(mins) < 60) {
    return `${mins.toFixed(0)} mins`;
  }
  if (Math.abs(mins) / 60 < 24) {
    return `${(mins / 60).toFixed(1)} hours`;
  }
  return `${(mins / 60 / 24).toFixed(1)} days`;
}

export function EventList(props: Props) {
  const { subheader, events } = props;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMore />}>
        {
          <Typography variant="subtitle2">
            {subheader}{" "}
            <Chip variant="filled" label={events.length} size="small" />
          </Typography>
        }
      </AccordionSummary>
      <AccordionDetails>
        <List disablePadding>
          {events.map((e) => (
            <ListItem
              key={e.id}
              dense
              disablePadding
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
                secondaryTypographyProps={{
                  style: {
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  },
                }}
              />
            </ListItem>
          ))}
          {events.length === 0 ? (
            <ListItem dense>
              <ListItemText primary={`No more upcoming events.`} />
            </ListItem>
          ) : null}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
