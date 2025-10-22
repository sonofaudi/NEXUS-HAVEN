document.querySelectorAll('.scene-card').forEach(card => {
  card.addEventListener('click', () => {
    localStorage.setItem('selectedScene', card.dataset.scene);
    location.href = 'vr-lobby.html';
  });
});