
(async function(){
  const res = await fetch('assets/gallery.json');
  const items = await res.json();
  const gallery = document.getElementById('gallery');
  items.forEach(it => {
    const fig = document.createElement('figure');
    fig.className = 'tile';
    fig.innerHTML = `<img src="${it.src}" alt="${it.alt}">`;
    // lightbox
    fig.addEventListener('click', () => openLightbox(it.src, it.alt));
    // tilt effect
    fig.addEventListener('mousemove', (e) => tilt(fig, e));
    fig.addEventListener('mouseleave', () => resetTilt(fig));
    gallery.appendChild(fig);
  });

  // Tilt math
  function tilt(el, e){
    const b = el.getBoundingClientRect();
    const rx = ((e.clientY - b.top)/b.height - .5) * -8; // rotateX
    const ry = ((e.clientX - b.left)/b.width - .5) * 8;  // rotateY
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function resetTilt(el){ el.style.transform = 'rotateX(0) rotateY(0)'; }

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  function openLightbox(src, alt){
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('open');
  }
  lb.addEventListener('click', (e)=>{
    if(e.target===lb || e.target===lbClose){ lb.classList.remove('open'); }
  });
})();
