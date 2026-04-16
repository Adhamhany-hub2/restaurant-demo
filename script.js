/* ─── MENU TAB SWITCHING ─── */
function showTab(name) {
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cuisine-pill').forEach(b => b.classList.remove('active'));

  document.getElementById('tab-' + name).classList.add('active');

  // Handle clicks on child spans inside the button
  let btn = event.target;
  if (!btn.classList.contains('cuisine-pill')) btn = btn.closest('.cuisine-pill');
  if (btn) btn.classList.add('active');
}

/* ─── SCROLL-REVEAL ANIMATION ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.menu-item, .buffet-card, .cuisine-card, .stat, .contact-info-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  revealObserver.observe(el);
});
