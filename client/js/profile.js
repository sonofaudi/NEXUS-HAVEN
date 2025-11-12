// js/profile.js
const token = localStorage.getItem('token');
if (!token) location.href = 'sign-in.html';

const nameEl  = document.getElementById('userName');
const tagEl   = document.getElementById('userTag');
const imgEl   = document.getElementById('avatarImg');
const fileInp = document.getElementById('fileInput');
const rpmUrl  = document.getElementById('rpmUrl');
const saveBtn = document.getElementById('saveBtn');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('auth');
    const me = await res.json();
    nameEl.textContent = me.username || 'Default User';
    tagEl.textContent  = me.tag || '@unknown';
    imgEl.src          = me.profilePic || 'assets/user.png';
  } catch {
    showRedPopUp('Could not load profile');
  }
})();

imgEl.addEventListener('click', () => fileInp.click());
fileInp.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => { imgEl.src = ev.target.result; };
  reader.readAsDataURL(file);
});

window.addEventListener('message', e => {
  if (e.data?.eventName === 'v1.avatar.exported') {
    const glbUrl = e.data.data.url;
    saveProfile(glbUrl, glbUrl.split('/').pop());
  }
});

async function saveProfile(glbUrl = '', charName = '') {
  const updates = {
    username: nameEl.textContent.trim(),
    tag: tagEl.textContent.trim(),
    profilePic: imgEl.src,
    avatarUrl: glbUrl || '',
    character: charName || ''
  };
  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (res.ok) showGreenPopUp('Profile saved!');
    else showRedPopUp(data.error || 'Save failed');
  } catch {
    showRedPopUp('Network error – is the server running?');
  }
}
saveBtn.addEventListener('click', () => saveProfile());

function showGreenPopUp(msg) {
  const pop = document.createElement('div');
  pop.className = 'pop-up green'; pop.textContent = msg;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 3000);
}
function showRedPopUp(msg) {
  const pop = document.createElement('div');
  pop.className = 'pop-up red'; pop.textContent = msg;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 3000);
}




// ---- LOGOUT ----
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  showGreenPopUp('Logged out');
  setTimeout(() => location.href = 'sign-in.html', 1000);
});
