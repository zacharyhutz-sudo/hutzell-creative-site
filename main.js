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
   * 3) Sticky Horizontal Scroll (Bubbles & Videos)
   * --------------------------------------------- */
  const stickySections = document.querySelectorAll('.features-bubbles, .video-sticky-slider');
  
  const setupStickySection = (section) => {
    const stickyTrack = section.querySelector('.sticky-track');
    const seq = section.querySelector('.bubble-seq');
    const items = section.querySelectorAll('.bubble, .video-bubble');

    if (!stickyTrack || !seq || !items.length) return;

    // Create a dedicated overlay for the dark background if not present
    let bgOverlay = section.querySelector('.sticky-bg-overlay');
    if (!bgOverlay) {
      bgOverlay = document.createElement('div');
      bgOverlay.className = 'sticky-bg-overlay';
      bgOverlay.style.position = 'absolute';
      bgOverlay.style.inset = '0';
      bgOverlay.style.backgroundColor = '#1b2a23'; // Dark ink
      bgOverlay.style.opacity = '0';
      bgOverlay.style.zIndex = '-1';
      bgOverlay.style.pointerEvents = 'none';
      bgOverlay.style.willChange = 'opacity';
      stickyTrack.appendChild(bgOverlay);
    }

    const update = () => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const currentScroll = window.scrollY;

      // 1. Calculate raw progress (0 to 1)
      const totalScrollable = sectionHeight - viewportHeight;
      let rawProgress = (currentScroll - sectionTop) / totalScrollable;
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      // 2. Dynamic Background Opacity (Sin curve)
      const targetOpacity = Math.max(0, Math.min(0.98, Math.sin(rawProgress * Math.PI) * 1.1));
      bgOverlay.style.opacity = targetOpacity;

      // 3. Apply Quadratic Ease-In-Out for horizontal motion
      const easedProgress = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress 
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

      const halfViewport = viewportWidth / 2;
      const first = items[0];
      const last = items[items.length - 1];
      
      // Use relative position within the seq (offsetLeft) plus parent offsets
      // to find the true starting horizontal point relative to viewport center.
      const firstCenterRel = first.offsetLeft + (first.offsetWidth / 2);
      const lastCenterRel = last.offsetLeft + (last.offsetWidth / 2);
      
      const startX = halfViewport - firstCenterRel;
      const endX = halfViewport - lastCenterRel;
      
      const currentTranslate = startX + (easedProgress * (endX - startX));
      
      // Safety: check if currentTranslate is actually a number
      if (!isNaN(currentTranslate)) {
        seq.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
      }

      // Active state for scale/opacity of individual items
      items.forEach((item) => {
        const iRect = item.getBoundingClientRect();
        const iCenter = iRect.left + (iRect.width / 2);
        const dist = Math.abs(iCenter - halfViewport);
        if (dist < iRect.width / 2) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    return update;
  };

  const stickyUpdaters = Array.from(stickySections).map(setupStickySection).filter(Boolean);

  if (stickyUpdaters.length) {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          stickyUpdaters.forEach(fn => fn());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      stickyUpdaters.forEach(fn => fn());
    });
    
    // Initial runs - important for calculation on load
    const forceUpdate = () => stickyUpdaters.forEach(fn => fn());
    window.addEventListener('load', forceUpdate);
    forceUpdate();
    setTimeout(forceUpdate, 100);
    setTimeout(forceUpdate, 500);
    setTimeout(forceUpdate, 1000); // Extra safety for video loading
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
