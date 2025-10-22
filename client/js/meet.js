import { getTk, post, authedGet } from './api.js';

if (!getTk()) location.href = 'sign-in.html';

const joinBtn   = document.getElementById('joinBtn');
const hostBtn   = document.getElementById('hostBtn');
const joinCode  = document.getElementById('joinCode');
const titleIn   = document.getElementById('title');
const durIn     = document.getElementById('duration');
const sceneSel  = document.getElementById('sceneSelect');

/* ---------- JOIN ---------- */
joinBtn.addEventListener('click', async () => {
  const code = joinCode.value.trim().toUpperCase();
  if (!code) return alert('Enter a code');
  const res = await post('/meetings/join', { code });
  if (res.msg) return alert(res.msg);
  localStorage.setItem('meetingCode', code);
  location.href = 'vr-lobby.html';
});

/* ---------- HOST ---------- */
hostBtn.addEventListener('click', async () => {
  const body = {
    title: titleIn.value.trim(),
    duration: parseInt(durIn.value) || 30,
    scene: sceneSel.value
  };
  if (!body.title) return alert('Give your meeting a title');
  const res = await post('/meetings/host', body);
  if (res.code) {
    localStorage.setItem('meetingCode', res.code);
    localStorage.setItem('meetingTitle', body.title);
    localStorage.setItem('meetingScene', body.scene);
    location.href = 'meet-scenes.html';
  } else {
    alert(res.msg || 'Host failed');
  }
});