import { ExtensionPage } from "./ExtensionPage.js";
import { test, expect } from "./fixture.js";

test("The sign-in button should be visible on the first view", async ({
  page,
  extensionId,
}) => {
  const extPage = await ExtensionPage.from(page, extensionId);
  await expect(await extPage.hasUnauthorizedWarning()).toEqual(true);
  await expect(extPage.page).toHaveScreenshot();
});

test("The sign-in button should not be visible if already signed-in", async ({
  page,
  extensionId,
}) => {
  const extPage = await ExtensionPage.from(page, extensionId, () => {
    chrome.identity.getAuthToken = (
      _: unknown,
      callback?: (token: string) => void
    ) => callback?.("xxx");
  });
  await expect(await extPage.hasUnauthorizedWarning()).toEqual(false);
  await expect(extPage.page).toHaveScreenshot();
});

test("sign-out should work", async ({ page, extensionId }) => {
  const extPage = await ExtensionPage.from(page, extensionId, () => {
    chrome.identity.getAuthToken = (
      _: unknown,
      callback?: (token: string) => void
    ) => callback?.("xxx");
  });
  await expect(await extPage.hasUnauthorizedWarning()).toEqual(false);
  await extPage.signOut();
  await expect(await extPage.hasUnauthorizedWarning()).toEqual(true);
});
