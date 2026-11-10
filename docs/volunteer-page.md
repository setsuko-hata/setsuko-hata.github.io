# SATORIN volunteer page

- Japanese: `/volunteer/`; English: `/en/volunteer/`.
- Content is in `src/data/volunteer.ts`; both routes share `src/pages/volunteer.astro`.
- Japanese follows the supplied SATORIN text. English is a translation for review, not a separately supplied official text.
- Uses existing website fonts, colors, layout, language switch and photographs. Photographs illustrate yoga and music activities; they do not identify people as volunteers.
- On the Japanese and English homepages, the volunteer entrance sits immediately before JA / EN in the top-right action group, with no duplicate in the main menu. Other pages keep their existing navigation placement.
- Both application buttons link to the supplied bilingual Google Form using `VOLUNTEER_APPLICATION_URL`. The form opens in a new tab; no form is embedded and this website collects no application data.
- Read-only form review on 2026-11-10: publicly accessible, with Japanese and English introductions, questions and options. Phone and WhatsApp are marked required and request country codes. The WhatsApp label says to enter “Not used” / “未利用” when unavailable, rather than the earlier email wording “Not available”. No field was filled, no response submitted, and server-side validation was not tested.
- Verify with `npm run check`, `npm run build`, `npm run test:i18n`, and `npm run test:volunteer`. In environments without a writable Astro telemetry config, set `ASTRO_TELEMETRY_DISABLED=1` for the Astro commands.
- This change is a local preview only. No push, pull request, merge or deployment is included.
