import { PlaywrightTestConfig, defineConfig, devices } from "@playwright/test";

const ciConfig: Partial<PlaywrightTestConfig> = {
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: "github",
  use: {
    actionTimeout: 30000,
    trace: "on-first-retry",
    screenshot: "on",
    headless: true,
  },
};
const localConfig: Partial<PlaywrightTestConfig> = {
  forbidOnly: false,
  retries: 0,
  workers: undefined,
  reporter: "dot",
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
    screenshot: "on",
    headless: false,
  },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 660 },
      },
    },
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results/",

  ...(process.env.CI ? ciConfig : localConfig),
});
