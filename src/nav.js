// Grid-based collision + A* pathfinding on a 1-unit grid centered on the origin.
export const SIZE = 60;
export const HALF = SIZE / 2;

export class Grid {
  constructor() {
    this.blocked = new Uint8Array(SIZE * SIZE);
    this.padded = new Uint8Array(SIZE * SIZE);
  }

  static cell(v) {
    return Math.floor(v + HALF);
  }

  static center(c) {
    return c - HALF + 0.5;
  }

  inBounds(cx, cz) {
    return cx >= 0 && cz >= 0 && cx < SIZE && cz < SIZE;
  }

  // Block a rectangle given by its center and size (world units).
  addRect(x, z, w, d) {
    const x0 = Math.floor(x - w / 2 + HALF + 1e-6);
    const x1 = Math.ceil(x + w / 2 + HALF - 1e-6) - 1;
    const z0 = Math.floor(z - d / 2 + HALF + 1e-6);
    const z1 = Math.ceil(z + d / 2 + HALF - 1e-6) - 1;
    for (let cz = z0; cz <= z1; cz++) for (let cx = x0; cx <= x1; cx++) if (this.inBounds(cx, cz)) this.blocked[cz * SIZE + cx] = 1;
  }

  // Must be called after all obstacles are added.
  finalize() {
    this.padded.fill(0);
    for (let cz = 0; cz < SIZE; cz++) {
      for (let cx = 0; cx < SIZE; cx++) {
        if (!this.blocked[cz * SIZE + cx]) continue;
        for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const nz = cz + dz;
          if (this.inBounds(nx, nz)) this.padded[nz * SIZE + nx] = 1;
        }
      }
    }
  }

  isBlockedAt(x, z) {
    const cx = Grid.cell(x);
    const cz = Grid.cell(z);
    return !this.inBounds(cx, cz) || this.blocked[cz * SIZE + cx] === 1;
  }

  isPaddedAt(x, z) {
    const cx = Grid.cell(x);
    const cz = Grid.cell(z);
    return !this.inBounds(cx, cz) || this.padded[cz * SIZE + cx] === 1;
  }

  // Circle (approximated with its 4 extreme points) vs blocked cells.
  collides(x, z, r) {
    return this.isBlockedAt(x - r, z - r) || this.isBlockedAt(x + r, z - r) || this.isBlockedAt(x - r, z + r) || this.isBlockedAt(x + r, z + r);
  }

  nearestFree(x, z, padded = true) {
    const sx = Math.min(SIZE - 1, Math.max(0, Grid.cell(x)));
    const sz = Math.min(SIZE - 1, Math.max(0, Grid.cell(z)));
    const arr = padded ? this.padded : this.blocked;
    const seen = new Set([sz * SIZE + sx]);
    const q = [[sx, sz]];
    while (q.length) {
      const [cx, cz] = q.shift();
      if (!arr[cz * SIZE + cx]) return { x: Grid.center(cx), z: Grid.center(cz) };
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx;
        const nz = cz + dz;
        const k = nz * SIZE + nx;
        if (this.inBounds(nx, nz) && !seen.has(k)) {
          seen.add(k);
          q.push([nx, nz]);
        }
      }
    }
    return null;
  }

  lineClear(a, b) {
    const dist = Math.hypot(b.x - a.x, b.z - a.z);
    const n = Math.ceil(dist / 0.25);
    for (let i = 0; i <= n; i++) {
      const f = n === 0 ? 0 : i / n;
      if (this.isPaddedAt(a.x + (b.x - a.x) * f, a.z + (b.z - a.z) * f)) return false;
    }
    return true;
  }

  findPath(sx, sz, tx, tz) {
    const start = this.nearestFree(sx, sz);
    const goal = this.nearestFree(tx, tz);
    if (!start || !goal) return null;
    const s = { cx: Grid.cell(start.x), cz: Grid.cell(start.z) };
    const g = { cx: Grid.cell(goal.x), cz: Grid.cell(goal.z) };
    const key = (cx, cz) => cz * SIZE + cx;
    const h = (cx, cz) => Math.hypot(cx - g.cx, cz - g.cz);
    const gScore = new Map([[key(s.cx, s.cz), 0]]);
    const came = new Map();
    const open = [{ cx: s.cx, cz: s.cz, f: h(s.cx, s.cz) }];
    const closed = new Set();
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
      const cur = open.splice(bi, 1)[0];
      const ck = key(cur.cx, cur.cz);
      if (closed.has(ck)) continue;
      closed.add(ck);
      if (cur.cx === g.cx && cur.cz === g.cz) {
        const raw = [{ x: goal.x, z: goal.z }];
        let k = ck;
        while (came.has(k)) {
          k = came.get(k);
          raw.push({ x: Grid.center(k % SIZE), z: Grid.center(Math.floor(k / SIZE)) });
        }
        raw.reverse();
        return this.smooth([{ x: sx, z: sz }, ...raw.slice(1)]).slice(1);
      }
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = cur.cx + dx;
          const nz = cur.cz + dz;
          if (!this.inBounds(nx, nz) || this.padded[key(nx, nz)]) continue;
          if (dx && dz && (this.padded[key(cur.cx + dx, cur.cz)] || this.padded[key(cur.cx, cur.cz + dz)])) continue;
          const tg = gScore.get(ck) + (dx && dz ? 1.414 : 1);
          const nk = key(nx, nz);
          if (tg < (gScore.get(nk) ?? Infinity)) {
            gScore.set(nk, tg);
            came.set(nk, ck);
            open.push({ cx: nx, cz: nz, f: tg + h(nx, nz) });
          }
        }
      }
    }
    return null;
  }

  smooth(path) {
    const out = [path[0]];
    let i = 0;
    while (i < path.length - 1) {
      let j = path.length - 1;
      while (j > i + 1 && !this.lineClear(path[i], path[j])) j--;
      out.push(path[j]);
      i = j;
    }
    return out;
  }
}
