# Claude Design System --- Setsuko Hata Yoga / SATORI

> Use this file as the design and implementation source of truth when
> redesigning the Setsuko Hata Yoga website. The goal is to translate
> the supplied SATORI brand reference into a distinctive, elegant, warm,
> conversion-focused website for Setsuko Hata's authentic Hatha Yoga and
> wellness offerings.

## 1. Brand foundation

### Brand idea

**Live in harmony with nature. Balance naturally.**

The visual world should feel like a quiet, sunlit natural space:
grounded, refined, tactile, spacious, and alive. It should communicate
that yoga is a serious, transformative practice while remaining
welcoming to ordinary people with busy lives.

### Brand qualities

-   Japanese organic luxury
-   Editorial wellness, not generic wellness
-   Quiet confidence and warmth
-   Nature-connected, tactile, and human
-   Credible, experienced, and grounded in practice
-   Premium but approachable
-   Clear and useful rather than mystical or overdecorated

### Brand context to preserve

-   Instructor: **Setsuko Hata (秦節子)**
-   Sadhguru-certified Hatha Yoga Instructor
-   More than **1,750 hours of training in India**
-   One of only four instructors in Japan, as stated in the existing
    brand materials
-   Offers in-person and online yoga, with potential personal,
    corporate-wellness, and health-management audiences
-   The site must support both serious students seeking authentic
    instruction and organizations/executives seeking credible wellness
    services.

Do not invent credentials, outcomes, testimonials, class availability,
or program details. Preserve the supplied Japanese copy exactly unless
explicitly asked to edit it.

## 2. Art direction

### Overall visual direction

Use the uploaded SATORI brand board as the primary art-direction
reference: - Soft ivory and parchment backgrounds - Olive and sage
greens - Warm, restrained browns and terracotta - Sand and warm beige -
Small, selective antique-gold accents - Natural botanical imagery,
sunlit walls, organic textures, landscapes, and linen - Gentle shadows,
soft daylight, quiet contrast, and ample negative space - Refined
editorial typography and hairline dividers

The design should feel like a premium independent wellness journal or a
thoughtfully designed nature-led Japanese lifestyle brand.

### What it should not look like

Avoid: - Bright, saturated "wellness green" - Dark green, brown, or
charcoal as large section backgrounds - Purple gradients or neon
accents - Generic yoga stock photography or overly posed spiritual
imagery - Mandalas, chakras, lotus clichés, decorative spiritual
symbols, or arbitrary icons - SaaS-style cards, excessive rounded
rectangles, dashboard layouts, or corporate-template visuals - Sterile
minimalism, cold white/grey palettes, or overly tech-forward layouts -
Overly feminine, revealing, or fashion-editorial yoga imagery - Bohemian
clutter, excessive ornament, or luxury cues that feel flashy - Heavy
animation, parallax effects, or motion that distracts from the content -
Unnecessary copy, filler sections, or invented claims

**Important color rule:** light beige, ivory, and soft sage should
dominate large page areas. Dark colors are for text, fine lines, and
small accents---not large backgrounds or full-width sections.

## 3. Color tokens

Use these reference colors as the starting palette. Keep the
implementation consistent through CSS variables or the project's
existing token system.

``` css
:root {
  /* Main surfaces */
  --color-ivory-cream: #F5EDDF;
  --color-warm-beige: #E8D9C2;
  --color-sand-beige: #D9C4A3;
  --color-paper: #FBF7EF;

  /* Greens */
  --color-deep-olive: #596044;
  --color-sage: #7E8764;
  --color-light-sage: #AEB394;

  /* Warm earth tones */
  --color-warm-brown: #8A6043;
  --color-camel-brown: #B17B55;
  --color-soft-terracotta: #C98B67;

  /* Accent */
  --color-antique-gold: #B99755;

  /* Text and borders */
  --color-text-primary: #40392F;
  --color-text-secondary: #716858;
  --color-text-muted: #8B8172;
  --color-border: rgba(89, 96, 68, 0.22);
  --color-border-warm: rgba(138, 96, 67, 0.20);

  /* Semantic surfaces */
  --color-page: var(--color-paper);
  --color-surface: var(--color-ivory-cream);
  --color-surface-sage: #EEF0E6;
  --color-surface-sand: #F2E6D4;
  --color-surface-terracotta: #F4E5DA;

  /* Interaction */
  --color-link: var(--color-deep-olive);
  --color-link-hover: var(--color-warm-brown);
  --color-focus: var(--color-sage);
}
```

