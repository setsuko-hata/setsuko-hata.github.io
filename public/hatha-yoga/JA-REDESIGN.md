# /ja warm redesign — change log

Static export of setsukohata.com with the Japanese pages restyled.
`/en` and the root redirect are unchanged except for palette parity.

## What changed

All work rides on ONE new file — `assets/ja-warm.css` — loaded only by
`ja/*.html`, after the compiled Tailwind stylesheet. The English pages are
byte-identical to the original export.

### Palette (warm / cozy)
| token | was | now |
| --- | --- | --- |
| `--color-brand-espresso` | `#3d3d33` olive-grey | `#43342b` warm cocoa |
| `--color-brand-moss` | `#545445` dull olive | `#b36a4c` terracotta |
| `--color-brand-tan` | `#c4c4a6` sage-grey | `#e4c8ae` warm sand |
| `--color-brand-cream` | `#ddbfa4` | `#f3e5d4` |
| `--color-brand-clay` | `#d48a6e` | `#c97a57` |
| page ground | `#f5efe6` | `#fbf5ec` / `#f6eadb` alt band |
| dark section band | espresso | `#8a5a44` cocoa |
| footer | espresso | `#4a3830` |
| sage band (`bg-brand-moss`) | `#545445` | `#5f6d55` |

The hero scrim was warmed off black. Emoji glyphs in the programme cards are
hidden.

### Section subtitles
The eyebrow labels (講師紹介 / 体験 / 効果 / プログラム / カレンダー …) were
13px IBM Plex Mono, uppercase, 0.24em tracking — far too small and too cramped
for Japanese. They are now 20px Shippori Mincho in terracotta with a trailing
hairline rule.

This is **opt-in**, not a blanket selector: a `ja-eyebrow` class was added to
the 28 genuine section labels in the six `/ja` HTML files. Two sibling
treatments exist so hierarchy stays intact:

- `.ja-eyebrow` — section labels: 20px serif + trailing rule.
- `.ja-sublabel` — labels sitting *under* a heading (サドグル公認ハタヨガ講師,
  plan names, 🌿/📍 inline sub-headers): 17.5px serif, no rule.
- everything else `.font-mono` (Latin kickers, `01`/`02`, footnotes, the hero
  スクロール cue) keeps its original small mono voice.

**If you add a new section, add `ja-eyebrow` to its label paragraph** — the
styling will not apply otherwise.

### Spacing
One 96px section step throughout (64px under 900px), oversized `mt-16`/`mt-14`
jumps tightened, `gap-px` card seams turned into real 20px gaps, cards given
warm surfaces instead of bare top borders, and the header collapsed to a single
row that never breaks Japanese labels mid-word.

### Layout
`ja/index.html`'s intro section was relaid out as two columns — はじめに eyebrow
+ heading + symptom lines on the left, a sand card holding the pull-quote, a
clay rule and the two ヨガ paragraphs on the right. This is the only markup
restructure; every other change is CSS.

### Buttons
Outline buttons (`border-brand-espresso`) run filled dark brown with warm-white
text and invert to cream-on-brown on hover.

## Gotchas for future edits

`ja-warm.css` is **unlayered**, while the compiled Tailwind file wraps
everything in `@layer`. Unlayered author styles beat every layered one
regardless of specificity, so a rule here will silently override any Tailwind
utility. Two consequences already handled:

1. The body-copy ink rule must explicitly exclude the colour utility families:
   `main p:not([class*="text-white"]):not([class*="text-brand"])`.
2. The warm-white rules use `[class~="text-white"]` (exact class token) so they
   don't paint `hover:text-white` at rest. Use `~=` for anything that could
   collide with a variant class, `*=` for family exclusions.

## Links
Filenames are unchanged, so the root `index.html` redirect to `./ja/index.html`,
all internal `/ja` nav and footer sitemap links, and the `/en` ↔ `/ja` language
switches all resolve as before.

## クラス + 月額会員 merge

`ja/classes.html` and `ja/membership.html` were merged into a single
`ja/offerings.html` and deleted. Nav and footer collapse to one item,
クラス・月額会員. `/en` is unaffected (its own Offerings/Membership pages stay
split); only the JA-side hreflang/language-switch links were repointed, and
`sitemap.xml` was updated.

Order on the merged page:

1. Hero with two entry cards — 単発で参加する / 月額会員で続ける (anchor links).
2. Comparison table — 通常クラス（単発） vs 大阪限定 月額会員 vs 全国オンライン
   月額会員, five rows. Carries the note that 単発参加 covers 通常クラス only and
   that 特別クラス is not eligible for member pricing.
3. 通常クラス — drop-in prices, three formats, the three class-type accordions,
   calendar.
4. 大阪限定 月額会員 — two plans (10,000 / 7,000), member notes, premium perks,
   venue, schedule.
5. 全国オンライン 月額会員 — 14,000, community.
6. 特別クラス — Surya Shakti / Surya Kriya, deliberately last since it sits
   outside the membership system.
7. ご参加について — logistics accordion (payment, cancellation, day-of, meals,
   what to bring) + both venues.

`ja/prepare.html` is a standalone post-booking page carrying the same
logistics accordion and venue block, linked from the footer and from the bottom
of the merged page.
