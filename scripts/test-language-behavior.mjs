import vm from 'node:vm';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync('public/scripts/language.js', 'utf8');
for (const blockedStorage of [false, true]) {
  const attrs = {href:'/hatha-yoga/en/offerings/','data-language-switch':'en'};
  const listeners = {};
  const link = { getAttribute:k=>attrs[k], addEventListener:(k,fn)=>listeners[k]=fn };
  const stored = {};
  vm.runInNewContext(source, {
    URL, location:{origin:'https://setsukohata.com',search:'?preview=1',hash:'#tokyo'},
    document:{documentElement:{lang:'ja'},querySelectorAll:()=>[link]},
    localStorage:{setItem:(k,v)=>{if(blockedStorage)throw Error('private'); stored[k]=v;}}
  });
  assert.equal(link.href,'/hatha-yoga/en/offerings/?preview=1#tokyo');
  listeners.click();
  if (!blockedStorage) assert.equal(stored['site-language'],'en');
}
const calendar = readFileSync('src/scripts/yoga/calendar.js','utf8');
for (const lang of ['en','ja']) {
  let click;
  const root = {
    dataset:{ics:'/fixture.ics'}, classList:{add(){},remove(){}}, setAttribute(){},
    addEventListener:(event,fn)=>{if(event==='click')click=fn;}, querySelector:()=>null,
    innerHTML:''
  };
  const doc = {documentElement:{lang},readyState:'complete',querySelectorAll:()=>[root],addEventListener(){}};
  vm.runInNewContext(calendar, {
    document:doc, Date, Promise, JSON, String, Math, isNaN,
    window:{AbortController:null}, requestAnimationFrame:fn=>fn(),
    fetch:()=>Promise.resolve({ok:true,text:()=>Promise.resolve('BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:test\nDTSTART:20261104T060000\nDTEND:20261104T064500\nRRULE:FREQ=DAILY;COUNT=60\nEND:VEVENT\nEND:VCALENDAR')})
  });
  await new Promise(r=>setTimeout(r,10));
  assert.ok(root.innerHTML.includes(lang==='en'?'All times are in Japan Standard Time':'時間は日本時間'));
  assert.ok(root.innerHTML.includes(lang==='en'?'Today':'今日'));
  const action = (selector,dataset) => ({closest:s=>s===selector?{dataset}:null});
  click({target:action('[data-v]',{v:'list'})});
  assert.ok(root.innerHTML.includes(lang==='en'?'Upcoming events':'これからの予定'));
  click({target:action('[data-v]',{v:'month'})});
  for (let i=0;i<14;i++) click({target:action('[data-act]',{act:'next'})});
  for (let i=0;i<14;i++) click({target:action('[data-act]',{act:'prev'})});
  assert.ok(root.innerHTML.includes('hy-cal__grid'));
  assert.ok(root.innerHTML.includes(lang==='en'?'(Untitled)':'(無題)'), 'Untitled events must not throw or lose their localized fallback');
}
console.log('PASS: language switch preserves fragments/query and tolerates blocked storage; calendar locale and repeated navigation.');

// Contact validation follows page locale, not the browser UI language.
const ts = await import('typescript');
const contactScript = readFileSync('src/pages/hatha-yoga/ja/contact.astro','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const lang of ['ja','en']) {
  const field = {validity:{valueMissing:true,typeMismatch:false},events:{},setCustomValidity(s){this.message=s;},addEventListener(k,v){this.events[k]=v;}};
  vm.runInNewContext(ts.transpile(contactScript), {document:{documentElement:{lang},querySelector:()=>({querySelectorAll:()=>[field]})}});
  field.events.invalid(); assert.equal(field.message,lang==='en'?'Please complete this field.':'この項目を入力してください。');
  field.validity={valueMissing:false,typeMismatch:true};field.events.invalid();
  assert.equal(field.message,lang==='en'?'Please enter a valid email address.':'有効なメールアドレスを入力してください。');
  field.events.input();assert.equal(field.message,'');
}

