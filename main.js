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
   * 3) Bubbles: Horizontal Sticky Scroll
   * --------------------------------------------- */
  const bubbleSection = document.querySelector('.features-bubbles');
  const bubbleSeq = document.querySelector('.bubble-seq');
  const bubbles = document.querySelectorAll('.features-bubbles .bubble');

  if (bubbleSection && bubbleSeq && bubbles.length) {
    const handleScroll = () => {
      const sectionRect = bubbleSection.getBoundingClientRect();
      const sectionHeight = bubbleSection.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate progress (0 to 1)
      const totalScrollable = sectionHeight - viewportHeight;
      let progress = -sectionRect.top / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      const containerWidth = bubbleSection.offsetWidth;
      const trackWidth = bubbleSeq.scrollWidth;
      const firstBubble = bubbles[0];
      const lastBubble = bubbles[bubbles.length - 1];

      // We want the center of the first bubble to be at the center of the viewport at progress 0
      // And the center of the last bubble to be at the center of the viewport at progress 1
      const firstBubbleCenter = firstBubble.offsetLeft + firstBubble.offsetWidth / 2;
      const lastBubbleCenter = lastBubble.offsetLeft + lastBubble.offsetWidth / 2;
      
      const startX = (containerWidth / 2) - firstBubbleCenter;
      const endX = (containerWidth / 2) - lastBubbleCenter;
      
      const translateX = startX + (progress * (endX - startX));
      
      bubbleSeq.style.transform = `translate3d(${translateX}px, 0, 0)`;

      // Active state for bubbles based on proximity to center
      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleCenter = rect.left + rect.width / 2;
        const viewportCenter = window.innerWidth / 2;
        const distance = Math.abs(bubbleCenter - viewportCenter);

        if (distance < rect.width / 3) {
          bubble.classList.add('active');
        } else {
          bubble.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }
});