### Color usage proportions

As a rough visual balance across a page: - **55--70%** ivory, paper, and
warm beige - **15--25%** white/cream or lightly tinted neutral
surfaces - **10--15%** sage and olive, mostly in small-to-medium areas -
**5--10%** brown, terracotta, and gold accents combined

These are directional, not rigid calculations. A page should remain
light and breathable.

### Color rules

1.  Use `--color-paper` or `--color-ivory-cream` as the default
    page/surface background.
2.  Use light sage for gentle section variation, not saturated green.
3.  Use deep olive primarily for headings, links, small buttons, and
    selected emphasis.
4.  Use warm brown and terracotta sparingly for secondary accents,
    labels, and selected calls to action.
5.  Use antique gold only for fine details, small rules, or subtle
    emphasis. Never make the page look metallic or glittery.
6.  Maintain sufficient text contrast. Do not use pale gold or beige for
    important body copy.
7.  Do not place long paragraphs on textured or photographic
    backgrounds.
8.  Alternate sections through subtle changes in tint, spacing, image
    treatment, and layout---not dramatic dark/light blocks.

## 4. Typography

### Typographic character

Typography should feel literary, calm, Japanese, and editorial. Combine
a refined Japanese typeface with a restrained serif for English, Latin
labels, and occasional display moments.

### Suggested font stacks

Use fonts already loaded in the project if they are suitable. Avoid
adding large font downloads without a reason.

``` css
:root {
  --font-japanese: "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN",
    "Hiragino Mincho Pro", serif;
  --font-japanese-sans: "Noto Sans JP", "Hiragino Kaku Gothic ProN",
    "Yu Gothic", sans-serif;
  --font-editorial: "Cormorant Garamond", "Times New Roman", serif;
  --font-body: var(--font-japanese-sans);
}
```

Use Japanese Mincho/serif styling for selected hero statements and
section titles where it remains readable. Use a clean Japanese
sans-serif for longer body copy, navigation, forms, and functional UI.
Do not use decorative fonts for paragraphs.

### Type scale

Use a responsive scale rather than fixed oversized text.

-   Hero heading: `clamp(2.2rem, 4.5vw, 4.6rem)`
-   Page title: `clamp(2rem, 3.8vw, 3.5rem)`
-   Section heading: `clamp(1.6rem, 2.6vw, 2.5rem)`
-   Subheading: `clamp(1.2rem, 1.7vw, 1.6rem)`
-   Body: `1rem–1.125rem`
-   Small supporting copy: `0.875rem–0.95rem`
-   Eyebrow / English label: `0.68rem–0.8rem`, with generous letter
    spacing

### Typography rules

-   Give Japanese headings comfortable line height and enough room to
    breathe.
-   Use letter spacing for short English labels, not Japanese body
    paragraphs.
-   Avoid making every heading uppercase English.
-   Keep paragraphs to a readable measure, approximately 35--42 Japanese
    characters per line where practical.
-   Body line-height should generally be around `1.8–2.0`; headings
    around `1.35–1.6`.
-   Avoid very thin type for essential content or small screens.
-   Maintain a clear hierarchy: one H1 per page, followed by logical H2
    and H3 headings.

## 5. Layout and spacing

### Layout principles

-   Spacious, asymmetrical editorial composition
-   Strong alignment and clear reading order
-   Generous margins and section padding
-   Large, intentional imagery balanced with concise copy
-   Fine rules and small labels to organize content
-   Varied layouts that feel art-directed, not a repeated grid of
    identical cards

### Suggested layout tokens

``` css
:root {
  --content-max: 1200px;
  --content-reading: 760px;
  --page-gutter: clamp(1.25rem, 5vw, 5rem);
  --section-space: clamp(4rem, 8vw, 8rem);
  --space-1: 0.5rem;
  --space-2: 0.75rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-7: 4rem;
}
```

### Layout rules

-   Keep main content centered within a sensible maximum width.
-   Use a consistent page gutter on every breakpoint.
-   Do not cram every section into a card.
-   Prefer open layouts, split editorial sections, image-and-copy
    pairings, quiet full-bleed photography, and small structured lists.