// Source contracts plus bounded geometry doubles, NOT browser layout validation.
// Execute the production TypeScript with asynchronous frames/timers. Intrinsic text
// widths below are supplied measurements, not a font engine or a CSS layout engine.
const headerSource = readFileSync('src/components/yoga/Header.astro', 'utf8');
const shell = readFileSync('src/styles/yoga/shell.css', 'utf8');
const warm = readFileSync('src/styles/yoga/warm.css', 'utf8');
const navSource = readFileSync('src/scripts/yoga/nav.ts', 'utf8');
const navScript = ts.transpile(navSource);
const cssRule = selector => {
  const rule = [...shell.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(match => match[1].trim() === selector);
  assert.ok(rule, `Missing CSS rule: ${selector}`);
  return rule[2];
};
const rowRule = cssRule('body.yoga-site .yoga-header > .yoga-header__row');
const compactRowRule = cssRule('body.yoga-site .yoga-header[data-nav-density="compact"] > .yoga-header__row');
const navRule = cssRule('body.yoga-site .yoga-header > .yoga-header__row > .yoga-primary-nav');
const compactNavRule = cssRule('body.yoga-site .yoga-header[data-nav-density="compact"] > .yoga-header__row > .yoga-primary-nav');
const pixels = (rule, property) => {
  const match = rule.match(new RegExp(`(?:^|[;\\s])${property}:\\s*([\\d.]+)px`));
  assert.ok(match, `Expected pixel value for ${property}`);
  return Number(match[1]);
};
const brandRule = cssRule('body.yoga-site .yoga-header .yoga-header__brand');
assert.equal(pixels(brandRule, 'gap'), 6, 'Narrow phones compress decorative brand spacing');
assert.match(brandRule, /letter-spacing:\s*\.03em/);
assert.ok(!brandRule.includes('font-size'), 'Do not shrink brand text to fit mobile controls');
const regularGap = pixels(rowRule, 'column-gap');
const compactGap = pixels(compactRowRule, 'column-gap');
const regularNavGap = pixels(navRule, 'gap');
const compactNavGap = pixels(compactNavRule, 'gap');
const compactPadding = pixels(compactRowRule, 'padding-inline');
const rowMax = pixels(rowRule, 'max-width');
const paddingClamp = rowRule.match(/padding-inline:\s*clamp\(([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)/);
assert.ok(paddingClamp, 'The regular row spends responsive outer whitespace');
const [, paddingMin, paddingVw, paddingMax] = paddingClamp.map(Number);
assert.ok(compactGap < regularGap && compactNavGap < regularNavGap && compactPadding < paddingMax);
assert.match(cssRule(':root'), /scrollbar-gutter:\s*stable/, 'Menu scroll lock must not change available header width');
assert.ok(!headerSource.includes('data-nav-layout='), 'No-JS fallback stays available until measurement sets the mode');
assert.ok(!/<nav[^>]*(?:aria-hidden|\binert\b)/.test(headerSource), 'No-JS desktop links must remain accessible');
assert.match(shell, /\.yoga-header:not\(\[data-nav-layout\]\) \.yoga-primary-nav/, 'Fallback must only apply before measured layout exists');
assert.match(navRule, /width:\s*max-content/);
assert.match(navRule, /flex:\s*none/);
assert.match(navRule, /display:\s*flex !important/);
assert.match(cssRule('.yoga-header:not([data-nav-layout="desktop"]) .yoga-primary-nav'), /visibility:\s*hidden/);
assert.match(shell, /\[data-nav-layout="desktop"\] #yoga-menu-btn/);
assert.match(headerSource, /<nav class="yoga-primary-nav /);
assert.ok(!headerSource.includes('md:flex') && !headerSource.includes('md:hidden'));
assert.ok(!warm.includes('nav[aria-label="Primary"]'));
assert.ok(!/OPEN_DESKTOP_MIN|matchMedia\(/.test(navSource), 'A guessed viewport cutoff must not replace content measurement');

function createHeader(lang, { width = 1360, languageSwitch = true } = {}) {
  const windowEvents = new Map(), documentEvents = new Map(), fontEvents = new Map();
  const frames = [], timers = [], observers = [], measurements = [];
  let resolveFonts;
  const fontsReady = new Promise(resolve => { resolveFonts = resolve; });
  let document;
  const element = (name, attrs = {}) => {
    const events = new Map(), classes = new Set();
    return {
      name, attrs, dataset: {}, children: [], hidden: false, inert: false,
      classList: {
        add: key => classes.add(key), remove: key => classes.delete(key), contains: key => classes.has(key),
        toggle(key, value) { if (value) classes.add(key); else classes.delete(key); }
      },
      setAttribute(key, value) { this.attrs[key] = value; },
      removeAttribute(key) { delete this.attrs[key]; },
      addEventListener(key, fn) { const callbacks = events.get(key) ?? []; callbacks.push(fn); events.set(key, callbacks); },
      dispatch(key, event = {}) { for (const fn of events.get(key) ?? []) fn(event); },
      contains(other) { return this === other || this.children.some(child => child.contains(other)); },
      focus(options) { assert.equal(options?.preventScroll, true); document.activeElement = this; },
      querySelector() { return null; }
    };
  };
  const labels = lang === 'ja' ? ['メニューを開く', 'メニューを閉じる'] : ['Open menu', 'Close menu'];
  const header = element('header');
  header.dataset = { navDensity: 'regular' };
  const row = element('row'), brand = element('brand'), nav = element('nav');
  const language = element('language'), button = element('button', { 'aria-expanded': 'false', 'aria-label': labels[0] });
  button.dataset = { labelOpen: labels[0], labelClose: labels[1] };
  const wrap = element('wrap'), list = element('list'), scrim = element('scrim');
  const desktopLink = element('desktopLink'), mobileLink = element('mobileLink');
  wrap.hidden = true;
  nav.children = [desktopLink]; list.children = [mobileLink]; wrap.children = [list, scrim];
  nav.querySelector = selector => selector === 'a, button' ? desktopLink : null;
  wrap.querySelector = selector => selector === 'nav' ? list : selector === '[data-scrim]' ? scrim : null;
  header.querySelector = selector => ({ '.yoga-header__row': row, '.yoga-header__brand': brand, '.yoga-primary-nav': nav, '.yoga-language-switch': languageSwitch ? language : null })[selector] ?? null;
  const geometry = { width, brand: 195, text: lang === 'ja' ? 510 : 465, language: lang === 'ja' ? 40 : 62, items: 7 };
  const contentWidth = density => geometry.brand + geometry.text + (geometry.items - 1) * (density === 'regular' ? regularNavGap : compactNavGap) + (languageSwitch ? geometry.language : 0);
  const required = density => contentWidth(density) + (languageSwitch ? 2 : 1) * (density === 'regular' ? regularGap : compactGap);
  const padding = density => density === 'compact' ? compactPadding : Math.max(paddingMin, Math.min(paddingMax, geometry.width * paddingVw / 100));
  const available = density => Math.min(rowMax, geometry.width) - 2 * padding(density);
  row.getBoundingClientRect = () => {
    measurements.push(header.dataset.navDensity);
    return { width: Math.min(rowMax, geometry.width) };
  };
  brand.getBoundingClientRect = () => ({ width: geometry.brand });
  nav.getBoundingClientRect = () => ({ width: geometry.text + (geometry.items - 1) * (header.dataset.navDensity === 'regular' ? regularNavGap : compactNavGap) });
  language.getBoundingClientRect = () => ({ width: geometry.language });
  document = {
    activeElement: null, documentElement: { lang, style: { overflow: '' } },
    fonts: { ready: fontsReady, addEventListener: (key, fn) => fontEvents.set(key, fn) },
    querySelectorAll: () => [], querySelector: () => header,
    getElementById: id => id === 'yoga-menu-btn' ? button : id === 'yoga-mobile-nav' ? wrap : null,
    addEventListener(key, fn) { documentEvents.set(key, fn); }
  };
  const window = { innerWidth: width, addEventListener: (key, fn) => windowEvents.set(key, fn), setTimeout: fn => timers.push(fn) };
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.observed = []; observers.push(this); }
    observe(target) { this.observed.push(target); }
  }
  vm.runInNewContext(navScript, {
    document, window, ResizeObserver,
    requestAnimationFrame: fn => frames.push(fn),
    getComputedStyle(target) {
      assert.equal(target, row);
      return { paddingLeft: String(padding(header.dataset.navDensity)), paddingRight: String(padding(header.dataset.navDensity)), columnGap: String(header.dataset.navDensity === 'regular' ? regularGap : compactGap) };
    }
  });
  const frame = () => frames.splice(0).forEach(fn => fn());
  const flush = () => {
    let count = 0;
    while (frames.length || timers.length) {
      assert.ok(++count < 20, 'Frame/timer queue must settle');
      frame(); timers.splice(0).forEach(fn => fn());
    }
  };
  const expectLayout = (layout, density) => {
    assert.equal(header.dataset.navLayout, layout, `${lang}: layout at ${geometry.width}`);
    assert.equal(header.dataset.navDensity, density);
    assert.equal(nav.inert, layout === 'mobile');
    assert.equal(nav.attrs['aria-hidden'], layout === 'mobile' ? 'true' : undefined);
    if (layout === 'desktop') assert.ok(required(density) + 1 <= available(density), 'Desktop decision leaves rounding safety and no overlap');
    else assert.ok(required('compact') + 1 > available('compact'), 'Mobile only after compact gutters and gaps have been exhausted');
  };
  const resize = newWidth => { geometry.width = newWidth; window.innerWidth = newWidth; windowEvents.get('resize')(); };
  const expectOpen = value => {
    assert.equal(button.attrs['aria-expanded'], String(value));
    assert.equal(button.attrs['aria-label'], labels[value ? 1 : 0]);
    assert.equal(wrap.hidden, !value);
    assert.equal(wrap.classList.contains('is-open'), value);
    assert.equal(header.classList.contains('is-menu-open'), value);
    assert.equal(document.documentElement.style.overflow, value ? 'hidden' : '');
  };
  return { header, geometry, required, available, resize, frame, flush, frames, measurements, expectLayout, expectOpen, button, wrap, list, scrim, document, desktopLink, mobileLink, brand, nav, language, row, window,
    escape: () => documentEvents.get('keydown')({ key: 'Escape' }),
    observe: () => observers.forEach(observer => observer.callback([])), observers,
    fontsDone: () => fontEvents.get('loadingdone')(), resolveFonts };
}

for (const lang of ['ja', 'en']) {
  const h = createHeader(lang);
  h.expectLayout('desktop', 'regular');
  assert.ok(h.observers[0].observed.includes(h.row) && h.observers[0].observed.includes(h.brand) && h.observers[0].observed.includes(h.nav) && h.observers[0].observed.includes(h.language));
  // All these regular widths consume spare space before any density change.
  for (const width of [1320, 1240, 1160, 1080]) {
    h.resize(width); h.flush(); h.expectLayout('desktop', 'regular');
  }
  // At this fixture's threshold the regular padding is in clamp's vw range.
  const regularThreshold = (h.required('regular') + 1) / (1 - 2 * paddingVw / 100);
  assert.ok(regularThreshold * paddingVw / 100 > paddingMin && regularThreshold * paddingVw / 100 < paddingMax);
  for (const offset of [1, -1, 1]) {
    h.resize(regularThreshold + offset); h.flush();
    h.expectLayout('desktop', offset < 0 ? 'compact' : 'regular');
  }
  const compactThreshold = h.required('compact') + 2 * compactPadding + 1;
  for (const offset of [1, 0, -1, 0, 1]) {
    h.resize(compactThreshold + offset); h.flush();
    h.expectLayout(offset < 0 ? 'mobile' : 'desktop', 'compact');
  }
  // Resize work is deferred and deduplicated, not synchronous RAF recursion.
  h.resize(compactThreshold - 1); h.resize(compactThreshold - 2); h.observe();
  assert.equal(h.frames.length, 1);
  assert.equal(h.header.dataset.navLayout, 'desktop');
  h.flush(); h.expectLayout('mobile', 'compact');
  assert.deepEqual(h.measurements.slice(-2), ['regular', 'compact']);

  // Font readiness/loading and element resizing remeasure without a viewport resize.
  const unchangedViewport = h.window.innerWidth;
  h.geometry.text -= 80;
  h.resolveFonts(); await Promise.resolve();
  assert.equal(h.frames.length, 1); h.flush(); h.expectLayout('desktop', 'compact');
  h.geometry.text += 80; h.fontsDone(); h.flush(); h.expectLayout('mobile', 'compact');
  h.geometry.text -= 80; h.observe(); h.flush(); h.expectLayout('desktop', 'compact');
  h.geometry.text += 80; h.observe(); h.flush(); h.expectLayout('mobile', 'compact');
  assert.equal(h.window.innerWidth, unchangedViewport);

  for (let repeat = 0; repeat < 3; repeat++) {
    h.button.dispatch('click');
    assert.equal(h.wrap.hidden, false);
    assert.equal(h.wrap.classList.contains('is-open'), false, 'Opening animation is deferred');
    h.flush(); h.expectOpen(true);
    h.list.dispatch('click', { target: { closest: () => null } }); h.flush(); h.expectOpen(true);
    h.escape(); h.flush(); h.expectOpen(false);
    h.button.dispatch('click'); h.button.dispatch('click'); h.button.dispatch('click'); h.flush(); h.expectOpen(true);
    h.scrim.dispatch('click'); h.flush(); h.expectOpen(false);
    h.button.dispatch('click'); h.list.dispatch('click', { target: { closest: selector => selector === 'a' ? h.mobileLink : null } });
    h.flush(); h.expectOpen(false);
    // A close's queued timer must not hide the subsequently reopened menu.
    h.button.dispatch('click'); h.escape(); h.button.dispatch('click'); h.flush(); h.expectOpen(true);
    h.escape(); h.flush(); h.expectOpen(false);
  }

  h.document.activeElement = h.button;
  h.resize(1360); h.flush(); h.expectLayout('desktop', 'regular');
  assert.equal(h.document.activeElement, h.desktopLink, 'Hidden mobile button focus relocates to desktop nav');
  h.document.activeElement = h.desktopLink;
  h.resize(compactThreshold - 1); h.flush(); h.expectLayout('mobile', 'compact');
  assert.equal(h.document.activeElement, h.button, 'Hidden desktop nav focus relocates to hamburger');
  h.button.dispatch('click'); h.flush(); h.expectOpen(true);
  h.document.activeElement = h.mobileLink;
  h.resize(1360); h.frame();
  h.expectLayout('desktop', 'regular');
  assert.equal(h.wrap.hidden, true, 'Desktop hides mobile panel immediately, not after its fade timer');
  assert.equal(h.document.documentElement.style.overflow, '');
  assert.equal(h.document.activeElement, h.desktopLink);
  h.flush(); h.expectOpen(false);
  h.button.dispatch('click'); h.flush(); h.expectOpen(false);

  // Desktop measurement is queued first, then a stale mobile open is queued.
  h.resize(compactThreshold - 1); h.flush();
  h.resize(1360); h.button.dispatch('click');
  assert.equal(h.frames.length, 2);
  h.frame(); h.expectLayout('desktop', 'regular');
  assert.equal(h.wrap.classList.contains('is-open'), false, 'Delayed opening frame cannot reopen on desktop');
  h.flush(); h.expectOpen(false);
  // Resizing must leave unrelated focused elements alone.
  h.document.activeElement = h.brand;
  h.resize(compactThreshold - 1); h.flush(); assert.equal(h.document.activeElement, h.brand);
  h.resize(1360); h.flush(); assert.equal(h.document.activeElement, h.brand);

  const withoutLanguage = createHeader(lang, { languageSwitch: false });
  withoutLanguage.expectLayout('desktop', 'regular');
  const threshold = withoutLanguage.required('compact') + 2 * compactPadding + 1;
  withoutLanguage.resize(threshold); withoutLanguage.flush(); withoutLanguage.expectLayout('desktop', 'compact');
  withoutLanguage.resize(threshold - 1); withoutLanguage.flush(); withoutLanguage.expectLayout('mobile', 'compact');
}
console.log('PASS: JA/EN production header content-fit decisions, regular/compact/mobile threshold edges, whitespace exhaustion, font/ResizeObserver changes, async menu races, dismissal, scroll unlock and focus relocation (bounded geometry double; not browser layout validation).');
