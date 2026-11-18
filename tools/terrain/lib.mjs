// Shared helpers for the terrain tools: the local grid, resampling, filters, and PNG previews.
import { deflateSync } from 'node:zlib';

// The world's local frame: x east, z south, in metres from (LON0, LAT0); y up, 0 = the sea level of the world's year.
// Metres per degree at 36.405 N on WGS84 (series for the length of a degree; good to a few metres over 30 km).
export const LON0 = 25.405, LAT0 = 36.405, M_LON = 89706, M_LAT = 110966;
export const toX = (lon) => (lon - LON0) * M_LON, toZ = (lat) => (LAT0 - lat) * M_LAT;
export const toLon = (x) => LON0 + x / M_LON, toLat = (z) => LAT0 - z / M_LAT;

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const sstep = (a, b, x) => { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
export const mix = (a, b, t) => a + (b - a) * t;

// bilinear sample of a GeoTIFF read by tiff.mjs (pixel centres), clamped at its edges
export function sampleGeo(t, lon, lat) {
  const x = (lon - t.lon0) / t.dLon - 0.5, y = (t.lat0 - lat) / t.dLat - 0.5;
  const ix = clamp(Math.floor(x), 0, t.width - 2), iy = clamp(Math.floor(y), 0, t.height - 2), fx = clamp(x - ix, 0, 1), fy = clamp(y - iy, 0, 1), i = iy * t.width + ix;
  return (t.data[i] * (1 - fx) + t.data[i + 1] * fx) * (1 - fy) + (t.data[i + t.width] * (1 - fx) + t.data[i + t.width + 1] * fx) * fy;
}

// A square grid of N x N cells of `cell` metres, centred on the origin. Cell (i, j) has its centre at gx(i), gz(j); j = 0 is north.
export class Grid {
  constructor(N, cell, data) { this.N = N; this.cell = cell; this.d = data || new Float32Array(N * N); }
  gx(i) { return (i - this.N / 2 + 0.5) * this.cell; }
  gz(j) { return (j - this.N / 2 + 0.5) * this.cell; }
  fi(x) { return x / this.cell + this.N / 2 - 0.5; }
  clone() { return new Grid(this.N, this.cell, this.d.slice()); }
  at(i, j) { return this.d[clamp(j, 0, this.N - 1) * this.N + clamp(i, 0, this.N - 1)]; }
  // bilinear at a world position
  sample(x, z) {
    const u = this.fi(x), v = this.fi(z), i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j;
    return (this.at(i, j) * (1 - fu) + this.at(i + 1, j) * fu) * (1 - fv) + (this.at(i, j + 1) * (1 - fu) + this.at(i + 1, j + 1) * fu) * fv;
  }
}

// separable box blur, `r` cells each side, repeated `passes` times (three passes are close to a Gaussian)
export function blur(src, N, r, passes = 3) {
  let a = Float32Array.from(src), b = new Float32Array(N * N);
  for (let p = 0; p < passes; p++) {
    for (let j = 0; j < N; j++) { let s = 0; for (let i = -r; i <= r; i++) s += a[j * N + clamp(i, 0, N - 1)];
      for (let i = 0; i < N; i++) { b[j * N + i] = s / (2 * r + 1); s += a[j * N + clamp(i + r + 1, 0, N - 1)] - a[j * N + clamp(i - r, 0, N - 1)]; } }
    for (let i = 0; i < N; i++) { let s = 0; for (let j = -r; j <= r; j++) s += b[clamp(j, 0, N - 1) * N + i];
      for (let j = 0; j < N; j++) { a[j * N + i] = s / (2 * r + 1); s += b[clamp(j + r + 1, 0, N - 1) * N + i] - b[clamp(j - r, 0, N - 1) * N + i]; } }
  }
  return a;
}

// distance in cells from every cell to the nearest cell where mask is set (two-pass chamfer, 3-4 weights, /3)
export function distance(mask, N) {
  const d = new Float32Array(N * N).fill(1e9);
  for (let k = 0; k < N * N; k++) if (mask[k]) d[k] = 0;
  const pass = (j0, j1, dj, i0, i1, di) => { for (let j = j0; j !== j1; j += dj) for (let i = i0; i !== i1; i += di) { const k = j * N + i; let v = d[k];
    if (i - di >= 0 && i - di < N) v = Math.min(v, d[k - di] + 3);
    if (j - dj >= 0 && j - dj < N) { v = Math.min(v, d[k - dj * N] + 3); if (i - di >= 0 && i - di < N) v = Math.min(v, d[k - dj * N - di] + 4); if (i + di >= 0 && i + di < N) v = Math.min(v, d[k - dj * N + di] + 4); }
    d[k] = v; } };
  pass(0, N, 1, 0, N, 1); pass(N - 1, -1, -1, N - 1, -1, -1);
  for (let k = 0; k < N * N; k++) d[k] /= 3;
  return d;
}

// point in polygon (even-odd), pts = [[x, z], ...]
export function inPoly(pts, x, z) {
  let c = false;
  for (let a = 0, b = pts.length - 1; a < pts.length; b = a++) { const [xa, za] = pts[a], [xb, zb] = pts[b]; if ((za > z) !== (zb > z) && x < (xb - xa) * (z - za) / (zb - za) + xa) c = !c; }
  return c;
}
// distance from a point to a polyline, and the fraction along it (0..1 by vertex index) of the nearest point
export function distPolyline(pts, x, z, closed = false) {
  let best = 1e18, bt = 0; const n = pts.length, m = closed ? n : n - 1;
  for (let a = 0; a < m; a++) { const [xa, za] = pts[a], [xb, zb] = pts[(a + 1) % n], dx = xb - xa, dz = zb - za; const t = clamp(((x - xa) * dx + (z - za) * dz) / (dx * dx + dz * dz || 1), 0, 1), ex = xa + dx * t - x, ez = za + dz * t - z, d = ex * ex + ez * ez; if (d < best) { best = d; bt = a + t; } }
  return [Math.sqrt(best), bt];
}

// deterministic value noise (integer hash), for the modelled relief of restored land
const ih = (x, y, s) => { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
export function vnoise(x, y, s = 0) {
  const ix = Math.floor(x), iy = Math.floor(y); let fx = x - ix, fy = y - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  return mix(mix(ih(ix, iy, s), ih(ix + 1, iy, s), fx), mix(ih(ix, iy + 1, s), ih(ix + 1, iy + 1, s), fx), fy);
}
export function fbm(x, y, oct = 4, s = 0) { let a = 0.5, v = 0; for (let o = 0; o < oct; o++) { v += a * vnoise(x, y, s + o * 17); x = x * 2.03 + 11.3; y = y * 2.03 + 7.7; a *= 0.5; } return v / (1 - 2 * a); }

// ---------------------------------------------------------------- PNG previews (for looking at the result; not part of the output)
const crcT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
export function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; Buffer.from(rgb.buffer, rgb.byteOffset + y * w * 3, w * 3).copy(raw, y * (w * 3 + 1) + 1); }
  const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8); b.writeUInt32BE(crc(b.subarray(4, 8 + data.length)), 8 + data.length); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}
