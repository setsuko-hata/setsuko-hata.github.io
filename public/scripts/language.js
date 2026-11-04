/* Progressive enhancement: locale links remain usable without JavaScript. */
(function () {
  var locale = document.documentElement.lang === 'en' ? 'en' : 'ja';
  document.querySelectorAll('a[data-language-switch]').forEach(function (link) {
    var url = new URL(link.getAttribute('href'), location.origin);
    url.search = location.search;
    url.hash = location.hash;
    link.href = url.pathname + url.search + url.hash;
    link.addEventListener('click', function () {
      try { localStorage.setItem('site-language', link.getAttribute('data-language-switch')); } catch (_) { /* Private browsing must not block navigation. */ }
    });
  });
  // Explicit URLs always win. A preference is retained across in-site navigation.
  try { localStorage.setItem('site-language', locale); } catch (_) {}
})();
