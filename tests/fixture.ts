import { join, dirname } from "path";
import { BrowserContext, chromium, test as base } from "@playwright/test";

export { expect } from "@playwright/test";

type MyFixtures = {
  context: BrowserContext;
  extensionId: string;
};

const __dirname = dirname(new URL(import.meta.url).pathname);

export const test = base.extend<MyFixtures>({
  context: async ({}, use) => {
    const pathToExtension = join(__dirname, "..", "dist");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});
