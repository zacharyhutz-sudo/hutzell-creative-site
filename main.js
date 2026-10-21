// Hutzell Creative Co. — calm, progressively enhanced interactions.
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a[href]').forEach(link => {
    const target = link.getAttribute('href').split(/[?#]/)[0];
    const active = target === page || (page.startsWith('portfolio') && target === 'services.html');
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Anchor offsets follow the actual header height, including text zoom.
  const header = document.querySelector('header');
  if (header && 'ResizeObserver' in window) {
    new ResizeObserver(entries => {
      document.documentElement.style.setProperty('--header-height', `${entries[0].contentRect.height}px`);
    }).observe(header);
  }

  // Original photo selection, dimensions, tilt, wash and 60-second motion.
  // Each repeated set includes its trailing gap; no fractional reset distance.
  const canvas = document.querySelector('.hero-bg-canvas');
  if (canvas) {
    canvas.setAttribute('aria-hidden', 'true');
    const images = [
      'EI8A9660.webp', 'EI8A8958.webp', 'IMG_1643.webp', 'IMG_1630.webp',
      'EI8A8721.webp', 'IMG_2049.webp', 'EI8A8851.webp', 'IMG_2052.webp',
      'IMG_2051.webp', 'EI8A8162.webp', 'Chase&Emma-7.webp', 'EI8A7714.webp',
      'EI8A4765-2.webp', 'EI8A0546.webp', 'EI8A2392.webp', 'EI8A0591.webp',
      'EI8A7836.webp', 'Chase&Emma.-16.webp', 'AllenMaternityPhotos-16.webp', 'IMG_1820.webp',
      'EI8A4852.webp', 'EI8A2361.webp', 'EI8A7804.webp', 'EI8A1432.webp'
    ];
    const track = document.createElement('div');
    track.className = 'bg-marquee is-loading';
    const group = document.createElement('div');
    group.className = 'bg-set';
    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      const column = document.createElement('div');
      column.className = 'bg-col';
      images.slice(columnIndex * 6, columnIndex * 6 + 6).forEach(file => {
        const wrap = document.createElement('div');
        wrap.className = 'bg-photo-wrap';
        const img = document.createElement('img');
        img.className = 'bg-photo';
        img.src = `assets/img/bg-thumbs/${file}`;
        img.alt = '';
        img.width = 200;
        img.height = 300;
        img.decoding = 'async';
        img.setAttribute('fetchpriority', 'low');
        wrap.append(img);
        column.append(wrap);
      });
      group.append(column);
    }
    track.append(group);
    canvas.replaceChildren(track);
    const ensureCoverage = () => {
      const period = group.offsetWidth;
      if (!period) return;
      track.style.setProperty('--hero-loop-width', `${period}px`);
      // Extra repeated sets cover wide screens throughout the complete loop.
      const required = Math.max(3, Math.ceil(canvas.getBoundingClientRect().width / period) + 1);
      while (track.children.length < required) track.append(group.cloneNode(true));
    };
    ensureCoverage();
    if ('ResizeObserver' in window) new ResizeObserver(ensureCoverage).observe(canvas);
    else window.addEventListener('resize', ensureCoverage, { passive: true });
    // Start after decoding the unique thumbnail set to avoid moving blank tiles.
    Promise.all(Array.from(group.querySelectorAll('img')).map(img => {
      if (typeof img.decode === 'function') return img.decode().catch(() => {});
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    })).then(() => track.classList.remove('is-loading'));
  }

  // Match the content viewport, excluding the desktop scrollbar, for the
  // original full-width reviews strip without horizontal page overflow.
  const reviewTrack = document.querySelector('.reviews-track');
  const updatePageWidth = () => {
    const value = `${document.documentElement.clientWidth}px`;
    if (document.documentElement.style.getPropertyValue('--page-width') !== value) {
      document.documentElement.style.setProperty('--page-width', value);
    }
    if (reviewTrack) {
      const group = reviewTrack.querySelector('.reviews-group');
      const period = group.offsetWidth;
      if (period) {
        reviewTrack.style.setProperty('--reviews-loop-width', `${period}px`);
        const copies = Math.max(3, Math.ceil(document.documentElement.clientWidth / period) + 1);
        while (reviewTrack.children.length < copies) {
          const clone = group.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.setAttribute('inert', '');
          reviewTrack.append(clone);
        }
      }
    }
  };
  updatePageWidth();
  if ('ResizeObserver' in window) new ResizeObserver(updatePageWidth).observe(document.documentElement);
  else window.addEventListener('resize', updatePageWidth, { passive: true });

  // Pause outside the viewport or in a background tab, preserving loop position.
  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting));
    });
    document.querySelectorAll('.hero, .reviews-slider').forEach(el => motionObserver.observe(el));
  }
  const updatePageVisibility = () => document.documentElement.classList.toggle('page-hidden', document.hidden);
  document.addEventListener('visibilitychange', updatePageVisibility);
  updatePageVisibility();

  // Small, one-time entrances only below the initial viewport. No scroll handler.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 32px 0px' });
    document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('.features-bubbles .bubble, .photo-card, .website-card').forEach(card => {
      // Set reveal classes only when the observer is installed successfully.
      if (card.getBoundingClientRect().top > window.innerHeight + 32) {
        card.classList.add('reveal', 'is-pending');
        observer.observe(card);
      }
    });
    const stopMotion = () => {
      if (reducedMotion.matches) {
        observer.disconnect();
        document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending'));
      }
    };
    reducedMotion.addEventListener('change', stopMotion);
    // Keyboard users should never focus a transparent link.
    document.addEventListener('focusin', event => {
      const card = event.target.closest('.is-pending');
      if (card) { card.classList.remove('is-pending'); observer.unobserve(card); }
    });
  }

  // Native links remain usable when JavaScript is unavailable.
  document.querySelectorAll('.video-launch').forEach(link => {
    const preview = link.querySelector('img');
    if (preview) {
      preview.addEventListener('error', () => preview.remove(), { once: true });
      if (preview.complete && !preview.naturalWidth) preview.remove();
    }
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?autoplay=1&rel=0`;
      frame.title = link.getAttribute('aria-label').replace('Play ', '');
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      link.replaceWith(frame);
      frame.focus();
    });
  });

  const gallery = document.getElementById('designGallery');
  if (gallery) {
    const slides = Array.from(gallery.querySelectorAll('.design-gallery-item'));
    const indicators = document.getElementById('designIndicators');
    const status = document.getElementById('designStatus');
    let current = 0;
    const buttons = slides.map((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'design-indicator';
      button.setAttribute('aria-label', `Show design ${index + 1}`);
      button.addEventListener('click', () => show(index));
      indicators.append(button);
      return button;
    });
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
        buttons[i].classList.toggle('active', i === current);
        buttons[i].setAttribute('aria-pressed', String(i === current));
      });
      status.textContent = `${current + 1} of ${slides.length}`;
      // Warm the next image without moving the layout.
      const nextImage = slides[(current + 1) % slides.length].querySelector('img');
      if (nextImage) nextImage.loading = 'eager';
    }
    document.getElementById('designPrev').addEventListener('click', () => show(current - 1));
    document.getElementById('designNext').addEventListener('click', () => show(current + 1));
    gallery.closest('.design-gallery-wrapper').addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
    let start = null;
    gallery.addEventListener('pointerdown', event => {
      if (event.isPrimary && event.button === 0) start = { x: event.clientX, y: event.clientY };
    });
    gallery.addEventListener('pointerup', event => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
    });
    gallery.addEventListener('pointercancel', () => { start = null; });
    gallery.querySelectorAll('img').forEach(img => { img.draggable = false; });
    show(0);
  }

  const form = document.getElementById('inquiryForm');
  if (form) {
    const serviceField = document.getElementById('serviceField');
    const serviceButtons = Array.from(document.querySelectorAll('.service-btn'));
    const selectService = value => {
      serviceField.value = value;
      serviceButtons.forEach(button => {
        const selected = button.dataset.value === value;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    };
    serviceButtons.forEach(button => button.addEventListener('click', () => selectService(button.dataset.value)));
    const requestedService = new URLSearchParams(location.search).get('service');
    if (serviceButtons.some(button => button.dataset.value === requestedService)) selectService(requestedService);

    // Preserve normal HTML POST behavior when fetch/FormData are unavailable.
    if ('fetch' in window && 'FormData' in window && 'AbortController' in window) {
      const status = document.getElementById('formStatus');
      const submit = form.querySelector('[type="submit"]');
      let sending = false;
      let sent = false;
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (sending || sent || !form.reportValidity()) return;
        sending = true;
        submit.disabled = true;
        submit.textContent = 'Sending…';
        form.setAttribute('aria-busy', 'true');
        status.dataset.state = 'sending';
        status.textContent = 'Sending your inquiry…';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const response = await fetch(form.action, {
            method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal
          });
          if (!response.ok) {
            status.dataset.state = 'error';
            status.textContent = 'Your inquiry was not accepted. Please check your details and try again.';
            return;
          }
          sent = true;
          submit.textContent = 'Inquiry sent';
          status.dataset.state = 'success';
          status.textContent = 'Thank you! Your inquiry has been sent to Hutzell Creative Co.';
          form.reset();
          selectService('');
        } catch (error) {
          status.dataset.state = 'error';
          status.textContent = 'We could not confirm delivery. Your details are still here. Please check your connection before trying again.';
        } finally {
          clearTimeout(timeout);
          sending = false;
          form.removeAttribute('aria-busy');
          submit.disabled = sent;
          if (!sent) submit.textContent = 'Send Inquiry';
        }
      });
      // A deliberate edit after success starts a new inquiry.
      form.addEventListener('input', () => {
        if (!sent) return;
        sent = false;
        submit.disabled = false;
        submit.textContent = 'Send Inquiry';
        status.textContent = '';
      });
    }
  }
});
