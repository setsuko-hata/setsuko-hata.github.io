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

// Menu can reopen during a pending close animation and closes on Escape/resize.
const navScript = ts.transpile(readFileSync('src/scripts/yoga/nav.ts','utf8'));
const events = {}, windowEvents = {}, buttonEvents = {}, listEvents = {}, timers = [];
const attributes = {}, classes = new Set();
const button = {dataset:{labelOpen:'Open menu',labelClose:'Close menu'},setAttribute:(k,v)=>attributes[k]=v,addEventListener:(k,v)=>buttonEvents[k]=v};
const wrap = {hidden:true,classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)},querySelector:s=>s==='nav'?{addEventListener:(k,v)=>listEvents[k]=v}:{addEventListener(){}}};
const documentStub={documentElement:{style:{}},querySelectorAll:()=>[],getElementById:id=>id==='yoga-menu-btn'?button:wrap,querySelector:()=>({classList:{toggle(){}}}),addEventListener:(k,v)=>events[k]=v};
const windowStub={innerWidth:390,setTimeout:fn=>timers.push(fn),addEventListener:(k,v)=>windowEvents[k]=v};
vm.runInNewContext(navScript,{document:documentStub,window:windowStub,requestAnimationFrame:fn=>fn()});
buttonEvents.click();assert.equal(attributes['aria-expanded'],'true');assert.equal(wrap.hidden,false);
buttonEvents.click();buttonEvents.click();timers.splice(0).forEach(fn=>fn());assert.equal(wrap.hidden,false);
events.keydown({key:'Escape'});timers.splice(0).forEach(fn=>fn());assert.equal(wrap.hidden,true);
buttonEvents.click();windowStub.innerWidth=1440;windowEvents.resize();timers.splice(0).forEach(fn=>fn());assert.equal(wrap.hidden,true);
console.log('PASS: localized contact validation and repeated mobile menu/Escape/resize behavior.');
