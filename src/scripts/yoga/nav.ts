/** Header behaviour for the /hatha-yoga/ pages: desktop dropdowns and the mobile menu. */

const OPEN_DESKTOP_MIN = 768;
const FADE_MS = 340;

function initDropdowns() {
  document.querySelectorAll<HTMLElement>('[data-navdrop]').forEach((wrap) => {
    const trigger = wrap.querySelector<HTMLButtonElement>('.ja-navtrigger');
    if (!trigger) return;
    let closeTimer: number | undefined;

    const set = (open: boolean) => {
      wrap.toggleAttribute('data-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    // The trigger label is also a link to the section's landing page.
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const href = trigger.dataset.href;
      if (href) location.href = href;
    });
    wrap.addEventListener('mouseenter', () => { clearTimeout(closeTimer); set(true); });
    wrap.addEventListener('mouseleave', () => { closeTimer = window.setTimeout(() => set(false), 140); });
    wrap.addEventListener('focusin', () => set(true));
    wrap.addEventListener('focusout', (e) => { if (!wrap.contains(e.relatedTarget as Node | null)) set(false); });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target as Node)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    wrap.querySelectorAll('.ja-navdrop-menu a').forEach((a) => a.addEventListener('click', () => set(false)));
  });
}

function initMobileMenu() {
  const btn = document.getElementById('yoga-menu-btn');
  const wrap = document.getElementById('yoga-mobile-nav');
  const header = document.querySelector<HTMLElement>('[data-yoga-header]');
  if (!btn || !wrap || !header) return;
  const scrim = wrap.querySelector<HTMLElement>('[data-scrim]');
  const list = wrap.querySelector('nav');

  let open = false;
  const set = (value: boolean) => {
    open = value;
    btn.setAttribute('aria-expanded', String(value));
    btn.setAttribute('aria-label', (value ? btn.dataset.labelClose : btn.dataset.labelOpen) ?? '');
    header.classList.toggle('is-menu-open', value);
    document.documentElement.style.overflow = value ? 'hidden' : '';
    if (value) {
      wrap.hidden = false;
      requestAnimationFrame(() => wrap.classList.add('is-open'));
    } else {
      wrap.classList.remove('is-open');
      window.setTimeout(() => { if (!open) wrap.hidden = true; }, FADE_MS);
    }
  };

  btn.addEventListener('click', () => set(!open));
  scrim?.addEventListener('click', () => set(false));
  list?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
  window.addEventListener('resize', () => { if (open && window.innerWidth >= OPEN_DESKTOP_MIN) set(false); });
}

initDropdowns();
initMobileMenu();
