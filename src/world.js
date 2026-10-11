import * as THREE from 'three';
import { Grid, HALF } from './nav.js';
import { zones, skills } from './data.js';

const matCache = new Map();
function mat(color, { emissive, intensity = 1, rough = 0.85, metal = 0, transparent = false, opacity = 1 } = {}) {
  const key = `${color}|${emissive}|${intensity}|${rough}|${metal}|${opacity}`;
  if (!matCache.has(key)) {
    matCache.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        flatShading: true,
        roughness: rough,
        metalness: metal,
        emissive: emissive ?? '#000000',
        emissiveIntensity: emissive ? intensity : 0,
        transparent,
        opacity,
      }),
    );
  }
  return matCache.get(key);
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
function box(w, h, d, material, x = 0, y = 0, z = 0, { shadow = true } = {}) {
  const m = new THREE.Mesh(boxGeo, material);
  m.scale.set(w, h, d);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function textSign(text, w, h, { bg = '#111827', fg = '#ffffff', font = '700 64px system-ui, sans-serif', border } = {}) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = Math.round(512 * (h / w));
  const g = c.getContext('2d');
  g.fillStyle = bg;
  g.fillRect(0, 0, c.width, c.height);
  if (border) {
    g.strokeStyle = border;
    g.lineWidth = 8;
    g.strokeRect(6, 6, c.width - 12, c.height - 12);
  }
  g.fillStyle = fg;
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, c.width / 2, c.height / 2 + 4);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.55, roughness: 0.6 }));
  m.castShadow = false;
  return m;
}

const LAYOUT = {
  about: { x: -12, z: 8.5, w: 6, d: 5, h: 3.2 },
  early: { x: -21, z: -16, w: 5, d: 5, h: 3.5 },
  movilnet: { x: -12, z: -16, w: 5, d: 5, h: 3 },
  hp: { x: -2.5, z: -16, w: 6, d: 5, h: 4.5 },
  ms: { x: 8.5, z: -16, w: 8, d: 6, h: 5 },
  projects: { x: 22, z: -3, w: 7, d: 6, h: 3.5 },
  certs: { x: 14.5, z: 8, w: 8, d: 6, h: 4 },
  education: { x: -22, z: -2, w: 7, d: 6, h: 4.5 },
  contact: { x: 0, z: 21, w: 3, d: 3, h: 2.4, trigger: { x: 0, z: 17.7 } },
};

const ROADS = [
  { x: 0, z: 3.25, w: 3, d: 31.5 },
  { x: -5.5, z: -11, w: 39, d: 3 },
  { x: 0, z: 2, w: 50, d: 3 },
  { x: 2, z: 13, w: 36, d: 3 },
];

export const SPAWN = { x: 0, z: 11 };

const ORB_SPOTS = [
  [-6, -11], [4, -11], [-17, -11], [17, -8], [-3, -5], [3, -5], [-8, 4], [8, 4], [-19, 7], [20, 8], [-3, 16], [4, 16], [14, 17],
];

