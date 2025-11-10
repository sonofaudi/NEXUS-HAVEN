/* ---------- sign up ---------- */
document.getElementById('submit').addEventListener('submit', async e => {
  e.preventDefault(); // ⛔ no page reload

  const body = {
    username: document.getElementById('username').value.trim(),
    tag:      document.getElementById('tag').value.trim(),
    email:    document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };

  const res = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    showGreenPopUp('Account created!');
    setTimeout(() => location.href = 'meet.html', 1200);
  } else {
    showRedPopUp(data.error || 'Sign-up failed');
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