// Hutzell Creative Co. — Core UX behaviors
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------
   * 0) Footer year
   * --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
   * 1) Hero: emphasize specific words (non-destructive)
   * --------------------------------------------- */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !heroH1.querySelector('.hero-key')) {
    const original = heroH1.textContent; // preserve exact text
    const re = /\b(photography|videography|design)\b(?=[^\w]|$)/gi;
    heroH1.innerHTML = original.replace(re, (m) => `<em class="hero-key">${m}</em>`);
  }

  /* ---------------------------------------------
   * 2) Bubbles: reveal/hide with gentle motion
   * --------------------------------------------- */
  const bubbles = Array.from(document.querySelectorAll('.bubble.reveal'));
  if (!bubbles.length) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    bubbles.forEach((el) => el.classList.add('visible'));
    return;
  }

  const SHOW_RATIO = 0.22; // show when > 22% visible
  const HIDE_RATIO = 0.08; // hide only when < 8% visible
  const STAGGER_MS = 150;  // entrance delay per item index
  const HIDE_DELAY = 120;  // tiny delay before hiding to avoid blink

  const clearTimers = (el) => {
    if (el._showTimer) { clearTimeout(el._showTimer); el._showTimer = null; }
    if (el._hideTimer) { clearTimeout(el._hideTimer); el._hideTimer = null; }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const idx = Number(el.dataset.seq) || 0;

      if (entry.intersectionRatio > SHOW_RATIO) {
        if (!el.classList.contains('visible')) {
          clearTimers(el);
          el._showTimer = setTimeout(() => {
            el.classList.add('visible');
          }, idx * STAGGER_MS);
        }
      } else if (entry.intersectionRatio < HIDE_RATIO) {
        if (el.classList.contains('visible')) {
          clearTimers(el);
          el._hideTimer = setTimeout(() => {
            el.classList.remove('visible');
          }, HIDE_DELAY);
        }
      }
    });
  }, {
    root: null,
    rootMargin: '4% 0px -10% 0px',
    threshold: [0, HIDE_RATIO, SHOW_RATIO, 0.5, 0.75, 1]
  });

  bubbles.forEach((b) => io.observe(b));

  // Safety: clear timers on page hide/unload
  window.addEventListener('pagehide', () => bubbles.forEach(clearTimers));
  window.addEventListener('beforeunload', () => bubbles.forEach(clearTimers));
});
