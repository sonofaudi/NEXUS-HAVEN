// js/sign-up.js
document.getElementById('signUpForm').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const tag  = document.getElementById('tag').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Basic validation
  if (!name || !tag || !email || !password) return showRedPopUp('Please fill all fields');

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, tag, email, password })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {}

    if (res.ok) {
      // Save token locally
      localStorage.setItem('token', data.token);
      showGreenPopUp('Account created!');
      setTimeout(() => location.href = 'meet.html', 1200);
    } else {
      // Show backend error message
      const msg = data.error || `Sign-up failed (status ${res.status})`;
      showRedPopUp(msg);
    }
  } catch (err) {
    console.error('❌ Sign-up Error:', err);
    showRedPopUp('Network error – check your connection or server.');
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
