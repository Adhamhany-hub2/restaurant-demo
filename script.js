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

document.querySelectorAll('.menu-item, .buffet-card, .cuisine-card, .stat, .contact-info-item, .review-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  revealObserver.observe(el);
});

/* ─── REVIEWS CAROUSEL ─── */
/*
  Logic: we slide the .reviews-track horizontally by one "page" at a time.
  A page = however many cards currently fit in the viewport (4 on desktop,
  3 on tablet, 2 on small tablet, 1 on phone — driven by the CSS flex-basis).
  We measure the actual rendered width of one card + gap so the math stays
  correct at any screen size.
*/
let reviewPage = 0;

function getReviewLayout() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return null;
  const viewport = track.parentElement;
  const cards = track.querySelectorAll('.review-card');
  if (cards.length === 0) return null;

  // Read the actual gap between cards from computed styles
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const cardWidth = cards[0].getBoundingClientRect().width;
  const viewportWidth = viewport.getBoundingClientRect().width;

  // How many fully-visible cards fit in the viewport right now?
  // Use round() so a card rendered at 99.6% of expected width still counts.
  const cardsPerPage = Math.max(1, Math.round((viewportWidth + gap) / (cardWidth + gap)));
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  return { track, cards, gap, cardWidth, cardsPerPage, totalPages };
}

function renderReviewPage() {
  const layout = getReviewLayout();
  if (!layout) return;

  // Clamp the current page in case the screen was resized
  if (reviewPage >= layout.totalPages) reviewPage = layout.totalPages - 1;
  if (reviewPage < 0) reviewPage = 0;

  // How far to shift the track to the left
  const shift = reviewPage * layout.cardsPerPage * (layout.cardWidth + layout.gap);
  layout.track.style.transform = `translateX(-${shift}px)`;

  // Update arrow disabled state
  const leftArrow = document.querySelector('.review-arrow-left');
  const rightArrow = document.querySelector('.review-arrow-right');
  if (leftArrow) leftArrow.disabled = (reviewPage === 0);
  if (rightArrow) rightArrow.disabled = (reviewPage >= layout.totalPages - 1);

  // Rebuild dots so the count matches current pages-per-screen
  const dotsContainer = document.getElementById('reviewDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < layout.totalPages; i++) {
      const dot = document.createElement('span');
      dot.className = 'review-dot' + (i === reviewPage ? ' active' : '');
      dot.onclick = () => goToReviewPage(i);
      dotsContainer.appendChild(dot);
    }
  }
}

function changeReviewPage(direction) {
  const layout = getReviewLayout();
  if (!layout) return;
  reviewPage = Math.max(0, Math.min(layout.totalPages - 1, reviewPage + direction));
  renderReviewPage();
}

function goToReviewPage(index) {
  reviewPage = index;
  renderReviewPage();
}

// Initial render + re-render on resize (debounced)
window.addEventListener('load', renderReviewPage);
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderReviewPage, 150);
});
