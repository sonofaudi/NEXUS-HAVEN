import { getTk, post } from './api.js';

if (!getTk()) location.href = 'sign-in.html';

/* ---------- SIMPLE JOIN ---------- */
document.getElementById('joinBtn').addEventListener('click', async () => {
  const code = document.getElementById('joinCode').value.trim().toUpperCase();
  if (!code) {
    alert('Please paste an invite code.');
    document.getElementById('joinCode').focus();
    return;
  }
  const res = await post('/meetings/join', { code });
  if (res.msg) return alert(res.msg);
  localStorage.setItem('meetingCode', code);
  location.href = 'vr-lobby.html';
});

/* ---------- SIMPLE HOST ---------- */
document.getElementById('hostBtn').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const dur   = document.getElementById('duration').value;

  if (!title) {
    alert('Please give your meeting a title.');
    document.getElementById('title').focus();
    return;
  }
  if (!dur) {
    alert('Please choose a duration.');
    document.getElementById('duration').focus();
    return;
  }

  const res = await post('/meetings/host', { title, duration: parseInt(dur) });
  if (res.code) {
    localStorage.setItem('meetingCode', res.code);
    localStorage.setItem('meetingTitle', title);
    location.href = 'meet-scenes.html';
  } else {
    alert(res.msg || 'Host failed');
  }
});