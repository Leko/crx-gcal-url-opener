import { useCallback, useEffect, useMemo, useState } from "react";
import { ParsedEvent, PortableEvent } from "../types/Event";
import { useAuth } from "./useAuth";

export function useEvents() {
  const { isAuthenticated } = useAuth();
  const [eventMap, setEventMap] = useState(new Map<string, PortableEvent>());
  const events = useMemo(
    () =>
      Array.from(eventMap.values()).map(
        (event: PortableEvent): ParsedEvent => ({
          ...event,
          startsAt: new Date(event.startsAt),
          endsAt: new Date(event.endsAt),
          startsIn: new Date(event.startsAt).getTime() - Date.now(),
          duration:
            new Date(event.endsAt).getTime() -
            new Date(event.startsAt).getTime(),
        })
      ),
    [eventMap]
  );

  const listReminders = useCallback(() => {
    chrome.runtime.sendMessage({ type: "ListReminders" }).then((res) => {
      setEventMap(
        res.reduce(
          (map: Map<string, PortableEvent>, event: PortableEvent) =>
            map.set(event.id, event),
          new Map()
        )
      );
    });
  }, []);
  const refresh = useCallback(() => {
    chrome.runtime
      .sendMessage({ type: "RefreshRequest" })
      .then(() => listReminders());
  }, [listReminders]);

  useEffect(() => {
    listReminders();
  }, [isAuthenticated]);

  return {
    events,
    refresh,
  };
}
