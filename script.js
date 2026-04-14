/* ─── MENU TAB SWITCHING ─── */
function showTab(name) {
  // Hide all panels and deactivate all buttons
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cuisine-btn').forEach(b => b.classList.remove('active'));

  // Show selected panel and activate clicked button
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
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

// Apply initial hidden state and observe each element
document.querySelectorAll('.menu-item, .buffet-card, .cuisine-card, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  revealObserver.observe(el);
});
