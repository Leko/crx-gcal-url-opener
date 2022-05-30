const HOST = `https://www.googleapis.com/calendar/v3`;

export async function listAllEvents(accessToken: string, email: string) {
  const allEvents = [];
  let syncToken = null;
  while (1) {
    const res: any = await listEvents(accessToken, email, syncToken);
    allEvents.push(...res.items);
    if (!res.nextSyncToken) {
      break;
    }
    syncToken = res.nextSyncToken;
  }
  return allEvents;
}

async function listEvents(
  accessToken: string,
  email: string,
  syncToken?: string | null
) {
  const url = new URL(`${HOST}/calendars/${encodeURIComponent(email)}/events`);
  url.searchParams.set("maxResults", "2500");
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("timeMin", new Date().toISOString());
  url.searchParams.set(
    "timeMax",
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
  );
  if (syncToken) {
    url.searchParams.set("syncToken", syncToken);
  }
  return request(accessToken, url);
}

function request(
  accessToken: string,
  url: URL,
  method: "GET" | "POST" = "GET",
  body: any = null
) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json());
}
