// Hutzell Creative Co. — Core UX behaviors
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------
   * 0) Footer year
   * --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
   * 1) Hero: emphasize specific words
   * --------------------------------------------- */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !heroH1.querySelector('.hero-key')) {
    const original = heroH1.textContent;
    const re = /\b(photography|videography|design)\b(?=[^\w]|$)/gi;
    heroH1.innerHTML = original.replace(re, (m) => `<em class="hero-key">${m}</em>`);
  }

  /* ---------------------------------------------
   * 2) Nav: mark current page as active
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
    let ticking = false;

    const updateBubbles = () => {
      const sectionRect = bubbleSection.getBoundingClientRect();
      const sectionHeight = bubbleSection.offsetHeight;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Progress: 0 when top is at top, 1 when bottom is at bottom
      const totalScrollable = sectionHeight - viewportHeight;
      const currentScroll = window.scrollY;
      const sectionTop = bubbleSection.offsetTop;
      
      let progress = (currentScroll - sectionTop) / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      // BUBBLE TRACKING
      // We calculate the center point of the viewport
      const viewCenter = viewportWidth / 2;
      
      // We want to translate bubbleSeq so that:
      // At progress 0: first bubble's center is at viewCenter
      // At progress 1: last bubble's center is at viewCenter
      
      const first = bubbles[0];
      const last = bubbles[bubbles.length - 1];
      
      // Calculate distances relative to the sequence container (bubbleSeq)
      const firstCenter = first.offsetLeft + (first.offsetWidth / 2);
      const lastCenter = last.offsetLeft + (last.offsetWidth / 2);
      
      // The translation needed to put a specific point (X) at the viewport center is:
      // translate = viewCenter - X
      const startTranslate = viewCenter - firstCenter;
      const endTranslate = viewCenter - lastCenter;
      
      const currentTranslate = startTranslate + (progress * (endTranslate - startTranslate));
      
      bubbleSeq.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;

      // Active state based on screen position
      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleMid = rect.left + rect.width / 2;
        const dist = Math.abs(bubbleMid - viewCenter);
        if (dist < rect.width / 3) {
          bubble.classList.add('active');
        } else {
          bubble.classList.remove('active');
        }
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateBubbles);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateBubbles);
    
    // Force a few frames to ensure layout is ready
    updateBubbles();
    setTimeout(updateBubbles, 50);
    setTimeout(updateBubbles, 300);
  }

  /* ---------------------------------------------
   * 4) Infinite Background Masonry
   * --------------------------------------------- */
  const bgCanvas = document.querySelector('.hero-bg-canvas');
  if (bgCanvas) {
    const images = [
      'EI8A9660.jpg', 'EI8A8958.jpg', 'IMG_1643.JPG', 'IMG_1630.JPG',
      'EI8A8721.jpg', 'IMG_2049.JPG', 'EI8A8851.jpg', 'IMG_2052.JPG',
      'IMG_2051.JPG', 'EI8A8162.jpg', 'Chase&Emma-7.jpg', 'EI8A7714.jpg',
      'EI8A4765-2.jpg', 'EI8A0546.jpg', 'EI8A2392.jpg', 'EI8A0591.jpg',
      'EI8A7836.jpg', 'Chase&Emma.-16.jpg', 'AllenMaternityPhotos-16.jpg', 'IMG_1820.JPG',
      'EI8A4852.jpg', 'EI8A2361.jpg', 'EI8A7804.jpg', 'EI8A1432.jpg'
    ];

    const createCol = (imgs) => {
      const col = document.createElement('div');
      col.className = 'bg-col';
      imgs.forEach(src => {
        const wrap = document.createElement('div');
        wrap.className = 'bg-photo-wrap';
        const img = document.createElement('img');
        img.src = `assets/img/bg-thumbs/${src}`;
        img.className = 'bg-photo';
        img.loading = 'lazy';
        wrap.appendChild(img);
        col.appendChild(wrap);
      });
      return col;
    };

    const marquee = document.createElement('div');
    marquee.className = 'bg-marquee';

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const chunk = images.slice(j * 6, (j + 1) * 6);
        marquee.appendChild(createCol(chunk));
      }
    }
    bgCanvas.appendChild(marquee);
  }
});
