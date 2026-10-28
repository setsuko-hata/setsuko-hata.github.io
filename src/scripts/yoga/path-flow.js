// Connecting lines for ヨガ講座・研修の流れ on the 本格ハタヨガへの道 page.
// Each card's data-next lists the ids it leads to. A card that sits below its source gets a
// down-across-down line; one beside it (ウパヨガ4 → スーリヤ・クリヤ on wide screens) gets an
// across-up-across line. Redrawn whenever the layout changes. Without JS the cards still read in order.
(function () {
  var flow = document.querySelector('[data-flow]');
  var svg = flow && flow.querySelector('[data-flow-lines]');
  if (!svg) return;
  var NS = 'http://www.w3.org/2000/svg';
  var cards = Array.prototype.slice.call(flow.querySelectorAll('[data-next]'));

  function rel(el, base) {
    var r = el.getBoundingClientRect();
    return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top };
  }

  function draw() {
    var base = flow.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    svg.setAttribute('width', base.width);
    svg.setAttribute('height', base.height);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    cards.forEach(function (card) {
      var a = rel(card, base);
      card.dataset.next.split(/\s+/).forEach(function (id) {
        var target = document.getElementById(id);
        if (!target) return;
        var b = rel(target, base);
        var d;
        if (b.t >= a.b - 1) {
          var sx = (a.l + a.r) / 2, tx = (b.l + b.r) / 2, midY = (a.b + b.t) / 2;
          d = 'M' + sx + ' ' + a.b + ' V' + midY + ' H' + tx + ' V' + b.t;
        } else {
          var sy = (a.t + a.b) / 2, ty = (b.t + b.b) / 2, midX = (a.r + b.l) / 2;
          d = 'M' + a.r + ' ' + sy + ' H' + midX + ' V' + ty + ' H' + b.l;
        }
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        svg.appendChild(path);
      });
    });
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; draw(); });
  }

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(schedule);
    ro.observe(flow);
    flow.querySelectorAll('.fl-card').forEach(function (c) { ro.observe(c); });
  } else {
    window.addEventListener('resize', schedule);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  draw();
})();
