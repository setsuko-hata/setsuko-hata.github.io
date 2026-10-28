// Starting-point quiz on the 本格ハタヨガへの道 page (markup: components/yoga/PathQuiz.astro).
// Starts with one 診断を始めよう button. One question at a time; clicking an option answers and moves on.
// After the third question: スーリヤ・クリヤ if an answer says so outright or the score
// reaches 3, otherwise a last question picks SATORIN or 対面. The result also marks
// the matching card in the map below.
(function () {
  var root = document.querySelector('[data-quiz]');
  if (!root) return;
  root.hidden = false;

  var SURYA_SCORE = 3;
  var questions = Array.prototype.slice.call(root.querySelectorAll('[data-quiz-q]'));
  var qBox = root.querySelector('[data-quiz-questions]');
  var resultBox = root.querySelector('[data-quiz-result]');
  var results = Array.prototype.slice.call(root.querySelectorAll('[data-result]'));
  var progress = root.querySelector('[data-quiz-progress]');
  var back = root.querySelector('[data-quiz-back]');
  var history = []; // [{ q: index, score, surya, route }]

  // Opens small; 診断を始めよう shows the questions.
  var intro = root.querySelector('[data-quiz-intro]');
  var panel = root.querySelector('[data-quiz-panel]');
  root.querySelector('[data-quiz-start]').addEventListener('click', function () {
    intro.hidden = true;
    panel.hidden = false;
    showQuestion(0, true);
  });

  function showQuestion(i, focus) {
    questions.forEach(function (q, n) { q.hidden = n !== i; });
    progress.textContent = '質問 ' + (i + 1);
    back.hidden = history.length === 0;
    if (focus) questions[i].querySelector('h3').focus();
  }

  function decide() {
    var score = 0, surya = false, route = 'satorin';
    history.forEach(function (a) {
      score += a.score;
      if (a.surya) surya = true;
      if (a.route) route = a.route;
    });
    return { surya: surya || score >= SURYA_SCORE, route: route };
  }

  function mark(target) {
    document.querySelectorAll('.fl-card.is-recommended').forEach(function (c) {
      c.classList.remove('is-recommended');
      var tag = c.querySelector('.pt-rec');
      if (tag) tag.remove();
    });
    var card = target && document.getElementById(target);
    if (!card) return;
    card.classList.add('is-recommended');
    var tag = document.createElement('span');
    tag.className = 'pt-rec';
    tag.textContent = 'あなたの始まり';
    card.insertBefore(tag, card.firstChild);
  }

  function showResult(id) {
    qBox.hidden = true;
    resultBox.hidden = false;
    var shown;
    results.forEach(function (r) {
      r.hidden = r.dataset.result !== id;
      if (!r.hidden) shown = r;
    });
    mark(shown.dataset.target);
    shown.querySelector('h3').focus();
  }

  function next() {
    var last = history[history.length - 1].q;
    var isPlace = questions[last].dataset.quizQ === 'place';
    if (isPlace) return showResult(decide().route);
    if (last === questions.length - 2) {
      // Third question answered: スーリヤ・クリヤ or the location question.
      if (decide().surya) return showResult('surya');
    }
    showQuestion(last + 1, true);
  }

  questions.forEach(function (q, i) {
    q.addEventListener('click', function (e) {
      var opt = e.target.closest('.pq-opt');
      if (!opt) return;
      history.push({
        q: i,
        score: Number(opt.dataset.score || 0),
        surya: opt.hasAttribute('data-surya'),
        route: opt.dataset.route || null,
      });
      next();
    });
  });

  back.addEventListener('click', function () {
    var prev = history.pop();
    showQuestion(prev ? prev.q : 0, true);
  });

  root.querySelector('[data-quiz-restart]').addEventListener('click', function () {
    history = [];
    mark(null);
    resultBox.hidden = true;
    qBox.hidden = false;
    showQuestion(0, true);
  });
})();
