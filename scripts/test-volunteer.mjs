/** Run after astro build. Guard supplied copy and the verified bilingual application destination. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const scope = { exports: {} };
vm.runInNewContext(ts.transpile(readFileSync('src/data/volunteer.ts', 'utf8'), { module: ts.ModuleKind.CommonJS }), scope);
const strings = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(strings);
const decode = html => html.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const headerCss = readFileSync('src/styles/personal-locale.css', 'utf8');
assert.match(headerCss, /@media \(min-width: 901px\)\s*\{\s*\.site-header__inner, \.site-header \.nav-list \{ flex-wrap: nowrap; \}/, 'Desktop header and navigation must stay on one row');
assert.match(headerCss, /@media \(max-width: 900px\)\s*\{\s*\.site-header__inner > nav:first-of-type \{ order: 2; width: 100%; \}/, 'Only the phone/tablet layout may move the menu to its own row');
for (const locale of ['ja', 'en']) {
  const path = `${locale === 'en' ? '/en' : ''}/volunteer/`;
  const html = readFileSync(`dist${path}index.html`, 'utf8');
  const copy = scope.exports.volunteer[locale];
  for (const text of strings(copy)) assert.ok(decode(html).includes(text), `Missing ${locale} copy: ${text}`);
  assert.equal((html.match(/class="volunteer-role"/g) || []).length, 5);
  assert.equal(copy.benefits.length, 6);
  assert.equal(copy.who.length, 6);
  const applyLink = html.match(/<a[^>]*class="volunteer-apply"[^>]*>/)?.[0];
  assert.ok(applyLink, 'Application action must be a link');
  assert.ok(decode(applyLink).includes(`href="${scope.exports.VOLUNTEER_APPLICATION_URL}"`));
  assert.match(applyLink, /target="_blank"/);
  assert.match(applyLink, /rel="noopener noreferrer"/);
  assert.match(applyLink, /aria-describedby="application-note"/);
  assert.ok(!applyLink.includes('disabled'));
  assert.match(html, /id="application-note"/);
  assert.ok(!html.includes('application-pending'));
  assert.ok(!/<form\b/i.test(html), 'Volunteer page must not collect data');
  assert.ok(!/href="https?:\/\/(?:docs\.google\.com\/forms\/?|forms\.google\.com\/?)"/i.test(html), 'No placeholder form destination');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, new RegExp(`<a[^>]*href="${path}"[^>]*aria-current="page"`));

  for (const page of ['', 'about/', 'music/', 'morning-yoga/', 'volunteer/']) {
    const pageHtml = readFileSync(`dist/${locale === 'en' ? 'en/' : ''}${page}index.html`, 'utf8');
    const header = pageHtml.match(/<header\b[\s\S]*?<\/header>/)[0];
    const mainMenu = header.match(/<ul class="nav-list">[\s\S]*?<\/ul>/)[0];
    const menuPaths = [...mainMenu.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
    assert.ok(menuPaths.includes(path), 'Volunteer belongs in the main navigation');
    assert.equal(menuPaths.indexOf(path) + 1, menuPaths.indexOf(`${locale === 'en' ? '/en' : ''}/music/`), 'Volunteer must directly precede Music');
    assert.equal(menuPaths.filter(href => href === path).length, 1, 'Each menu has exactly one volunteer entrance');
    assert.ok(!header.includes('site-header__actions'), 'Remove the former entrance beside the language switch');
  }
}
console.log('PASS: JA/EN volunteer copy, five roles, six benefits, eligibility, one H1, active navigation, verified application URL, and one volunteer entrance directly before Music on every personal-site page.');
