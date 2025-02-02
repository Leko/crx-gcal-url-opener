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
    // j = join, w = webinar
    // https://support.zoom.us/hc/en-us/articles/115004954946
    test: /^https:\/\/(?:[^\.]+\.)?zoom\.us\/[jw]\//,
    provider: "Zoom Meetings",
  },
  {
    test: /^https:\/\/teams\.microsoft\.com\/l\/meetup-join\//,
    provider: "Microsoft Teams",
  },
  {
    test: /^https:\/\/\d+\.webex\.com\/\d+\/j\.php/,
    provider: "WebEx",
  },
  //
  {
    test: /^https:\/\/\w+\.my\.webex\.com\/\w+\.my\/\j.php/,
    provider: "WebEx",
  },
  {
    test: /^https:\/\/chime.aws\//,
    provider: "Amazon Chime",
  },
  {
    test: /^https:\/\/vc-jp.larksuite.com\/j\//,
    provider: "Lark",
  },
  {
    test: /^https:\/\/app.slack.com\/huddle\//,
    provider: "Slack Huddle",
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

  extractValidUrl(event: {
    hangoutLink?: string;
    description?: string;
    conferenceData?: any;
  }): {
    url: string;
    rule: URLRule | null;
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
    if (event.conferenceData) {
      const videoEntryPoint = event.conferenceData.entryPoints?.filter(
        (ep: any) => ep.entryPointType === "video"
      );
      if (videoEntryPoint?.length) {
        const matchedRule = urlRules.filter((rule) =>
          rule.test.test(videoEntryPoint[0].uri)
        );
        if (matchedRule.length) {
          return {
            url: videoEntryPoint[0].uri,
            rule: matchedRule[0],
          };
        } else {
          return {
            url: videoEntryPoint[0].uri,
            rule: null,
          }
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
