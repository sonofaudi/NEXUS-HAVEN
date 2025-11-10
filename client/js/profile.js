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






/* ---------- auth check ---------- */
const token = localStorage.getItem('token');
if (!token) location.href = 'sign-in.html';

/* ---------- DOM shortcuts ---------- */
const saveBtn = document.getElementById('saveBtn');

/* ---------- load REAL profile ---------- */
async function loadProfile() {
  const res = await fetch('http://localhost:5000/api/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return showRedPopUp('Could not load profile');
  const me = await res.json();
  nameEl.textContent = me.username || 'Default User';
  tagEl.textContent  = me.tag || '@unknown';
  imgEl.src          = me.profilePic || 'assets/user.png';
  localStorage.profileName = nameEl.textContent;
  localStorage.profileTag  = tagEl.textContent;
}
await loadProfile();

/* ---------- file upload ---------- */
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

/* ---------- RPM listener ---------- */
window.addEventListener('message', e => {
  if (e.data?.eventName === 'v1.avatar.exported') {
    const glbUrl = e.data.data.url;
    // auto-save the new avatar
    saveProfile(glbUrl, glbUrl.split('/').pop());
  }
});

/* ---------- SAVE to backend ---------- */
async function saveProfile(glbUrl = '', charName = '') {
  const updates = {
    username: nameEl.textContent.trim(),
    tag: tagEl.textContent.trim(),
    profilePic: imgEl.src,
    avatarUrl: glbUrl || localStorage.profileImg || '',
    character: charName || glbUrl.split('/').pop() || ''
  };

  const res = await fetch('http://localhost:5000/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  if (res.ok) {
    showGreenPopUp('Profile saved!');
  } else {
    showRedPopUp(data.error || 'Save failed');
  }
}

/* ---------- SAVE BUTTON ---------- */
saveBtn.addEventListener('click', saveProfile);

/* ---------- POP-UPS ---------- */
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