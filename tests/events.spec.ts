import { ExtensionPage } from "./ExtensionPage.js";
import { test, expect } from "./fixture.js";

test("List events in order of start time", async ({ page, extensionId }) => {
  const extPage = await ExtensionPage.from(page, extensionId, () => {
    const today = new Date(2023, 0, 1);
    const addMinutes = (date: Date, mins: number) =>
      new Date(date.getTime() + 1000 * 60 * mins);
    Date.now = () => today.getTime();

    chrome.identity.getAuthToken = (
      _: unknown,
      callback?: (token: string) => void
    ) => callback?.("xxx");
    // @ts-expect-error sendMessage is defined with overload
    chrome.runtime.sendMessage = (() => {
      const origin = chrome.runtime.sendMessage.bind(chrome.runtime);
      return (message: { type: string }) => {
        if (message.type === "ListReminders") {
          return Promise.resolve([
            {
              id: "1",
              title: "A 30min event",
              startsAt: addMinutes(today, 10).toISOString(),
              endsAt: addMinutes(today, 40).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
            {
              id: "3",
              title: "A 1hour event",
              startsAt: addMinutes(today, 60).toISOString(),
              endsAt: addMinutes(today, 120).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
            {
              id: "2",
              title: "A 10min event",
              startsAt: addMinutes(today, 50).toISOString(),
              endsAt: addMinutes(today, 60).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
          ]);
        }
        return origin(message);
      };
    })();
  });
  await expect(extPage.page).toHaveScreenshot();
});

test("List past events correctly", async ({ page, extensionId }) => {
  const extPage = await ExtensionPage.from(page, extensionId, () => {
    const today = new Date(2023, 0, 1, 10);
    const addMinutes = (date: Date, mins: number) =>
      new Date(date.getTime() + 1000 * 60 * mins);
    Date.now = () => today.getTime();

    chrome.identity.getAuthToken = (
      _: unknown,
      callback?: (token: string) => void
    ) => callback?.("xxx");
    // @ts-expect-error sendMessage is defined with overload
    chrome.runtime.sendMessage = (() => {
      const origin = chrome.runtime.sendMessage.bind(chrome.runtime);
      return (message: { type: string }) => {
        if (message.type === "ListReminders") {
          return Promise.resolve([
            {
              id: "1",
              title: "A 30min event",
              startsAt: addMinutes(today, -40).toISOString(),
              endsAt: addMinutes(today, -10).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
            {
              id: "2",
              title: "A 1hour event",
              startsAt: addMinutes(today, -10).toISOString(),
              endsAt: addMinutes(today, 50).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
            {
              id: "3",
              title: "A 10min event",
              startsAt: addMinutes(today, 50).toISOString(),
              endsAt: addMinutes(today, 60).toISOString(),
              url: "https://meet.google.com/xxx-xxxx-xxx",
            },
          ]);
        }
        return origin(message);
      };
    })();
  });
  await expect(extPage.page).toHaveScreenshot();
});
