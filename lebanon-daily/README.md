# Lebanon Daily | لبنان اليوم

A simple website that shows the USD to LBP market rate and today's fuel prices in Lebanon.
It works in Arabic (the default, right-to-left) and English.

## Files

| File         | What it is                                                         |
|--------------|--------------------------------------------------------------------|
| `index.html` | The page layout: header, the two cards and the footer              |
| `style.css`  | Colours, sizes and layout (built for phones first)                 |
| `app.js`     | Loads the data, fills in the numbers, draws the chart, switches language |
| `data.json`  | **The prices. Edit this file to update the site.**                 |

## How to open and test it on your computer

The page reads `data.json` with JavaScript. Browsers block this when you double-click
`index.html` (the address starts with `file://`), so you will see an error message.
Run a small local server instead. Pick **one** of these:

**Option A: VS Code (easiest)**
1. Install the free **Live Server** extension.
2. Open the `lebanon-daily` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The site opens in your browser and reloads every time you save a file.

**Option B: Python (already installed on most Macs and Linux)**
1. Open a terminal in the `lebanon-daily` folder.
2. Run: `python3 -m http.server 8000` (on Windows: `py -m http.server 8000`)
3. Open http://localhost:8000 in your browser.
4. Press `Ctrl + C` in the terminal to stop it.

**Option C: Node.js**
Run `npx serve` in the folder and open the address it prints.

### Test it on your phone
1. Make sure your phone and computer are on the same Wi-Fi.
2. Start the server with Option B.
3. Find your computer's local IP address (for example `192.168.1.20`).
4. On your phone, open `http://192.168.1.20:8000`.

You can also use your browser's phone preview: press `F12`, then the phone/tablet icon.

### What to check
- The page opens in Arabic, right-to-left.
- The **English** button switches everything to English, and the choice is remembered.
- Change a number in `data.json`, save, and refresh the page: the new number appears.

## Updating the prices

Open `data.json` and change the numbers. Keep the commas, quotes and brackets exactly as they are.

```json
"dollar": {
  "rate": 89500,                      <- today's rate (no commas inside the number)
  "lastUpdated": "2026-11-03T09:30:00",  <- date and time: YYYY-MM-DDTHH:MM:SS
  "history": [ ... 7 days of { "date", "rate" } ... ]
}
```

Each day: update `rate` and `lastUpdated`, then add today's entry at the **end** of
`history` and delete the first (oldest) one, so there are always 7 days.

If the page shows an error after editing, you probably broke the JSON format
(a missing comma is the usual cause). Paste the file into https://jsonlint.com to find the mistake.

## Changing the wording

All the text in both languages is in the `TEXT` object near the top of `app.js`.

## Connecting a real data source later

All loading happens in one place: the `loadData()` function in `app.js`.

- **If you find an API that returns the same JSON shape as `data.json`**, just change
  `DATA_URL` at the top of `app.js` to its address.
- **If the API returns a different shape**, keep `DATA_URL` pointing at it and change
  `loadData()` so it converts the response into the `data.json` shape before returning it.
  The rest of the code does not need to change.
- **Or keep the file**: have a small script or scheduled job write a fresh `data.json`
  on your server every day. The website code stays exactly the same.

## Publishing it for free

Because it is plain HTML, CSS and JS, it works on any static host. With GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root → Save.**
