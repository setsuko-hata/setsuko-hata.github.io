# Hatha Yoga calendar

The schedule on `/hatha-yoga/ja/offerings` is one reusable, hand-built calendar (no Google iframe) with two dropdown filters, 場所 (大阪 / 東京, matched against the event title via `data-keywords`) and 種類 (one per `data-sources` entry); they combine. Light, warm, earthy: no dark fills.

## How it works

```
Google Calendar (owned by events@setsukohata.com)
   │  read live by a Google Apps Script web app (apps-script/calendar-feed.gs)
   ▼
JSON feed  ──►  calendar.js (in the browser) renders month / list views
```

Nothing is saved in the repo or built at deploy time: every page load asks the feed, which reads the calendars as their owner and caches for 120 seconds. Edits in Google Calendar show up within about 2 minutes.

| Piece | Path |
|---|---|
| Component (JS) | `src/scripts/yoga/calendar.js` |
| Component (CSS) | `src/styles/yoga/calendar.css` |
| Feed script (Google-side) | `apps-script/calendar-feed.gs` |
| Mount point | `<section id="calendar">` in `src/pages/hatha-yoga/ja/offerings.astro` |

The component is bundled by Astro (imported by `offerings.astro`), so changes ship with the normal build. There is no GitHub Action for the calendar.

## The mount point

```html
<div data-hy-cal data-label="開催スケジュール" data-feed="https://script.google.com/macros/s/…/exec"
  data-sources='[{"key":"online","label":"オンラインクラス","tone":"sage"},
                 {"key":"inperson","label":"対面クラス","tone":"clay"},
                 {"key":"special","label":"特別プログラム","tone":"honey"}]'></div>
```

- `data-feed`: the Apps Script web app URL (public by design, like the signup form's). The page requests `?cal=<keys>`.
- `data-sources`: one entry per category: `key` (matches `CALENDARS` in the script), `label` (tab text), `tone` (`sage`, `clay`, `honey`; add tones in `hy-calendar.css` as `.hy-cal--NAME`, plus its popup twin, and in `TONES` in the JS). Optional `ics`: a path to a `.ics` file used only if the feed fails.
- With more than one source the component adds the 種類 dropdown, colours events by category, and names the category in the popup and list view. A single `data-ics` + `data-tone` gives a plain calendar with no tabs.

The component is imported once, by the offerings page (`import '../../../scripts/yoga/calendar.js'` and `calendar.css`). Bundled assets get content-hashed filenames, so no `?v=N` cache-busting is needed any more.

Never embed Google's iframe or write a second calendar implementation.

## Adding a category

1. Add `key: 'calendarId@group.calendar.google.com'` to `CALENDARS` in `apps-script/calendar-feed.gs` and redeploy the script (below). The script's account must own or be subscribed to the calendar.
2. Add `{"key": "...", "label": "...", "tone": "..."}` to `data-sources`.

## Features

- Place and type dropdowns, month grid and list view (月 / 一覧), prev / next / 今日, tap an event for details.
- Narrow containers (under 700px, measured on the calendar itself) switch to coloured dots and tapping a day lists that day's classes.
- Wide layout shows a start–end time badge and the title on every event.
- Times always display in JST regardless of visitor timezone.
- Author name 秦節子 is stripped from titles; Zoom / Google Meet invites (links, IDs, passcodes) are stripped from descriptions, both in the script and again in the page.
- Opens on the next month that has events if the current month is empty.
- Event colours: Google's 11 event colours are mapped to earthy shades (`GCOLORS` in the JS). Events with the default colour use their category tone.
- Respects `prefers-reduced-motion`.

## The Apps Script feed

`apps-script/calendar-feed.gs` is the source of truth; the Apps Script project only holds a pasted copy.

**Deploying**
1. Signed in as events@setsukohata.com, go to script.google.com → **New project**.
2. Replace `Code.gs` with the file's contents, **Run** `doGet` once and approve the Calendar permission.
3. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Copy the `…/exec` URL into `data-feed`.
4. Check `<url>?cal=online` in a browser: it should return JSON events.

**After changing the script:** Deploy → Manage deployments → Edit → New version → Deploy. The URL stays the same. (A `/macros/library/…` link is not the web app URL.)

The feed reads about 2 months back and 13 months ahead, with repeats already expanded by Google. It exposes only the calendars listed in `CALENDARS`.

## If the calendar shows an error

- The page asks the feed with an 8s timeout; if it fails and a source has no `ics` fallback the page shows "カレンダーを読み込めませんでした". Open the feed URL directly to see whether the script is failing (Apps Script → Executions shows errors; a Google-side permission change on the calendars is the usual cause).
- Old browser cache: not an issue; bundled files are content-hashed.

## Notes

- No API key is used. Google does not expose per-event colours to key-only readers (tested: `colorId` is null), which is why the owner-run script is used.
- Never commit secrets. `.env` is gitignored.
