# crx-gcal-url-opener

![Chrome Web Store version](https://img.shields.io/chrome-web-store/v/pjginhohpenlemfdcjbahjbhnpinfnlm)
![Chrome Web Store users](https://img.shields.io/chrome-web-store/users/pjginhohpenlemfdcjbahjbhnpinfnlm)
![Chrome Web Store rating](https://img.shields.io/chrome-web-store/rating/pjginhohpenlemfdcjbahjbhnpinfnlm)
![Chrome Web Store rating count](https://img.shields.io/chrome-web-store/rating-count/pjginhohpenlemfdcjbahjbhnpinfnlm)

This is a Chrome extension that automatically opens the URL set in your calendar event as a new tab a few minutes before the start of the Google Calendar event.

- **Easy to use**: Just log in with your Google account to link calendars and it's automatic.
- **Concentrate without worrying about time**: The tab will automatically open 1-2 minutes before the meeting. No more worrying about the time so you don't miss the MTG. You can focus on your task, not the clock.
- **Interrupt overconcentration**: Opens a new tab and brings that window to the forefront. You will never miss the MTG even if you are doing other tasks in a text editor, terminal, etc.
- Support Google Meet, Zoom, and Microsoft Teams (beta)

## Getting started

1. Install [the extension on the Chrome Web Store](https://chrome.google.com/webstore/detail/crx-gcal-url-opener/pjginhohpenlemfdcjbahjbhnpinfnlm?hl=ja)
2. Click the popup icon
3. Please sign in with the Google account you wish to link your calendar to
   - This OAuth application is under review by Google. Until the review is complete, a warning screen will appear after granting permissions
4. You're all set! Events are automatically and regularly updated. You won't have to click the refresh button unless you want to retrieve the latest events immediately.

## Development

```
npm i
npm run dev
```

Then `dist` directory will be created on the project root. Please load it on `chrome://extensions`.

## License

This repository is under [MIT license](https://opensource.org/licenses/MIT).
