export type ScheduledEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  url: string;
};

const KEY_EVETNS = "events_1";
const KEY_OPENED = "opened";

export async function clearAllEvents(): Promise<void> {
  await chrome.storage.local.remove([KEY_EVETNS, KEY_OPENED]);
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

export async function isOpened(id: string): Promise<boolean> {
  const set = await loadOpenedFlags();
  return set.has(id);
}

export async function markAsOpened(id: string): Promise<void> {
  const set = await loadOpenedFlags();
  set.add(id);
  await chrome.storage.local.set({ [KEY_OPENED]: JSON.stringify([...set]) });
}

function loadOpenedFlags(): Promise<Set<string>> {
  return chrome.storage.local
    .get([KEY_OPENED])
    .then(({ [KEY_OPENED]: value }) => new Set(JSON.parse(value ?? "[]")));
}
