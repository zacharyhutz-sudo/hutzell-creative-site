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
      // 1. Get exact current positions
      const sectionRect = bubbleSection.getBoundingClientRect();
      const sectionTop = sectionRect.top + window.scrollY;
      const sectionHeight = bubbleSection.offsetHeight;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const currentScroll = window.scrollY;

      // 2. Calculate Progress (0 to 1)
      const totalScrollable = sectionHeight - viewportHeight;
      let progress = (currentScroll - sectionTop) / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      // 3. Define the "Screen Center" target
      const halfViewport = viewportWidth / 2;

      // 4. Find the relative centers of the first and last bubbles
      const first = bubbles[0];
      const last = bubbles[bubbles.length - 1];
      
      const firstCenterRel = first.offsetLeft + (first.offsetWidth / 2);
      const lastCenterRel = last.offsetLeft + (last.offsetWidth / 2);
      
      // 5. Calculate Start and End Translation
      // Since the track starts at the left edge of the screen (0px),
      // the translation to center a bubble is simply (halfViewport - bubbleCenterRelativeToTrack)
      const startX = halfViewport - firstCenterRel;
      const endX = halfViewport - lastCenterRel;
      
      const currentTranslate = startX + (progress * (endX - startX));
      bubbleSeq.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;

      // 6. Active States based on proximity to screen center
      bubbles.forEach((bubble) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleMid = rect.left + rect.width / 2;
        const dist = Math.abs(bubbleMid - halfViewport);
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
    
    // Safety calls for layout stability
    updateBubbles();
    setTimeout(updateBubbles, 100);
    setTimeout(updateBubbles, 500);
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