-   Use cards only when they genuinely help compare plans or understand
    distinct program options.
-   Make mobile layouts feel intentionally designed, not merely stacked
    desktop blocks.
-   Avoid excessive blank space that separates related content;
    whitespace should improve hierarchy, not make the page feel
    unfinished.

## 6. Imagery and art direction

### Image subjects

Prioritize: - Sunlight filtering through leaves - Olive branches and
natural foliage - Warm plaster walls and tactile stone - Linen, paper,
wood, and other natural materials - Quiet Japanese landscapes and soft
sunrise light - Calm, lived-in spaces for yoga practice - Authentic
photos of Setsuko teaching or practicing - Diverse adults practicing in
a natural, comfortable, non-performative way when people are needed

### Image treatment

-   Warm daylight, soft highlights, gentle shadows
-   Natural greens, muted earth tones, cream, and beige
-   A restrained filmic quality without excessive filters
-   Natural skin tones and realistic anatomy
-   A balance of texture and calm negative space
-   Use subtle crops and image ratios to create an editorial rhythm

### Setsuko's photos --- non-negotiable

-   When using real photos of Setsuko, preserve her actual identity,
    face, expression, body, and natural proportions.
-   Do not generate a replacement person or alter her facial features.
-   Do not apply heavy skin smoothing, artificial beauty filters, or
    dramatic color grading.
-   Crop and adjust the surrounding composition if needed; do not "fix"
    the person to fit the design.
-   Prefer real instructor photography over generic yoga stock images
    whenever possible.

### Image selection rules

-   Every image should support the section's message or create a
    meaningful emotional pause.
-   Do not use a random yoga image simply to fill space.
-   Avoid images with embedded text, visible watermarks, awkward crops,
    or inconsistent color temperature.
-   Do not place critical copy over busy foliage or textured
    backgrounds.
-   If image assets are missing, create clearly named placeholders or
    describe the desired asset; do not invent a fake instructor image.
-   Use descriptive alt text for meaningful images and empty alt text
    for purely decorative imagery.

## 7. Components and interaction patterns

### Navigation

-   Minimal, calm, easy to scan.
-   Use a light cream background, dark olive text, and subtle dividers
    if needed.
-   Keep the main conversion action visible without turning the
    navigation into a row of competing buttons.
-   On mobile, make menu controls obvious and touch-friendly.
-   Avoid excessive all-caps navigation labels.

### Buttons

Primary buttons should feel tactile and confident, not loud.

-   Primary: deep olive fill with light cream text, used sparingly.
-   Secondary: transparent or cream fill with a thin olive border.
-   Text links: olive with a clear hover/focus treatment and optional
    understated arrow.
-   Use warm brown or terracotta for a secondary campaign accent, not
    every button.
-   Keep button labels concise and action-oriented.
-   Use consistent padding and a modest radius (for example, `2px–8px`);
    avoid pill-shaped buttons everywhere.
-   Ensure keyboard focus is visible and contrast is accessible.

### Cards

-   Prefer a flat, editorial surface with thin borders or subtle tonal
    contrast.
-   Use generous internal spacing and clear typography.
-   Avoid heavy shadows, thick borders, floating-card effects, and
    excessive rounded corners.
-   Membership/pricing cards may use a light sage or sand tint to
    distinguish plans.
-   Highlight a recommended plan with a small label and refined border
    treatment, not a giant bright badge.

### Dividers and decorative details

-   Use thin olive/brown rules, small editorial labels, subtle botanical
    details, and occasional gold accents.
-   Decorative elements should reinforce the natural brand and never
    compete with the content.
-   Do not add icons to every bullet or heading. Use typography and
    spacing first.

### Forms and booking

-   Make booking and inquiry flows clear and low-friction.
-   Label every field; do not rely on placeholder text alone.
-   Show validation messages in plain, helpful language.
-   Make the primary action visually clear and usable by keyboard and
    touch.
-   Clearly distinguish online, in-person, personal, and corporate
    inquiries where relevant.

### Motion

-   Prefer subtle opacity or short positional transitions, if any.
-   Respect `prefers-reduced-motion`.
-   No scroll-jacking, looping animation, auto-moving carousels, or
    decorative motion that delays access to content.
