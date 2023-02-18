import { Page } from "playwright-core";

export class ExtensionPage {
  static async from(
    page: Page,
    extensionId: string,
    initScript?: () => void
  ): Promise<ExtensionPage> {
    // Inject mock Chrome Manifest v3 API
    await page.addInitScript(initScript ?? (() => {}));

    await page.goto(`chrome-extension://${extensionId}/src/popup.html`);

    // mask app version to remove unintended visual diffs
    await page
      .getByTestId("app-version")
      .evaluate((el) => (el.innerHTML = "vX.X.X"));

    return new ExtensionPage(page);
  }

  constructor(public readonly page: Page) {}

  async signIn(): Promise<void> {
    await this.page.getByTestId("signin-with-google-button").click();
  }

  async signOut(): Promise<void> {
    await this.page.getByTestId("signout-button").click();
    await this.page.getByTestId("signin-with-google-button").waitFor();
  }

  hasUnauthorizedWarning(): Promise<boolean> {
    return this.page.getByTestId("unauthorized-warning").isVisible();
  }
}
