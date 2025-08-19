// Hutzell Creative Co. — Scroll-reveal slideshow with lightbox
// How to use:
// 1) Put your photos in assets/img/gallery/ (JPG/PNG/WebP).
// 2) List them below in the `photos` array (use exact filenames).
// 3) Ensure services.html has: <div class="slideshow" id="slideshow"></div>
// 4) Ensure services.html loads this file: <script src="assets/js/gallery.js"></script>

// ====== EDIT THIS LIST ======
const photos = [
  // Example filenames — replace with your ~12 images:
  "assets/img/gallery/photo1.jpg",
  "assets/img/gallery/photo2.jpg",
  "assets/img/gallery/photo3.jpg",
  "assets/img/gallery/photo4.jpg",
  "assets/img/gallery/photo5.jpg",
  "assets/img/gallery/photo6.jpg",
  "assets/img/gallery/photo7.jpg",
  "assets/img/gallery/photo8.jpg",
  "assets/img/gallery/photo9.jpg",
  "assets/img/gallery/photo10.jpg",
  "assets/img/gallery/photo11.jpg",
  "assets/img/gallery/photo12.jpg"
];
// ============================

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("slideshow") || document.getElementById("gallery");
  if(!root){
    console.warn("No #slideshow or #gallery element found.");
    return;
  }

  // Build slides
  photos.forEach((src, i) => {
    const fig = document.createElement("figure");
    fig.className = "slide";
    const img = document.createElement("img");
    img.alt = `Slide ${i+1}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.src = src; // lazy source (set when visible)
    const cap = document.createElement("figcaption");
    cap.textContent = `${i+1} / ${photos.length}`;
    fig.appendChild(img);
    fig.appendChild(cap);
    root.appendChild(fig);
  });

  // Reveal on scroll + lazy-set src
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const slide = entry.target;
        const img = slide.querySelector("img");
        if(img && !img.src) img.src = img.dataset.src;
        slide.classList.add("visible");
        obs.unobserve(slide);
      }
    });
  }, { rootMargin: "150px 0px 150px 0px" });

  document.querySelectorAll(".slide").forEach(s => io.observe(s));

  // Lightbox
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML = `
    <button class="close" aria-label="Close">Close ✕</button>
    <img alt="">
  `;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  const lbClose = lb.querySelector(".close");

  function open(src, alt){
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.classList.add("open");
    document.addEventListener("keydown", onKey);
  }
  function close(){
    lb.classList.remove("open");
    lbImg.src = "";
    document.removeEventListener("keydown", onKey);
  }
  function onKey(e){
    if(e.key === "Escape") close();
    if(e.key === "ArrowRight") nav(1);
    if(e.key === "ArrowLeft") nav(-1);
  }
  lb.addEventListener("click", (e)=>{
    if(e.target === lb || e.target === lbClose) close();
  });

  // Click to open & keyboard nav
  const slides = Array.from(document.querySelectorAll(".slide img"));
  slides.forEach((img, idx) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      open(img.currentSrc || img.src || img.dataset.src, img.alt);
      lb.dataset.idx = idx;
    });
  });

  function nav(dir){
    const current = parseInt(lb.dataset.idx || "0", 10);
    let next = current + dir;
    if(next < 0) next = slides.length - 1;
    if(next >= slides.length) next = 0;
    const nimg = slides[next];
    const src = nimg.currentSrc || nimg.src || nimg.dataset.src;
    lb.dataset.idx = next;
    lbImg.src = src;
  }
});
