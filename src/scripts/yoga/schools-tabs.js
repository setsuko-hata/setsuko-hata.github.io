(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  function select(id) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = document.getElementById('panel-' + t.dataset.tab);
      if (p) p.hidden = !on;
    });
  }
  function fromHash() {
    var id = (location.hash || '').replace(/^#/, '').replace(/^tab-/, '');
    if (!id) return;
    if (!tabs.some(function (t) { return t.dataset.tab === id; })) return;
    select(id);
    var sec = document.getElementById('stages');
    if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.pageYOffset - 88 });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { select(t.dataset.tab); });
    t.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(t), n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
      if (n < 0 || n >= tabs.length) return;
      e.preventDefault();
      tabs[n].focus();
      select(tabs[n].dataset.tab);
    });
  });
  fromHash();
  window.addEventListener('hashchange', fromHash);
})();
