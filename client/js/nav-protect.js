import { getStartedRedirect } from './api.js';

document.getElementById('getStartedBtn')?.addEventListener('click', e => {
  e.preventDefault();
  getStartedRedirect();
});