export function buildWorld(scene) {
  const grid = new Grid();
  const animated = [];
  const pickables = [];
  const rand = mulberry32(20260610);

  // Walkable area limit
  for (let i = 0; i < 60; i++) {
    for (const k of [0, 1, 58, 59]) {
      grid.addRect(Grid.center(k), Grid.center(i), 1, 1);
      grid.addRect(Grid.center(i), Grid.center(k), 1, 1);
    }
  }

  // ---------- Island ----------
  const grassTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 2;
    const g = c.getContext('2d');
    g.fillStyle = '#4c9d6c';
    g.fillRect(0, 0, 2, 2);
    g.fillStyle = '#459565';
    g.fillRect(0, 0, 1, 1);
    g.fillRect(1, 1, 1, 1);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(30, 30);
    return t;
  })();
  const ground = new THREE.Mesh(new THREE.BoxGeometry(60, 0.6, 60), [
    mat('#6b4f3a'), mat('#6b4f3a'),
    new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95 }),
    mat('#6b4f3a'), mat('#6b4f3a'), mat('#6b4f3a'),
  ]);
  ground.position.y = -0.3;
  ground.receiveShadow = true;
  scene.add(ground);
  scene.add(box(58, 5, 58, mat('#5a4332'), 0, -3.1, 0));
  scene.add(box(46, 5, 46, mat('#4a382a'), 0, -8, 0));
  scene.add(box(30, 5, 30, mat('#3b2d22'), 0, -12.8, 0));
  scene.add(box(14, 4, 14, mat('#2d231b'), 0, -17, 0));

  // Stars / void
  {
    const n = 2500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -130 + Math.random() * 190;
      pos[i * 3 + 1] = -52 + Math.random() * 6;
      pos[i * 3 + 2] = -130 + Math.random() * 190;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#cfd8ff', size: 2, sizeAttenuation: false, transparent: true, opacity: 0.8 })));
  }

  // Floating debris around the island
  for (let i = 0; i < 10; i++) {
    const a = rand() * Math.PI * 2;
    const r = 36 + rand() * 12;
    const s = 0.8 + rand() * 1.6;
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), mat('#6b5646'));
    const baseY = -4 - rand() * 10;
    rock.position.set(Math.cos(a) * r, baseY, Math.sin(a) * r);
    rock.castShadow = true;
    scene.add(rock);
    const ph = rand() * 6;
    animated.push((t) => {
      rock.position.y = baseY + Math.sin(t * 0.6 + ph) * 0.5;
      rock.rotation.y = t * 0.2 + ph;
    });
  }

  // ---------- Roads & plaza ----------
  for (const r of ROADS) scene.add(box(r.w, 0.06, r.d, mat('#3d4356', { rough: 0.95 }), r.x, 0.03, r.z, { shadow: false }));
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.1, 40), mat('#7b849c'));
  plaza.position.set(0, 0.05, 7.5);
  plaza.receiveShadow = true;
  scene.add(plaza);
  const plazaRing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.12, 40), mat('#5f6882'));
  plazaRing.position.set(0, 0.06, 7.5);
  plazaRing.receiveShadow = true;
  scene.add(plazaRing);

  // Fountain
  {
    const f = new THREE.Group();
    f.position.set(0, 0, 7.5);
    f.add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.6, 12), mat('#9aa3b8')));
    f.children[0].position.y = 0.4;
    const water = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.1, 12), mat('#2dd4ff', { emissive: '#1ab8ff', intensity: 1.2 }));
    water.position.y = 0.72;
    f.add(water);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.4, 8), mat('#9aa3b8'));
    col.position.y = 1.2;
    f.add(col);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 1), mat('#7de9ff', { emissive: '#5be3ff', intensity: 2 }));
    orb.position.y = 2.2;
    f.add(orb);
    f.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    scene.add(f);
    animated.push((t) => {
      orb.position.y = 2.2 + Math.sin(t * 2) * 0.12;
      orb.rotation.y = t;
    });
    grid.addRect(0, 7.5, 3, 3);
  }

  // ---------- Buildings ----------
  const litWin = mat('#2a3045', { emissive: '#ffd98a', intensity: 1.5 });
  const dimWin = mat('#232a3d', { emissive: '#ffd98a', intensity: 0.12 });
  const winGeo = new THREE.BoxGeometry(0.8, 0.75, 0.06);

  function windows(g, { w, d, h }, { colsMax = 6, skipDoor = true } = {}) {
    const cols = Math.min(colsMax, Math.max(1, Math.floor((w - 0.8) / 1.5)));
    const rows = Math.max(1, Math.floor((h - 1.2) / 1.3));
    for (let r = 0; r < rows; r++) {
      const y = 1.5 + r * 1.3;
      if (y > h - 0.5) break;
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * 1.5;
        if (skipDoor && r === 0 && Math.abs(x) < 1) continue;
        const m = new THREE.Mesh(winGeo, rand() < 0.78 ? litWin : dimWin);
        m.position.set(x, y, d / 2 + 0.02);
        g.add(m);
      }
      const colsSide = Math.max(1, Math.floor((d - 0.8) / 1.5));
      for (let c = 0; c < colsSide; c++) {
        const z = (c - (colsSide - 1) / 2) * 1.5;
        const m = new THREE.Mesh(winGeo, rand() < 0.78 ? litWin : dimWin);
        m.rotation.y = Math.PI / 2;
        m.position.set(w / 2 + 0.02, y, z);
        g.add(m);
      }
    }
  }

  function shell(def, { wall, roof, accent, roofH = 0.35 }) {
    const g = new THREE.Group();
    const { w, d, h } = def;
    g.add(box(w, h, d, mat(wall), 0, h / 2, 0));
    g.add(box(w + 0.5, roofH, d + 0.5, mat(roof), 0, h + roofH / 2, 0));
    g.add(box(w + 0.8, 0.12, d + 0.8, mat('#9aa3b8'), 0, 0.06, 0));
    const door = box(1.3, 1.9, 0.12, mat(accent, { emissive: accent, intensity: 0.45 }), 0, 0.95, d / 2 + 0.04);
    g.add(door);
    g.add(box(2.2, 0.15, 0.9, mat(accent), 0, 2.1, d / 2 + 0.4));
    return g;
  }

  const builders = {
    about(def) {
      const g = shell(def, { wall: '#eadfc9', roof: '#b7493a', accent: '#38bdf8', roofH: 0.2 });
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 4), mat('#c2553f'));
      cone.geometry = cone.geometry.clone();
      cone.geometry.rotateY(Math.PI / 4);
      cone.scale.set(def.w / 1.414 + 0.45, 1.5, def.d / 1.414 + 0.45);
      cone.position.y = def.h + 0.2 + 0.75;
      cone.castShadow = true;
      g.add(cone);
      g.add(box(0.6, 1.4, 0.6, mat('#8a5a44'), 1.4, def.h + 1.1, -0.8));
      windows(g, def, { colsMax: 3 });
      return { g, top: def.h + 2.6 };
    },
    early(def) {
      const g = shell(def, { wall: '#a8c97a', roof: '#5b7a3a', accent: '#a3e635' });
      const s = textSign('1998–2005', 3, 0.7, { bg: '#2e4420', fg: '#d9f99d', font: '700 90px system-ui, sans-serif' });
      s.position.set(0, def.h - 0.5, def.d / 2 + 0.05);
      g.add(s);
      windows(g, def, { colsMax: 3 });
      g.add(box(1.4, 0.8, 1.4, mat('#5b7a3a'), -1.2, def.h + 0.75, -0.5));
      return { g, top: def.h + 1.4 };
    },
    movilnet(def) {
      const g = shell(def, { wall: '#323759', roof: '#1f2340', accent: '#fb7185' });
      const s = textSign('movilnet', 3.6, 0.9, { bg: '#fb7185', fg: '#ffffff', font: '800 100px system-ui, sans-serif' });
      s.position.set(0, def.h - 0.55, def.d / 2 + 0.05);
      g.add(s);
      windows(g, def, { colsMax: 3 });
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 8, 6), mat('#cbd5e1', { metal: 0.4 }));
      mast.position.set(1.2, def.h + 4.2, -1);
      mast.castShadow = true;
      g.add(mast);
      for (let i = 0; i < 4; i++) g.add(box(1.4 - i * 0.25, 0.08, 0.08, mat('#cbd5e1'), 1.2, def.h + 2 + i * 1.6, -1));
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), mat('#ff3b55', { emissive: '#ff2040', intensity: 3 }));
      tip.position.set(1.2, def.h + 8.3, -1);
      g.add(tip);
      const waves = [];
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a90').multiplyScalar(1.6), transparent: true }));
        ring.position.set(1.2, def.h + 8.3, -1);
        ring.rotation.x = Math.PI / 2;
        g.add(ring);
        waves.push(ring);
      }
      animated.push((t) => {
        tip.material.emissiveIntensity = 1.5 + Math.sin(t * 5) * 1.5;
        waves.forEach((r, i) => {
          const p = (t * 0.6 + i / 3) % 1;
          r.scale.setScalar(0.5 + p * 3);
          r.material.opacity = (1 - p) * 0.8;
        });
      });
      return { g, top: def.h + 9 };
    },
    hp(def) {
      const g = shell(def, { wall: '#e6ecf5', roof: '#0096d6', accent: '#0096d6', roofH: 0.3 });
      g.add(box(def.w + 0.1, 0.5, def.d + 0.1, mat('#0096d6'), 0, 2.4, 0));
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const x = c.getContext('2d');
      x.fillStyle = '#0096d6';
      x.beginPath();
      x.arc(128, 128, 120, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#fff';
      x.font = '800 130px system-ui, sans-serif';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText('hp', 128, 138);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshStandardMaterial({ map: tex, transparent: true, emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.5 }));
      logo.position.set(0, def.h - 0.7, def.d / 2 + 0.06);
      g.add(logo);
      windows(g, { ...def, h: 3.6 }, { colsMax: 4 });
      const rooftop = box(2, 0.7, 2, mat('#c9d3e3'), -1.5, def.h + 0.65, 0);
      g.add(rooftop);
      return { g, top: def.h + 1.6 };
    },
    ms(def) {
      const g = shell(def, { wall: '#243552', roof: '#17233a', accent: '#34d399', roofH: 0.3 });
      g.add(box(4.4, 3.2, 4.2, mat('#2c4066'), 1.2, def.h + 0.3 + 1.6, -0.4));
      g.add(box(4.8, 0.3, 4.6, mat('#17233a'), 1.2, def.h + 3.65, -0.4));
      const logo = new THREE.Group();
      [['#f25022', -0.5, 0.5], ['#7fba00', 0.5, 0.5], ['#00a4ef', -0.5, -0.5], ['#ffb900', 0.5, -0.5]].forEach(([c, x, y]) =>
        logo.add(box(0.9, 0.9, 0.15, mat(c, { emissive: c, intensity: 0.9 }), x, y, 0)),
      );
      logo.position.set(-1.5, def.h - 1.1, def.d / 2 + 0.1);
      g.add(logo);
      windows(g, def, { colsMax: 5 });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
        const m = new THREE.Mesh(winGeo, litWin);
        m.position.set(0.3 + c * 1.9, def.h + 1.1 + r * 1.3, 1.72);
        g.add(m);
      }
      const s = textSign('Microsoft', 3.6, 0.8, { bg: '#0f172a', fg: '#e2e8f0', font: '600 88px system-ui, sans-serif' });
      s.position.set(2.3, def.h - 0.55, def.d / 2 + 0.05);
      g.add(s);
      return { g, top: def.h + 4.4 };
    },
    projects(def) {
      const g = shell(def, { wall: '#3a2d5c', roof: '#241a3d', accent: '#c084fc', roofH: 0.3 });
      const s = textSign('AI LAB', 2.6, 0.75, { bg: '#c084fc', fg: '#1a1033', font: '800 96px system-ui, sans-serif' });
      s.position.set(0, def.h - 0.5, def.d / 2 + 0.05);
      g.add(s);
      windows(g, def, { colsMax: 4 });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat('#5eead4', { emissive: '#2dd4bf', intensity: 0.6, transparent: true, opacity: 0.55 }));
      dome.position.set(1.5, def.h + 0.3, -0.5);
      g.add(dome);
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), mat('#e9d5ff', { emissive: '#c084fc', intensity: 2.2 }));
      core.position.set(1.5, def.h + 1.3, -0.5);
      g.add(core);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color('#d8b4fe').multiplyScalar(1.8) }));
      ring.position.copy(core.position);
      g.add(ring);
      const ring2 = ring.clone();
      g.add(ring2);
      animated.push((t) => {
        core.rotation.set(t, t * 1.3, 0);
        core.position.y = def.h + 1.3 + Math.sin(t * 2) * 0.1;
        ring.rotation.set(t * 0.8, t * 0.5, 0);
        ring2.rotation.set(t * 0.4, t * 0.9 + 1, 1);
        ring.position.y = ring2.position.y = core.position.y;
      });
      return { g, top: def.h + 3.2 };
    },
    certs(def) {
      const g = shell(def, { wall: '#f1e8d4', roof: '#d8c9a3', accent: '#fbbf24', roofH: 0.3 });
      for (let i = 0; i < 6; i++) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, def.h - 0.4, 8), mat('#fff8e7'));
        c.position.set((i - 2.5) * 1.35, (def.h - 0.4) / 2 + 0.1, def.d / 2 + 0.35);
        c.castShadow = true;
        g.add(c);
      }
      g.add(box(def.w + 0.3, 0.3, 1.2, mat('#d8c9a3'), 0, def.h - 0.1, def.d / 2 + 0.35));
      const ped = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 4), mat('#e8dcc0'));
      ped.geometry.rotateY(Math.PI / 4);
      ped.scale.set(def.w * 0.4, 1.5, def.d * 0.4);
      ped.position.set(0, def.h + 1.05, 0);
      ped.castShadow = true;
      g.add(ped);
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), mat('#fde68a', { emissive: '#fbbf24', intensity: 2.4 }));
      star.position.set(0, def.h + 3, 0);
      g.add(star);
      animated.push((t) => {
        star.rotation.y = t * 1.5;
        star.position.y = def.h + 3 + Math.sin(t * 2) * 0.15;
      });
      windows(g, def, { colsMax: 4, skipDoor: true });
      return { g, top: def.h + 4 };
    },
    education(def) {
      const g = shell(def, { wall: '#b45a4a', roof: '#6b2f27', accent: '#f472b6' });
      g.add(box(2.4, 3.8, 2.4, mat('#a24f40'), 0, def.h + 1.9 + 0.2, -0.6));
      g.add(box(2.8, 0.3, 2.8, mat('#6b2f27'), 0, def.h + 4.1, -0.6));
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.5, 4), mat('#6b2f27'));
      cone.rotation.y = Math.PI / 4;
      cone.position.set(0, def.h + 4.95, -0.6);
      cone.castShadow = true;
      g.add(cone);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.8, 24), mat('#fff7ed', { emissive: '#ffedd5', intensity: 0.8 }));
      face.position.set(0, def.h + 2.9, 0.62);
      g.add(face);
      const hand = box(0.07, 0.55, 0.05, mat('#1f1f1f'), 0, def.h + 3.05, 0.64);
      g.add(hand);
      animated.push((t) => (hand.rotation.z = -t * 0.5));
      windows(g, def, { colsMax: 4 });
      return { g, top: def.h + 6 };
    },
    contact(def) {
      const g = new THREE.Group();
      g.add(box(def.w, 0.3, def.d, mat('#9aa3b8'), 0, 0.15, 0));
      g.add(box(2.2, 1.6, 2.2, mat('#2b6cb0'), 0, 1.1, 0));
      g.add(box(2.6, 0.25, 2.6, mat('#1e4e82'), 0, 2, 0));
      const slot = box(1.4, 0.18, 0.1, mat('#0b1220', { emissive: '#22d3ee', intensity: 1 }), 0, 1.5, 1.12);
      g.add(slot);
      g.add(box(1.0, 0.9, 0.12, mat('#ef4444'), 0, 0.85, 1.12));
      const env = new THREE.Group();
      env.add(box(1.2, 0.8, 0.08, mat('#ffffff', { emissive: '#ffffff', intensity: 0.6 }), 0, 0, 0));
      const flap = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.45, 4), mat('#e2e8f0'));
      flap.rotation.set(Math.PI, 0, Math.PI / 4);
      flap.scale.set(1, 1, 0.1);
      flap.position.set(0, 0.2, 0.05);
      env.add(flap);
      env.position.set(0, def.h + 1, 0);
      g.add(env);
      animated.push((t) => {
        env.position.y = def.h + 1 + Math.sin(t * 2) * 0.2;
        env.rotation.y = t * 1.2;
      });
      return { g, top: def.h + 2.4 };
    },
  };

  const pois = [];
  for (const z of zones) {
    const def = LAYOUT[z.id];
    const { g, top } = builders[z.id](def);
    g.position.set(def.x, 0, def.z);
    scene.add(g);
    g.traverse((o) => {
      if (o.isMesh) {
        o.userData.poi = z.id;
        pickables.push(o);
      }
    });
    grid.addRect(def.x, def.z, def.w, def.d);
    const trigger = def.trigger ?? { x: def.x, z: def.z + def.d / 2 + 1.8 };
    pois.push({ id: z.id, def: z, x: trigger.x, z: trigger.z, radius: 2.3, top, bx: def.x, bz: def.z, discovered: false });
  }

  // ---------- Markers (ring + light beam) ----------
  const ringGeo = new THREE.RingGeometry(0.95, 1.2, 40);
  const beamGeo = new THREE.CylinderGeometry(0.9, 0.9, 5, 20, 1, true);
  for (const p of pois) {
    const col = new THREE.Color(p.def.color);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(1.7), transparent: true, opacity: 0.95, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, 0.12, p.z);
    scene.add(ring);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    beam.position.set(p.x, 2.6, p.z);
    scene.add(beam);
    p.ring = ring;
    p.beam = beam;
    p.baseColor = col;
    animated.push((t) => {
      const s = 1 + Math.sin(t * 3 + p.x) * 0.08;
      ring.scale.set(s, s, 1);
    });
  }

  const doneColor = new THREE.Color('#4ade80');
  function markDiscovered(p) {
    p.discovered = true;
    p.ring.material.color.copy(doneColor).multiplyScalar(1.6);
    p.beam.material.color.copy(doneColor);
    p.beam.material.opacity = 0.08;
  }

  // ---------- Decor: lamps, benches, trees ----------
  const bulb = mat('#fff3c4', { emissive: '#ffe08a', intensity: 3 });
  const lampPole = mat('#2b3040');
  function lamp(x, z) {
    const g = new THREE.Group();
    g.add(box(0.12, 2.2, 0.12, lampPole, 0, 1.1, 0));
    g.add(box(0.5, 0.1, 0.1, lampPole, 0.2, 2.2, 0));
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), bulb);
    b.position.set(0.4, 2.12, 0);
    g.add(b);
    g.position.set(x, 0, z);
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    scene.add(g);
  }
  [[-2.4, -8], [2.4, -4], [-2.4, 0], [2.4, 4], [-2.4, 15.5], [2.4, 16.5], [-8, -9.3], [-18, -9.3], [14, -9.3], [-8, 3.7], [8, 3.7], [-8, 11.3], [8, 14.7]].forEach(([x, z]) => lamp(x, z));

  function bench(x, z, ry) {
    const g = new THREE.Group();
    g.add(box(1.6, 0.12, 0.5, mat('#8a5a3c'), 0, 0.5, 0));
    g.add(box(1.6, 0.4, 0.1, mat('#8a5a3c'), 0, 0.8, -0.22));
    g.add(box(0.1, 0.5, 0.45, mat('#2b3040'), -0.7, 0.25, 0));
    g.add(box(0.1, 0.5, 0.45, mat('#2b3040'), 0.7, 0.25, 0));
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    g.traverse((o) => o.isMesh && (o.castShadow = true));
    scene.add(g);
  }
  bench(-4.6, 7.5, Math.PI / 2);
  bench(4.6, 7.5, -Math.PI / 2);

  // Orbs first so trees avoid them
  const orbs = [];
  const orbGeo = new THREE.IcosahedronGeometry(0.38, 1);
  skills.forEach((s, i) => {
    const free = grid.nearestFree(ORB_SPOTS[i][0], ORB_SPOTS[i][1], false);
    const m = new THREE.Mesh(orbGeo, new THREE.MeshStandardMaterial({ color: s.color, emissive: s.color, emissiveIntensity: 1.6, flatShading: true, roughness: 0.3 }));
    m.position.set(free.x, 0.9, free.z);
    m.castShadow = true;
    scene.add(m);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.55, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.color).multiplyScalar(1.4), transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(free.x, 0.1, free.z);
    scene.add(halo);
    orbs.push({ mesh: m, halo, skill: s, x: free.x, z: free.z, collected: false, phase: i * 0.7 });
  });

  // Trees (instanced) placed on grid cells
  const nearRoad = (x, z, m) => ROADS.some((r) => Math.abs(x - r.x) < r.w / 2 + m && Math.abs(z - r.z) < r.d / 2 + m);
  const nearPoint = (x, z, list, d) => list.some((p) => Math.hypot(p.x - x, p.z - z) < d);
  const treeSpots = [];
  grid.finalize();
  for (let tries = 0; tries < 1400 && treeSpots.length < 120; tries++) {
    const cx = Math.floor(rand() * 60);
    const cz = Math.floor(rand() * 60);
    const x = Grid.center(cx);
    const z = Grid.center(cz);
    if (grid.padded[cz * 60 + cx]) continue;
    if (Math.abs(x) > HALF - 0.5 || Math.abs(z) > HALF - 0.5) continue;
    if (nearRoad(x, z, 1.2)) continue;
    if (nearPoint(x, z, pois, 3.2) || nearPoint(x, z, pois.map((p) => ({ x: p.bx, z: p.bz })), 7) || nearPoint(x, z, orbs, 1.6) || Math.hypot(x - SPAWN.x, z - SPAWN.z) < 3) continue;
    if (Math.hypot(x, z - 7.5) < 7.5) continue;
    const edge = Math.min(HALF - Math.abs(x), HALF - Math.abs(z));
    if (edge > 6 && rand() > 0.1) continue;
    if (treeSpots.some((t) => Math.hypot(t.x - x, t.z - z) < 2)) continue;
    treeSpots.push({ x, z, kind: rand() < 0.55 ? 0 : 1, s: 0.8 + rand() * 0.6, c: rand() });
  }
  const trunkM = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.14, 0.2, 1, 6), mat('#6b4a32'), treeSpots.length);
  const pineIdx = treeSpots.filter((t) => t.kind === 0);
  const roundIdx = treeSpots.filter((t) => t.kind === 1);
  const pineM = new THREE.InstancedMesh(new THREE.ConeGeometry(0.9, 2.6, 7), mat('#ffffff'), pineIdx.length * 2);
  const roundM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), mat('#ffffff'), roundIdx.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  let pi = 0;
  let ri = 0;
  treeSpots.forEach((t, i) => {
    dummy.rotation.set(0, 0, 0);
    dummy.position.set(t.x, 0.5 * t.s, t.z);
    dummy.scale.set(t.s, t.s, t.s);
    dummy.updateMatrix();
    trunkM.setMatrixAt(i, dummy.matrix);
    if (t.kind === 0) {
      for (let k = 0; k < 2; k++) {
        dummy.position.set(t.x, (1.7 + k * 1.1) * t.s, t.z);
        dummy.scale.set(t.s * (1 - k * 0.35), t.s * (1 - k * 0.15), t.s * (1 - k * 0.35));
        dummy.rotation.y = i;
        dummy.updateMatrix();
        pineM.setMatrixAt(pi, dummy.matrix);
        pineM.setColorAt(pi, color.set('#2f7a5a').offsetHSL(0, 0, (t.c - 0.5) * 0.08));
        pi++;
      }
    } else {
      dummy.position.set(t.x, 1.7 * t.s, t.z);
      dummy.scale.set(t.s * 1.05, t.s * 0.95, t.s * 1.05);
      dummy.rotation.y = i;
      dummy.updateMatrix();
      roundM.setMatrixAt(ri, dummy.matrix);
      roundM.setColorAt(ri, color.set(t.c > 0.75 ? '#e08a5a' : '#5fae5b').offsetHSL(0, 0, (t.c - 0.5) * 0.08));
      ri++;
    }
    grid.addRect(t.x, t.z, 0.9, 0.9);
  });
  for (const m of [trunkM, pineM, roundM]) {
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }

  // Flowers & rocks (decor only)
  const flowerCols = ['#f472b6', '#fbbf24', '#fb7185', '#a78bfa', '#f8fafc'];
  for (let i = 0; i < 160; i++) {
    const x = (rand() - 0.5) * 54;
    const z = (rand() - 0.5) * 54;
    if (grid.isPaddedAt(x, z) || nearRoad(x, z, 0.3) || Math.hypot(x, z - 7.5) < 6) continue;
    const f = box(0.14, 0.14, 0.14, mat(flowerCols[i % 5], { emissive: flowerCols[i % 5], intensity: 0.25 }), x, 0.12, z, { shadow: false });
    scene.add(f);
  }
  for (let i = 0; i < 18; i++) {
    const x = (rand() - 0.5) * 54;
    const z = (rand() - 0.5) * 54;
    if (grid.isPaddedAt(x, z) || nearRoad(x, z, 0.8) || nearPoint(x, z, pois, 3)) continue;
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25 + rand() * 0.25, 0), mat('#8b93a7'));
    r.position.set(x, 0.18, z);
    r.rotation.set(rand() * 3, rand() * 3, 0);
    r.castShadow = true;
    scene.add(r);
  }

  grid.finalize();

  return {
    grid,
    pois,
    orbs,
    pickables,
    markDiscovered,
    update(t) {
      for (const a of animated) a(t);
      for (const o of orbs) {
        if (o.collected) continue;
        o.mesh.position.y = 0.95 + Math.sin(t * 2 + o.phase) * 0.15;
        o.mesh.rotation.y = t * 1.5 + o.phase;
        const s = 1 + Math.sin(t * 3 + o.phase) * 0.1;
        o.halo.scale.set(s, s, 1);
      }
    },
    collect(o) {
      o.collected = true;
      o.mesh.visible = false;
      o.halo.visible = false;
    },
  };
}
