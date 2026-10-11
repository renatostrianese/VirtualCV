import * as THREE from 'three';

const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0, ...extra });

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// Low-poly avatar: khaki pants, black sweater, salt-and-pepper hair and beard.
export function createAvatar() {
  const skin = std('#d3a07a');
  const sweater = std('#17171c');
  const sweaterRib = std('#26262e');
  const khaki = std('#b9a77b');
  const shoe = std('#3b2c22');
  const hair = std('#6e655b');
  const hairLight = std('#9a948c');
  const beardMat = std('#8d8a86');
  const beardDark = std('#4a4642');
  const dark = std('#1b1410');

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const makeLeg = (x) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.62, 0);
    pivot.add(box(0.24, 0.52, 0.26, khaki, 0, -0.27, 0));
    pivot.add(box(0.26, 0.12, 0.38, shoe, 0, -0.56, 0.05));
    body.add(pivot);
    return pivot;
  };
  const legL = makeLeg(-0.15);
  const legR = makeLeg(0.15);

  body.add(box(0.62, 0.56, 0.34, sweater, 0, 0.9, 0));
  body.add(box(0.64, 0.08, 0.36, sweaterRib, 0, 0.64, 0));
  body.add(box(0.3, 0.07, 0.22, sweaterRib, 0, 1.2, 0));

  const makeArm = (x) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 1.12, 0);
    pivot.add(box(0.17, 0.5, 0.2, sweater, 0, -0.25, 0));
    pivot.add(box(0.18, 0.06, 0.22, sweaterRib, 0, -0.5, 0));
    pivot.add(box(0.14, 0.14, 0.16, skin, 0, -0.6, 0));
    body.add(pivot);
    return pivot;
  };
  const armL = makeArm(-0.4);
  const armR = makeArm(0.4);

  const head = new THREE.Group();
  head.position.set(0, 1.25, 0);
  body.add(head);
  head.add(box(0.2, 0.1, 0.2, skin, 0, 0, 0));
  head.add(box(0.44, 0.44, 0.42, skin, 0, 0.3, 0));
  head.add(box(0.48, 0.12, 0.46, hair, 0, 0.58, -0.01));
  head.add(box(0.46, 0.1, 0.1, hairLight, 0, 0.52, 0.18));
  head.add(box(0.05, 0.2, 0.4, hairLight, -0.235, 0.42, 0));
  head.add(box(0.05, 0.2, 0.4, hairLight, 0.235, 0.42, 0));
  head.add(box(0.48, 0.3, 0.1, hair, 0, 0.45, -0.2));
  head.add(box(0.46, 0.2, 0.08, beardMat, 0, 0.12, 0.2));
  head.add(box(0.05, 0.2, 0.3, beardMat, -0.235, 0.17, 0.05));
  head.add(box(0.05, 0.2, 0.3, beardMat, 0.235, 0.17, 0.05));
  head.add(box(0.26, 0.04, 0.06, beardDark, 0, 0.24, 0.22));
  head.add(box(0.12, 0.05, 0.04, std('#b8745f'), 0, 0.17, 0.215));
  head.add(box(0.07, 0.07, 0.03, dark, -0.1, 0.35, 0.212));
  head.add(box(0.07, 0.07, 0.03, dark, 0.1, 0.35, 0.212));
  head.add(box(0.12, 0.03, 0.03, dark, -0.1, 0.42, 0.212));
  head.add(box(0.12, 0.03, 0.03, dark, 0.1, 0.42, 0.212));

  root.scale.setScalar(0.95);

  let phase = 0;
  let amount = 0;
  return {
    group: root,
    // speed01: 0 idle .. 1 full run
    update(dt, speed01, time) {
      amount += (speed01 - amount) * Math.min(1, dt * 12);
      phase += dt * (6 + 6 * speed01);
      const s = Math.sin(phase) * 0.8 * amount;
      legL.rotation.x = s;
      legR.rotation.x = -s;
      armL.rotation.x = -s * 0.9;
      armR.rotation.x = s * 0.9;
      body.position.y = Math.abs(Math.cos(phase)) * 0.06 * amount + Math.sin(time * 2) * 0.008 * (1 - amount);
      head.rotation.z = Math.sin(time * 1.5) * 0.03 * (1 - amount);
    },
  };
}
