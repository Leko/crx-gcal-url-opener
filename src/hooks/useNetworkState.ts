import { useEffect, useState } from "react";

export function useNetworkState() {
  const [onLine, setOnLine] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffLine = () => setOnLine(false);
    const handleOnLine = () => setOnLine(true);
    window.addEventListener("offline", handleOffLine);
    window.addEventListener("online", handleOnLine);

    return () => {
      window.removeEventListener("offline", handleOffLine);
      window.removeEventListener("online", handleOnLine);
    };
  }, []);

  return {
    onLine,
  };
}
