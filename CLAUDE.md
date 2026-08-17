# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static Astro 4 site for setsukohata.com — a bilingual (Japanese-primary, English-secondary) personal site for Setsuko Hata (秦 節子), jazz singer / composer / Hatha Yoga teacher. Astro builds Home (`src/pages/index.astro`) and About (`src/pages/about.astro`).

`/hatha-yoga` is a separate, prebuilt static export (its own CSS, fonts, JA/EN pages, no JS) living in `public/hatha-yoga/`, so Astro copies it verbatim into the build. Edit those HTML files directly; don't convert them to Astro components or restyle them with `global.css`. Its own `sitemap.xml` still points at the old higgsfield.app domain — the root `public/sitemap.xml` is the one that counts.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (withastro/action → deploy-pages) on every push to `main`; the repo's Pages source must be set to "GitHub Actions". The custom domain comes from `CNAME` (a copy lives in `public/CNAME` so it lands in `dist/`). `PUBLIC_SIGNUP_ENDPOINT` is set in the workflow because `.env` is gitignored.

## SEO

`Layout.astro` emits canonical (always trailing slash, matching how Pages serves `/about/`), OG/Twitter tags with an absolute image (default `public/assets/og-image.jpg`, 1200×630), and optional JSON-LD via the `jsonLd` prop (Home passes a `Person`). Titles and descriptions include the kanji name 秦 節子 for Japanese search. `public/sitemap.xml` and `public/robots.txt` are hand-maintained: add new pages there.

The site was rebuilt from a high-fidelity design handoff (`.dc.html` prototypes + README with authoritative tokens, type scale, and behavior). Treat that handoff as the source of truth for colors, fonts, spacing, and copy; don't port its inline styles or its `support.js` runtime.

## Commands

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve dist/
npm run check    # astro check (TypeScript, strict tsconfig)
```

There is no test suite or linter; `npm run check` plus a build is the verification step. The local Node is v18.18 (nvm), which the `.claude/launch.json` preview config points at directly; CI builds with Node 20. `npm run check` needs Node 20+ (`@astrojs/check` uses newer regex syntax) — on Node 18 it fails to load and prompts to reinstall.

## Architecture

- **`src/layouts/Layout.astro`** wraps every page: `<html lang="ja">`, Google Fonts, meta/OG tags, skip link, `Header`, and a footer. Props `active: 'home' | 'about'` sets the nav's `aria-current`; `footer: 'home' | 'about'` picks `FooterHome` (light) or `FooterAbout` (dark). Adding a page means extending both unions, `Header.astro`, and `public/sitemap.xml`.
- **All styling lives in one file, `src/styles/global.css`**, imported by the layout. Components use BEM-ish class names (`.intro__body`, `.signup-card__title`) rather than scoped `<style>` blocks. The file starts with design tokens on `:root` (`--paper`, `--ink`, `--gold`, `--gold-deep`, `--gutter`, `--page-max`, font stacks, `--ease-standard`) and is organized into `/* ---------- Section ---------- */` blocks per page region. Responsive rules sit next to the section they affect (breakpoints mostly 900px and 560px).
- **Scroll reveal:** `src/scripts/reveal.ts` (loaded by the layout) adds `.is-visible` to `[data-reveal]` and `[data-reveal-soft]` elements via IntersectionObserver, with an in-viewport check on first frame and a timeout failsafe. The hidden/visible states are defined at the end of `global.css`. Reduced motion shows everything immediately. `ExploreCards` takes `reveal` to opt in.
- **`StatCards.astro`** holds the three "At a Glance" cards, shared by About (`reveal`) and Home (`float`, placed in `.hero-stats`, whose negative top margin overlaps the hero photo — `.hero__copy-wrap`'s large bottom padding keeps the copy card clear of them).
- **Images** are plain `<img src="/assets/...jpg">` from `public/assets/` (not Astro's image pipeline).

## Signup form → Google Sheets

`src/components/SignupForm.astro` POSTs `{ firstName, lastName, email }` as a JSON string to `import.meta.env.PUBLIC_SIGNUP_ENDPOINT` (set in `.env`, gitignored; see `.env.example`). The endpoint is a Google Apps Script web app owned by events@setsukohata.com; its source lives only in that Apps Script project (not in this repo) and `JSON.parse`s `e.postData.contents` and appends a timestamped row to the active sheet.

- The request uses `mode: 'no-cors'` with an unset content type so it stays a simple request (no preflight). The response is opaque, so the UI shows success whenever the request reaches Google — a broken script still looks successful. Verify by checking the sheet.
- If you change the body format, change the Apps Script to match (and the owner must redeploy the Apps Script).
- With no endpoint set, the form still shows the thank-you message and only logs a console warning.
- The production host needs `PUBLIC_SIGNUP_ENDPOINT` set at build time.

## Design rules to preserve

- Text on cream backgrounds: no grey lighter than `--muted` (`#6B635A`); gold text under ~16px uses `--gold-deep` (`#8A6A2C`), not `--gold`.
- No text below 12px. Japanese body copy keeps line-height ≥ 2.0 (deliberate).
- Mostly square corners (radius 0); buttons/inputs 2–3px.
- `→` arrows are set in Inter even inside Japanese text; mark Japanese runs with `lang="ja"`.
- All animation must be disabled under `prefers-reduced-motion: reduce`.
