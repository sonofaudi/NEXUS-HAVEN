/* hamburger toggle */
document.querySelector('.hamburger')?.addEventListener('click', e => {
  e.stopPropagation();                 // block outside-click
  document.querySelector('.menu-bar').classList.toggle('open');
});

/* close when clicking outside */
document.addEventListener('click', e => {
  const menu = document.querySelector('.menu-bar');
  if (menu && !menu.contains(e.target)) menu.classList.remove('open');
});