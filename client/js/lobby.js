import { authedGet, getTk } from './api.js';

const code = localStorage.getItem('meetingCode');
const scene = localStorage.getItem('selectedScene') || 'conference-room';
document.getElementById('lobbyCode').textContent = code;
document.getElementById('lobbyScene').textContent = scene.replace('-',' ');

/* fetch meeting + avatars */
const meet = await authedGet(`/meetings/${code}`);
if (meet.msg) return alert(meet.msg);

/* Unity bootstrap stub */
document.getElementById('enterBtn').addEventListener('click', () => {
  document.getElementById('unity-container').classList.remove('hidden');
  startUnity(meet);
});

function startUnity(data) {
  // ---- EXAMPLE ----
  // window.unityInstance = UnityLoader.instantiate(...);
  // send JSON: data.participants[{name,tag,readyPlayerMeUrl}]
  console.log('Unity start with:', data);
}