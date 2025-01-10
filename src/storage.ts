export type ScheduledEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  url: string;
};

const KEY_EVETNS = "events_1";

export async function clearAllEvents(): Promise<void> {
  await chrome.storage.local.remove([KEY_EVETNS]);
}

export async function upsertEvent(
  id: string,
  newValue: ScheduledEvent
): Promise<void> {
  const prev = await getAllEvents();
  await chrome.storage.local.set({
    [KEY_EVETNS]: JSON.stringify([...prev.set(id, newValue).entries()]),
  });
}

export async function removeEvent(id: string): Promise<void> {
  const prev = await getAllEvents();
  await chrome.storage.local.set({
    [KEY_EVETNS]: JSON.stringify(
      [...prev.entries()].filter(([key]) => key !== id)
    ),
  });
}

export async function getEvent(id: string): Promise<ScheduledEvent | null> {
  const map = await getAllEvents();
  return map.get(id) ?? null;
}

export function getAllEvents(): Promise<Map<string, ScheduledEvent>> {
  return chrome.storage.local
    .get([KEY_EVETNS])
    .then(({ [KEY_EVETNS]: value }) => new Map(JSON.parse(value ?? "[]")));
}
