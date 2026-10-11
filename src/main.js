import './style.css';
import { applyStatic, getLang, setLang, onLang, t, tx } from './i18n.js';
import { profile } from './data.js';
import { fullCVHTML, bindCopyButtons } from './render.js';
import { audio } from './audio.js';

const $ = (s) => document.querySelector(s);
const start = $('#start');
const fast = $('#fast');
const hud = $('#hud');
const fastContent = $('#fast-content');

let game = null;
let loading = null;
let gameActive = false;

function refreshText() {
  applyStatic();
  document.querySelectorAll('[data-lang-other]').forEach((el) => (el.textContent = getLang() === 'es' ? 'EN' : 'ES'));
  $('#start-headline').textContent = tx(profile.headline);
  document.title = `${profile.name} · ${getLang() === 'es' ? 'CV interactivo' : 'Interactive CV'}`;
  $('.sound-ico').textContent = audio.muted ? '🔇' : '🔊';
  if (!fast.hidden) renderFast();
}

function renderFast() {
  const y = fast.scrollTop;
  fastContent.innerHTML = fullCVHTML();
  fast.scrollTop = y;
}

async function ensureGame() {
  if (game) return game;
  if (!loading) {
    loading = import('./game.js').then((m) => {
      game = m.createGame();
      return game;
    });
  }
  return loading;
}

async function startGame() {
  audio.start();
  const btn = $('#btn-explore');
  btn.disabled = true;
  btn.classList.add('loading');
  try {
    await ensureGame();
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.classList.remove('loading');
    alert('WebGL no disponible / WebGL unavailable');
    return;
  }
  btn.disabled = false;
  btn.classList.remove('loading');
  start.classList.add('hide');
  setTimeout(() => (start.hidden = true), 500);
  hud.hidden = false;
  fast.hidden = true;
  gameActive = true;
  game.start();
  game.setPaused(false);
}

function showFast() {
  renderFast();
  fast.hidden = false;
  start.hidden = true;
  fast.scrollTop = 0;
  if (game) game.setPaused(true);
  document.body.classList.add('fast-mode');
}

function backToGame() {
  fast.hidden = true;
  document.body.classList.remove('fast-mode');
  if (gameActive && game) game.setPaused(false);
  else {
    start.hidden = false;
    start.classList.remove('hide');
  }
}

$('#btn-explore').addEventListener('click', startGame);
// Warm up the 3D bundle while the user reads the intro.
$('#btn-explore').addEventListener('pointerenter', () => ensureGame().catch(() => {}), { once: true });

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const act = b.dataset.act;
  if (act === 'lang') setLang(getLang() === 'es' ? 'en' : 'es');
  else if (act === 'sound') {
    audio.start();
    audio.toggleMute();
    refreshText();
  } else if (act === 'fast') showFast();
  else if (act === 'game') backToGame();
  else if (act === 'print') window.print();
});

bindCopyButtons(fastContent);
onLang(refreshText);
refreshText();
