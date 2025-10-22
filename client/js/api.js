const API = window.location.hostname === 'localhost'
            ? 'http://localhost:5000/api'
            : '/api';

export const setTk = tk => localStorage.setItem('tk', tk);
export const getTk = () => localStorage.getItem('tk');

/* ---------- fetch helpers ---------- */
export const post = (url, body) =>
  fetch(API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json());

export const authedGet = url =>
  fetch(API + url, {
    headers: { authorization: 'Bearer ' + getTk() }
  }).then(r => r.json());

/* ---------- page helpers ---------- */
export const getStartedRedirect = () => {
  const tk = getTk();
  location.href = tk ? 'profile.html' : 'sign-up.html';
};