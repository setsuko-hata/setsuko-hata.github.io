/** Header behaviour for the /hatha-yoga/ pages: desktop dropdowns and the mobile menu. */

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

/** Measure the actual, localized labels with the loaded font, never a guessed viewport cutoff. */
function initResponsiveHeader(header: HTMLElement, onLayout: (desktop: boolean) => void) {
  const row = header.querySelector<HTMLElement>('.yoga-header__row');
  const brand = header.querySelector<HTMLElement>('.yoga-header__brand');
  const nav = header.querySelector<HTMLElement>('.yoga-primary-nav');
  const language = header.querySelector<HTMLElement>('.yoga-language-switch');
  if (!row || !brand || !nav) return;

  const fits = () => {
    const style = getComputedStyle(row);
    const available = row.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const content = [brand, nav, ...(language ? [language] : [])];
    const required = content.reduce((width, item) => width + item.getBoundingClientRect().width, 0)
      + parseFloat(style.columnGap) * (content.length - 1);
    return required + 1 <= available; // Leave a pixel for subpixel rounding.
  };
  const update = () => {
    header.dataset.navDensity = 'regular';
    let desktop = fits();
    if (!desktop) {
      header.dataset.navDensity = 'compact';
      desktop = fits();
    }
    onLayout(desktop);
  };
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  };
  // A font can change intrinsic widths without changing the viewport width.
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    [row, brand, nav, ...(language ? [language] : [])].forEach((item) => observer.observe(item));
  }
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener('loadingdone', schedule);
  update();
}

function initMobileMenu() {
  const btn = document.getElementById('yoga-menu-btn');
  const wrap = document.getElementById('yoga-mobile-nav');
  const header = document.querySelector<HTMLElement>('[data-yoga-header]');
  if (!btn || !wrap || !header) return;
  const scrim = wrap.querySelector<HTMLElement>('[data-scrim]');
  const list = wrap.querySelector('nav');
  const nav = header.querySelector<HTMLElement>('.yoga-primary-nav');

  let open = false;
  const set = (requestedOpen: boolean) => {
    const value = requestedOpen && header.dataset.navLayout !== 'desktop';
    open = value;
    btn.setAttribute('aria-expanded', String(value));
    btn.setAttribute('aria-label', (value ? btn.dataset.labelClose : btn.dataset.labelOpen) ?? '');
    header.classList.toggle('is-menu-open', value);
    document.documentElement.style.overflow = value ? 'hidden' : '';
    if (value) {
      wrap.hidden = false;
      requestAnimationFrame(() => { if (open) wrap.classList.add('is-open'); });
    } else {
      wrap.classList.remove('is-open');
      window.setTimeout(() => { if (!open) wrap.hidden = true; }, FADE_MS);
    }
  };

  btn.addEventListener('click', () => set(!open));
  scrim?.addEventListener('click', () => set(false));
  list?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
  initResponsiveHeader(header, (desktop) => {
    const focused = document.activeElement;
    const moveFocus = desktop ? focused === btn || wrap.contains(focused) : !!nav?.contains(focused);
    header.dataset.navLayout = desktop ? 'desktop' : 'mobile';
    if (nav) {
      nav.inert = !desktop;
      if (desktop) nav.removeAttribute('aria-hidden');
      else nav.setAttribute('aria-hidden', 'true');
    }
    if (desktop) {
      if (open) set(false);
      wrap.hidden = true;
      if (moveFocus) nav?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    } else if (moveFocus) btn.focus({ preventScroll: true });
  });
}

initDropdowns();
initMobileMenu();
