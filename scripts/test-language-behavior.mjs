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

// Guard the shared CSS/JS breakpoint. This is source-level coverage, not a browser layout test.
const header = readFileSync('src/components/yoga/Header.astro', 'utf8');
const warm = readFileSync('src/styles/yoga/warm.css', 'utf8');
const navSource = readFileSync('src/scripts/yoga/nav.ts', 'utf8');
const desktopMin = Number(navSource.match(/const OPEN_DESKTOP_MIN = (\d+);/)[1]);
assert.equal(desktopMin, 1280);
assert.match(header, /<nav class="yoga-primary-nav /, 'Use a locale-independent navigation hook');
assert.ok(!header.includes('md:flex') && !header.includes('md:hidden'), 'Do not reintroduce a second navigation breakpoint');
assert.ok(!header.includes('display:'), 'Navigation visibility belongs in the shared stylesheet');
assert.ok(!warm.includes('nav[aria-label="Primary"]'), 'Translated accessible labels must not control styling');
assert.match(warm, /header \.yoga-primary-nav\s*\{\s*display: none !important;\s*\}\s*#yoga-menu-btn\s*\{\s*display: flex !important;\s*\}/);
assert.match(warm, new RegExp(`@media \\(min-width: ${desktopMin}px\\)\\s*\\{\\s*header \\.yoga-primary-nav\\s*\\{\\s*display: flex !important;\\s*\\}\\s*#yoga-menu-btn,\\s*#yoga-mobile-nav\\s*\\{\\s*display: none !important;\\s*\\}\\s*\\}`));
console.log('PASS: JA/EN navigation uses one locale-independent 1280px CSS/JS breakpoint.');

// Exercise the real menu script in both languages, including the former dead zone.
const navScript = ts.transpile(navSource);
for (const lang of ['ja', 'en']) {
  const events = {}, windowEvents = {}, buttonEvents = {}, listEvents = {}, scrimEvents = {}, timers = [];
  const attributes = {}, classes = new Set();
  const labels = lang === 'ja' ? ['メニューを開く', 'メニューを閉じる'] : ['Open menu', 'Close menu'];
  let headerOpen = false;
  const button = {dataset:{labelOpen:labels[0],labelClose:labels[1]},setAttribute:(k,v)=>attributes[k]=v,addEventListener:(k,v)=>buttonEvents[k]=v};
  const wrap = {hidden:true,classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)},querySelector:s=>({addEventListener:(k,v)=>(s==='nav'?listEvents:scrimEvents)[k]=v})};
  const documentStub={documentElement:{style:{}},querySelectorAll:()=>[],getElementById:id=>id==='yoga-menu-btn'?button:wrap,querySelector:()=>({classList:{toggle:(_,value)=>{headerOpen=value;}}}),addEventListener:(k,v)=>events[k]=v};
  const windowStub={innerWidth:390,setTimeout:fn=>timers.push(fn),addEventListener:(k,v)=>windowEvents[k]=v};
  vm.runInNewContext(navScript,{document:documentStub,window:windowStub,requestAnimationFrame:fn=>fn()});
  const flush = () => timers.splice(0).forEach(fn=>fn());
  const expectOpen = value => {
    assert.equal(attributes['aria-expanded'], String(value));
    assert.equal(attributes['aria-label'], labels[value ? 1 : 0]);
    assert.equal(wrap.hidden, !value);
    assert.equal(classes.has('is-open'), value);
    assert.equal(headerOpen, value);
    assert.equal(documentStub.documentElement.style.overflow, value ? 'hidden' : '');
  };
  for (const width of [390, 1023, 1024, 1279]) {
    windowStub.innerWidth=width;
    buttonEvents.click(); windowEvents.resize(); flush(); expectOpen(true);
    buttonEvents.click(); buttonEvents.click(); flush(); expectOpen(true);
    events.keydown({key:'Escape'}); flush(); expectOpen(false);
    buttonEvents.click(); scrimEvents.click(); flush(); expectOpen(false);
    buttonEvents.click(); listEvents.click({target:{closest:()=>({})}}); flush(); expectOpen(false);
    for (const desktopWidth of [1280, 1440]) {
      buttonEvents.click();
      windowStub.innerWidth=desktopWidth; windowEvents.resize(); flush(); expectOpen(false);
      windowStub.innerWidth=width; windowEvents.resize(); expectOpen(false);
    }
  }
}
console.log('PASS: localized menu open/close, repeated clicks, Escape, scrim/link dismissal, scroll restoration and resize across 1023/1024/1279/1280px.');
