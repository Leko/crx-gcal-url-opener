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
import { t } from "../i18n";

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
        <Typography variant="subtitle1">{t("appName")}</Typography>
        <div style={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <>
            <Tooltip title={t("refresh")}>
              <IconButton onClick={onRefresh}>
                <RepeatIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("signOut")}>
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
