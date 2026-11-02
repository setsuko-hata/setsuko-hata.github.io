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

    var defs = document.createElementNS(NS, 'defs');
    var marker = document.createElementNS(NS, 'marker');
    marker.setAttribute('id','fl-direction'); marker.setAttribute('viewBox','0 0 8 8');
    marker.setAttribute('refX','7'); marker.setAttribute('refY','4');
    marker.setAttribute('markerWidth','6'); marker.setAttribute('markerHeight','6'); marker.setAttribute('orient','auto');
    var arrow = document.createElementNS(NS,'polygon'); arrow.setAttribute('points','0,0 8,4 0,8'); arrow.setAttribute('fill','#7B8062');
    marker.appendChild(arrow); defs.appendChild(marker); svg.appendChild(defs);
    cards.forEach(function (card) {
      var a = rel(card, base);
      card.dataset.next.split(/\s+/).forEach(function (id) {
        var target = document.getElementById(id);
        if (!target) return;
        var b = rel(target, base);
        var d;
        if (window.matchMedia('(min-width: 900px)').matches && card.id === 'fl-upa4') {
          // Exit below the preparatory module, then use the clear central corridor.
          var moduleBottom = flow.querySelector('.fl-col--upa').getBoundingClientRect().bottom - base.top;
          var corridor = (flow.querySelector('.fl-col--upa').getBoundingClientRect().right - base.left + b.l) / 2;
          d = 'M' + ((a.l+a.r)/2) + ' ' + a.b + ' V' + (moduleBottom+24) + ' H' + corridor + ' V' + ((b.t+b.b)/2) + ' H' + b.l;
        } else if (window.matchMedia('(min-width: 900px)').matches && card.id === 'fl-upa3') {
          d = 'M' + a.l + ' ' + ((a.t+a.b)/2) + ' H' + b.r;
        } else if (b.t >= a.b - 1) {
          var sx = (a.l + a.r) / 2, tx = (b.l + b.r) / 2, midY = (a.b + b.t) / 2;
          d = 'M' + sx + ' ' + a.b + ' V' + midY + ' H' + tx + ' V' + b.t;
        } else {
          var sy = (a.t + a.b) / 2, ty = (b.t + b.b) / 2, midX = (a.r + b.l) / 2;
          d = 'M' + a.r + ' ' + sy + ' H' + midX + ' V' + ty + ' H' + b.l;
        }
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('marker-end', 'url(#fl-direction)');
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
