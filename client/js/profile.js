import { authedGet, getTk } from './api.js';

const nameEl  = document.getElementById('userName');
const tagEl   = document.getElementById('userTag');
const imgEl   = document.getElementById('avatarImg');
const fileInp = document.getElementById('fileInput');
const saveBtn = document.getElementById('saveBtn');
const rpmBtn  = document.getElementById('rpmBtn');
const rpmFrame= document.getElementById('rpmFrame');
const rpmUrl  = document.getElementById('rpmUrl');

let userData = {};

/* ---------- load profile ---------- */
async function load(){
  userData = await authedGet('/users/me');
  if(!userData.id) return location.href='sign-in.html';
  nameEl.textContent = userData.name;
  tagEl.textContent  = userData.tag;
  if(userData.readyPlayerMeUrl) rpmUrl.textContent = userData.readyPlayerMeUrl;
  buildPickers();
  loadLocal();
}
load();

/* ---------- local save / load ---------- */
function loadLocal(){
  if(localStorage.profileName) nameEl.textContent = localStorage.profileName;
  if(localStorage.profileTag)  tagEl.textContent  = localStorage.profileTag;
  if(localStorage.profileImg)  imgEl.src = localStorage.profileImg;
}
nameEl.addEventListener('input', ()=> localStorage.profileName = nameEl.textContent);
tagEl.addEventListener('input',  ()=> localStorage.profileTag  = tagEl.textContent);

/* ---------- avatar upload ---------- */
imgEl.addEventListener('click', ()=> fileInp.click());
fileInp.addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ev=>{
    imgEl.src = ev.target.result;
    localStorage.profileImg = ev.target.result;
  };
  reader.readAsDataURL(file);
});

/* ---------- settings pickers ---------- */
const skinColors = ['#F1C27D','#E0AC69','#C68642','#8D5524','#FFE0BD','#FFDBAC'];
const hairs      = ['Short','Long','Bald','Curly'];
const genders    = ['male','female','other'];
const bodies     = ['slim','average','athletic','heavy'];

function buildPickers(){
  // skin
  const skinPicker = document.getElementById('skinPicker');
  skinColors.forEach(c=>{
    const d=document.createElement('div');
    d.className='color-option'; d.style.background=c; d.dataset.color=c;
    d.onclick=()=>{document.querySelectorAll('.color-option').forEach(o=>o.classList.remove('selected'));d.classList.add('selected');};
    skinPicker.appendChild(d);
    if(c===userData.settings.skinColor) d.classList.add('selected');
  });
  // selects
  const fillSel = (id,arr,sel)=>{const s=document.getElementById(id);arr.forEach(o=>{const opt=new Option(o,o);s.add(opt);});s.value=sel;};
  fillSel('hairSelect', hairs,   userData.settings.hair);
  fillSel('genderSelect',genders,userData.settings.gender);
  fillSel('bodySelect', bodies, userData.settings.bodyType);
}

/* ---------- save ---------- */
saveBtn.addEventListener('click', async ()=>{
  const selected = document.querySelector('.color-option.selected');
  const payload = {
    name: nameEl.textContent.trim(),
    tag:  tagEl.textContent.trim(),
    settings:{
      skinColor: selected ? selected.dataset.color : userData.settings.skinColor,
      hair:      document.getElementById('hairSelect').value,
      gender:    document.getElementById('genderSelect').value,
      bodyType:  document.getElementById('bodySelect').value
    },
    readyPlayerMeUrl: rpmUrl.textContent || ''
  };
  const res = await fetch('/api/users/me',{
    method:'PATCH',
    headers:{ 'Content-Type':'application/json', authorization:'Bearer '+getTk() },
    body:JSON.stringify(payload)
  }).then(r=>r.json());
  if(res.msg) return alert(res.msg);
  alert('Profile saved!');
});
/* ---------- ReadyPlayerMe – open immediately ---------- */
window.addEventListener('DOMContentLoaded', () => {
  rpmFrame.src = 'https://demo.readyplayer.me/avatar?frameApi';
  rpmFrame.hidden = false;
});

window.addEventListener('message', e => {
  if (e.data?.eventName === 'v1.avatar.exported') {
    rpmUrl.textContent = e.data.data.url;
    rpmFrame.hidden = true;
  }
});

