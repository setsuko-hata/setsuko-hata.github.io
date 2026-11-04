/**
 * Run with `node scripts/test-static-locales.mjs` (no build required).
 * Executes the actual inline scripts against small DOM mocks. These checks
 * cover interaction logic and localized data, not browser layout or rendering.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const publicRoot = new URL('../public/', import.meta.url);
const readPage = (section, locale) => readFileSync(
  new URL(`${section}/${locale === 'en' ? 'en/' : ''}index.html`, publicRoot),
  'utf8',
);
const inlineScript = (html) => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/\bsrc\s*=/.test(match[1]));
  assert.equal(scripts.length, 1, 'Expected one inline behavior script');
  return scripts[0][2];
};
const capture = (html, pattern) => {
  const match = html.match(pattern);
  assert.ok(match, `Missing expected static markup: ${pattern}`);
  return match[1];
};
const decodeText = (html) => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'");

function eventNode() {
  return {
    attrs: {},
    events: {},
    style: { setProperty() {} },
    setAttribute(key, value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; },
    addEventListener(type, listener) { this.events[type] = listener; },
    focus() { this.focused = true; },
    closest() { return null; },
  };
}

function testCarousel(locale) {
  const html = readPage('satorin', locale);
  const cards = [...html.matchAll(/class="plan-card"/g)].map(eventNode);
  const dots = [...html.matchAll(/\bdata-dot="\d+"/g)].map(eventNode);
  assert.equal(cards.length, 5);
  assert.equal(dots.length, cards.length);
  const previous = eventNode();
  const next = eventNode();
  const region = eventNode();
  region.children = cards;
  vm.runInNewContext(inlineScript(html), {
    document: {
      getElementById: () => region,
      querySelectorAll: () => dots,
      querySelector: (selector) => selector.includes('prev') ? previous : next,
    },
  });
  const current = () => cards.findIndex((card) => card.attrs['aria-current'] === 'true');
  const key = (value, target = region) => {
    let prevented = false;
    region.events.keydown({ key: value, target, preventDefault() { prevented = true; } });
    return prevented;
  };

  assert.equal(current(), 2, 'Balance is selected initially');
  assert.equal(dots[2].attrs['aria-current'], 'true');
  assert.ok(key('Home'));
  assert.equal(current(), 0);
  assert.equal(previous.disabled, true);
  previous.events.click();
  assert.equal(current(), 0, 'Previous cannot pass the first card');
  key('End');
  assert.equal(current(), 4);
  assert.equal(next.disabled, true);
  next.events.click();
  assert.equal(current(), 4, 'Next cannot pass the last card');
  dots[1].events.click();
  assert.equal(current(), 1);
  key('ArrowRight');
  assert.equal(current(), 2);
  key('ArrowLeft');
  assert.equal(current(), 1);
  key('Enter', cards[3]);
  assert.equal(current(), 3);
  assert.equal(cards[3].focused, true);
  key(' ', cards[2]);
  assert.equal(current(), 2);
  cards[3].events.focusin();
  assert.equal(current(), 3);
  cards[1].events.click({ target: { closest: () => null } });
  assert.equal(current(), 1);
  cards[4].events.click({ target: { closest: () => ({}) } });
  assert.equal(current(), 1, 'A nested link is not a card-selection click');
  assert.equal(key('Tab'), false, 'Unrelated keys retain native behavior');

  region.events.pointerdown({ pointerType: 'touch', clientX: 200, clientY: 100, pointerId: 1 });
  region.events.pointerup({ clientX: 100, clientY: 100, pointerId: 1 });
  assert.equal(current(), 2, 'Swipe left selects the next card');
  let prevented = false;
  let stopped = false;
  region.events.click({ preventDefault() { prevented = true; }, stopPropagation() { stopped = true; } });
  assert.ok(prevented && stopped, 'A completed swipe suppresses the following click');
  region.events.pointerdown({ pointerType: 'touch', clientX: 200, clientY: 100, pointerId: 2 });
  region.events.pointercancel();
  region.events.pointerup({ clientX: 100, clientY: 100, pointerId: 2 });
  assert.equal(current(), 2, 'A cancelled gesture does not select another card');
  region.events.pointerdown({ pointerType: 'mouse', clientX: 200, clientY: 100, pointerId: 3 });
  region.events.pointerup({ clientX: 100, clientY: 100, pointerId: 3 });
  assert.equal(current(), 2, 'Mouse gestures do not trigger touch navigation');
  console.log(`PASS: ${locale} SATORIN carousel keyboard, boundaries, dots, focus, links, swipe and cancellation.`);
}

function testShop(locale) {
  const html = readPage('shop', locale);
  const image = { src: '', alt: '' };
  const photo = { className: '' };
  const inner = { innerHTML: '' };
  const closeButton = {};
  const dialog = {
    open: false,
    scrollTop: 10,
    querySelector(selector) {
      return selector === 'img' ? image : selector === '.ph' ? photo
        : selector === '.in' ? inner : closeButton;
    },
    showModal() { this.open = true; },
    close() { this.open = false; },
  };
  const cards = [...html.matchAll(/<article\b[^>]*class="card"[^>]*>([\s\S]*?)<\/article>/g)].map((match) => {
    const markup = match[1];
    const headingHtml = capture(markup, /<h3>([\s\S]*?)<\/h3>/);
    const heading = { textContent: decodeText(headingHtml), innerHTML: headingHtml };
    const sourceImage = { src: capture(markup, /<img\b[^>]*src="([^"]+)"/) };
    const sourcePhoto = { className: capture(markup, /<div class="(ph [^"]+)"/) };
    const subtitle = { outerHTML: capture(markup, /(<div class="en">[\s\S]*?<\/div>)/) };
    const price = { outerHTML: capture(markup, /(<div class="price">[\s\S]*?<\/div>)/) };
    const details = { innerHTML: capture(markup, /<div class="more" hidden>([\s\S]*)<\/div>\s*$/) };
    const body = { querySelector: (selector) => selector === 'h3' ? heading : selector === '.en' ? subtitle : price };
    return {
      heading, sourceImage, sourcePhoto, details, price,
      querySelector: (selector) => selector === 'img' ? sourceImage : selector === 'h3' ? heading
        : selector === '.body' ? body : selector === '.more' ? details : sourcePhoto,
    };
  });
  assert.equal(cards.length, 19, 'All catalog products are available');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, new RegExp(`aria-label="${locale === 'en' ? 'Close' : '閉じる'}"`));
  vm.runInNewContext(inlineScript(html), {
    document: { getElementById: () => dialog, querySelectorAll: () => cards },
  });

  for (const card of cards) {
    card.onclick();
    assert.equal(dialog.open, true);
    assert.equal(dialog.scrollTop, 0);
    assert.equal(image.src, card.sourceImage.src);
    assert.equal(image.alt, card.heading.textContent);
    assert.equal(photo.className, card.sourcePhoto.className);
    assert.ok(inner.innerHTML.includes(card.details.innerHTML));
    assert.ok(inner.innerHTML.includes(card.price.outerHTML));
    if (locale === 'en') assert.doesNotMatch(inner.innerHTML, /[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]/u);
    closeButton.onclick();
    assert.equal(dialog.open, false);
    for (const key of ['Enter', ' ']) {
      let prevented = false;
      card.onkeydown({ key, preventDefault() { prevented = true; } });
      assert.ok(dialog.open && prevented, `${key} opens the product dialog`);
      dialog.onclick({ target: inner });
      assert.equal(dialog.open, true, 'Clicks inside the dialog do not dismiss it');
      dialog.onclick({ target: dialog });
      assert.equal(dialog.open, false, 'Backdrop clicks dismiss the dialog');
    }
    card.onkeydown({ key: 'Tab', preventDefault() { assert.fail('Tab must retain native behavior'); } });
    assert.equal(dialog.open, false);
  }
  console.log(`PASS: ${locale} shop, all 19 products: click, keyboard, localized content, images, prices, close and reopen.`);
}

for (const locale of ['ja', 'en']) {
  testCarousel(locale);
  testShop(locale);
}
