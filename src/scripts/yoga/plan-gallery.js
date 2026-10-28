// SATORIN plan gallery: a horizontal scroll-snap row of plan cards.
// Arrows step one card; dots jump to a card and show which one is in view.
(function () {
  document.querySelectorAll('[data-plan-gallery]').forEach(function (g) {
    var track = g.querySelector('.cl-plans__track');
    var cards = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(g.querySelectorAll('[data-plan-dot]'));
    var prev = g.querySelector('[data-plan-step="-1"]');
    var next = g.querySelector('[data-plan-step="1"]');
    var smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    function go(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: smooth });
    }
    function current() {
      var x = track.scrollLeft;
      var best = 0;
      cards.forEach(function (c, i) {
        if (Math.abs(c.offsetLeft - cards[0].offsetLeft - x) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - x)) best = i;
      });
      return best;
    }
    function update() {
      var i = current();
      dots.forEach(function (d, n) { if (n === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      // Hide the controls when every card already fits.
      g.classList.toggle('is-static', max <= 2);
    }

    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { go(Number(d.dataset.planDot)); }); });
    track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    // The gallery may start inside a hidden tab; re-measure when it becomes visible.
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    update();
  });
})();
