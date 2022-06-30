type URLRules = typeof urlRules;
type URLRule = URLRules[number];

type SerializedConfig = {
  offset: number;
  urlRules: URLRule[];
  pollInterval: number;
};

const urlRules = [
  {
    test: /^https:\/\/us02web.zoom.us\/j\//,
    provider: "Zoom Meetings",
  },
  {
    test: /https:\/\/teams.microsoft.com\/l\/meetup-join\//,
    provider: "Microsoft Teams",
  },
  {
    test: /^https:\/\/meet.google.com\//,
    provider: "Google Meet",
  },
];

export async function loadConfig(): Promise<Config> {
  return new Config({
    offset: 1000 * 60 * 1,
    urlRules,
    pollInterval: 1,
  });
}

class Config {
  offset: number; // ms
  urlRules: URLRule[];
  pollInterval: number; // minutes

  constructor(init: SerializedConfig) {
    this.offset = init.offset;
    this.urlRules = init.urlRules;
    this.pollInterval = init.pollInterval;
  }

  extractValidUrl(event: { hangoutLink?: string; description?: string }): {
    url: string;
    rule: URLRule;
  } | null {
    const urls: string[] =
      event.description?.match(/(https?:\/\/[^ ]+)/g) ?? [];

    for (const url of urls) {
      const rule = this.urlRules.find((rule) => rule.test.test(url));
      if (rule) {
        return { rule, url };
      }
    }
    if (event.hangoutLink) {
      return {
        url: event.hangoutLink,
        rule: urlRules[urlRules.length - 1],
      };
    }
    return null;
  }
}
