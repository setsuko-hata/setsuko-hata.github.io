# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static Astro 4 site for setsukohata.com — a bilingual (Japanese-primary, English-secondary) personal site for Setsuko Hata (秦 節子), jazz singer / composer / Hatha Yoga teacher. Astro builds Home (`src/pages/index.astro`), About (`src/pages/about.astro`), and Music (`src/pages/music.astro`, the jazz-singer page, nav label 音楽, also linked from the Home "Explore Music" card).

`/hatha-yoga` is part of the Astro build too, under `src/pages/hatha-yoga/{ja,en}/` (URLs `/hatha-yoga/ja/about/`, `/hatha-yoga/en/`; `/hatha-yoga` redirects to `/hatha-yoga/ja/`). Its pages use `src/layouts/YogaLayout.astro` and the components in `src/components/yoga/` (`Header`, `Footer`, `Sprite`); nav and footer links, URLs and the booking form link live in `src/data/yoga.ts`. Styles are the `src/styles/yoga/*.css` set (the Japanese home page's look, applied to every page; per-page extras in `styles/yoga/pages/`), behaviour is in `src/scripts/yoga/`. Static images stay in `public/hatha-yoga/assets/`. Page bodies are still the legacy Tailwind-class markup (the compiled `tailwind.css` has no build step, so only utility classes already in it work). The design brief is `docs/hatha-yoga/design-system.md`.

### Hatha Yoga nav

Edit the menu in `NAV` in `src/data/yoga.ts`; each page passes `active="<nav item id>"` to `YogaLayout`. Don't paste nav markup into pages. The mobile menu is rendered by `Header.astro` and driven by `scripts/yoga/nav.ts`.

### Hatha Yoga calendars

The class schedule uses one reusable calendar component, `src/scripts/yoga/calendar.js` + `src/styles/yoga/calendar.css`, fed live by a Google Apps Script (`apps-script/calendar-feed.gs`, deployed separately in events@setsukohata.com's Google account). Never embed Google's iframe or write a new calendar; see `docs/hatha-yoga-calendar.md` for the mount point, adding a category and redeploying the script. Keep it light and earthy: no dark fills.

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

- **`src/layouts/Layout.astro`** wraps every page: `<html lang="ja">`, Google Fonts, meta/OG tags, skip link, `Header`, and a footer. Props `active: 'home' | 'about'` sets the nav's `aria-current`; `footer: 'home' | 'about' | 'none'` picks `FooterHome` (light), `FooterAbout` (dark), or no footer (Music, which ends on Explore Yoga + back-to-Home cards instead). Adding a page means extending both unions, `Header.astro`, and `public/sitemap.xml`. Pages can inject extra `<head>` tags (e.g. a page-only font) via `slot="head"`.
- **Music page** keeps its own champagne/brass palette and Playfair Display (loaded only there) under the `/* ---------- Music ---------- */` block in `global.css`; its tokens are `--jazz-*`, scoped to `.jazz`, so they don't collide with site tokens.
- **All styling lives in one file, `src/styles/global.css`**, imported by the layout. Components use BEM-ish class names (`.intro__body`, `.signup-card__title`) rather than scoped `<style>` blocks. The file starts with design tokens on `:root` (`--paper`, `--ink`, `--gold`, `--gold-deep`, `--gutter`, `--page-max`, font stacks, `--ease-standard`) and is organized into `/* ---------- Section ---------- */` blocks per page region. Responsive rules sit next to the section they affect (breakpoints mostly 900px and 560px).
- **Scroll reveal:** `src/scripts/reveal.ts` (loaded by the layout) adds `.is-visible` to `[data-reveal]` and `[data-reveal-soft]` elements via IntersectionObserver, with an in-viewport check on first frame and a timeout failsafe. The hidden/visible states are defined at the end of `global.css`. Reduced motion shows everything immediately. `ExploreCards` takes `reveal` to opt in, and `show` to pick which cards (`yoga`, `music`, `home`) appear.
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
