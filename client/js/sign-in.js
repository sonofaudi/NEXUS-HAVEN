// js/sign-in.js
document.getElementById('signInForm').addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const pwd   = document.getElementById('password').value;

  if (!email || !pwd) return showRedPopUp('Please fill all fields');

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showGreenPopUp('Welcome back!');
      setTimeout(() => location.href = 'index.html', 1200);
    } else {
      showRedPopUp(data.error || 'Login failed');
    }
  } catch {
    showRedPopUp('Network error – is the server running?');
  }
});

function togglePwd() {
  const p = document.getElementById('password');
  p.type = p.type === 'password' ? 'text' : 'password';
}
window.togglePwd = togglePwd;

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
