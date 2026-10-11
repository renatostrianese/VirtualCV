// Procedural audio (no asset files): ambient generative music + small SFX via WebAudio.
const KEY = 'vcv-muted';

let ctx = null;
let master = null;
let musicGain = null;
let sfxGain = null;
let muted = localStorage.getItem(KEY) === '1';
let timer = null;
let nextTime = 0;
let step = 0;

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
// Am - F - C - G, chord root + arpeggio offsets (MIDI)
const CHORDS = [
  [57, 0, 3, 7, 12],
  [53, 0, 4, 7, 12],
  [48, 0, 4, 7, 12],
  [55, 0, 4, 7, 12],
];
const STEP_LEN = 0.3;

function tone(freq, start, dur, { type = 'sine', gain = 0.1, dest = musicGain, attack = 0.02 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(dest);
  o.start(start);
  o.stop(start + dur + 0.05);
}

function schedule() {
  while (nextTime < ctx.currentTime + 0.6) {
    const bar = Math.floor(step / 8) % CHORDS.length;
    const [root, ...offs] = CHORDS[bar];
    const i = step % 8;
    if (i === 0) {
      tone(NOTE(root - 12), nextTime, STEP_LEN * 8, { type: 'sine', gain: 0.16, attack: 0.3 });
      offs.slice(0, 3).forEach((o) => tone(NOTE(root + o), nextTime, STEP_LEN * 8, { type: 'triangle', gain: 0.035, attack: 0.5 }));
    }
    if (i % 2 === 0 || Math.random() < 0.3) {
      const o = offs[(i * 3 + bar) % offs.length];
      tone(NOTE(root + 12 + o), nextTime, 0.9, { type: 'sine', gain: 0.06, attack: 0.01 });
    }
    nextTime += STEP_LEN;
    step++;
  }
}

function applyMute() {
  if (!master) return;
  master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.05);
}

export const audio = {
  get muted() {
    return muted;
  },
  start() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      musicGain = ctx.createGain();
      sfxGain = ctx.createGain();
      musicGain.gain.value = 0.55;
      sfxGain.gain.value = 0.9;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 2200;
      musicGain.connect(lp).connect(master);
      sfxGain.connect(master);
      master.connect(ctx.destination);
      applyMute();
      nextTime = ctx.currentTime + 0.1;
      timer = setInterval(schedule, 200);
    }
    if (ctx.state === 'suspended') ctx.resume();
  },
  toggleMute() {
    muted = !muted;
    localStorage.setItem(KEY, muted ? '1' : '0');
    applyMute();
    return muted;
  },
  step() {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    tone(110 + Math.random() * 30, t0, 0.07, { type: 'triangle', gain: 0.05, dest: sfxGain, attack: 0.002 });
  },
  pickup(i = 0) {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    const base = 72 + (i % 5);
    [0, 4, 7, 12].forEach((o, k) => tone(NOTE(base + o), t0 + k * 0.06, 0.25, { type: 'sine', gain: 0.12, dest: sfxGain, attack: 0.005 }));
  },
  open() {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    [0, 7, 12, 16].forEach((o, k) => tone(NOTE(64 + o), t0 + k * 0.07, 0.4, { type: 'triangle', gain: 0.1, dest: sfxGain, attack: 0.01 }));
  },
  close() {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    [12, 7, 0].forEach((o, k) => tone(NOTE(64 + o), t0 + k * 0.05, 0.2, { type: 'triangle', gain: 0.08, dest: sfxGain, attack: 0.005 }));
  },
  click() {
    if (!ctx || muted) return;
    tone(660, ctx.currentTime, 0.08, { type: 'square', gain: 0.03, dest: sfxGain, attack: 0.002 });
  },
  fanfare() {
    if (!ctx || muted) return;
    const t0 = ctx.currentTime;
    [0, 4, 7, 12, 16, 19, 24].forEach((o, k) => tone(NOTE(60 + o), t0 + k * 0.09, 0.5, { type: 'triangle', gain: 0.12, dest: sfxGain, attack: 0.01 }));
  },
};

window.addEventListener('beforeunload', () => timer && clearInterval(timer));
