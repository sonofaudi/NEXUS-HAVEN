import { getStartedRedirect } from './api.js';

document.getElementById('getStartedBtn')?.addEventListener('click', e => {
  e.preventDefault();
  getStartedRedirect();
});


/* toggle hamburger nav */
document.querySelector('.hamburger')?.addEventListener('click', function () {
  this.parentElement.classList.toggle('open');
});


  /* 1️⃣  theme toggle inside hamburger */
  document.querySelectorAll('#themeToggle').forEach(btn =>
    btn.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('theme', document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
    })
  );

/* 2️⃣  close menu when clicking outside */
document.addEventListener('click', e => {
  const menu = document.querySelector('.menu-bar');
  if (!menu.contains(e.target)) menu.classList.remove('open');
});