import { post, setTk } from './api.js';

document.getElementById('signInForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };
  const res = await post('/auth/login', body);
  if (res.accessToken) {
    setTk(res.accessToken);
    location.href = 'profile.html';
  } else {
    alert(res.msg || 'Login failed');
  }
});

function togglePwd() {
  const p = document.getElementById('password');
  p.type = p.type === 'password' ? 'text' : 'password';
}
window.togglePwd = togglePwd;