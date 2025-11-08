/* =====  THEME TOGGLE  ======================================== */
const html = document.documentElement;

/* apply saved / preferred theme */
const saved = localStorage.getItem('theme') ||
              (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
if (saved === 'light') html.classList.add('light-mode');

/* attach to any .themeToggle or #themeToggle, now or later */
function bindToggles() {
  document.querySelectorAll('#themeToggle, .themeToggle').forEach(btn => {
    if (btn.dataset.themeBound) return; // already done
    btn.addEventListener('click', () => {
      html.classList.toggle('light-mode');
      localStorage.setItem('theme', html.classList.contains('light-mode') ? 'light' : 'dark');
    });
    btn.dataset.themeBound = '1';
  });
}

/* initial bind + after any nav/menu rebuild */
window.addEventListener('DOMContentLoaded', bindToggles);
window.addEventListener('navRebuilt', bindToggles); // if you fire this