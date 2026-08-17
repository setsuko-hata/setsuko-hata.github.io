# Setsuko Hata Yoga — Design System (JA warm)

Reference for rebuilding the Japanese pages of setsukohata.com from scratch.
Everything below is what the current `/ja` pages actually use.

---

## 1. Foundations

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--color-brand-espresso` | `#43342b` | warm cocoa — body ink, primary buttons, borders |
| `--ja-ink-70` | `#6b564a` | default body-copy ink (softer than espresso) |
| `--color-brand-moss` | `#b36a4c` | terracotta — eyebrows, accents, hover fill, active rules |
| `--color-brand-clay` | `#c97a57` | hairline dividers, card underlines |
| `--color-brand-tan` | `#e4c8ae` | warm sand — labels on dark bands |
| `--color-brand-cream` | `#f3e5d4` | light cream surfaces |
| `--ja-page` | `#fbf5ec` | page ground |
| `--ja-page-2` | `#f6eadb` | alternating band |
| `--ja-sage` | `#5f6d55` | one cool-green band, for variety only |
| dark band | `#8a5a44` | mid-cocoa section band (`.brand-dark`) |
| footer | `#4a3830` | darkest cocoa |
| warm white | `#fdf7ee` | text on dark bands, inverted button fill |
| card surface | `#ffffff` / `#faf4ea` | opaque card on light band / card inside white panel |

Rules of thumb: **max two background tones per page** plus one dark band.
Terracotta is an accent, never a large field. Never pure black or pure grey.

Borders: `rgba(67,52,43,.14–.22)` on light, `rgba(253,247,238,.24)` on dark.
Radius: `2px` on buttons, `3px` on cards and images. Nothing rounder.

### Type

```
Headings / numerals / nav: "Shippori Mincho", "Newsreader", serif — weight 400
Body (Japanese):           "Zen Kaku Gothic New", sans — weight 400/500
Latin kickers, footnotes:  "IBM Plex Mono"
```

| Role | Size | Tracking | Line-height |
| --- | --- | --- | --- |
| h1 (page hero) | 36 / 60px md | — | 1.2 / 1.1 |
| h2 (section) | 30 / 48px md | — | 1.3 |
| h3 (card, accordion) | 24 / 30px md | — | 1.35 |
| Price numeral | 36 / 48px lg | — | 1 (`white-space: nowrap`) |
| `.ja-eyebrow` section label | 20px serif (17 mobile) | 0.14em | 1.5 |
| `.ja-sublabel` under a heading | 17.5px serif (16 mobile) | 0.08em | 1.7 |
| Body base | 16.5px | — | 2.05 (`leading-loose`) |
| Body small | 15px | — | 1.85 |
| Latin mono kicker | 13px uppercase | 0.18–0.24em | — |
| Nav link | 15px (13.5 at 768–1180) | 0.04em | — |

**Japanese never gets Latin caps tracking.** `text-transform: none` and
≤0.08em on any Japanese label, button, or nav item; wide tracking (0.18em+)
is reserved for Latin mono kickers. Buttons and nav get `white-space: nowrap`
so labels never break mid-word.

### Spacing & layout

- Section step: `96px` top and bottom (`64px` under 900px). One step, everywhere.
- Inner-page hero band: `152px` top (clears the fixed 80px header) / `96px` bottom.
- Container: `max-width: 72rem` (`max-w-6xl`), gutters `40px` desktop / `22px` mobile.
- Header: fixed, ~80px, `rgba(251,245,236,.94)` + backdrop blur, 1px terracotta-tinted rule.
- Card grid gaps: `20px` (`gap-5`). Never `gap-px` seams.
- Two-column content split: `260px | 1fr` at 768px, `340px | 1fr` at 1100px, 40–64px column gap.

---

## 2. Components

### Eyebrow label
```html
<p class="ja-eyebrow">はじめての方へ</p>
```
20px Shippori Mincho, terracotta, flex with a trailing 1px hairline
(`rgba(179,106,76,.28)`) filling the remaining width. On a dark band the text
goes `#fbe8d3` and the rule `rgba(253,247,238,.3)`.
Sub-labels *under* a heading use `.ja-sublabel` — same voice, no rule.

