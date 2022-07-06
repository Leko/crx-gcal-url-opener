import React from "react";
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RepeatIcon from "@mui/icons-material/Repeat";

type Props = {
  isAuthenticated: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
};

export function AppBar(props: Props) {
  const { isAuthenticated, onRefresh, onSignOut } = props;

  return (
    <MuiAppBar>
      <Toolbar>
        <Typography variant="subtitle1">gcal-url-opener</Typography>
        <div style={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <>
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <RepeatIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign out">
              <IconButton onClick={onSignOut}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : null}
      </Toolbar>
    </MuiAppBar>
  );
}
