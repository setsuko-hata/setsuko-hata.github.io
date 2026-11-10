# SATORIN volunteer page

- Japanese: `/volunteer/`; English: `/en/volunteer/`.
- Content is in `src/data/volunteer.ts`; both routes share `src/pages/volunteer.astro`.
- Japanese follows the supplied SATORIN text. English is a translation for review, not a separately supplied official text.
- Uses existing website fonts, colors, layout, language switch and photographs. Photographs illustrate yoga and music activities; they do not identify people as volunteers.
- In the Japanese and English personal-site header, the volunteer entrance sits directly before Music in the main navigation. The previous entrance beside JA / EN has been removed, so each header has exactly one volunteer link.
- The personal-site header stays on one row above 900px, with compact spacing at 1100px and 1360px. Browser checks cover JA/EN home and volunteer pages at 320, 390, 560, 561, 600, 630, 768, 900, 901, 1024, 1100, 1101, 1133, 1280, 1360, 1361, 1440 and 1600px. No desktop header wrapping, overlap or clipped links; the volunteer link directly precedes Music and remains usable on phones.
- Both application buttons link to the supplied bilingual Google Form using `VOLUNTEER_APPLICATION_URL`. The form opens in a new tab; no form is embedded and this website collects no application data.
- Read-only form review on 2026-11-10: publicly accessible, with Japanese and English introductions, questions and options. Phone and WhatsApp are marked required and request country codes. The WhatsApp label says to enter “Not used” / “未利用” when unavailable, rather than the earlier email wording “Not available”. No field was filled, no response submitted, and server-side validation was not tested.
- Verify with `npm run check`, `npm run build`, `npm run test:i18n`, and `npm run test:volunteer`. In environments without a writable Astro telemetry config, set `ASTRO_TELEMETRY_DISABLED=1` for the Astro commands.
- This change is a local preview only. No push, pull request, merge or deployment is included.
