// Hutzell Creative Co. — core UX behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 1) Runtime emphasize specific words in the hero H1
  //    Keeps your source text exact while styling those words.
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    const original = heroH1.textContent; // exact copy preserved
    const re = /\b(photography|videography|design)\b(?=[^\w]|$)/gi;
    heroH1.innerHTML = original.replace(re, (m) => `<em class="hero-key">${m}</em>`);
  }

// Scroll reveal for bubbles in sequence + subtle hide when out of view
document.addEventListener('DOMContentLoaded', () => {
  const bubbles = Array.from(document.querySelectorAll('.bubble.reveal'));
  if (!bubbles.length) return;

  // Respect prefers-reduced-motion
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    bubbles.forEach(el => el.classList.add('visible'));
    return;
  }

  // Hysteresis: show at a higher ratio than we hide to avoid “popping”
  const SHOW_RATIO = 0.22;  // become visible once ~22% in view
  const HIDE_RATIO = 0.08;  // hide only when <8% in view (more forgiving)
  const STAGGER = 150;      // ms per item when entering

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      const idx = Number(el.dataset.seq) || 0;

      if (entry.intersectionRatio > SHOW_RATIO) {
        clearTimeout(el._hideTimer);
        // stagger entrance a bit
        el._showTimer = setTimeout(() => el.classList.add('visible'), idx * STAGGER);
      } else if (entry.intersectionRatio < HIDE_RATIO) {
        clearTimeout(el._showTimer);
        // slight delay before removing to avoid “blink” on micro scrolls
        el._hideTimer = setTimeout(() => el.classList.remove('visible'), 120);
      }
    });
  }, {
    // root margin keeps them “visible” a touch longer near edges, esp. on mobile
    rootMargin: '4% 0px -10% 0px',
    threshold: [0, 0.08, 0.22, 0.5, 0.75, 1]
  });

  bubbles.forEach(b => io.observe(b));
});
