// Hutzell Creative Co. — Core UX behaviors
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------
   * 0) Footer year
   * --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
   * 1) Hero: emphasize specific words (non-destructive)
   *    - Keeps your exact source copy
   *    - Adds <em class="hero-key"> around target words
   * --------------------------------------------- */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !heroH1.querySelector('.hero-key')) {
    const original = heroH1.textContent; // preserve exact text
    const re = /\b(photography|videography|design)\b(?=[^\w]|$)/gi;
    heroH1.innerHTML = original.replace(re, (m) => `<em class="hero-key">${m}</em>`);
  }

  /* ---------------------------------------------
   * 2) Nav: mark current page as active (for the pill/bubble)
   *    - Ignores query strings, hashes, and trailing slash
   * --------------------------------------------- */
  const setActiveNav = () => {
    const links = document.querySelectorAll('nav a[href]');
    const last = location.pathname.split('/').pop() || 'index.html';
    const path = last.split('?')[0].split('#')[0].toLowerCase();
    links.forEach(a => a.classList.remove('active'));
    const match = Array.from(links).find(a => {
      const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
      if (path === '' || path === 'index.html') return /index\.html$/.test(href) || href === './';
      return href.endsWith(path);
    });
    if (match) match.classList.add('active');
  };
  setActiveNav();

  /* ---------------------------------------------
   * 3) Bubbles: reveal/hide with very gentle motion (esp. mobile)
   *    - Hysteresis thresholds + minimum visible time
   *    - Respects prefers-reduced-motion
   * --------------------------------------------- */
  const bubbles = Array.from(document.querySelectorAll('.bubble.reveal'));
  if (!bubbles.length) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile =
    window.matchMedia && window.matchMedia('(max-width: 780px)').matches;

  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    bubbles.forEach((el) => el.classList.add('visible'));
    return;
  }

  // Tuned for subtle mobile motion
  const SHOW_RATIO     = isMobile ? 0.16 : 0.22; // show once this much is visible
  const HIDE_RATIO     = isMobile ? 0.03 : 0.08; // hide only when well out of view
  const STAGGER_MS     = isMobile ? 120  : 150;  // entrance stagger
  const HIDE_DELAY     = isMobile ? 320  : 140;  // debounce before hiding
  const MIN_VISIBLE_MS = isMobile ? 600  : 350;  // minimum time to stay visible once shown

  const THRESHOLDS = isMobile
    ? [0, HIDE_RATIO, SHOW_RATIO, 0.35, 0.6, 1]
    : [0, HIDE_RATIO, SHOW_RATIO, 0.5, 0.75, 1];

  const ROOT_MARGIN = isMobile ? '8% 0px -18% 0px' : '4% 0px -10% 0px';

  const clearTimers = (el) => {
    if (el._showTimer) { clearTimeout(el._showTimer); el._showTimer = null; }
    if (el._hideTimer) { clearTimeout(el._hideTimer); el._hideTimer = null; }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const idx = Number(el.dataset.seq) || 0;

      if (entry.intersectionRatio > SHOW_RATIO) {
        // Show (with stagger) and mark when it became visible
        if (!el.classList.contains('visible')) {
          clearTimers(el);
          el._showTimer = setTimeout(() => {
            el.classList.add('visible');
            el._visibleAt = Date.now();
          }, idx * STAGGER_MS);
        } else {
          // already visible—cancel any pending hide
          if (el._hideTimer) { clearTimeout(el._hideTimer); el._hideTimer = null; }
        }
      } else if (entry.intersectionRatio < HIDE_RATIO) {
        // Schedule a gentle hide, respecting a minimum visible time
        if (el.classList.contains('visible')) {
          clearTimeout(el._showTimer);
          const elapsed = Date.now() - (el._visibleAt || 0);
          const waitMore = Math.max(0, MIN_VISIBLE_MS - elapsed);
          clearTimeout(el._hideTimer);
          el._hideTimer = setTimeout(() => {
            el.classList.remove('visible');
            el._visibleAt = null;
          }, HIDE_DELAY + waitMore);
        }
      } else {
        // Between thresholds: cancel pending hides (prevents flicker near edges)
        if (el._hideTimer) { clearTimeout(el._hideTimer); el._hideTimer = null; }
      }
    });
  }, { root: null, rootMargin: ROOT_MARGIN, threshold: THRESHOLDS });

  bubbles.forEach((b) => io.observe(b));

  // Safety: clear timers on page hide/unload
  window.addEventListener('pagehide', () => bubbles.forEach(clearTimers));
  window.addEventListener('beforeunload', () => bubbles.forEach(clearTimers));
});
