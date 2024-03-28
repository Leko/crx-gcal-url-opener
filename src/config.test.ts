import { loadConfig } from "./config";

describe("Config", () => {
  describe("extractValidUrl", () => {
    it("returns Zoom URL rather than Google Meet", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          hangoutLink: "https://meet.google.com/xxx",
          description: "https://us02web.zoom.us/j/xxx",
        })
      ).toMatchObject({ rule: { provider: "Zoom Meetings" } });
      expect(
        config.extractValidUrl({
          description: [
            "https://meet.google.com/xxx",
            "https://us02web.zoom.us/j/xxx",
          ].join("\n"),
        })
      ).toMatchObject({ rule: { provider: "Zoom Meetings" } });
    });
    it("returns Microsoft Teams rather than Google Meet", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          hangoutLink: "https://meet.google.com/xxx",
          description: "https://teams.microsoft.com/l/meetup-join/xxx",
        })
      ).toMatchObject({ rule: { provider: "Microsoft Teams" } });
      expect(
        config.extractValidUrl({
          description: [
            "https://meet.google.com/xxx",
            "https://teams.microsoft.com/l/meetup-join/xxx",
          ].join("\n"),
        })
      ).toMatchObject({ rule: { provider: "Microsoft Teams" } });
    });
    it("returns Amazon Chime rather than Google Meet", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          hangoutLink: "https://meet.google.com/xxx",
          description: "https://chime.aws/0000000000",
        })
      ).toMatchObject({ rule: { provider: "Amazon Chime" } });
      expect(
        config.extractValidUrl({
          description: [
            "https://meet.google.com/xxx",
            "https://chime.aws/0000000000",
          ].join("\n"),
        })
      ).toMatchObject({ rule: { provider: "Amazon Chime" } });
    });
    it("returns WebEx rather than Google Meet", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          hangoutLink: "https://meet.google.com/xxx",
          description: "https://00000.webex.com/00000/j.php?MTID=xxx",
        })
      ).toMatchObject({ rule: { provider: "WebEx" } });
      expect(
        config.extractValidUrl({
          description: [
            "https://meet.google.com/xxx",
            "https://00000.webex.com/00000/j.php?MTID=xxx",
          ].join("\n"),
        })
      ).toMatchObject({ rule: { provider: "WebEx" } });
    });
    it("can extract Google Meet URL from hangoutLink", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          hangoutLink: "https://meet.google.com/xxx",
        })
      ).toMatchObject({ rule: { provider: "Google Meet" } });
    });
    it("can extract Google Meet URL from conferenceData", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          conferenceData: {
            entryPoints: [
              {
                entryPointType: "video",
                uri: "https://meet.google.com/xxx",
              },
            ],
          },
        })
      ).toMatchObject({ rule: { provider: "Google Meet" } });
    });
    it("can extract Microsoft Teams URL from conferenceData", async () => {
      const config = await loadConfig();
      expect(
        config.extractValidUrl({
          conferenceData: {
            entryPoints: [
              {
                entryPointType: "video",
                uri: "https://teams.microsoft.com/l/meetup-join/xxx",
              },
            ],
          },
        })
      ).toMatchObject({ rule: { provider: "Microsoft Teams" } });
    });

    it.each([
      // Without subdomains
      "https://zoom.us/j/xxx",
      "https://zoom.us/w/xxx",
      // official subdomains
      "https://us02web.zoom.us/j/xxx",
      "https://us02web.zoom.us/w/xxx",
      // Vanity URL
      // https://support.zoom.us/hc/ja/articles/215062646-%E3%83%90%E3%83%8B%E3%83%86%E3%82%A3-URL-%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%AE%E3%82%AC%E3%82%A4%E3%83%89%E3%83%A9%E3%82%A4%E3%83%B3
      "https://hooli.zoom.us/j/xxx",
      "https://hooli-org.zoom.us/j/xxx",
      "https://1234.zoom.us/j/xxx",
      "https://hooli.zoom.us/w/xxx",
      "https://hooli-org.zoom.us/w/xxx",
      "https://1234.zoom.us/w/xxx",
    ])("can extract Zoom from description: %s", async (url) => {
      const config = await loadConfig();
      expect(config.extractValidUrl({ description: url })).toMatchObject({
        rule: { provider: "Zoom Meetings" },
      });
    });
    it.each(["https://teams.microsoft.com/l/meetup-join/xxx"])(
      "can extract Microsoft Teams from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "Microsoft Teams" },
        });
      }
    );
    it.each(["https://chime.aws/0000000000"])(
      "can extract Amazon Chime from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "Amazon Chime" },
        });
      }
    );
    it.each(["https://00000.webex.com/00000/j.php?MTID=xxx"])(
      "can extract WebEx from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "WebEx" },
        });
      }
    );
    it.each(["https://vc-jp.larksuite.com/j/xxx"])(
      "can extract Lark from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "Lark" },
        });
      }
    );
    it.each(["https://app.slack.com/huddle/xxx/xxx"])(
      "can extract Slack Huddle from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "Slack Huddle" },
        });
      }
    );
    it.each(["https://meet.google.com/xxx-xxxx-xxx"])(
      "can extract Google Meet from description: %s",
      async (url) => {
        const config = await loadConfig();
        expect(config.extractValidUrl({ description: url })).toMatchObject({
          rule: { provider: "Google Meet" },
        });
      }
    );
    it("returns null if the event does not have any valid URL", async () => {
      const config = await loadConfig();
      expect(config.extractValidUrl({})).toEqual(null);
    });
  });
});
