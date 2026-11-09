/** Run after astro build: inspect generated routes and their language navigation. */
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const yoga = ['', 'about/', 'contact/', 'hatha-types/', 'hatha-yoga/', 'offerings/', 'path/', 'schools/', 'wellness/'];
const pairs = [
  ['/', '/en/'], ['/about/', '/en/about/'], ['/music/', '/en/music/'], ['/morning-yoga/', '/en/morning-yoga/'],
  ['/volunteer/', '/en/volunteer/'],
  ['/satorin/', '/satorin/en/'], ['/shop/', '/shop/en/'],
  ...yoga.map(p => ['/hatha-yoga/ja/' + p, '/hatha-yoga/en/' + p]),
];
for (const pair of pairs) {
  for (const [i, route] of pair.entries()) {
    const file = 'dist' + route + 'index.html';
    assert.ok(existsSync(file), `Missing route ${route}`);
    const html = readFileSync(file, 'utf8');
    const language = i ? 'en' : 'ja';
    assert.match(html, new RegExp(`<html[^>]*lang=["']${language}["']`), `Wrong language at ${route}`);
    assert.ok(html.includes('data-language-switch'), `Missing switch at ${route}`);
    assert.ok(html.includes(pair[1-i]), `Missing counterpart at ${route}`);
    assert.ok(html.includes('/scripts/language.js'), `Missing switch behavior at ${route}`);
    // No accidental English redirect back to the Japanese page.
    if (i) assert.ok(!/http-equiv=["']refresh/i.test(html), `English route redirects: ${route}`);
  }
}
for (const route of ['/shop/', '/shop/en/']) assert.match(readFileSync('dist'+route+'index.html','utf8'), /noindex/);
const site = readFileSync('dist/sitemap.xml','utf8');
for (const pair of pairs) for (const route of pair) if (!route.startsWith('/shop/')) assert.ok(site.includes(`https://setsukohata.com${route}<`), `Missing sitemap ${route}`);
console.log(`PASS: ${pairs.length * 2} localized content routes, counterpart switches, script and sitemap coverage.`);
// English content may retain the person's Japanese name and the Japanese switch label.
for (const [, route] of pairs) {
  const html = readFileSync('dist' + route + 'index.html','utf8');
  const body = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  const text = body.replace(/<[^>]*>/g,'').replace(/秦\s*節子|日本語/g,'');
  assert.ok(!/[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]/.test(text), `Untranslated English text at ${route}`);
  for (const tag of body.matchAll(/<a\b[^>]*>/gi)) {
    const href = tag[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href || tag[0].includes('data-language-switch')) continue;
    assert.ok(!href.startsWith('/hatha-yoga/ja/'), `Japanese link ${href} in ${route}`);
    if (href.startsWith('/') && !href.startsWith('//') && !href.includes('.')) {
      const path = href.split(/[?#]/)[0];
      assert.ok(existsSync('dist' + path + (path.endsWith('/')?'':'/') + 'index.html'), `Broken local link ${href} in ${route}`);
    }
  }
}
console.log('PASS: English text coverage and localized internal links.');

const englishHero = readFileSync('dist/hatha-yoga/en/index.html', 'utf8');
assert.match(englishHero, /<h1[^>]*id="jh-title"[^>]*><span[^>]*>Be who you want to be<\/span><br\s*\/?><span[^>]*>through Classical Hatha Yoga<\/span><\/h1>/);
console.log('PASS: exact English hero wording, capitalization and explicit line break.');
