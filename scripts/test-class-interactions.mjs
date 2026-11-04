/**
 * Run from any directory: node scripts/test-class-interactions.mjs
 * No build, browser, network, or extra dependencies required beyond npm install.
 * Executes the shipped interaction scripts with a focused DOM mock. This checks
 * application behavior, not browser layout, native dialog focus trapping, or Esc.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(path.join(root, file), 'utf8');
const japanese = /[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]/u;
let checks = 0;
function test(name, run) {
  run();
  checks++;
  console.log(`PASS: ${name}`);
}
function loadData(file) {
  const scope = { exports: {} };
  vm.runInNewContext(ts.transpileModule(read(file), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, scope, { filename: file });
  return scope.exports;
}
const classes = loadData('src/data/classes.ts');
const yoga = loadData('src/data/yoga.ts');
const plain = value => JSON.parse(JSON.stringify(value));

test('JA defaults, English coverage, content shape, prices and operational link parity', () => {
  const ja = classes.getClassContent('ja');
  const en = classes.getClassContent('en');
  assert.deepEqual(plain(classes.getClassContent()), plain(ja));
  for (const [key, value] of Object.entries(ja)) {
    assert.deepEqual(plain(value), plain(classes[key]), `Japanese source changed: ${key}`);
  }
  function compare(a, b, key = 'classes') {
    assert.equal(typeof b, typeof a, `Type changed: ${key}`);
    if (a === null || typeof a !== 'object') {
      if (typeof a === 'string' && japanese.test(a)) {
        assert.ok(b.trim(), `Empty English translation: ${key}`);
        assert.ok(!japanese.test(b), `Untranslated English content: ${key}`);
      } else {
        // Every ASCII string (prices, URLs, IDs, time ranges) stays identical.
        assert.equal(b, a, `Operational value changed: ${key}`);
      }
      return;
    }
    assert.equal(Array.isArray(b), Array.isArray(a), `Array shape changed: ${key}`);
    assert.deepEqual(Object.keys(b), Object.keys(a), `Content missing: ${key}`);
    for (const field of Object.keys(a)) compare(a[field], b[field], `${key}.${field}`);
  }
  compare(ja, en);
  en.SATORIN_PLANS[0].name = 'temporary test mutation';
  assert.notEqual(classes.getClassContent('en').SATORIN_PLANS[0].name, 'temporary test mutation');
  assert.deepEqual(plain(classes.getClassContent('ja')), plain(ja), 'Localization must not mutate source data');
});

test('Every class UI translation is present; locale props and internal links are wired', () => {
  const dir = 'src/components/yoga/classes';
  const files = readdirSync(path.join(root, dir)).filter(name => name.endsWith('.astro')).map(name => `${dir}/${name}`);
  const page = 'src/pages/hatha-yoga/ja/offerings.astro';
  let labels = 0;
  for (const file of [...files, page]) {
    const source = read(file);
    assert.match(source, /locale\s*=\s*'ja'/, `${file}: missing Japanese default`);
    for (const [, literal] of source.matchAll(/\bt\(((?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'))\)/g)) {
      const label = vm.runInNewContext(literal);
      assert.equal(classes.classText('ja', label), label, `${file}: changed Japanese label`);
      const english = classes.classText('en', label);
      assert.ok(english.trim(), `${file}: empty label`);
      assert.ok(!japanese.test(english), `${file}: untranslated label ${label}`);
      labels++;
    }
    assert.ok(!/href=["']\/hatha-yoga\/ja\//.test(source), `${file}: hardcoded Japanese internal link`);
  }
  assert.ok(labels > 100, 'Expected broad UI/accessible-label coverage');
  const source = read(page);
  for (const name of ['ClassDialogs', 'Fees', 'InPerson', 'OnlineSingle', 'OsakaCourse', 'RegularClass', 'Satorin', 'SuryaKriya']) {
    for (const tag of source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))) {
      assert.ok(tag[0].includes('locale={locale}'), `${name}: missing locale propagation`);
    }
    assert.ok(source.includes(`<${name} locale={locale}`), `${name}: missing shared component`);
  }
  assert.match(read(`${dir}/Fees.astro`), /<OsakaMembership\s+locale=\{locale\}/);
  assert.match(read('src/pages/hatha-yoga/en/offerings.astro'), /import Offerings from '\.\.\/ja\/offerings\.astro'/);
  assert.match(read('src/pages/hatha-yoga/en/offerings.astro'), /<Offerings locale="en"/);
  assert.match(source, /href=\{yogaHref\(locale, 'contact'\)\}/);
  assert.match(read(`${dir}/SuryaKriya.astro`), /yogaHref\(locale, 'path'\)/);
  for (const name of ['Satorin', 'OnlineSingle']) {
    assert.match(read(`${dir}/${name}.astro`), /locale === 'en' \? '\/satorin\/en\/' : SATORIN_PAGE_URL/);
  }
  for (const locale of ['ja', 'en']) {
    for (const pageName of ['offerings', 'contact', 'path']) {
      assert.equal(yoga.yogaHref(locale, pageName), `/hatha-yoga/${locale}/${pageName}/`);
    }
  }
  // Localized filter names must retain the Japanese keywords used by live data.
  assert.match(source, /label: t\('大阪'\), kw: '大阪'/);
  assert.match(source, /label: t\('東京'\), kw: '東京'/);
  assert.match(source, /data-locale=\{locale\}/);
});

class Target {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  removeEventListener(type, fn) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item !== fn));
  }
  emit(type, options = {}) {
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...options };
    for (const fn of this.listeners.get(type) || []) fn(event);
    return event;
  }
}
class Element extends Target {
  constructor(tag = 'div', { id = '', dataset = {}, classes = [], attrs = {} } = {}) {
    super();
    Object.assign(this, { tagName: tag.toUpperCase(), id, dataset, attrs: { ...attrs }, children: [], parent: null,
      hidden: false, disabled: false, tabIndex: 0, focusCount: 0, open: false, offsetLeft: 0 });
    const names = new Set(classes);
    this.classList = {
      contains: name => names.has(name),
      add: name => names.add(name),
      remove: name => names.delete(name),
      toggle(name, on) {
        const enabled = on === undefined ? !names.has(name) : on;
        if (enabled) names.add(name); else names.delete(name);
        return enabled;
      },
    };
  }
  append(...children) { for (const child of children) { this.children.push(child); child.parent = this; } return this; }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  getAttribute(key) { return Object.hasOwn(this.attrs, key) ? this.attrs[key] : null; }
  removeAttribute(key) { delete this.attrs[key]; }
  focus() { this.focusCount++; }
  getBoundingClientRect() { return { top: 300 }; }
  matches(selector) {
    if (selector === 'a[href^="#"]:not([data-city-tab])') {
      return this.tagName === 'A' && this.getAttribute('href')?.startsWith('#') && !Object.hasOwn(this.dataset, 'cityTab');
    }
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    const attribute = selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);
    if (attribute) {
      const key = attribute[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return Object.hasOwn(this.dataset, key) && (attribute[2] === undefined || this.dataset[key] === attribute[2]);
    }
    return this.tagName === selector.toUpperCase();
  }
  closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector) || null; }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  showModal() { this.open = true; this.openCount = (this.openCount || 0) + 1; }
  close() { this.open = false; this.closeCount = (this.closeCount || 0) + 1; }
}
function harness(elements, { hash = '', reducedMotion = false } = {}) {
  const document = new Target();
  const tree = new Element().append(...elements);
  Object.assign(document, {
    querySelectorAll: selector => tree.querySelectorAll(selector),
    querySelector: selector => tree.querySelector(selector),
    getElementById: id => {
      const find = node => node.id === id ? node : node.children.map(find).find(Boolean);
      return find(tree) || null;
    },
  });
  const window = new Target();
  window.pageYOffset = 10;
  window.scrolls = [];
  window.scrollTo = options => window.scrolls.push(options);
  const location = { hash };
  const history = { entries: [], replaceState(_state, _unused, url) { location.hash = url; this.entries.push(['replace', url]); },
    pushState(_state, _unused, url) { location.hash = url; this.entries.push(['push', url]); } };
  const frames = [];
  const observers = [];
  class ResizeObserver { constructor(fn) { this.callback = fn; observers.push(this); } observe(target) { this.target = target; } }
  window.ResizeObserver = ResizeObserver;
  const context = { document, window, history, location, ResizeObserver,
    requestAnimationFrame: fn => frames.push(fn), matchMedia: () => ({ matches: reducedMotion }) };
  return {
    ...context, tree, frames, observers,
    run(file) { vm.runInNewContext(read(`src/scripts/yoga/${file}`), context, { filename: file }); },
    flush() {
      let remaining = 1000;
      while (frames.length) { assert.ok(remaining-- > 0, 'Animation frame loop did not settle'); frames.shift()(); }
    },
    click(target) { if (target.disabled) return null; const event = target.emit('click'); document.emit('click', { target }); return event; },
  };
}
function classTabs(hash = '', calendarReady = true) {
  const ids = ['osaka', 'tokyo', 'online', 'online-single'];
  const defaults = ['kw-osaka', 'kw-tokyo', 'online', 'online'];
  const tabs = ids.map((id, i) => new Element('a', { dataset: { cityTab: id, calDefault: defaults[i] }, attrs: { href: `#${id}` } }));
  const panels = ids.map(id => new Element('div', { id, dataset: { cityPanel: '' } }));
  const targets = [
    ['osaka-regular', 0], ['osaka-fees', 0], ['osaka-membership', 0], ['osaka-surya', 0], ['online-satorin', 2],
  ].map(([id, index]) => { const node = new Element('section', { id }); panels[index].append(node); return node; });
  const venues = ['osaka', 'osaka', 'tokyo'].map(city => new Element('div', { dataset: { venueCity: city } }));
  const venueRow = new Element('div', { dataset: { venueRow: '' } }).append(...venues);
  const cancel = new Element('div', { dataset: { guideFor: 'osaka tokyo' } });
  const refund = new Element('div', { dataset: { guideFor: 'online' } });
  const guide = new Element('section', { dataset: { hideFor: 'online-single' } }).append(venueRow, cancel, refund);
  const calendar = new Element('div', { dataset: { hyCal: '' } });
  const filters = [];
  const ready = () => { calendar.__hySetFilter = value => filters.push(value); };
  if (calendarReady) ready();
  const h = harness([new Element('div', { id: 'cities' }).append(...tabs), ...panels, guide, calendar], { hash });
  h.run('class-cities.js');
  function selected(id) {
    for (const [i, tab] of tabs.entries()) {
      assert.equal(tab.getAttribute('aria-selected'), ids[i] === id ? 'true' : 'false');
      assert.equal(tab.tabIndex, ids[i] === id ? 0 : -1);
      assert.equal(panels[i].hidden, ids[i] !== id);
    }
    for (const venue of venues) assert.equal(venue.hidden, venue.dataset.venueCity !== id);
    assert.equal(venueRow.hidden, !['osaka', 'tokyo'].includes(id));
    assert.equal(cancel.hidden, !['osaka', 'tokyo'].includes(id));
    assert.equal(refund.hidden, id !== 'online');
    assert.equal(guide.hidden, id === 'online-single');
    if (filters.length) assert.equal(filters.at(-1), defaults[ids.indexOf(id)]);
  }
  return { ...h, ids, tabs, panels, targets, filters, ready, selected };
}

test('Repeated city clicks and keyboard navigation preserve filters and accessible state', () => {
  const h = classTabs();
  h.selected('osaka');
  for (let round = 0; round < 3; round++) {
    for (const [i, id] of h.ids.entries()) {
      assert.ok(h.click(h.tabs[i]).defaultPrevented);
      h.selected(id);
      assert.equal(h.location.hash, `#${id}`);
    }
  }
  function key(index, value, expectedIndex) {
    const event = h.tabs[index].emit('keydown', { key: value });
    assert.ok(event.defaultPrevented);
    h.selected(h.ids[expectedIndex]);
    assert.ok(h.tabs[expectedIndex].focusCount > 0);
    assert.equal(h.location.hash, `#${h.ids[expectedIndex]}`);
  }
  key(3, 'ArrowRight', 0);
  key(0, 'ArrowLeft', 3);
  key(3, 'Home', 0);
  key(0, 'End', 3);
  key(3, 'ArrowLeft', 2);
  assert.equal(h.tabs[2].emit('keydown', { key: 'Tab' }).defaultPrevented, false);
  h.selected('online');
});

test('Direct, nested, legacy, unknown and repeated hashes select the correct class tab', () => {
  const cases = [
    ['#tokyo', 'tokyo'], ['#online-single', 'online-single'], ['#online-satorin', 'online'],
    ['#satorin', 'online'], ['#inperson', 'osaka'], ['#osaka-inperson', 'osaka'], ['#fees', 'osaka'],
    ['#membership', 'osaka'], ['#special', 'osaka'], ['#surya-kriya', 'osaka'], ['#missing', 'osaka'],
  ];
  for (const [hash, selected] of cases) { const h = classTabs(hash); h.flush(); h.selected(selected); }
  const h = classTabs();
  const anchor = new Element('a', { attrs: { href: '#online-satorin' } }).append(new Element('span'));
  for (let round = 0; round < 3; round++) {
    h.click(h.tabs[0]);
    h.document.emit('click', { target: anchor.children[0] });
    h.flush();
    h.selected('online');
    assert.equal(h.location.hash, '#online-satorin');
    assert.equal(h.history.entries.at(-1)[0], 'push');
    assert.equal(h.window.scrolls.at(-1).behavior, 'auto');
  }
  for (const id of ['tokyo', 'online', 'osaka']) {
    h.location.hash = `#${id}`;
    h.window.emit('hashchange');
    h.flush();
    h.selected(id);
  }
  h.location.hash = '#calendar';
  h.window.emit('hashchange');
  h.selected('osaka');
});

test('Tabs tolerate delayed or absent calendar startup and pages without tab markup', () => {
  const h = classTabs('', false);
  h.click(h.tabs[1]);
  h.ready();
  h.flush();
  h.selected('tokyo');
  const absent = classTabs('', false);
  absent.flush();
  absent.selected('osaka');
  assert.equal(absent.frames.length, 0, 'Calendar retries must be bounded');
  const empty = harness([]);
  empty.run('class-cities.js');
  assert.equal(empty.frames.length, 0);
});

test('All class dialogs repeatedly open, ignore content clicks, and close by button/backdrop', () => {
  const dialogs = classes.CLASS_DIALOGS.map(({ id }) => new Element('dialog', { id, classes: ['cl-dialog'] }));
  for (const dialog of dialogs) {
    dialog.append(new Element('button', { dataset: { dialogClose: '' } }).append(new Element('span')), new Element('p'));
  }
  const h = harness(dialogs);
  h.run('class-dialogs.js');
  for (const dialog of dialogs) {
    const opener = new Element('button', { dataset: { dialog: dialog.id } }).append(new Element('span'));
    for (let round = 0; round < 3; round++) {
      h.document.emit('click', { target: opener.children[0] });
      assert.equal(dialog.open, true);
      h.document.emit('click', { target: dialog.children[1] });
      assert.equal(dialog.open, true, 'Content click must not dismiss dialog');
      h.document.emit('click', { target: dialog.children[0].children[0] });
      assert.equal(dialog.open, false);
      h.document.emit('click', { target: opener });
      h.document.emit('click', { target: dialog });
      assert.equal(dialog.open, false);
    }
    assert.equal(dialog.openCount, 6);
    assert.equal(dialog.closeCount, 6);
  }
  h.document.emit('click', { target: new Element('button', { dataset: { dialog: 'missing-dialog' } }) });
  dialogs[0].showModal = undefined;
  h.document.emit('click', { target: new Element('button', { dataset: { dialog: dialogs[0].id } }) });
  assert.equal(dialogs[0].open, false, 'Missing native dialog support must not throw');
});

function gallery(reducedMotion) {
  const gallery = new Element('div', { dataset: { planGallery: '' } });
  const track = new Element('div', { classes: ['cl-plans__track'] });
  const dots = Array.from({ length: 5 }, (_, i) => new Element('button', { dataset: { planDot: String(i) } }));
  const prev = new Element('button', { dataset: { planStep: '-1' } });
  const next = new Element('button', { dataset: { planStep: '1' } });
  const cards = dots.map((_, i) => { const card = new Element('article'); card.offsetLeft = 30 + 240 * i; return card; });
  track.append(...cards);
  Object.assign(track, { scrollWidth: 1200, clientWidth: 240, scrollLeft: 0, scrollCalls: [] });
  track.scrollTo = options => {
    track.scrollCalls.push(options);
    track.scrollLeft = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, options.left));
    track.emit('scroll');
  };
  gallery.append(track, prev, ...dots, next);
  const h = harness([gallery], { reducedMotion });
  h.run('plan-gallery.js');
  function current(index) {
    for (const [i, dot] of dots.entries()) assert.equal(dot.getAttribute('aria-current'), i === index ? 'true' : null);
    assert.equal(prev.disabled, index === 0);
    assert.equal(next.disabled, index === 4);
  }
  return { ...h, gallery, track, dots, prev, next, current };
}

test('Plan gallery arrows, dots, scroll state, reduced motion and visibility remeasurement', () => {
  for (const reduced of [false, true]) {
    const h = gallery(reduced);
    h.current(0);
    for (let round = 0; round < 2; round++) {
      for (let i = 1; i <= 4; i++) { h.click(h.next); h.flush(); h.current(i); }
      const count = h.track.scrollCalls.length;
      h.click(h.next);
      assert.equal(h.track.scrollCalls.length, count, 'Disabled next must not move the gallery');
      for (let i = 3; i >= 0; i--) { h.click(h.prev); h.flush(); h.current(i); }
    }
    for (const index of [4, 1, 3, 0, 2]) { h.click(h.dots[index]); h.flush(); h.current(index); }
    assert.ok(h.track.scrollCalls.every(call => call.behavior === (reduced ? 'auto' : 'smooth')));
    h.track.scrollLeft = 715;
    h.track.emit('scroll');
    h.flush();
    h.current(3);
    h.track.clientWidth = 1200;
    h.track.scrollLeft = 0;
    h.window.emit('resize');
    assert.equal(h.gallery.classList.contains('is-static'), true);
    assert.equal(h.prev.disabled, true);
    assert.equal(h.next.disabled, true);
    h.track.clientWidth = 240;
    for (const observer of h.observers) observer.callback();
    assert.equal(h.gallery.classList.contains('is-static'), false);
    h.current(0);
  }
});

console.log(`\n${checks} class checks passed. Browser layout, native modal focus trapping/Escape, and live external services are not simulated.`);
