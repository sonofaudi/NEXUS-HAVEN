const track = document.querySelector('.slider-track');
const cards = Array.from(document.querySelectorAll('.scene-card'));
const leftBtn = document.querySelector('.nav-arrow.left');
const rightBtn = document.querySelector('.nav-arrow.right');

let currentIndex = 0;

function updateSlider() {
  // Calculate offset to center active card
  const cardWidth = cards[0].offsetWidth + 24; // width + gap
  const offset = (track.clientWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);
  track.style.transform = `translateX(${offset}px)`;

  // Highlight active card
  cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
}

// Navigation arrows
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateSlider();
});
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateSlider();
});

// Click to select
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    currentIndex = i;
    updateSlider();
    const scene = card.dataset.scene;
    localStorage.setItem('selectedScene', scene);
    location.href = 'vr-lobby.html';
  });
});

// Initialize
window.addEventListener('load', updateSlider);
window.addEventListener('resize', updateSlider);
