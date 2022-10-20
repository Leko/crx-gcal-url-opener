import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "../auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = useCallback(() => {
    chrome.runtime.sendMessage({ type: "SignInRequest" });
  }, []);
  const signOut = useCallback(() => {
    chrome.runtime.sendMessage({ type: "SignOutRequest" });
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    getAuthToken(false).then(
      () => setIsAuthenticated(true),
      () => setIsAuthenticated(false)
    );
  }, []);

  return {
    isAuthenticated,
    signIn,
    signOut,
  };
}
