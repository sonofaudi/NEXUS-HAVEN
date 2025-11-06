document.querySelectorAll('.scene-card').forEach(card => {
  card.addEventListener('click', () => {
    localStorage.setItem('selectedScene', card.dataset.scene);
    location.href = 'vr-lobby.html';
  });
});


/* =====  ARROW KEYS  ============================ */
window.addEventListener('keydown', e => {
  const sc = document.getElementById('scrollContainer');
  const scrollAmount = sc.clientWidth * .6; // 60% of viewport
  if (e.key === 'ArrowRight') sc.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  if (e.key === 'ArrowLeft')  sc.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

/* =====  WHEEL HORIZONTAL  ====================== */
document.getElementById('scrollContainer').addEventListener('wheel', e => {
  e.preventDefault();
  e.currentTarget.scrollLeft += e.deltaY;
});


document.querySelector('.nav-arrow.left').onclick  = () => document.getElementById('scrollContainer').scrollBy({left:-320, behavior:'smooth'});
document.querySelector('.nav-arrow.right').onclick = () => document.getElementById('scrollContainer').scrollBy({left:320, behavior:'smooth'});







const sc  = document.getElementById('scrollContainer');
const car = document.querySelector('.carousel');
const cards = Array.from(document.querySelectorAll('.scene-card'));
const total = cards.length;
const angleStep = 360 / total;

/* build cylinder */
cards.forEach((c,i)=>{
  c.style.setProperty('--angle', (angleStep * i).toFixed(2));
  car.appendChild(c);        // move into .carousel
});

/* head-turn while scrolling */
sc.addEventListener('scroll', () => {
  const maxScroll = sc.scrollWidth - sc.clientWidth;
  const ratio     = maxScroll ? sc.scrollLeft / maxScroll : 0;
  const turn      = (ratio - 0.5) * 35;   // -17.5° … +17.5°
  car.style.transform = `rotateY(${turn}deg)`;
});