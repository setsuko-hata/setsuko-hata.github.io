// 大阪 / 東京 / オンライン tabs on the クラス page.
// Without JS every panel shows, one after another. With JS only the chosen city shows.
// The URL hash picks the tab: #osaka, #tokyo, #online, or any id inside a panel
// (e.g. #online-satorin opens オンライン and scrolls to it). Old anchors are mapped below.
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-city-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-city-panel]'));
  if (!tabs.length) return;

  var LEGACY = {
    satorin: 'online-satorin', inperson: 'osaka-regular', 'osaka-inperson': 'osaka-regular', fees: 'osaka-fees',
    membership: 'osaka-membership', special: 'osaka-surya', 'surya-kriya': 'osaka-surya',
  };

  function select(id, focus) {
    tabs.forEach(function (t) {
      var on = t.dataset.cityTab === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) { p.hidden = p.id !== id; });
    // ご案内 lists only the studios of the chosen city (online has no venue).
    var shown = 0;
    document.querySelectorAll('[data-venue-city]').forEach(function (v) {
      var on = v.dataset.venueCity === id;
      v.hidden = !on;
      if (on) shown++;
    });
    // Rows that apply to only some tabs (e.g. キャンセル for 対面, 返金・休学・退会 for オンライン).
    document.querySelectorAll('[data-guide-for]').forEach(function (r) {
      r.hidden = r.dataset.guideFor.split(' ').indexOf(id) < 0;
    });
    var row = document.querySelector('[data-venue-row]');
    if (row) row.hidden = !shown;
  }

  // Jump (not smooth-scroll): switching tabs changes the page height under a running
  // smooth scroll, which can leave the page far from the target. Wait two frames for layout.
  function scrollTo(el) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'auto' });
      });
    });
  }

  // Returns true when the hash belonged to a city panel.
  function fromHash(scroll) {
    var id = decodeURIComponent(location.hash.slice(1));
    if (LEGACY[id]) id = LEGACY[id];
    var el = id && document.getElementById(id);
    if (!el) return false;
    var panel = el.matches('[data-city-panel]') ? el : el.closest('[data-city-panel]');
    if (!panel) return false;
    select(panel.id, false);
    if (scroll) scrollTo(el === panel ? document.getElementById('cities') : el);
    return true;
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      select(t.dataset.cityTab, false);
      history.replaceState(null, '', '#' + t.dataset.cityTab);
    });
    t.addEventListener('keydown', function (e) {
      var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (next === null) return;
      e.preventDefault();
      var tab = tabs[(next + tabs.length) % tabs.length];
      select(tab.dataset.cityTab, true);
      history.replaceState(null, '', '#' + tab.dataset.cityTab);
    });
  });

  // In-page links into another tab (e.g. 大阪's "プランを見る" → #online-satorin) work even
  // when the hash is already set, so handle them here rather than waiting for hashchange.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]:not([data-city-tab])');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el || !el.closest('[data-city-panel]')) return;
    e.preventDefault();
    history.pushState(null, '', a.getAttribute('href'));
    fromHash(true);
  });

  if (!fromHash(true)) select(tabs[0].dataset.cityTab, false);
  window.addEventListener('hashchange', function () { fromHash(true); });
})();