### Buttons
- **Primary:** `#43342b` fill, `#fff` text, `padding: 14px 28px`, 14px / 0.18em,
  hover → terracotta fill. `active:translate-y-px`.
- **Secondary (outline markup):** renders *filled* dark brown by default and
  inverts to `#fdf7ee` background / espresso text on hover.
- Radius 2px, no shadow.

### Card
Opaque white surface, `1px solid rgba(179,106,76,.22)`, 3px radius,
`padding: 32px 32px 36px`. Headings inside get a 34×1px clay underline set
18px below. On a dark band: `rgba(253,247,238,.14)` surface,
`rgba(253,247,238,.24)` border.

### Price card
Card + label (16px, ink-70) + numeral (`font-display`, 36–48px, `.ja-price`
for `white-space: nowrap`). Two or three across in a `gap-5` grid.

### Accordion (`<details class="group">`)
Border card; summary is a flex row: title block (24–30px serif + 18–20px
terracotta subtitle) and a `+` glyph, 30px terracotta, `group-open:rotate-45`,
300ms. Open state: white surface, `inset 3px 0 0` terracotta left bar.
`summary::marker` and `::-webkit-details-marker` hidden.

### Side-nav tabs (offerings page)
`<nav role="tablist">` of `<button role="tab" data-tab="…">`, each with a leaf
icon, 17px label, and a right caret. Vertical and sticky (`top: 96px`) above
960px; a horizontal scrolling row below. Selected: sage-tinted background
`rgba(157,175,124,.24)`, 3px terracotta left border, full-opacity caret.
Panels are `<div role="tabpanel" id="panel-{tab}">`, white with a
`rgba(67,52,43,.14)` border; sections inside step at 56px, separated by a
1px top rule.

The tab script also: reads `location.hash` on load, listens to `hashchange`,
and intercepts `a[href^="#"]` so an in-page link opens the panel containing
its target (walking up nested tabpanels) and scrolls with a 96px header offset.

### Lists
Unordered: flex row, `─` in terracotta as the marker, 12px gap, 15px text.
Ordered: same shape with `01` / `02` mono numerals in terracotta.

### Hero
Full-bleed photo with a warm scrim —
`linear-gradient(100deg, rgba(64,40,28,.86), rgba(92,60,42,.5) 46%, rgba(150,104,70,.14))`
plus a bottom-up `rgba(64,40,28,.3) → transparent 55%`. Never a neutral black scrim.
Inner pages use a flat coloured band instead of a photo.

### Footer
`#4a3830`, warm-white text at 80% opacity, four link columns with tan mono
column headings, then a `border-white/10` bar with copyright and
`Tokyo · Osaka · India` in mono.

---

## 3. Content & voice

- Japanese body copy is calm and plain; no exclamation marks, no emoji.
- Latin kickers pair each section with its English name (`Classes & Membership`).
- Prices always written `4,000円` — full-width-free, comma-grouped, nowrap.
- Notes and caveats prefix with `※`, set 16px at 75% ink.

---

## 4. Gotchas

1. `ja-warm.css` is **unlayered** and loads after the compiled Tailwind file,
   which is `@layer`-wrapped. Any unlayered rule beats every Tailwind utility
   regardless of specificity. Rebuilding without Tailwind removes this trap —
   but if you keep the pattern, exclude colour families explicitly:
   `main p:not([class*="text-white"]):not([class*="text-brand"])`.
2. Use `[class~="text-white"]` (exact token) so a rule never paints
   `hover:text-white` at rest. Use `[class*=]` only for family *exclusions*.
3. New section? Its label needs the `ja-eyebrow` class — the styling is opt-in,
   not a blanket selector.
4. `/en` pages must stay untouched by any JA styling.
5. Between 768–1180px the header nav is the first thing to break: drop nav to
   13.5px / 0 tracking and shrink the CTA at that range.
