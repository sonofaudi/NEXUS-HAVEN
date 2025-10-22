import { post, setTk } from './api.js';

document.getElementById('signUpForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name: document.getElementById('name').value.trim(),
    tag:  document.getElementById('tag').value.trim(),
    email:document.getElementById('email').value.trim(),
    password:document.getElementById('password').value
  };
  const res = await post('/auth/register', body);
  if (res.accessToken) {
    setTk(res.accessToken);
    location.href = 'profile.html';
  } else {
    alert(res.msg || 'Sign-up failed');
  }
});

function togglePwd() {
  const p = document.getElementById('password');
  p.type = p.type === 'password' ? 'text' : 'password';
}
window.togglePwd = togglePwd;