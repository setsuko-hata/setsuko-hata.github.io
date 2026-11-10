/** Run after astro build. Guard supplied copy and the verified bilingual application destination. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const scope = { exports: {} };
vm.runInNewContext(ts.transpile(readFileSync('src/data/volunteer.ts', 'utf8'), { module: ts.ModuleKind.CommonJS }), scope);
const strings = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(strings);
const decode = html => html.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
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

  const home = readFileSync(`dist/${locale === 'en' ? 'en/' : ''}index.html`, 'utf8');
  const header = home.match(/<header\b[\s\S]*?<\/header>/)[0];
  const mainMenu = header.match(/<ul class="nav-list">[\s\S]*?<\/ul>/)[0];
  assert.ok(!mainMenu.includes('/volunteer/'), 'Home must not repeat the volunteer link in its main menu');
  assert.equal((header.match(new RegExp(`href="${path}"`, 'g')) || []).length, 1);
  assert.match(header, /site-header__actions--home[\s\S]*site-header__volunteer[\s\S]*class="language-switch"/);
  const morning = readFileSync(`dist/${locale === 'en' ? 'en/' : ''}morning-yoga/index.html`, 'utf8');
  assert.ok(!morning.includes('site-header__actions--home'), 'Home-only relocation must not affect the morning-yoga page');
}
console.log('PASS: JA/EN volunteer copy, five roles, six benefits, eligibility, one H1, active navigation, verified application URL, and one homepage entrance directly before the language switch.');
