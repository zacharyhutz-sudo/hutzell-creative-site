
// Mobile nav toggle (simple)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-nav-toggle]');
  if(btn){
    document.querySelector('nav ul').classList.toggle('open');
  }
});

// Contact form handler for Formspree (fallback shows mailto compose if fetch fails)
const form = document.querySelector('form[data-formspree]');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Sending...';
    const data = new FormData(form);
    try{
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if(res.ok){
        form.reset();
        status.textContent = 'Thanks! Your inquiry was sent.';
      }else{
        status.textContent = 'Could not send via form service. Opening your email app...';
        window.location.href = 'mailto:hutzellcreativeco@gmail.com?subject=New%20Inquiry&body=' + encodeURIComponent(
          [...data.entries()].map(([k,v]) => k + ': ' + v).join('\n')
        );
      }
    }catch(err){
      status.textContent = 'Network error. Opening your email app...';
      window.location.href = 'mailto:hutzellcreativeco@gmail.com?subject=New%20Inquiry&body=' + encodeURIComponent(
        [...data.entries()].map(([k,v]) => k + ': ' + v).join('\n')
      );
    }
  });
}


// Scroll reveal for bubbles in sequence
document.addEventListener('DOMContentLoaded', () => {
  const bubbles = Array.from(document.querySelectorAll('.bubble.reveal'));
  if (!bubbles.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const index = Number(el.getAttribute('data-seq')) || 0;
        setTimeout(() => el.classList.add('visible'), index * 150);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  bubbles.forEach(b => io.observe(b));
});
