Setsuko Hata Yoga Studio — static site export
===============================================

This is a pure HTML + CSS + images static export. No JavaScript, no
build step, no runtime. Works out of the box in three modes:

  1. Double-click index.html (file://)
  2. VS Code Live Server (or any static server) at any subpath
  3. Any static host: Netlify, Cloudflare Pages, GitHub Pages, S3

VS Code Live Server
-------------------
Common pattern: put this folder inside your project and open it in
VS Code. If you drop it into a folder called `hatha-yoga`, Live Server
will serve the site at:

  http://127.0.0.1:5500/hatha-yoga/            (Japanese home)
  http://127.0.0.1:5500/hatha-yoga/en/         (English home)
  http://127.0.0.1:5500/hatha-yoga/ja/about.html
  ...

The site sits at ANY subpath. Every internal link is relative, so no
URL surgery is required.

Layout
------
  index.html                 Homepage (Japanese, default locale)
  ja/                        Japanese pages
      about.html
      offerings.html
      membership.html
      contact.html
  en/                        English pages
      index.html
      about.html
      offerings.html
      membership.html
      contact.html
  assets/                    Images (JPEG + WebP) and one CSS file
  favicon.svg
  sitemap.xml

Fonts
-----
Google Fonts (Newsreader, Inter Tight, Shippori Mincho, Zen Kaku
Gothic New, IBM Plex Mono) load from fonts.googleapis.com — needs
internet on first paint. Offline, the site falls back to system
serif/sans and still looks correct.

Three things to know
--------------------
* This is a JavaScript-free export. That means:
    - Navigation between pages works via plain <a> links.
    - The mobile hamburger menu is replaced with an always-visible
      inline nav on small screens.
    - The nav sits solid (cream background) throughout — the live
      site has a transparent-over-hero → solid-on-scroll transition
      that requires JS.
* The contact form is only visual — it used to POST to a Cloudflare
  server function. Use the live site (setsuko-hata-yoga.higgsfield.app)
  if you need submissions to work, or wire the form up to any static-
  friendly service (Formspree, Basin, Netlify Forms, etc.).
* Program photography (Upa Yoga, Angamardana, Surya Kriya, Yoga
  Asanas, and Corporate) is loaded from the Higgsfield CDN by URL —
  it renders whenever the visitor has internet; no local copies are
  included.
