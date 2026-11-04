import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const scope = { exports: {} };
vm.runInNewContext(ts.transpile(readFileSync('src/data/personal-i18n.ts', 'utf8'), { module: ts.ModuleKind.CommonJS }), scope);
const { localizedPath, alternatePaths } = scope.exports;
const routes = [
  ['/', 'ja', '/'], ['/', 'en', '/en/'], ['/en/about/', 'ja', '/about/'], ['/en/music', 'en', '/en/music/'],
  ['/hatha-yoga/ja/offerings/?x=1#calendar', 'en', '/hatha-yoga/en/offerings/?x=1#calendar'],
  ['/hatha-yoga/en/offerings/', 'ja', '/hatha-yoga/ja/offerings/'], ['/hatha-yoga', 'en', '/hatha-yoga/en/'],
  ['/satorin', 'en', '/satorin/en/'], ['/satorin/en/?x=1', 'ja', '/satorin/?x=1'], ['/shop/en/', 'en', '/shop/en/'],
  ['https://youtube.com/a', 'en', 'https://youtube.com/a'], ['//example.com/a', 'en', '//example.com/a'],
  ['#paths', 'en', '#paths'], ['mailto:x@y.com', 'en', 'mailto:x@y.com'],
];
for (const [path, locale, expected] of routes) assert.equal(localizedPath(path, locale), expected);
for (const path of ['/', '/about/', '/music/', '/morning-yoga/']) {
  assert.equal(alternatePaths(path).en, `/en${path}`);
  assert.equal(alternatePaths(`/en${path}`).ja, path);
}

const signupSource = readFileSync('src/components/SignupForm.astro', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const locale of ['ja', 'en']) {
  for (const result of ['unconfigured', 'success', 'failure']) {
    let now = 10000;
    let calls = 0;
    const fields = {};
    for (const name of ['firstName', 'lastName', 'email', 'website']) {
      fields[name] = {
        value: name === 'firstName' ? 'Alex' : '', validity: {}, events: {},
        addEventListener(event, fn) { this.events[event] = fn; },
        setCustomValidity(value) { this.validationMessage = value; },
      };
    }
    const button = { disabled: false };
    const msg = { textContent: '' };
    const events = {};
    const form = {
      dataset: { locale },
      querySelector(selector) {
        if (selector === '.signup-submit') return button;
        if (selector === '[data-signup-msg]') return msg;
        return fields[selector.match(/name="(.*?)"/)[1]];
      },
      querySelectorAll(selector) { return Object.entries(fields).filter(([name]) => selector === 'input' || name !== 'website').map(([, field]) => field); },
      addEventListener(event, fn) { events[event] = fn; },
    };
    const endpoint = result === 'unconfigured' ? '' : 'https://example.test/signup';
    const source = signupSource.replace('import.meta.env.PUBLIC_SIGNUP_ENDPOINT', JSON.stringify(endpoint));
    vm.runInNewContext(ts.transpile(source), {
      document: { querySelector: () => form }, Date: { now: () => now }, console: { warn() {}, error() {} },
      fetch: async () => { calls++; if (result === 'failure') throw Error('offline'); return {}; },
    });
    fields.firstName.validity = { valueMissing: true };
    fields.firstName.events.invalid();
    assert.equal(fields.firstName.validationMessage, locale === 'en' ? 'Please fill out this field.' : 'この項目を入力してください。');
    fields.firstName.events.input();
    assert.equal(fields.firstName.validationMessage, '');
    fields.email.validity = { typeMismatch: true };
    fields.email.events.invalid();
    assert.equal(fields.email.validationMessage, locale === 'en' ? 'Please enter a valid email address.' : '有効なメールアドレスを入力してください。');
    now = 13000;
    await events.submit({ preventDefault() {} });
    assert.equal(calls, result === 'unconfigured' ? 0 : 1);
    assert.equal(button.disabled, false);
    if (result === 'failure') {
      assert.ok(msg.textContent.includes(locale === 'en' ? 'Something went wrong.' : '送信できませんでした。'));
    } else {
      assert.equal(msg.textContent, locale === 'en' ? 'Thank you for signing up, Alex.' : 'Alex様、ご登録ありがとうございます。');
    }
  }
}

const gallerySource = readFileSync('src/pages/about.astro', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const locale of ['ja', 'en']) {
  let paused = false;
  let onClick;
  const label = { textContent: '' };
  const toggle = { dataset: { locale }, querySelector: () => label, setAttribute() {}, addEventListener: (_, fn) => { onClick = fn; } };
  const track = { classList: { toggle: () => (paused = !paused) } };
  vm.runInNewContext(ts.transpile(gallerySource), { document: { querySelector: selector => selector.includes('track') ? track : toggle } });
  onClick();
  assert.equal(label.textContent, locale === 'en' ? 'Play gallery motion' : 'ギャラリーの動きを再開する');
  onClick();
  assert.equal(label.textContent, locale === 'en' ? 'Pause gallery motion' : 'ギャラリーの動きを止める');
}
console.log('PASS: personal locale routing, signup validation/success/error copy, and repeated gallery controls in JA/EN.');
