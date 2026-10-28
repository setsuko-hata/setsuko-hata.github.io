// Fade-up for `.sc-rise` blocks as they scroll into view. The `js` class on <html> is what
// hides them in CSS, so it is only added once we know they will be revealed.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js');
  const items = document.querySelectorAll('.sc-rise');
  // Safety net: never leave a block hidden.
  setTimeout(() => items.forEach((el) => el.classList.add('is-in')), 2500);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
}
