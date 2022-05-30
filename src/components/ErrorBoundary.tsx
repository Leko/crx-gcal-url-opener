import React from "react";
import { Alert, Box } from "@mui/material";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box m={2}>
          <Alert color="error">{this.state.error.stack}</Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