// shaded relief of a height grid, tinted by height (sea blue by depth, land ochre to white), with optional overlay(i, j) -> [r,g,b,a] | null
// and a graticule every `grat` degrees. crop = [i0, j0, i1, j1] in cells, zoom = pixels per cell.
export function relief(g, { crop, zoom = 1, overlay, grat = 0.02, sea = 0 } = {}) {
  const [i0, j0, i1, j1] = crop || [0, 0, g.N, g.N], w = (i1 - i0) * zoom, h = (j1 - j0) * zoom, out = new Uint8Array(w * h * 3);
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const i = i0 + Math.floor(px / zoom), j = j0 + Math.floor(py / zoom), v = g.at(i, j);
    const dx = (g.at(i + 1, j) - g.at(i - 1, j)) / (2 * g.cell), dz = (g.at(i, j + 1) - g.at(i, j - 1)) / (2 * g.cell);
    const l = 1 / Math.hypot(dx, 1, dz), sh = clamp((-dx * -0.6 + 0.65 + -dz * -0.5) * l, 0, 1.2); // light from the north-west
    let c;
    if (v <= sea) { const t = clamp(-(v - sea) / 400, 0, 1), s = clamp(-(v - sea) / 12, 0, 1); c = [mix(150, mix(60, 10, t), s), mix(215, mix(120, 30, t), s), mix(225, mix(190, 90, t), s)]; c = c.map((x) => x * (0.75 + 0.25 * sh)); }
    else { const t = clamp(v / 560, 0, 1); c = [mix(196, 250, t), mix(176, 246, t), mix(128, 240, t)].map((x) => x * (0.25 + 0.75 * sh)); }
    const o = overlay && overlay(i, j, px, py); if (o) c = c.map((x, k) => mix(x, o[k], o[3]));
    if (grat) { const lon = toLon(g.gx(i)), lat = toLat(g.gz(j)), lon2 = toLon(g.gx(i + 1)), lat2 = toLat(g.gz(j + 1)); if ((Math.floor(lon / grat) !== Math.floor(lon2 / grat) || Math.floor(lat / grat) !== Math.floor(lat2 / grat)) && px % zoom === 0 && py % zoom === 0) c = c.map((x) => x * 0.6); }
    const k = (py * w + px) * 3; out[k] = clamp(c[0], 0, 255); out[k + 1] = clamp(c[1], 0, 255); out[k + 2] = clamp(c[2], 0, 255);
  }
  return png(w, h, out);
}
