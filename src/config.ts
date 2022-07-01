import getUrls from "get-urls";

type URLRules = typeof urlRules;
type URLRule = URLRules[number];

type SerializedConfig = {
  offset: number;
  urlRules: URLRule[];
  pollInterval: number;
};

const urlRules = [
  {
    test: /^https:\/\/(?:[^\.]+\.)?zoom\.us\/j\//,
    provider: "Zoom Meetings",
  },
  {
    test: /https:\/\/teams\.microsoft\.com\/l\/meetup-join\//,
    provider: "Microsoft Teams",
  },
  {
    test: /^https:\/\/meet\.google\.com\//,
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
    const urls: string[] = [
      ...getUrls(event.description ?? "", { requireSchemeOrWww: false }),
    ];
    for (const rule of this.urlRules) {
      for (const url of urls) {
        if (rule.test.test(url)) {
          return { rule, url };
        }
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
