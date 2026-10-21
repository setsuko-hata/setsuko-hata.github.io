# Hatha Yoga calendar

The schedules on `/hatha-yoga/ja/offerings.html` (対面クラス, オンラインクラス, 特別プログラム) use one reusable, hand-built calendar instead of Google's iframe embed. Light, warm, earthy: no dark fills.

## How it works

```
Google Calendar (public)
   │  deploy workflow, every 6h + on push
   ▼
scripts/fetch-calendars.mjs ──► public/hatha-yoga/calendars/NAME.ics   (same-origin snapshot)
                                          │
                                          ▼
              hy-calendar.js (in the browser) parses + expands repeats + renders
```

Browsers cannot read Google's public `.ics` feed directly (no CORS), so the deploy saves a copy next to the site and the page reads that copy.

| Piece | Path |
|---|---|
| Component (JS) | `public/hatha-yoga/assets/hy-calendar.js` |
| Component (CSS) | `public/hatha-yoga/assets/hy-calendar.css` |
| Fetch script | `scripts/fetch-calendars.mjs` |
| Saved calendars | `public/hatha-yoga/calendars/*.ics` |
| Refresh schedule | `.github/workflows/deploy.yml` (push to `main`, manual run, cron every 6 hours) |

`public/hatha-yoga/` is served verbatim by Astro: edit these files directly, no build step for the component.

## Adding a calendar to a page

1. Load the component once in the page `<head>` (already done on `ja/offerings.html`):
   ```html
   <link rel="stylesheet" href="../assets/hy-calendar.css" />
   <script src="../assets/hy-calendar.js" defer></script>
   ```
2. Put a mount point where the calendar goes:
   ```html
   <div data-hy-cal data-tone="sage" data-label="オンラインクラスカレンダー" data-ics="../calendars/online.ics"></div>
   ```
   - `data-tone`: `sage` (online), `clay` (in-person), `honey` (special programs). New tones are CSS variables in `hy-calendar.css` (`.hy-cal--NAME`, plus its `.hy-cal__scrim` twin for the popup).
   - `data-label`: accessible name.
   - `data-ics`: path to the saved file, relative to the page.
3. Register the calendar in `scripts/fetch-calendars.mjs`:
   ```js
   const CALENDARS = { online: 'c_…', inperson: 'c_…', special: 'c_…', NAME: 'c_<id>' };
   ```
   The id is the Google Calendar ID without `@group.calendar.google.com`. The calendar must be **shared publicly** in Google Calendar.
4. Run `node scripts/fetch-calendars.mjs` once and commit the new `.ics`, so there is a fallback copy.

On `ja/offerings.html` there is **one** calendar (`<section id="calendar">`, below the class tabs and independent of the side menu). It takes several calendars at once and shows filter tabs 全部 / オンラインクラス / 対面クラス / 特別プログラム:
```html
<div data-hy-cal data-label="開催スケジュール" data-sources='[
  {"key":"online","label":"オンラインクラス","ics":"../calendars/online.ics","tone":"sage"},
  {"key":"inperson","label":"対面クラス","ics":"../calendars/inperson.ics","tone":"clay"},
  {"key":"special","label":"特別プログラム","ics":"../calendars/special.ics","tone":"honey"}]'></div>
```
With more than one source the component adds the 全部 tab plus one tab per source (coloured dot = legend), colours events by their source's tone, and labels the source in the event popup and list view. With a single `data-ics` + `data-tone` it behaves as a plain calendar with no tabs. Add a new category by adding an entry to `data-sources` and to `scripts/fetch-calendars.mjs`.

Never use Google's iframe or write a second calendar implementation.

## Features

- Filter tabs (全部 + one per calendar) when several sources are given.
- Month grid and list view (月 / 一覧), prev / next / 今日, tap an event for details.
- Narrow containers (under 760px, measured on the calendar itself via a container query) switch to dots, and tapping a day lists that day's classes.
- Start and end time are shown as a highlighted badge on every event.
- Times always display in JST regardless of visitor timezone.
- Repeating events are expanded in the browser: `DAILY`, `WEEKLY` (with `BYDAY`, `INTERVAL`), `MONTHLY` (same day of month), `YEARLY`, with `COUNT`, `UNTIL`, `EXDATE` and edited single instances (`RECURRENCE-ID`). Not supported: ordinal rules like "second Tuesday".
- The author name 秦節子 is stripped from event titles (see `parseICS`).
- Google Meet dial-in boilerplate is removed from descriptions.
- Opens on the next month that has events if the current month is empty.
- Respects `prefers-reduced-motion`.

## Updating events

Edit events in Google Calendar. The site shows them after the next snapshot:

- **Live site:** within 6 hours, or immediately by running **Actions → Deploy to GitHub Pages → Run workflow**. Google's feed itself can lag a few minutes.
- **Local:** run `node scripts/fetch-calendars.mjs` and reload. No key needed.

If a download fails the script keeps the committed `.ics`, so a Google outage never breaks the page.

## Event colours (current status)

Google's public `.ics` feed carries no colours, so every event uses its calendar's tone.

The script also supports `GOOGLE_CALENDAR_API_KEY` (a GitHub Actions secret): when set, it asks the Calendar API for each event's `colorId` and writes it into the `.ics` as `X-HY-COLOR`, which `hy-calendar.js` maps to earthy shades (`GCOLORS`).

**This does not work today.** Tested with a valid key: Google returns `colorId: null` for every event, even right after an event's colour was changed (the `updated` time moved). The API does not expose event colours to a key-only (anonymous) reader. Reading them needs the calendar owner's sign-in, and the organization blocks service-account key creation.

Options if per-event colours are wanted:

- **Tag in the event** (recommended, not built yet): write e.g. `[clay]` in the description or title, parse it in `parseICS`, hide it in the display. No key, no secret.
- **Owner access:** an admin allows service account keys, then use a service account shared on the calendars.

Until then the API-key code is harmless (it falls back to plain events if the call fails) and the secret can stay unset.

## Checking things

```bash
# refresh the saved calendars locally
node scripts/fetch-calendars.mjs

# list titles in a saved calendar
grep -h "^SUMMARY" public/hatha-yoga/calendars/online.ics | sort | uniq -c

# local preview
npm run dev   # then open /hatha-yoga/ja/offerings.html and pick the class tab
```

Never commit an API key. `.env` is gitignored; pass keys as environment variables or GitHub secrets.
