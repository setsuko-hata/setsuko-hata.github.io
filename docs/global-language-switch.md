# Global Japanese / English language switching

## Workspace and scope

Developed in `feature/global-ja-en`, based on main `e24090a`, without publishing.

All 15 owned content pages have matching Japanese and English versions:
- Personal: `/`, `/about/`, `/music/`, `/morning-yoga/` and `/en/` counterparts.
- Yoga: nine routes under `/hatha-yoga/{ja,en}/`.
- Static: `/satorin/` ↔ `/satorin/en/`, `/shop/` ↔ `/shop/en/`.

Existing Japanese URLs stay valid. Obsolete English redirects now target English equivalents. The unpublished `_en` legacy sources remain excluded from Astro output; they are not the source of current translations.

## Behavior

Language switches point to the same page, preserving the query string and fragment when JavaScript is available. Normal anchors work without JavaScript. Internal links stay in the active language. Explicit locale URLs take precedence over saved preferences; the neutral `/hatha-yoga/` entrance uses the last saved language and defaults to Japanese. Storage restrictions do not prevent switching.

Most Astro pages share source templates through a `locale` prop. Class content uses `getClassContent(locale)` with a translation dictionary. Static SATORIN/shop pages have separately maintained English copies. Keep both static versions synchronized when changing content.

Navigation, page bodies, metadata, accessible labels, quiz, class dialogs, calendar controls and dates, signup feedback, and static dialogs are localized. Preserve Japanese operational calendar keyword filters and all external destinations.

## Content boundaries

- Public calendar event titles, descriptions and locations come from the organizer's external feed. The calendar interface is translated, but those fields are shown as supplied and disclosed in English. Do not machine-translate booking-specific facts silently.
- Google Forms, STORES, Square and other third-party pages are outside this repository and retain their own language behavior.
- Proper names, song titles, logos and original photographs are preserved.
- Existing source copy uses differing teacher counts (3, 4 and 6). Translation preserves each source statement; editorial reconciliation needs separate confirmation.

## Verification

```
npm ci
npm run check
npm run build
node scripts/check-locales.mjs
node scripts/test-language-behavior.mjs
```

On restricted cloud environments, use a writable `XDG_CONFIG_HOME` and `ASTRO_TELEMETRY_DISABLED=1`; npm's cache may also need a writable location.

Browser visual testing is required before publication: check mobile/desktop English text wrapping, menu at intermediate widths, tab state and fragments on switch, quiz/dialog re-entry, Back/Forward, and signup feedback. The development cloud's Chromium socket restriction blocked new screenshots; build/source checks are not a visual sign-off.
