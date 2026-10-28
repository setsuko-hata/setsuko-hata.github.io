(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  function group(id) {
    var btn = document.querySelector('[data-tab="' + id + '"]');
    return btn ? Array.prototype.slice.call(btn.closest('[role="tablist"]').querySelectorAll('[data-tab]')) : [];
  }
  function select(id, scroll) {
    group(id).forEach(function (t) {
      var on = t.dataset.tab === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      document.getElementById('panel-' + t.dataset.tab).hidden = !on;
    });
    if (scroll) {
      var top = document.querySelector('[data-tab="' + id + '"]').closest('[role="tablist"]').getBoundingClientRect().top + window.pageYOffset - 96;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { select(t.dataset.tab, true); });
  });
  function fromHash(scroll) {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var p = el.closest('[role="tabpanel"]');
    while (p) { select(p.id.replace('panel-', ''), false); p = p.parentElement.closest('[role="tabpanel"]'); }
    if (scroll) requestAnimationFrame(function () {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
    });
  }
  fromHash(false);
  window.addEventListener('hashchange', function () { fromHash(true); });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      var p = el.closest('[role="tabpanel"]');
      while (p) { select(p.id.replace('panel-', ''), false); p = p.parentElement.closest('[role="tabpanel"]'); }
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
    });
  });
})();
