const html = document.documentElement;
const btn  = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') ||
              (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
if (saved === 'light') html.classList.add('light-mode');
btn.addEventListener('click', () => {
  html.classList.toggle('light-mode');
  localStorage.setItem('theme', html.classList.contains('light-mode') ? 'light' : 'dark');
});