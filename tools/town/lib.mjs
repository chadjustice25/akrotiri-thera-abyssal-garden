// Geometry and raster helpers shared by the town tools (no dependencies).

// ---------------------------------------------------------------- numbers
// a small seeded generator (mulberry32): the same seed gives the same town
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
export const mix = (a, b, t) => a + (b - a) * t;
export const sstep = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
export const round = (v, q) => Math.round(v / q) * q;

// ---------------------------------------------------------------- polygons: arrays of [x, y]
export const area = (p) => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } return a / 2; }; // signed
export const centroid = (p) => { let a = 0, cx = 0, cy = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length], w = p[i][0] * q[1] - q[0] * p[i][1]; a += w; cx += (p[i][0] + q[0]) * w; cy += (p[i][1] + q[1]) * w; } return [cx / (3 * a), cy / (3 * a)]; };
export const perimeter = (p) => { let s = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; s += Math.hypot(q[0] - p[i][0], q[1] - p[i][1]); } return s; };
export const inPoly = (p, x, y) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c; };
export const bbox = (p) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const q of p) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); } return [x0, y0, x1, y1]; };
export const distSeg = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? clamp(((x - a[0]) * dx + (y - a[1]) * dy) / l, 0, 1) : 0; return Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t); };
export const distPoly = (p, x, y) => { let d = 1e9; for (let i = 0; i < p.length; i++) d = Math.min(d, distSeg(x, y, p[i], p[(i + 1) % p.length])); return d; }; // to the outline
// do two polygons overlap (edges cross, or one holds the other)?
const segX = (a, b, c, d) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
export const polysOverlap = (p, q) => {
  const a = bbox(p), b = bbox(q); if (a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]) return false;
  for (let i = 0; i < p.length; i++) for (let j = 0; j < q.length; j++) if (segX(p[i], p[(i + 1) % p.length], q[j], q[(j + 1) % q.length])) return true;
  return inPoly(q, p[0][0], p[0][1]) || inPoly(p, q[0][0], q[0][1]);
};
// the part of a convex polygon on the left of the line a -> b (keep = +1) or on its right (keep = -1), moved back by `gap`
export function clipHalf(p, a, b, keep, gap = 0) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l * keep, ny = dx / l * keep, out = [];
  const side = (q) => (q[0] - a[0]) * nx + (q[1] - a[1]) * ny - gap;
  for (let i = 0; i < p.length; i++) {
    const c = p[i], d = p[(i + 1) % p.length], sc = side(c), sd = side(d);
    if (sc >= 0) out.push(c);
    if ((sc >= 0) !== (sd >= 0)) { const t = sc / (sc - sd); out.push([c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t]); }
  }
  return out;
}
// Douglas-Peucker on a closed loop
export function simplify(loop, tol) {
  if (loop.length < 4) return loop;
  let ia = 0, ib = 0, far = -1;
  for (let i = 0; i < loop.length; i++) { const d = Math.hypot(loop[i][0] - loop[0][0], loop[i][1] - loop[0][1]); if (d > far) { far = d; ib = i; } }
  const dp = (pts) => {
    const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const st = [[0, pts.length - 1]];
    while (st.length) { const [s, e] = st.pop(); let m = -1, md = tol; for (let i = s + 1; i < e; i++) { const d = distSeg(pts[i][0], pts[i][1], pts[s], pts[e]); if (d > md) { md = d; m = i; } } if (m > 0) { keep[m] = 1; st.push([s, m], [m, e]); } }
    return pts.filter((_, i) => keep[i]);
  };
  const h1 = dp(loop.slice(ia, ib + 1)), h2 = dp([...loop.slice(ib), loop[ia]]);
  return [...h1.slice(0, -1), ...h2.slice(0, -1)];
}

