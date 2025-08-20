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

  // 2) Bubbles: reveal in sequence, and hide when scrolled away
  const bubbles = Array.from(document.querySelectorAll('.bubble.reveal'));
  if (bubbles.length) {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // Respect reduced-motion: just show them without animation
      bubbles.forEach((el) => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = Number(el.dataset.seq) || 0;

        if (entry.isIntersecting) {
          clearTimeout(el._revealTimer);
          el._revealTimer = setTimeout(() => el.classList.add('visible'), idx * 150);
        } else {
          clearTimeout(el._revealTimer);
          el.classList.remove('visible'); // hide when out of view
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

    bubbles.forEach((b) => io.observe(b));
  }
});
