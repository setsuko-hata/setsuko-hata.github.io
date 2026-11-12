import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const route = '/satorin/en/global-live-online-yoga/';
const html = readFileSync(`dist${route}index.html`, 'utf8');
const normalize = text => text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const supplied = readFileSync('scripts/fixtures/global-yoga-copy.txt', 'utf8')
  .trim().split('\n').map(line => line.trim()).filter(Boolean)
  .map(line => line.replace(/^(# |- )/, '').replaceAll('**', '').replace(/^\[(.*)\]$/, '$1'))
  .map(normalize);
const actual = [...html.matchAll(/<([a-z0-9]+)\b[^>]*\bdata-copy(?:\s|>)[\s\S]*?<\/\1>/gi)]
  .map(match => normalize(match[0]));
assert.equal(actual.length, 37, 'Keep all supplied content blocks');
assert.deepEqual([...actual].sort(), [...supplied].sort(), 'Published copy must match the supplied English copy');
assert.match(html, /<html lang="en">/);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
assert.match(html, new RegExp(`<link rel="canonical" href="https://setsukohata.com${route}">`));
assert.ok(!/Preview only|<title>Preview|data-language-switch|<script\b|<form\b/.test(html));
const buttons = [...html.matchAll(/<button\b([^>]*)>([^<]+)<\/button>/g)];
assert.equal(buttons.length, 2);
for (const [, attrs, label] of buttons) {
  assert.match(attrs, /\bdisabled\b/);
  assert.equal(label, 'Sign Up for Your Free Week');
}
for (const [, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
  assert.ok(src.startsWith('/assets/'));
  assert.ok(existsSync(`dist${src}`), `Missing image ${src}`);
}
for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
  if (href.startsWith('#')) continue;
  assert.ok(['/satorin/en/', '/en/'].includes(href), `Unexpected page link ${href}`);
  assert.ok(existsSync(`dist${href}index.html`));
}
for (const page of ['', 'about/', 'music/', 'morning-yoga/', 'volunteer/']) {
  for (const locale of ['ja', 'en']) {
    const home = readFileSync(`dist/${locale === 'en' ? 'en/' : ''}${page}index.html`, 'utf8');
    const nav = home.match(/<ul class="nav-list">[\s\S]*?<\/ul>/)?.[0];
    assert.ok(nav, `Missing navigation for ${locale} ${page}`);
    assert.ok(nav.includes(`href="${locale === 'en' ? route : '/satorin/'}"`));
    if (locale === 'ja') assert.ok(!nav.includes(route), 'Japanese navigation must retain its Japanese program');
  }
}
assert.ok(!readFileSync('dist/satorin/index.html', 'utf8').includes(route), 'Do not add the English program to the Japanese membership page');
assert.ok(readFileSync('dist/sitemap.xml', 'utf8').includes(`https://setsukohata.com${route}<`));
console.log('PASS: all 37 supplied English copy blocks, disabled signup buttons, assets, links, sitemap, and separate Japanese/English navigation.');
