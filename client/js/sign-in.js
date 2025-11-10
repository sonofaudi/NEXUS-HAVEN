/* ---------- sign in ---------- */
document.getElementById('submit').addEventListener('submit', async e => {
  e.preventDefault(); // ⛔ no page reload

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    showGreenPopUp('Welcome back!');
    setTimeout(() => location.href = 'meet.html', 1200);
  } else {
    showRedPopUp(data.error || 'Login failed');
  }
});

/* ---------- password toggle ---------- */
function togglePwd() {
  const p = document.getElementById('password');
  p.type = p.type === 'password' ? 'text' : 'password';
}
window.togglePwd = togglePwd;

/* ---------- pop-ups ---------- */
function showGreenPopUp(msg) {
  const pop = document.createElement('div');
  pop.className = 'pop-up green';
  pop.textContent = msg;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 3000);
}
function showRedPopUp(msg) {
  const pop = document.createElement('div');
  pop.className = 'pop-up red';
  pop.textContent = msg;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 3000);
}