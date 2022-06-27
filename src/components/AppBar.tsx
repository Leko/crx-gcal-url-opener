import React from "react";
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import RepeatIcon from "@mui/icons-material/Repeat";

type Props = {
  isAuthenticated: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
  onSignIn: () => void;
};

export function AppBar(props: Props) {
  const { isAuthenticated, onRefresh, onSignOut, onSignIn } = props;

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
        ) : (
          <Tooltip title="Sign in with Google">
            <IconButton onClick={onSignIn}>
              <LoginIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}
