/* ja-nav.js — shared header navigation for the /hatha-yoga/ja pages.
 * Usage (once per page, inside <header>), script directly after the nav:
 *   <nav class="hidden items-center gap-9 md:flex" aria-label="Primary" data-ja-nav data-active="about"></nav>
 *   <script src="../assets/ja-nav.js?v=2"></script>
 * data-active: home | about | hatha-yoga | hatha-types | classes | corporate | schools | contact | (omit)
 * Runs synchronously so the nav exists before the page's mobile-menu script reads it.
 * Edit the NAV list below to change the menu on every page; bump ?v=N on the script tags. */
(function () {
  var nav = document.currentScript && document.currentScript.previousElementSibling;
  if (!nav || !nav.hasAttribute('data-ja-nav')) return;
  var active = nav.getAttribute('data-active') || '';

  var NAV = [
    { id: 'home', label: 'ホーム', href: './' },
    { id: 'about', label: '秦 節子｜SETSUKO HATA', href: './about' },
    { id: 'hatha', label: 'ハタヨガ', href: './hatha-yoga', menuId: 'ja-hatha-menu', items: [
      { id: 'hatha-yoga', label: 'ハタヨガとは', href: './hatha-yoga' },
      { id: 'hatha-types', label: 'ハタヨガの種類', href: './hatha-types' }
    ] },
    { id: 'classes', label: 'クラス', href: './offerings', menuId: 'ja-classes-menu', items: [
      { label: '初めての方へ', href: './offerings#trial' },
      { label: '対面クラス', href: './offerings#inperson' },
      { label: 'オンラインクラス', href: './offerings#online-class' },
      { label: '特別プログラム', href: './offerings#special' },
      { label: 'クラス価格', href: './offerings#pricing' }
    ] },
    { id: 'corporate', label: '法人・団体向け', href: './wellness', menuId: 'ja-corporate-menu', items: [
      { label: '企業・健康経営', href: './wellness' }
    ] },
    { id: 'schools', label: '学校・教育機関向け', href: './schools', menuId: 'ja-schools-menu', items: [
      { label: '小学校', href: './schools#stage-es' },
      { label: '中学校', href: './schools#stage-jhs' },
      { label: '高校', href: './schools#stage-hs' },
      { label: '大学', href: './schools#stage-uni' }
    ] },
    { id: 'contact', label: 'お問い合わせ', href: './contact' }
  ];

  var LINK = 'text-[14px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70 [&.active]:font-semibold';
  var CARET = '<svg class="ja-navtrigger-caret" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>';

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function isActive(item) {
    if (item.id === active) return true;
    return (item.items || []).some(function (s) { return s.id === active; });
  }

  nav.innerHTML = NAV.map(function (item) {
    var on = isActive(item);
    if (!item.items) {
      return '<a href="' + item.href + '" class="' + esc(LINK) + (on ? ' active" data-status="active" aria-current="page' : '') + '">' + item.label + '</a>';
    }
    var menu = item.items.map(function (s) {
      return '<a href="' + s.href + '" role="menuitem"' + (s.id && s.id === active ? ' aria-current="page"' : '') + '>' + s.label + '</a>';
    }).join('');
    return '<div class="ja-navdrop" data-navdrop><button type="button" class="ja-navtrigger' + (on ? ' active' : '') +
      '" data-href="' + item.href + '" aria-expanded="false" aria-haspopup="true" aria-controls="' + item.menuId + '"' +
      (item.id === active ? ' aria-current="page"' : '') + '>' +
      item.label + CARET + '</button><div class="ja-navdrop-menu" id="' + item.menuId + '" role="menu">' + menu + '</div></div>';
  }).join('');
})();
