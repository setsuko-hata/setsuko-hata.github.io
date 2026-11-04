/**
 * Source-level JA/EN interaction regression tests.
 * Run: node scripts/test-yoga-interactions.mjs
 *
 * Executes the real quiz and chart scripts against a small DOM/Chart test double,
 * using question/result data evaluated from the actual Astro component. No build,
 * browser, network access, form submission, or new dependencies are required.
 * These tests do not replace visual layout or native-browser accessibility QA.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const quizSource = read('src/scripts/yoga/path-quiz.js');
const component = read('src/components/yoga/PathQuiz.astro');
const chartSource = read('src/scripts/yoga/schools-charts.js');
const transpile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const yogaScope = { exports: {} };
vm.runInNewContext(transpile(read('src/data/yoga.ts')), yogaScope);
const frontmatter = component.match(/^---\s*\n([\s\S]*?)\n---/);
assert.ok(frontmatter, 'Quiz must have an Astro frontmatter block');

// Keep the test double tied to the actual template's data and text bindings.
for (const binding of [
  'data-locale={locale}', 'data-quiz-q={q.id}', 'data-result={r.id}', 'data-target={r.target}',
  "data-score={'score' in o ? o.score : undefined}",
  "data-surya={'surya' in o ? '' : undefined}",
  "data-route={'route' in o ? o.route : undefined}",
  '{q.title}', '{o.label}', '{r.name}', '{r.text}',
]) assert.ok(component.includes(binding), `Quiz template must retain ${binding}`);

function fixture(locale) {
  const scope = {
    exports: {},
    Astro: { props: { locale } },
    require(specifier) {
      assert.equal(specifier, '../../data/yoga', 'Only the existing yoga data module is needed');
      return yogaScope.exports;
    },
  };
  vm.runInNewContext(transpile(`${frontmatter[1]}\nglobalThis.quizFixture = { questions, results, trialHref, trialDates, trialExternal };`), scope);
  return scope.quizFixture;
}

// The mock implements only DOM APIs exercised by the production quiz script.
class Element {
  constructor(tagName = 'div', dataset = {}) {
    this.tagName = tagName;
    this.dataset = dataset;
    this.hidden = false;
    this.textContent = '';
    this.children = [];
    this.parent = null;
    this.listeners = {};
    this.classes = new Set();
    this.classList = {
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
      contains: (name) => this.classes.has(name),
    };
  }
  set className(value) { this.classes = new Set(value.split(/\s+/)); }
  get className() { return [...this.classes].join(' '); }
  get firstChild() { return this.children[0] ?? null; }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  focus() { this.ownerDocument.activeElement = this; }
  append(child) { child.parent = this; child.ownerDocument = this.ownerDocument; this.children.push(child); return child; }
  insertBefore(child, before) {
    child.parent = this;
    child.ownerDocument = this.ownerDocument;
    const index = this.children.indexOf(before);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
  }
  remove() { this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; }
  hasAttribute(name) {
    const key = name.replace(/^data-/, '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return Object.hasOwn(this.dataset, key);
  }
  matches(selector) {
    if (selector.startsWith('.')) return selector.slice(1).split('.').every((name) => this.classes.has(name));
    if (selector.startsWith('[')) return this.hasAttribute(selector.slice(1, -1));
    return this.tagName === selector;
  }
  closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector) ?? null; }
  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector),
    ]);
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  click(target = this) {
    let element = target;
    while (element) {
      element.listeners.click?.({ target });
      element = element.parent;
    }
  }
}

function mount(locale, data) {
  const document = {
    activeElement: null,
    createElement(tag) { const element = new Element(tag); element.ownerDocument = this; return element; },
    querySelector(selector) { return selector === '[data-quiz]' ? root : null; },
    querySelectorAll(selector) { return cards.filter((card) => card.matches(selector)); },
    getElementById(id) { return cards.find((card) => card.id === id) ?? null; },
  };
  const make = (tag, dataset = {}) => { const element = document.createElement(tag); element.dataset = dataset; return element; };
  const root = make('div', { quiz: '', locale });
  root.hidden = true;
  const intro = root.append(make('div', { quizIntro: '' }));
  const start = intro.append(make('button', { quizStart: '' }));
  const panel = root.append(make('div', { quizPanel: '' }));
  panel.hidden = true;
  const questionBox = panel.append(make('div', { quizQuestions: '' }));
  const progress = questionBox.append(make('p', { quizProgress: '' }));
  const questions = data.questions.map((q, index) => {
    const node = questionBox.append(make('div', { quizQ: q.id }));
    node.hidden = index > 0;
    node.append(make('h3')).textContent = q.title;
    const options = node.append(make('div'));
    q.options.forEach((option) => {
      const attributes = {};
      if ('score' in option) attributes.score = String(option.score);
      if ('surya' in option) attributes.surya = '';
      if ('route' in option) attributes.route = option.route;
      const button = options.append(make('button', attributes));
      button.className = 'pq-opt';
      button.textContent = option.label;
    });
    return node;
  });
  const back = questionBox.append(make('button', { quizBack: '' }));
  back.hidden = true;
  const resultBox = panel.append(make('div', { quizResult: '' }));
  resultBox.hidden = true;
  const results = data.results.map((result) => {
    const node = resultBox.append(make('article', { result: result.id, target: result.target }));
    node.hidden = true;
    node.append(make('h3')).textContent = result.name;
    node.append(make('p')).textContent = result.text;
    return node;
  });
  const restart = resultBox.append(make('button', { quizRestart: '' }));
  const cards = ['fl-upa1', 'fl-surya'].map((id) => {
    const card = make('article'); card.id = id; card.className = 'fl-card'; return card;
  });
  vm.runInNewContext(quizSource, { document });
  const answer = (question, option, nested = false) => {
    const button = questions[question].querySelectorAll('.pq-opt')[option];
    assert.ok(button, 'Answer must exist in the actual question data');
    assert.equal(questions[question].hidden, false, 'Only the current question is answered');
    button.click(nested ? button.append(make('span')) : button);
  };
  const expectQuestion = (index) => {
    assert.equal(questionBox.hidden, false);
    assert.equal(resultBox.hidden, true);
    questions.forEach((q, i) => assert.equal(q.hidden, i !== index));
    assert.equal(progress.textContent, `${locale === 'en' ? 'Question ' : '質問 '}${index + 1}`);
    assert.equal(document.activeElement, questions[index].querySelector('h3'));
    assert.equal(back.hidden, index === 0);
  };
  const expectResult = (id) => {
    assert.equal(questionBox.hidden, true);
    assert.equal(resultBox.hidden, false);
    results.forEach((result) => assert.equal(result.hidden, result.dataset.result !== id));
    const shown = results.find((result) => result.dataset.result === id);
    assert.equal(document.activeElement, shown.querySelector('h3'));
    const recommended = cards.filter((card) => card.classList.contains('is-recommended'));
    assert.equal(recommended.length, 1);
    assert.equal(recommended[0].id, shown.dataset.target);
    assert.equal(recommended[0].querySelectorAll('.pt-rec').length, 1);
    assert.equal(recommended[0].querySelector('.pt-rec').textContent, locale === 'en' ? 'Your starting point' : 'あなたの始まり');
  };
  const reset = () => {
    restart.click();
    expectQuestion(0);
    cards.forEach((card) => {
      assert.equal(card.classList.contains('is-recommended'), false);
      assert.equal(card.querySelector('.pt-rec'), null);
    });
  };
  return { root, intro, start, panel, questions, back, restart, answer, expectQuestion, expectResult, reset };
}

let quizJourneys = 0;
for (const locale of ['ja', 'en']) {
  const data = fixture(locale);
  assert.deepEqual(Array.from(data.questions, (q) => q.id), ['exp', 'seek', 'bond', 'place']);
  assert.deepEqual(Array.from(data.results, (r) => r.id), ['satorin', 'inperson', 'surya']);
  const sourceTexts = [
    ...data.questions.flatMap((q) => [q.title, ...q.options.map((o) => o.label)]),
    ...data.results.flatMap((r) => [r.name, r.text, ...r.links.map((l) => l.label)]),
  ];
  sourceTexts.forEach((value) => {
    assert.ok(value.trim(), 'All quiz text must be present');
    if (locale === 'en') assert.doesNotMatch(value, /[\u3040-\u30ff\u3400-\u9fff]/, 'EN questions and results must not leak Japanese');
    else assert.match(value, /[\u3040-\u30ff\u3400-\u9fff]/, 'JA questions and results must remain Japanese');
  });
  assert.equal(data.questions[0].title, locale === 'en' ? 'What is your experience with yoga?' : 'これまでのヨガの経験は？');
  assert.equal(data.results.find((r) => r.id === 'surya').name, locale === 'en' ? 'Surya Kriya' : 'スーリヤ・クリヤ');
  assert.equal(data.results[0].links[0].href, locale === 'en' ? '/satorin/en/' : '/satorin/');
  assert.deepEqual(Array.from(data.results[1].links, (link) => link.href), [
    `/hatha-yoga/${locale}/offerings/#osaka`, `/hatha-yoga/${locale}/offerings/#tokyo`,
  ]);
  assert.equal(data.results[2].links[0].href, yogaScope.exports.SURYA_KRIYA_FORM_URL);
  assert.equal(data.results[2].links[0].external, true);
  if (!yogaScope.exports.NEXT_FREE_TRIAL.url) assert.equal(data.trialHref, `/hatha-yoga/${locale}/offerings/#calendar`);
  if (!yogaScope.exports.NEXT_FREE_TRIAL.dates) assert.equal(data.trialDates, locale === 'en' ? 'Dates coming soon' : '日程は近日公開');

  const controls = {
    'data-quiz-start': ['診断を始めよう', 'Start the quiz'],
    'data-quiz-back': ['戻る', 'Back'],
    'data-quiz-restart': ['もう一度診断する', 'Take the quiz again'],
  };
  for (const [marker, text] of Object.entries(controls)) {
    const body = component.match(new RegExp(`${marker}[^>]*>([\\s\\S]*?)<\\/button>`))?.[1].trim();
    assert.ok(body?.startsWith('{t('), `${marker} must use localized button text`);
    const label = vm.runInNewContext(body.slice(1, -1), { t: (ja, en) => locale === 'en' ? en : ja });
    assert.equal(label, text[locale === 'en' ? 1 : 0]);
  }

  const quiz = mount(locale, data);
  assert.equal(quiz.root.hidden, false, 'JS reveals progressive enhancement');
  assert.equal(quiz.panel.hidden, true, 'Questions stay hidden until Start');
  assert.equal(quiz.intro.hidden, false);
  quiz.start.click();
  assert.equal(quiz.intro.hidden, true);
  assert.equal(quiz.panel.hidden, false);
  quiz.expectQuestion(0);
  // Clicking the question heading must not answer; clicks on nested option content must work.
  quiz.questions[0].querySelector('h3').click();
  quiz.expectQuestion(0);
  quiz.answer(0, 2, true);
  quiz.expectQuestion(1);
  quiz.back.click();
  quiz.expectQuestion(0);
  // Back must discard the previous high score rather than keep it in history.
  quiz.answer(0, 0); quiz.answer(1, 0); quiz.answer(2, 3);
  quiz.expectQuestion(3);
  quiz.back.click(); quiz.expectQuestion(2);
  quiz.answer(2, 0); quiz.expectResult('surya');
  quiz.reset(); quiz.reset(); // repeated reset must remain safe and idempotent

  // All first-three-answer combinations, both final locations when applicable.
  // This covers exact score threshold, explicit recommendation, all three results,
  // and repeated completion/reset on the same mounted quiz without stale scores.
  for (let experience = 0; experience < 3; experience++) {
    for (let seek = 0; seek < 3; seek++) {
      for (let bond = 0; bond < 4; bond++) {
        const expectSurya = bond < 2 || experience + (seek === 2 ? 2 : 0) + (bond === 2 ? 2 : 0) >= 3;
        for (const place of expectSurya ? [null] : [0, 1]) {
          quiz.answer(0, experience); quiz.expectQuestion(1);
          quiz.answer(1, seek); quiz.expectQuestion(2);
          quiz.answer(2, bond);
          if (expectSurya) quiz.expectResult('surya');
          else {
            quiz.expectQuestion(3);
            quiz.answer(3, place);
            quiz.expectResult(place === 0 ? 'inperson' : 'satorin');
          }
          quizJourneys++;
          quiz.reset();
        }
      }
    }
  }
}
// Pages without a quiz must be safe to load with the shared script.
assert.doesNotThrow(() => vm.runInNewContext(quizSource, { document: { querySelector: () => null } }));

// Replace only the module import. Chart configuration and tooltip callbacks are
// still executed directly from schools-charts.js; no chart implementation is copied.
const chartBody = chartSource.replace(/^import Chart from 'chart\.js\/auto';\s*/m, '');
assert.notEqual(chartBody, chartSource, 'Chart import seam must match the actual module');
let chartCases = 0;
for (const lang of ['ja', 'en']) {
  for (const canvasIds of [[], ['chartTruancy'], ['chartTruancy', 'chartSuicide']]) {
    const charts = [];
    class Chart {
      static defaults = { font: {} };
      constructor(canvas, config) { charts.push({ canvas, config }); }
    }
    vm.runInNewContext(chartBody, {
      Chart,
      document: {
        documentElement: { lang },
        getElementById: (id) => canvasIds.includes(id) ? { id } : null,
      },
      getComputedStyle: () => ({ getPropertyValue: () => '#2A1D14' }),
    });
    assert.equal(charts.length, canvasIds.length, 'Only present canvases are initialized');
    for (const { canvas, config } of charts) {
      assert.deepEqual(Array.from(config.data.labels), lang === 'en'
        ? ['Elementary school', 'Junior high school', 'High school'] : ['小学生', '中学生', '高校生']);
      assert.deepEqual(Array.from(config.data.datasets[0].data), canvas.id === 'chartTruancy' ? [23, 67.9, 23.3] : [10, 172, 356]);
      assert.equal(config.options.scales.x.suggestedMax, canvas.id === 'chartTruancy' ? 75 : 380);
      const tooltip = config.options.plugins.tooltip.callbacks.label;
      for (const value of [0, 23.3, 1234.5]) {
        assert.equal(tooltip({ parsed: { x: value } }), value.toLocaleString(lang) + (lang === 'en' ? ' students' : '人'));
      }
      assert.equal(config.options.responsive, true);
      assert.equal(config.options.indexAxis, 'y');
    }
    chartCases++;
  }
}
console.log(`PASS: ${quizJourneys} JA/EN quiz journeys, localized source text and links, focus/back/repeated reset, and ${chartCases} chart locale/presence cases. No network or external submissions.`);
