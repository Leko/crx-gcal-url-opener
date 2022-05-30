export async function getAuthToken(interactive = true) {
  return new Promise<string>((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) =>
      token ? resolve(token) : reject(new Error("Failure"))
    );
  });
}

export async function getProfileUserInfo(): Promise<chrome.identity.UserInfo> {
  return fetch(`https://openidconnect.googleapis.com/v1/userinfo`, {
    headers: {
      Authorization: `Bearer ${await getAuthToken()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => ({
      id: res.sub,
      email: res.email,
    }));
}
