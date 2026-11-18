// The compact form of the terrain: heights in UNIT metres and a rock class per cell, predicted from the cells already
// stored and written with an adaptive binary range coder. Two layers: a coarse grid of the whole square (sea floor
// included), and the full-resolution cells only where the coarse grid is land or shallow water; deep water is the coarse
// grid interpolated. The step between storable heights grows with the local slope and with depth, so cliffs and deep
// water cost little and flat ground near the shore stays exact to half a metre.
// decodeTerrain() here is the reference; the page's copy (source/src/world.js, between the terrain-decoder marks) must
// give the same grid, and build.mjs checks that it does.
export const UNIT = 0.25;
const MIN_COARSE = 4, MIN_FINE = 2, SHALLOW = -60; // steps in UNITs; full resolution is kept above -15 m

class Enc {
  constructor() { this.low = 0; this.range = 0xffffffff; this.cache = 0; this.cacheSize = 1; this.out = []; }
  shift() {
    if (this.low < 0xff000000 || this.low >= 0x100000000) { const carry = this.low >= 0x100000000 ? 1 : 0; let t = this.cache; do { this.out.push((t + carry) & 255); t = 255; } while (--this.cacheSize); this.cache = Math.floor(this.low / 16777216) & 255; }
    this.cacheSize++; this.low = (this.low % 16777216) * 256;
  }
  bit(p, i, b) {
    const bound = (this.range >>> 11) * p[i];
    if (!b) { this.range = bound; p[i] += (2048 - p[i]) >> 4; } else { this.low += bound; this.range -= bound; p[i] -= p[i] >> 4; }
    while (this.range < 16777216) { this.range *= 256; this.shift(); }
    return b;
  }
  end() { for (let i = 0; i < 5; i++) this.shift(); return Uint8Array.from(this.out); }
}
class Dec {
  constructor(b, pos) { this.b = b; this.pos = pos + 1; this.range = 0xffffffff; this.code = 0; for (let i = 0; i < 4; i++) this.code = this.code * 256 + b[this.pos++]; }
  bit(p, i) {
    const bound = (this.range >>> 11) * p[i]; let b = 0;
    if (this.code < bound) { this.range = bound; p[i] += (2048 - p[i]) >> 4; } else { this.code -= bound; this.range -= bound; p[i] -= p[i] >> 4; b = 1; }
    while (this.range < 16777216) { this.range *= 256; this.code = this.code * 256 + (this.b[this.pos++] || 0); }
    return b;
  }
}