-   Motion must never be required to understand a page.

## 8. Website experience and conversion

The site is not just a mood board. It needs to explain the value of
Setsuko's teaching and help visitors take the next step.

### Primary visitor questions

Within the first few scrolls, visitors should understand: 1. What
Setsuko teaches and what makes the approach distinctive. 2. Who the
classes/programs are for. 3. Why Setsuko is a credible instructor. 4.
Which program or class is right for them. 5. How to experience a class,
ask a question, or book.

### Recommended content hierarchy

Adapt to the actual pages and existing content. Do not add sections
automatically if they are not needed.

1.  **Hero:** one clear value proposition, a short supporting statement,
    and one primary CTA.
2.  **What Hatha Yoga is:** an accessible, accurate explanation of the
    practice.
3.  **Instructor introduction:** Setsuko's real photo, training, and
    relevant credentials.
4.  **Class/program options:** clear distinctions between offerings and
    who each is for.
5.  **Experience / practical details:** format, location, schedule, or
    what to expect, using verified information.
6.  **Trust and support:** only real testimonials, factual credentials,
    and confirmed support details.
7.  **Final CTA:** a calm, clear invitation to book or make an inquiry.

Use the existing website structure and supplied copy as the starting
point. Do not force this sequence onto every page if the current
information architecture has a different purpose.

### CTA language

Use specific actions such as: - 体験クラスに申し込む -
プログラムを見る - 開催日時を確認する - 相談・お問い合わせ

Choose the correct CTA for the destination. Do not use vague labels such
as "Click here" or make multiple actions compete equally in the hero.

### Premium positioning

Premium should come from the clarity of the offer, instructor
credibility, image quality, thoughtful typography, and careful
spacing---not from dark backgrounds, gold everywhere, exaggerated
claims, or ornamental luxury clichés.

## 9. Responsive behavior

### Desktop

-   Use editorial split layouts and generous margins.
-   Let photography and copy have clear, intentional proportions.
-   Avoid excessively wide paragraphs.
-   Use asymmetry only when the visual hierarchy remains obvious.

### Tablet

-   Reduce large gaps and image dimensions proportionally.
-   Preserve heading hierarchy and breathing room.
-   Avoid awkward narrow text columns beside oversized imagery.

### Mobile

-   Stack split sections in a deliberate order.
-   Keep the main heading readable and avoid covering the entire first
    screen with decorative imagery.
-   Ensure buttons and links have comfortable touch targets (aim for at
    least 44 × 44 CSS pixels where practical).
-   Use image crops that preserve the subject and context.
-   Reduce letter spacing where it harms readability.
-   Avoid tiny overline labels and side-by-side cards that force cramped
    text.
-   Make booking/contact actions easy to find without obstructing the
    content.

## 10. Accessibility and implementation quality

-   Target WCAG 2.2 AA contrast for text and controls.
-   Use semantic HTML and correct heading order.
-   Ensure keyboard navigation, visible focus states, and descriptive
    link text.
-   Provide alt text for informative imagery.
-   Respect reduced-motion preferences.
-   Do not communicate status using color alone.
-   Optimize image sizes and use responsive image sources when possible.
-   Avoid layout shift; specify image dimensions or aspect ratios.
-   Preserve existing project conventions, framework, routing, and
    component architecture unless a change is necessary.
-   Reuse components and tokens rather than scattering one-off styles.
-   Do not introduce dependencies for decorative effects that can be
    implemented simply.
-   Keep the website fast, responsive, search-friendly, and
    maintainable.

## 11. SEO and Japanese content quality

-   Preserve the intended Japanese wording and nuance.
-   Do not rewrite the supplied copy or invent additional marketing
    claims unless explicitly asked.
-   Maintain one clear H1 and descriptive H2/H3 sections.
-   Use meaningful page titles, meta descriptions, internal links, and
    image alt text.
-   Keep important text as actual HTML text rather than embedding it in
    images.
-   Make page content understandable without relying on visual effects.
-   Preserve existing URLs and redirects unless explicitly asked to
    change them.
-   Ensure CTA links lead to the correct booking, inquiry, or program
    destination.

## 12. Working with the existing codebase

