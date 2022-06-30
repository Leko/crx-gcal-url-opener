import { getAuthToken, getProfileUserInfo } from "./auth";
import { isFutureEvent, listAllEvents, willParticipate } from "./calendar";
import { loadConfig } from "./config";
import {
  getAllEvents,
  getEvent,
  isOpened,
  markAsOpened,
  ScheduledEvent,
  upsertEvent,
} from "./storage";

type ListAccountRequest = { type: "ListAccountRequest" };
type SignInRequest = { type: "SignInRequest" };
type SignOutRequest = { type: "SignOutRequest" };
type RefreshRequest = { type: "RefreshRequest" };
type ListReminders = { type: "ListReminders" };
type IncomingMessage =
  | ListAccountRequest
  | SignInRequest
  | SignOutRequest
  | RefreshRequest
  | ListReminders;

let loading = Promise.resolve();

async function dispatch(message: IncomingMessage) {
  switch (message.type) {
    case "SignInRequest":
      await getProfileUserInfo();
      loading = startWatching();
      return;
    case "SignOutRequest": {
      const token = await getAuthToken();
      await Promise.all([
        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`),
        new Promise<void>((resolve) =>
          chrome.identity.removeCachedAuthToken({ token }, resolve)
        ),
        new Promise<void>((resolve) =>
          chrome.identity.clearAllCachedAuthTokens(resolve)
        ),
      ]);
      return;
    }
    case "RefreshRequest":
      return loading.then(() => startWatching);
    case "ListReminders": {
      return [...(await getAllEvents()).values()];
    }
    default:
      throw new Error(`Unrecognized type: ${JSON.stringify(message)}`);
  }
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

async function startWatching() {
  const [accessToken, user, config] = await Promise.all([
    getAuthToken(),
    getProfileUserInfo(),
    loadConfig(),
    chrome.action.setBadgeText({ text: "-" }),
  ]);
  const allEvents = await listAllEvents(accessToken, "primary");
  const matched = allEvents
    .filter(
      (e) =>
        willParticipate(e, user.email) &&
        isFutureEvent(e) &&
        !!config.extractValidUrl(e)
    )
    .map((event): ScheduledEvent => {
      let { url, rule } = config.extractValidUrl(event)!;
      if (rule.provider === "Google Meet") {
        const tmp = new URL(url);
        tmp.searchParams.set("authuser", user.email);
        url = tmp.toString();
      }
      return {
        id: event.id,
        title: event.summary,
        startsAt: event.start?.dateTime ?? null,
        endsAt: event.end?.dateTime ?? null,
        url: url!,
      };
    });
  await chrome.action.setBadgeText({
    text: String(
      matched.filter((e) => isSameDay(new Date(e.startsAt), new Date())).length
    ),
  });
  for (const event of matched) {
    await registerReminder(event);
  }
}

async function registerReminder(event: ScheduledEvent) {
  const config = await loadConfig();
  const startsAt = new Date(event.startsAt);
  await chrome.alarms.clear(event.id);
  await Promise.all([
    chrome.alarms.create(event.id, {
      when: startsAt.getTime() - config.offset,
    }),
    upsertEvent(event.id, event),
  ]);
}

async function init() {
  const [config, authToken] = await Promise.all([
    loadConfig(),
    getAuthToken(false),
  ]);
  if (authToken) {
    loading = startWatching();
  }
  await chrome.alarms.create("CRX_GCAL_REFRESH", {
    periodInMinutes: config.pollInterval,
  });
}

chrome.runtime.onMessage.addListener((message, _sender, callback) => {
  dispatch(message).then(callback, callback);
  return true;
});
chrome.alarms.onAlarm.addListener(async (alerm) => {
  switch (alerm.name) {
    case "CRX_GCAL_REFRESH": {
      loading = startWatching();
      return;
    }
    default: {
      const event = await getEvent(alerm.name);
      if (!event || (await isOpened(alerm.name))) {
        return;
      }
      await markAsOpened(alerm.name);
      const tab = await chrome.tabs.create({ url: event.url });
      await chrome.windows.update(tab.windowId, {
        focused: true,
        drawAttention: true,
      });
    }
  }
});

init();
