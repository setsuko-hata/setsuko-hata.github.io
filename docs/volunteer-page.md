# SATORIN volunteer page

- Japanese: `/volunteer/`; English: `/en/volunteer/`.
- Content is in `src/data/volunteer.ts`; both routes share `src/pages/volunteer.astro`.
- Japanese follows the supplied SATORIN text. English is a translation for review, not a separately supplied official text.
- Uses existing website fonts, colors, layout, language switch and photographs. Photographs illustrate yoga and music activities; they do not identify people as volunteers.
- The application control is a native disabled button. No form is embedded, no application data is collected, and there is no placeholder Google Forms link.
- Enable applications only after the final Japanese and English form URLs have been supplied and approved. Replace the disabled button with the correct locale-specific link and remove the pending notice. Confirm the actual forms, including the requested phone and WhatsApp requirements, separately.
- Verify with `npm run check`, `npm run build`, `npm run test:i18n`, and `npm run test:volunteer`. In environments without a writable Astro telemetry config, set `ASTRO_TELEMETRY_DISABLED=1` for the Astro commands.
- This change is a local preview only. No push, pull request, merge or deployment is included.
