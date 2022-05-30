type Config = {
  offset: number; // ms
  urlAllowList: string[];
  pollInterval: number; // min
};

export async function loadConfig(): Promise<Config> {
  return {
    offset: 1000 * 60 * 1,
    urlAllowList: ["https://us02web.zoom.us/j/"],
    pollInterval: 1,
  };
}
