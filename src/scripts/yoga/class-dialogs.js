// Class description popups on the クラス page.
// A button with data-dialog="<id>" opens <dialog id="<id>">; the same popup is shared
// by the online and in-person sections. Closes on ×, Esc (native) or a click on the backdrop.
(function () {
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-dialog]');
    if (opener) {
      var dlg = document.getElementById(opener.dataset.dialog);
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
      return;
    }
    if (e.target.closest('[data-dialog-close]')) {
      e.target.closest('dialog').close();
      return;
    }
    // A click on the dialog element itself (not its content) is a click on the backdrop.
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('cl-dialog')) e.target.close();
  });
})();
