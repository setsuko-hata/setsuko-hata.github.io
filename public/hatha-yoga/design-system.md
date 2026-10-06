# Setsuko Hata Yoga — Design System (JA light natural)

Reference for rebuilding the Japanese pages of setsukohata.com from scratch.
Everything below is what the current `/ja` pages actually use.

---

## 1. Foundations

### Colour — light, natural, beige & green

Feel: Light · Warm · Natural · Calm · Organic · Refined · Spacious. Japanese organic
luxury × editorial wellness × quiet nature (linen, plaster, sage foliage, sand, clay).
**Lightness is the default. Darkness is intentional and limited.**

**Area budget:** 50–60% ivory/cream/beige · 20–30% light sage/soft olive · 10–15% sand/camel ·
≤5% terracotta/brown/gold. Dark colours cover <5–10% of the viewport at any time.
Blur test: the page must read as light beige, cream and soft green.

| Token | Value | Use |
| --- | --- | --- |
| Ivory Cream `--ja-page` | `#F5EFDF` | page ground, header, cards' base |
| Warm Beige `--ja-page-2` | `#E8D9C2` | alternating band, footer |
| Sand Beige | `#D9C4A3` | borders, tabs, quiet fills |
| Pale Sage `--ja-sage` | `#DDE1CE` | tinted section band (tint of `#AEB39A`) |
| Light Sage | `#AEB39A` | decorative fills, blobs, rules |
| Sage Green | `#7E8764` | borders, icons, card top-rules |
| Deep Olive | `#596044` | accent only — tiny icons, thin lines |
| Warm Brown `--color-brand-moss` | `#8A6043` | eyebrows, buttons, hover — small |
| Camel Brown | `#B17B55` | decorative lines, icons |
| Soft Terracotta `--color-brand-clay` | `#C98B67` | hairlines, chips, photo warmth |
| Ink | `#3A3228` | headings, primary text (never `#000`) |
| Ink-70 | `#6B5F4E` | secondary text |
| Card surface | `#FBF8EE` | cards on any band |

**Never** a large deep-olive, brown or dark-green section; no dark footer.
Deep Olive / Warm Brown / Camel are for headings, small text, thin borders, small buttons,
icons, rules, labels and image overlays only.

**Section rhythm:** Ivory → Pale sage → Warm beige → Ivory → Pale sage → Beige/sand → Footer
(warm beige, dark text). Contrast comes from switching between light neutrals and muted
greens (`.ja-band-sage`, `.ja-band-sand`, `.ja-band-card`, `.ja-band-foot`), never dark blocks.
Photo heroes use an **ivory wash** scrim (`rgba(245,239,223,.94→.15)`) with dark text.
Buttons: warm-brown `#8A6043` fill / white text, hover `#6F4B33`.

Borders: `rgba(138,96,67,.2–.35)`. Radius: `2px` buttons, `3–6px` cards and images.

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
Full-bleed photo under an ivory wash (see Colour) with ink text; inner pages use a flat
ivory / pale-sage band. No dark scrims.

### Footer
`#E8D9C2` warm beige, ink text, four link columns with warm-brown mono headings, hairline
rule, then copyright and `Tokyo · Osaka · India` in mono.

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