// One pass over the data, the same for writing (c is an Enc, tgt and rockT given) and reading (c is a Dec).
function walk(c, N, CF, tgt, rockT) {
  const prob = (n) => new Uint16Array(n).fill(1024), Zp = prob(8), Sp = prob(8), Gp = prob(160), Mp = prob(40), Rp = prob(16);
  const res = (cx, r) => { // a signed residual: zero flag, sign, then magnitude - 1 as an Exp-Golomb code
    if (!c.bit(Zp, cx, r ? 1 : 0)) return 0;
    const neg = c.bit(Sp, cx, r < 0 ? 1 : 0), v = r < 0 ? -r : r; let n = 0;
    if (tgt) { n = 31 - Math.clz32(v); for (let i = 0; i < n; i++) c.bit(Gp, cx * 20 + i, 1); c.bit(Gp, cx * 20 + n, 0); } else while (c.bit(Gp, cx * 20 + n)) n++;
    let m = 1; for (let i = n - 1; i >= 0; i--) m = m * 2 + c.bit(Mp, n * 2 + (i === n - 1 ? 0 : 1), (v >> i) & 1);
    return neg ? -m : m;
  };
  const layer = (a, n, mask, minStep, want) => {
    for (let j = 0, k = 0; j < n; j++) for (let i = 0; i < n; i++, k++) {
      if (mask && !mask[k]) continue;
      const L = i ? a[k - 1] : j ? a[k - n] : 0, U = j ? a[k - n] : L, UL = i && j ? a[k - n - 1] : j ? U : L, UR = j && i < n - 1 ? a[k - n + 1] : U;
      const pred = L + U - UL, act = Math.abs(L - UL) + Math.abs(U - UL) + Math.abs(UR - U);
      let step = ((act + 9) / 18) | 0; const deep = pred < 0 ? (-pred / 20) | 0 : 0; if (deep > step) step = deep; step = step < minStep ? minStep : step > 255 ? 255 : step;
      const cx = Math.min(7, 31 - Math.clz32(1 + ((act / step) | 0)));
      a[k] = pred + res(cx, want ? Math.round((want(k) - pred) / step) : 0) * step;
    }
  };
  const NC = N / CF, co = new Int32Array(NC * NC), q = new Int32Array(N * N), rock = new Uint8Array(N * N);
  layer(co, NC, null, MIN_COARSE, tgt && ((k) => { let s = 0; const I = k % NC, J = (k / NC) | 0; for (let b = 0; b < CF; b++) for (let a = 0; a < CF; a++) s += tgt[(J * CF + b) * N + I * CF + a]; return s / (CF * CF); }));
  // the coarse grid interpolated to every cell (integer weights, so the reader gets the same numbers), and the cells kept at full resolution
  const mask = new Uint8Array(N * N), cAt = (I, J) => co[(J < 0 ? 0 : J >= NC ? NC - 1 : J) * NC + (I < 0 ? 0 : I >= NC ? NC - 1 : I)];
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const u = 2 * i + 1 - CF, v = 2 * j + 1 - CF, I = Math.floor(u / (2 * CF)), J = Math.floor(v / (2 * CF)), fu = u - I * 2 * CF, fv = v - J * 2 * CF;
    q[k] = Math.round(((cAt(I, J) * (2 * CF - fu) + cAt(I + 1, J) * fu) * (2 * CF - fv) + (cAt(I, J + 1) * (2 * CF - fu) + cAt(I + 1, J + 1) * fu) * fv) / (4 * CF * CF));
    const ci = (i / CF) | 0, cj = (j / CF) | 0; let top = -1e9; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) top = Math.max(top, cAt(ci + a, cj + b));
    mask[k] = top > SHALLOW ? 1 : 0;
  }
  layer(q, N, mask, MIN_FINE, tgt && ((k) => tgt[k]));
  // rock classes: "same as the cell before" or a 3-bit class
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const left = i ? rock[k - 1] : j ? rock[k - N] : 0, up = j ? rock[k - N] : left, cx = up === left ? 0 : 1;
    if (!c.bit(Rp, cx, rockT ? (rockT[k] !== left ? 1 : 0) : 0)) { rock[k] = left; continue; }
    let node = 1; for (let b = 2; b >= 0; b--) node = node * 2 + c.bit(Rp, 4 + node, rockT ? (rockT[k] >> b) & 1 : 0);
    rock[k] = node - 8;
  }
  return { q, rock, mask };
}

export function decodeTerrain(bytes) {
  const N = bytes[0] * 16, CF = bytes[1], { q, rock } = walk(new Dec(bytes, 2), N, CF, null, null);
  return { N, CF, q, rock };
}

// heights: Float32Array of N*N metres; rockT: Uint8Array of classes 0-7. Returns the bytes, what a reader will get back, and the error.
export function encodeTerrain(heights, rockT, N, CF) {
  const tgt = Float64Array.from(heights, (v) => v / UNIT), enc = new Enc(), w = walk(enc, N, CF, tgt, rockT), body = enc.end();
  const bytes = new Uint8Array(body.length + 2); bytes[0] = N / 16; bytes[1] = CF; bytes.set(body, 2);
  const back = decodeTerrain(bytes);
  for (let k = 0; k < N * N; k++) if (back.q[k] !== w.q[k] || back.rock[k] !== rockT[k]) throw new Error('codec: the decoder does not give back what was written, at cell ' + k);
  let maxErrLand = 0, maxErrSea = 0, sse = 0, nl = 0, fineStored = 0; const decoded = new Float32Array(N * N);
  for (let k = 0; k < N * N; k++) {
    decoded[k] = w.q[k] * UNIT; fineStored += w.mask[k]; const e = Math.abs(decoded[k] - heights[k]);
    if (heights[k] > 0) { nl++; sse += e * e; if (e > maxErrLand) maxErrLand = e; } else if (e > maxErrSea) maxErrSea = e;
  }
  return { bytes, decoded, q: w.q, fineStored, maxErrLand, maxErrSea, rmsLand: Math.sqrt(sse / Math.max(nl, 1)) };
}
