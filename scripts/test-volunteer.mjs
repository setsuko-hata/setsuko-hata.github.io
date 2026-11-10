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
}
console.log('PASS: JA/EN volunteer copy, five roles, six benefits, eligibility, one H1, active navigation and the supplied application URL with safe new-tab behavior.');
