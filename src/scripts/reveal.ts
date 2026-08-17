function initReveal(selector: string, opts: { threshold: number; rootMargin: string; failsafeMs: number; delayMs?: number }) {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!nodes.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach((n) => n.classList.add('is-visible'));
    return;
  }

  const show = (n: HTMLElement) => n.classList.add('is-visible');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        if (opts.delayMs) {
          setTimeout(() => show(entry.target as HTMLElement), opts.delayMs);
        } else {
          show(entry.target as HTMLElement);
        }
      });
    },
    { threshold: opts.threshold, rootMargin: opts.rootMargin }
  );

  nodes.forEach((n) => io.observe(n));

  requestAnimationFrame(() => {
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) && r.bottom > 0) {
        show(n);
        io.unobserve(n);
      }
    });
  });

  setTimeout(() => {
    nodes.forEach((n) => {
      show(n);
      io.unobserve(n);
    });
  }, opts.failsafeMs);
}

initReveal('[data-reveal]', { threshold: 0.08, rootMargin: '0px 0px -8% 0px', failsafeMs: 1400 });
initReveal('[data-reveal-soft]', { threshold: 0.16, rootMargin: '0px 0px -8% 0px', failsafeMs: 1600, delayMs: 40 });