// ---------------------------------------------------------------- rasters: Uint8Array masks of w x h
// exact squared Euclidean distance to the nearest set cell (Felzenszwalb and Huttenlocher), as Float32Array of distances
export function distanceTo(mask, w, h) {
  const INF = 1e12, g = new Float64Array(w * h), n = Math.max(w, h), f = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1), d = new Float64Array(n);
  const pass = (len) => {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) { let s; for (;;) { s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); if (s <= z[k]) k--; else break; } k++; v[k] = q; z[k] = s; z[k + 1] = INF; }
    k = 0; for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
  };
  for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = mask[y * w + x] ? 0 : INF; pass(h); for (let y = 0; y < h; y++) g[y * w + x] = d[y]; }
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = g[y * w + x]; pass(w); for (let x = 0; x < w; x++) out[y * w + x] = Math.sqrt(d[x]); }
  return out;
}
export const invert = (m) => m.map((v) => (v ? 0 : 1));
export const grow = (mask, w, h, r) => { const d = distanceTo(mask, w, h), o = new Uint8Array(w * h); for (let i = 0; i < o.length; i++) o[i] = d[i] <= r ? 1 : 0; return o; };
export const shrink = (mask, w, h, r) => invert(grow(invert(mask), w, h, r));
// fill everything not reachable from the border through unset cells
export function fillHoles(mask, w, h) {
  const out = new Uint8Array(w * h).fill(1), st = [];
  const push = (x, y) => { if (x >= 0 && y >= 0 && x < w && y < h && out[y * w + x] && !mask[y * w + x]) { out[y * w + x] = 0; st.push(x, y); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); } for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (st.length) { const y = st.pop(), x = st.pop(); push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  return out;
}
// The outlines of a mask as closed loops of pixel-corner points, set cells on the walker's right: outer edges of a
// shape run clockwise on the screen (y down) and the edges of its holes the other way. Each loop: [[x, y], ...].
export function outlines(mask, w, h) {
  const at = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] ? 1 : 0);
  // edges between a set cell and an unset one, as directed unit steps keyed by their start corner
  const W1 = w + 1, next = new Map();
  const add = (x0, y0, x1, y1) => { const k = y0 * W1 + x0; const a = next.get(k); if (a === undefined) next.set(k, [x1, y1]); else a.push(x1, y1); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (mask[y * w + x]) {
    if (!at(x, y - 1)) add(x, y, x + 1, y);           // top edge, walking east
    if (!at(x + 1, y)) add(x + 1, y, x + 1, y + 1);   // right edge, walking south
    if (!at(x, y + 1)) add(x + 1, y + 1, x, y + 1);   // bottom edge, walking west
    if (!at(x - 1, y)) add(x, y + 1, x, y);           // left edge, walking north
  }
  const loops = [];
  for (const [k0, a0] of next) {
    while (a0.length) {
      const sx = k0 % W1, sy = (k0 / W1) | 0, loop = []; let x = sx, y = sy, px = x, py = y - 1; // a made-up previous point; fixed below
      let a = a0, first = true;
      for (;;) {
        // at a corner where two outlines touch, turn right (keeps touching shapes apart)
        let pick = 0;
        if (a.length > 2 && !first) { const dx = x - px, dy = y - py; for (let i = 0; i < a.length; i += 2) if ((a[i] - x) === -dy && (a[i + 1] - y) === dx) pick = i; }
        const nx = a[pick], ny = a[pick + 1]; a.splice(pick, 2);
        if (!loop.length || !((x - px) === (nx - x) && (y - py) === (ny - y)) || first) loop.push([x, y]); // keep corners only
        first = false; px = x; py = y; x = nx; y = ny;
        if (x === sx && y === sy) break;
        a = next.get(y * W1 + x);
      }
      if (loop.length > 2) { const p = loop[loop.length - 1], q = loop[0], r = loop[1]; if ((q[0] - p[0]) * (r[1] - q[1]) === (q[1] - p[1]) * (r[0] - q[0])) loop.shift(); loops.push(loop); }
    }
  }
  return loops;
}