Before redesigning: 1. Inspect the current repository, framework,
routes, components, styles, and image assets. 2. Identify which content
and functionality must be preserved. 3. Review the supplied reference
image and existing brand assets. 4. Establish design tokens and shared
components before styling individual pages. 5. Redesign incrementally
and verify each route at desktop, tablet, and mobile widths.

During implementation: - Do not replace the whole site architecture
simply to achieve a visual refresh. - Do not delete functional booking
links, forms, analytics, metadata, or integrations. - Do not change
copy, pricing, dates, instructor credentials, or program details without
permission. - Do not fabricate images, testimonials, customer counts,
awards, or results. - Keep existing functionality working. - Prefer
small, consistent, reusable components.

After implementation: - Check responsive behavior at representative
widths. - Check text contrast, focus states, keyboard navigation, and
form behavior. - Check all links and CTAs. - Check image loading, crops,
and layout shift. - Check console/build errors and remove unused styles
or assets introduced during the redesign. - Compare the final page
against the reference's palette, softness, natural textures, typography,
and visual restraint.

## 13. Design acceptance checklist

Before considering a page complete, verify:

-   [ ] The page feels warm, light, nature-connected, and premium.
-   [ ] Ivory, beige, and sage dominate; dark colors do not dominate
    large sections.
-   [ ] Olive, brown, terracotta, and gold are used with restraint.
-   [ ] Typography has a clear editorial hierarchy and remains readable
    in Japanese.
-   [ ] Imagery feels coherent, natural, and intentional.
-   [ ] Setsuko's real photos preserve her identity and natural
    appearance.
-   [ ] The layout is spacious without feeling empty or disjointed.
-   [ ] The design avoids generic wellness, SaaS, and overdecorated
    luxury clichés.
-   [ ] Visitors can understand the offering and find the next step
    quickly.
-   [ ] Existing content, links, and functionality have been preserved.
-   [ ] The page works on mobile, with accessible controls and readable
    copy.
-   [ ] No credentials, claims, testimonials, or program details were
    invented.

## 14. Final instruction to Claude

**Treat this document as the design source of truth, but inspect the
existing site before making changes.** Apply the system consistently
across the website, preserving the current content and functionality.
Aim for the feeling of the SATORI reference board---sunlit, tactile,
editorial, and naturally refined---while making Setsuko Hata's expertise
and the path to joining a class unmistakably clear.

When a design decision is uncertain, choose the option that is lighter,
calmer, more natural, more readable, and more useful to the visitor. Use
fewer decorative elements, not more.

## 15. Space budget (hard limits, check before finishing any page)

Pages must be compact. If a layout breaks any rule below, shrink it before moving on. These limits exist because oversized photo cards and padding made sections like 体験 take several screens of scrolling.

**Section height**
- A section is at most 1.1 viewport heights on a 390×844 phone and 0.9 viewport heights on a 1440×900 desktop. Whole home page: at most 10 phone screens (it was 11.8 before this budget existed).
- Vertical padding per section: `clamp(32px, 4.5vw, 64px)`. Heading to first content block: 20px or less. Never add padding only to "let it breathe".

**Media**
- Photos inside cards: 16/10 or wider on desktop; on a phone, 3 or more cards become horizontal rows with an 88–96px square thumbnail, never three full-width photos stacked.
- Full-width photo bands: 240px tall at most. Hero photo: 72vh at most. Side photos beside text: 4/5 portrait at 320px wide at most on desktop and 82% width on phone.
- Icons inside cards: 56px at most (30px on a phone). Decorative circles or frames: 120px at most.

**Cards and lists**
- No more than 3 stacked full-width cards on a phone before switching to rows or 2 columns.
- Lists of 4+ items: no divider line between items, line-height 1.7 or less, 3–6px vertical padding per item.
- Do not repeat a heading, a label and an icon for the same idea. One of the three is enough.

**Check**
Run this in the browser console at 390 and 1440 wide. Any row marked `TOO TALL` needs trimming.

```js
[...document.querySelectorAll('main section')].map(s=>{const h=s.getBoundingClientRect().height,v=innerHeight*(innerWidth<700?1.1:0.9);return `${h>v?'TOO TALL':'ok'}  ${Math.round(h)}px  ${s.dataset.screenLabel||s.id||s.className.slice(0,30)}`})
```
