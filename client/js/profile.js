import { getTk } from './api.js';   // only for auth check (optional)

const nameEl  = document.getElementById('userName');
const tagEl   = document.getElementById('userTag');
const imgEl   = document.getElementById('avatarImg');
const fileInp = document.getElementById('fileInput');
const rpmUrl  = document.getElementById('rpmUrl');

/* ----- local save ----- */
nameEl.addEventListener('input', () => localStorage.profileName = nameEl.textContent);
tagEl.addEventListener('input',  () => localStorage.profileTag  = tagEl.textContent);

/* ----- avatar upload ----- */
imgEl.addEventListener('click', () => fileInp.click());
fileInp.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    imgEl.src = ev.target.result;
    localStorage.profileImg = ev.target.result;
  };
  reader.readAsDataURL(file);
});





window.addEventListener('message', e => {
  if (e.data?.eventName === 'v1.avatar.exported') {
    rpmUrl.textContent = e.data.data.url;
  }
});




const MAX = { userName: 20, userTag: 10 };
[nameEl, tagEl].forEach(el => {
  el.addEventListener('input', () => {
    const limit = MAX[el.id];
    if (el.textContent.length > limit) el.textContent = el.textContent.slice(0, limit);
    /* two-line clamp */
    const lines = el.textContent.split('\n');
    if (lines.length > 2) el.textContent = lines.slice(0, 2).join('\n');
  });
});