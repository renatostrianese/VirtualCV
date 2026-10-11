import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildWorld, SPAWN } from './world.js';
import { createAvatar } from './player.js';
import { audio } from './audio.js';
import { skills } from './data.js';
import { getLang, onLang, t, tx } from './i18n.js';
import { zoneHTML, bindCopyButtons } from './render.js';

const SAVE_KEY = 'vcv-progress';
const SQRT1_2 = Math.SQRT1_2;
const isTouch = () => matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

export function createGame() {
  const $ = (s) => document.querySelector(s);
  const canvas = $('#scene');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0c1124');

  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
  const CAM_OFFSET = new THREE.Vector3(30, 30, 30);
  let zoom = 1;

  scene.add(new THREE.HemisphereLight('#b4c4ff', '#3b3050', 1.25));
  const sun = new THREE.DirectionalLight('#ffe0b0', 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 100 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.65, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const world = buildWorld(scene);
  const avatar = createAvatar();
  scene.add(avatar.group);

  const player = { pos: new THREE.Vector3(SPAWN.x, 0, SPAWN.z), facing: Math.PI * 0.25, radius: 0.32, speed: 5.4 };
  avatar.group.position.copy(player.pos);

  const clickMarker = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.4, 24),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(1.5), transparent: true, opacity: 0, side: THREE.DoubleSide }),
  );
  clickMarker.rotation.x = -Math.PI / 2;
  scene.add(clickMarker);
  let markerT = 99;

  // ---------- Persistent progress ----------
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY)) ?? {};
    } catch {
      return {};
    }
  })();
  const progress = { zones: new Set(saved.zones ?? []), skills: new Set(saved.skills ?? []) };
  const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify({ zones: [...progress.zones], skills: [...progress.skills] }));
  world.pois.forEach((p) => progress.zones.has(p.id) && world.markDiscovered(p));
  world.orbs.forEach((o) => progress.skills.has(o.skill.name) && world.collect(o));

  // ---------- DOM refs ----------
  const els = {
    zones: $('#hud-zones'),
    skills: $('#hud-skills'),
    bar: $('#hud-bar'),
    labels: $('#labels'),
    quest: $('#quest'),
    questList: $('#quest-list'),
    btnMap: $('#btn-map'),
    minimap: $('#minimap'),
    prompt: $('#prompt'),
    toasts: $('#toasts'),
    joystick: $('#joystick'),
    knob: $('#knob'),
    panel: $('#panel'),
    panelIcon: $('#panel-icon'),
    panelTitle: $('#panel-title'),
    panelSub: $('#panel-sub'),
    panelBody: $('#panel-body'),
    panelClose: $('#panel-close'),
    help: $('#help'),
    helpClose: $('#help-close'),
    btnHelp: $('#btn-help'),
    hint: $('#hint'),
  };
  bindCopyButtons(els.panelBody);

  // ---------- Labels ----------
  const labelEls = new Map();
  world.pois.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'poi-label';
    el.style.setProperty('--accent', p.def.color);
    el.innerHTML = `<span class="ico">${p.def.icon}</span><span class="txt"></span><span class="ok">✓</span>`;
    el.addEventListener('click', () => travelTo(p.id));
    els.labels.appendChild(el);
    labelEls.set(p.id, el);
  });

  function renderStatic() {
    world.pois.forEach((p) => {
      const el = labelEls.get(p.id);
      el.querySelector('.txt').textContent = tx(p.def.title);
      el.classList.toggle('done', p.discovered);
    });
    els.zones.textContent = `${progress.zones.size}/${world.pois.length}`;
    els.skills.textContent = `${progress.skills.size}/${skills.length}`;
    els.bar.style.width = `${(progress.zones.size / world.pois.length) * 100}%`;
    els.questList.innerHTML = '';
    world.pois.forEach((p) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.className = p.discovered ? 'done' : '';
      b.style.setProperty('--accent', p.def.color);
      b.innerHTML = `<span class="ico">${p.def.icon}</span><span class="q-text"><strong></strong><small></small></span><span class="q-state">${p.discovered ? '✓' : '→'}</span>`;
      b.querySelector('strong').textContent = tx(p.def.title);
      b.querySelector('small').textContent = tx(p.def.subtitle);
      b.addEventListener('click', () => {
        audio.click();
        setQuestOpen(false);
        travelTo(p.id);
      });
      li.appendChild(b);
      els.questList.appendChild(li);
    });
    updatePrompt(true);
    if (openId) renderPanel(openId, false);
  }

  function setQuestOpen(open) {
    els.quest.hidden = !open;
    els.btnMap.classList.toggle('active', open);
  }
  els.btnMap.addEventListener('click', () => {
    audio.click();
    setQuestOpen(els.quest.hidden);
  });

  // ---------- Toasts ----------
  function toast(msg, color = '#38bdf8') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.setProperty('--accent', color);
    el.textContent = msg;
    els.toasts.appendChild(el);
    setTimeout(() => el.classList.add('out'), 3000);
    setTimeout(() => el.remove(), 3500);
  }

  // ---------- Panel ----------
  let openId = null;
  function renderPanel(id, scrollTop = true) {
    const p = world.pois.find((x) => x.id === id);
    els.panel.style.setProperty('--accent', p.def.color);
    els.panelIcon.textContent = p.def.icon;
    els.panelTitle.textContent = tx(p.def.title);
    els.panelSub.textContent = tx(p.def.subtitle);
    els.panelBody.innerHTML = zoneHTML(id);
    if (scrollTop) els.panelBody.scrollTop = 0;
  }

  function openZone(id) {
    const p = world.pois.find((x) => x.id === id);
    if (!p || openId) return;
    openId = id;
    pendingOpen = null;
    path = null;
    keys.clear();
    renderPanel(id);
    els.panel.hidden = false;
    document.body.classList.add('panel-open');
    requestAnimationFrame(() => els.panel.classList.add('open'));
    audio.open();
    setQuestOpen(false);
    if (!p.discovered) {
      progress.zones.add(id);
      world.markDiscovered(p);
      persist();
      toast(t('toast.zone', tx(p.def.title)), p.def.color);
      if (progress.zones.size === world.pois.length) {
        setTimeout(() => {
          toast(t('toast.allZones'), '#4ade80');
          audio.fanfare();
        }, 900);
      }
    }
    renderStatic();
    updatePrompt(true);
  }

  function closePanel() {
    if (!openId) return;
    openId = null;
    els.panel.classList.remove('open');
    document.body.classList.remove('panel-open');
    audio.close();
    setTimeout(() => !openId && (els.panel.hidden = true), 250);
    updatePrompt(true);
  }
  els.panelClose.addEventListener('click', closePanel);
  els.helpClose.addEventListener('click', () => (els.help.hidden = true));
  els.btnHelp.addEventListener('click', () => {
    audio.click();
    els.help.hidden = !els.help.hidden;
  });
  els.help.addEventListener('click', (e) => e.target === els.help && (els.help.hidden = true));

  // ---------- Input ----------
  const keys = new Set();
  const stick = { x: 0, y: 0 };
  let paused = true;
  let hintHidden = false;
  const hideHint = () => {
    if (!hintHidden) {
      hintHidden = true;
      els.hint.classList.add('out');
    }
  };

  const KEYMAP = { w: 'up', arrowup: 'up', s: 'down', arrowdown: 'down', a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right' };
  window.addEventListener('keydown', (e) => {
    if (paused) return;
    const k = e.key.toLowerCase();
    if (k === 'escape') {
      if (!els.help.hidden) els.help.hidden = true;
      else if (openId) closePanel();
      else setQuestOpen(false);
      return;
    }
    if (openId || !els.help.hidden) return;
    if (e.target.closest?.('input, textarea')) return;
    if (KEYMAP[k]) {
      keys.add(KEYMAP[k]);
      path = null;
      pendingOpen = null;
      hideHint();
      e.preventDefault();
    } else if (k === 'e' || k === 'enter' || k === ' ') {
      if (nearPoi) {
        e.preventDefault();
        openZone(nearPoi.id);
      }
    }
  });
  window.addEventListener('keyup', (e) => {
    const k = KEYMAP[e.key.toLowerCase()];
    if (k) keys.delete(k);
  });
  window.addEventListener('blur', () => keys.clear());

  // Pointer: tap to move, pinch to zoom
  const pointers = new Map();
  let tapStart = null;
  let pinchDist = 0;
  canvas.addEventListener('pointerdown', (e) => {
    if (paused || openId) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) tapStart = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId };
    else {
      tapStart = null;
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
    setQuestOpen(false);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) {
      hoverEvent = e;
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist > 0) setZoom(zoom * (d / pinchDist));
      pinchDist = d;
    }
  });
  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    if (tapStart && tapStart.id === e.pointerId) {
      const moved = Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y);
      if (moved < 8 && performance.now() - tapStart.t < 600 && e.type === 'pointerup') handleTap(e.clientX, e.clientY);
      tapStart = null;
    }
    if (pointers.size < 2) pinchDist = 0;
  };
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', (e) => {
    if (paused || openId) return;
    e.preventDefault();
    setZoom(zoom * Math.exp(-e.deltaY * 0.0012));
  }, { passive: false });

  function setZoom(z) {
    zoom = Math.min(1.9, Math.max(0.6, z));
    resize();
  }

  // Joystick
  let stickId = null;
  const STICK_R = 48;
  els.joystick.addEventListener('pointerdown', (e) => {
    stickId = e.pointerId;
    els.joystick.setPointerCapture(e.pointerId);
    moveStick(e);
    hideHint();
  });
  els.joystick.addEventListener('pointermove', (e) => e.pointerId === stickId && moveStick(e));
  const endStick = (e) => {
    if (e.pointerId !== stickId) return;
    stickId = null;
    stick.x = stick.y = 0;
    els.knob.style.transform = 'translate(-50%, -50%)';
  };
  els.joystick.addEventListener('pointerup', endStick);
  els.joystick.addEventListener('pointercancel', endStick);
  function moveStick(e) {
    const r = els.joystick.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > STICK_R) {
      dx = (dx / len) * STICK_R;
      dy = (dy / len) * STICK_R;
    }
    els.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    stick.x = dx / STICK_R;
    stick.y = -dy / STICK_R;
    if (Math.hypot(stick.x, stick.y) > 0.15) {
      path = null;
      pendingOpen = null;
    }
  }

  // ---------- Picking & travel ----------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  let path = null;
  let pendingOpen = null;
  let hoverEvent = null;

  function pick(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(world.pickables, false)[0];
    if (h) return { poi: h.object.userData.poi };
    if (ray.ray.intersectPlane(groundPlane, hit)) return { ground: hit.clone() };
    return null;
  }

  function handleTap(x, y) {
    const res = pick(x, y);
    if (!res) return;
    audio.start();
    hideHint();
    if (res.poi) return travelTo(res.poi);
    walkTo(res.ground.x, res.ground.z);
    clickMarker.position.set(res.ground.x, 0.15, res.ground.z);
    markerT = 0;
  }

  function walkTo(x, z) {
    pendingOpen = null;
    path = world.grid.findPath(player.pos.x, player.pos.z, x, z);
  }

  function travelTo(id) {
    if (paused || openId) return;
    const p = world.pois.find((q) => q.id === id);
    if (!p) return;
    hideHint();
    if (Math.hypot(p.x - player.pos.x, p.z - player.pos.z) < p.radius * 0.8) return openZone(id);
    walkTo(p.x, p.z);
    pendingOpen = id;
  }

  // ---------- Prompt ----------
  let nearPoi = null;
  function updatePrompt(force = false) {
    let best = null;
    let bd = Infinity;
    if (!openId) {
      for (const p of world.pois) {
        const d = Math.hypot(p.x - player.pos.x, p.z - player.pos.z);
        if (d < p.radius && d < bd) {
          best = p;
          bd = d;
        }
      }
    }
    if (best === nearPoi && !force) return;
    nearPoi = best;
    els.prompt.hidden = !best;
    if (best) {
      els.prompt.style.setProperty('--accent', best.def.color);
      els.prompt.innerHTML = `${isTouch() ? '' : '<kbd>E</kbd>'}<span>${t('hud.interact')} · ${tx(best.def.title)}</span>`;
    }
  }
  els.prompt.addEventListener('click', () => nearPoi && openZone(nearPoi.id));

  // ---------- Minimap ----------
  const mm = els.minimap.getContext('2d');
  const MM = 160;
  const MM_SCALE = 1.85;
  const toMM = (x, z) => [MM / 2 + ((x - z) * SQRT1_2) * MM_SCALE, MM / 2 + ((x + z) * SQRT1_2) * MM_SCALE - 2];
  function drawMinimap(time) {
    mm.clearRect(0, 0, MM, MM);
    mm.beginPath();
    [[-28, -28], [28, -28], [28, 28], [-28, 28]].forEach(([x, z], i) => {
      const [px, py] = toMM(x, z);
      i ? mm.lineTo(px, py) : mm.moveTo(px, py);
    });
    mm.closePath();
    mm.fillStyle = 'rgba(76,157,108,0.35)';
    mm.fill();
    mm.strokeStyle = 'rgba(255,255,255,0.25)';
    mm.stroke();
    for (const o of world.orbs) {
      if (o.collected) continue;
      const [px, py] = toMM(o.x, o.z);
      mm.fillStyle = o.skill.color;
      mm.fillRect(px - 1.5, py - 1.5, 3, 3);
    }
    for (const p of world.pois) {
      const [px, py] = toMM(p.bx, p.bz);
      mm.beginPath();
      mm.arc(px, py, 5, 0, Math.PI * 2);
      mm.fillStyle = p.discovered ? '#4ade80' : p.def.color;
      mm.fill();
      mm.strokeStyle = '#0b1020';
      mm.lineWidth = 1.5;
      mm.stroke();
    }
    const [px, py] = toMM(player.pos.x, player.pos.z);
    mm.beginPath();
    mm.arc(px, py, 4 + Math.sin(time * 5) * 0.8, 0, Math.PI * 2);
    mm.fillStyle = '#ffffff';
    mm.fill();
    mm.strokeStyle = '#0ea5e9';
    mm.lineWidth = 2;
    mm.stroke();
  }

  // ---------- Resize ----------
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    const aspect = w / h;
    let halfH = 9.5 / zoom;
    let halfW = halfH * aspect;
    const minHalfW = 8 / zoom;
    if (halfW < minHalfW) {
      halfW = minHalfW;
      halfH = halfW / aspect;
    }
    Object.assign(camera, { left: -halfW, right: halfW, top: halfH, bottom: -halfH });
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- Main loop ----------
  const camTarget = player.pos.clone();
  const look = new THREE.Vector3();
  let panelShift = 0;
  const proj = new THREE.Vector3();
  let lastT = performance.now();
  let elapsed = 0;
  const tick = () => {
    const now = performance.now();
    const d = (now - lastT) / 1000;
    lastT = now;
    return d;
  };
  let stepDist = 0;
  let frame = 0;
  let moving = 0;

  function readInput() {
    let mx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
    let my = (keys.has('up') ? 1 : 0) - (keys.has('down') ? 1 : 0);
    mx += stick.x;
    my += stick.y;
    const len = Math.hypot(mx, my);
    if (len > 1) {
      mx /= len;
      my /= len;
    }
    return { mx, my, len: Math.min(1, len) };
  }

  function step(dt) {
    let dx = 0;
    let dz = 0;
    let speed01 = 0;
    const input = openId ? { mx: 0, my: 0, len: 0 } : readInput();
    if (input.len > 0.08) {
      // screen right = (1,-1)/sqrt2, screen up = (-1,-1)/sqrt2 in world (x,z)
      dx = (input.mx - input.my) * SQRT1_2;
      dz = (-input.mx - input.my) * SQRT1_2;
      speed01 = input.len;
    } else if (path && path.length) {
      const wp = path[0];
      const ddx = wp.x - player.pos.x;
      const ddz = wp.z - player.pos.z;
      const dist = Math.hypot(ddx, ddz);
      if (dist < 0.18) {
        path.shift();
      } else {
        dx = ddx / dist;
        dz = ddz / dist;
        speed01 = 1;
      }
      if (!path.length) {
        path = null;
        if (pendingOpen) {
          const id = pendingOpen;
          pendingOpen = null;
          openZone(id);
        }
      }
    }
    if (speed01 > 0) {
      const len = Math.hypot(dx, dz) || 1;
      const mvx = (dx / len) * player.speed * speed01 * dt;
      const mvz = (dz / len) * player.speed * speed01 * dt;
      const ox = player.pos.x;
      const oz = player.pos.z;
      if (!world.grid.collides(ox + mvx, oz, player.radius)) player.pos.x += mvx;
      if (!world.grid.collides(player.pos.x, oz + mvz, player.radius)) player.pos.z += mvz;
      const moved = Math.hypot(player.pos.x - ox, player.pos.z - oz);
      if (moved < 1e-4 && path) path = null;
      const target = Math.atan2(dx, dz);
      let diff = target - player.facing;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      player.facing += diff * Math.min(1, dt * 14);
      stepDist += moved;
      if (stepDist > 1.25) {
        stepDist = 0;
        audio.step();
      }
    }
    moving = speed01;
  }

  function loop() {
    requestAnimationFrame(loop);
    if (paused) return;
    const dt = Math.min(0.05, tick());
    elapsed += dt;
    const time = elapsed;
    frame++;

    step(dt);

    for (const o of world.orbs) {
      if (o.collected) continue;
      if (Math.hypot(o.x - player.pos.x, o.z - player.pos.z) < 0.95) {
        world.collect(o);
        progress.skills.add(o.skill.name);
        persist();
        audio.pickup(progress.skills.size);
        toast(t('toast.skill', o.skill.name), o.skill.color);
        renderStatic();
        if (progress.skills.size === skills.length) {
          setTimeout(() => {
            toast(t('toast.allSkills'), '#fde047');
            audio.fanfare();
          }, 700);
        }
      }
    }

    updatePrompt();
    world.update(time);
    avatar.group.position.copy(player.pos);
    avatar.group.rotation.y = player.facing;
    avatar.update(dt, moving, time);

    markerT += dt;
    clickMarker.material.opacity = Math.max(0, 1 - markerT * 1.4);
    clickMarker.scale.setScalar(1 + markerT * 2);

    camTarget.lerp(player.pos, 1 - Math.exp(-dt * 6));
    // Keep the character visible beside the side panel on wide screens.
    const wantShift = openId && window.innerWidth > 700 ? Math.min(560, window.innerWidth) / window.innerWidth : 0;
    panelShift += (wantShift - panelShift) * (1 - Math.exp(-dt * 6));
    const shiftWorld = panelShift * camera.right;
    look.set(camTarget.x + SQRT1_2 * shiftWorld, 0, camTarget.z - SQRT1_2 * shiftWorld);
    camera.position.copy(look).add(CAM_OFFSET);
    camera.lookAt(look);
    sun.position.copy(camTarget).add(new THREE.Vector3(14, 26, 10));
    sun.target.position.copy(camTarget);

    if (hoverEvent && frame % 4 === 0 && !openId) {
      const res = pick(hoverEvent.clientX, hoverEvent.clientY);
      canvas.style.cursor = res?.poi ? 'pointer' : 'default';
      hoverEvent = null;
    }

    for (const p of world.pois) {
      proj.set(p.bx, p.top + 0.6, p.bz).project(camera);
      const el = labelEls.get(p.id);
      el.style.transform = `translate(-50%, -100%) translate(${((proj.x + 1) / 2) * window.innerWidth}px, ${((1 - proj.y) / 2) * window.innerHeight}px)`;
    }
    if (frame % 2 === 0) drawMinimap(time);
    composer.render();
  }

  onLang(renderStatic);
  renderStatic();
  loop();

  return {
    start() {
      paused = false;
      tick();
      els.hint.textContent = isTouch() ? t('hint.touch') : t('hint.desktop');
      els.hint.hidden = false;
      setTimeout(hideHint, 12000);
    },
    setPaused(p) {
      paused = p;
      keys.clear();
      if (!p) tick();
    },
  };
}
