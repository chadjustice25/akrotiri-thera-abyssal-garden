// ============================================================================
// the world: Thera's terrain data, the sun over it, the sea's waves, the meshes (load-time only unless noted)
// ============================================================================
// The frame: x east, z south, y up, in metres. The origin is 36.405 N, 25.405 E and y = 0 is the sea level of 1615 BCE.
// The terrain itself comes from terrain-data.js, which tools/terrain/build.mjs writes (docs/terrain/README.md).
const DOM = 25600; // side of the square the terrain data covers: 640 cells of 40 m

// <terrain-decoder> (tools/terrain/build.mjs runs this text against its own reader, so keep it self-contained)
// The data is two layers of predicted heights, in units of 0.25 m, behind an adaptive binary range coder: a coarse grid
// of the whole square, then the full-resolution cells wherever the coarse grid is land or shallow water. See
// tools/terrain/codec.mjs for the writer and the reasons.
function decodeTerrain(b) {
  const N = b[0] * 16, CF = b[1], NC = N / CF, co = new Int32Array(NC * NC), q = new Int32Array(N * N), rock = new Uint8Array(N * N), mask = new Uint8Array(N * N);
  let pos = 3, range = 0xffffffff, code = 0;
  for (let i = 0; i < 4; i++) code = code * 256 + b[pos++];
  const prob = (n) => new Uint16Array(n).fill(1024), Zp = prob(8), Sp = prob(8), Gp = prob(160), Mp = prob(40), Rp = prob(16);
  const bit = (p, i) => {
    const bound = (range >>> 11) * p[i]; let r = 0;
    if (code < bound) { range = bound; p[i] += (2048 - p[i]) >> 4; } else { code -= bound; range -= bound; p[i] -= p[i] >> 4; r = 1; }
    while (range < 16777216) { range *= 256; code = code * 256 + (b[pos++] || 0); }
    return r;
  };
  const res = (cx) => {
    if (!bit(Zp, cx)) return 0;
    const neg = bit(Sp, cx); let n = 0, m = 1;
    while (bit(Gp, cx * 20 + n)) n++;
    for (let i = n - 1; i >= 0; i--) m = m * 2 + bit(Mp, n * 2 + (i === n - 1 ? 0 : 1));
    return neg ? -m : m;
  };
  const layer = (a, n, mk, minStep) => {
    for (let j = 0, k = 0; j < n; j++) for (let i = 0; i < n; i++, k++) {
      if (mk && !mk[k]) continue;
      const L = i ? a[k - 1] : j ? a[k - n] : 0, U = j ? a[k - n] : L, UL = i && j ? a[k - n - 1] : j ? U : L, UR = j && i < n - 1 ? a[k - n + 1] : U;
      const pred = L + U - UL, act = Math.abs(L - UL) + Math.abs(U - UL) + Math.abs(UR - U);
      let step = ((act + 9) / 18) | 0; const deep = pred < 0 ? (-pred / 20) | 0 : 0; if (deep > step) step = deep; step = step < minStep ? minStep : step > 255 ? 255 : step;
      a[k] = pred + res(Math.min(7, 31 - Math.clz32(1 + ((act / step) | 0)))) * step;
    }
  };
  layer(co, NC, null, 4);
  const cAt = (I, J) => co[(J < 0 ? 0 : J >= NC ? NC - 1 : J) * NC + (I < 0 ? 0 : I >= NC ? NC - 1 : I)];
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const u = 2 * i + 1 - CF, v = 2 * j + 1 - CF, I = Math.floor(u / (2 * CF)), J = Math.floor(v / (2 * CF)), fu = u - I * 2 * CF, fv = v - J * 2 * CF;
    q[k] = Math.round(((cAt(I, J) * (2 * CF - fu) + cAt(I + 1, J) * fu) * (2 * CF - fv) + (cAt(I, J + 1) * (2 * CF - fu) + cAt(I + 1, J + 1) * fu) * fv) / (4 * CF * CF));
    const ci = (i / CF) | 0, cj = (j / CF) | 0; let top = -1e9; for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) top = Math.max(top, cAt(ci + x, cj + y));
    mask[k] = top > -60 ? 1 : 0;
  }
  layer(q, N, mask, 2);
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const left = i ? rock[k - 1] : j ? rock[k - N] : 0, up = j ? rock[k - N] : left;
    if (!bit(Rp, up === left ? 0 : 1)) { rock[k] = left; continue; }
    let node = 1; for (let c = 2; c >= 0; c--) node = node * 2 + bit(Rp, 4 + node);
    rock[k] = node - 8;
  }
  return { N, q, rock };
}
// </terrain-decoder>

// ---------------------------------------------------------------- the sun
// Thera is at 36.4 N. The day is a liberty (docs/terrain/README.md, T-L9): late May, given as the sun's ecliptic longitude
// of 65 degrees, with the tilt of the Earth's axis as it was around 1615 BCE (23.89 degrees, from Laskar's 1986 series).
// Time is local solar time: the sun is due south at 12.
const LAT = 36.4 * PI / 180, DECL = asin(sin(23.89 * PI / 180) * sin(65 * PI / 180));
// direction to the sun at `hour` into out[0..2]; returns its height above the horizon in radians
function sunAt(hour, out) {
  const H = (hour - 12) * PI / 12, sa = sin(LAT) * sin(DECL) + cos(LAT) * cos(DECL) * cos(H);
  out[0] = -cos(DECL) * sin(H); out[1] = sa; out[2] = -(cos(LAT) * sin(DECL) - sin(LAT) * cos(DECL) * cos(H)); // east, up, south
  return asin(sa);
}
// the moments the T key and the menu step through: name, solar hour
const TIMES = [['Dawn', 5.02], ['Noon', 12], ['Afternoon', 15.7], ['Golden', 18.35], ['Dusk', 19.5], ['Night', 23.5]];
// How fresh the breeze is through the day, 0 calm to 1 breezy: calm mornings and a north wind that builds in the afternoon,
// the daily pattern of today's summer Etesians carried back (T1#50, grade C; T-L10).
const WIND = [0.12, 0.1, 0.1, 0.12, 0.3, 0.55, 0.85, 0.6, 0.25, 0.12]; // every 2.4 h from midnight
const windAt = (hour) => { const u = hour / 2.4, i = floor(u) % 10; return mix(WIND[i], WIND[(i + 1) % 10], u - floor(u)); };

// ---------------------------------------------------------------- the air (the same numbers go into the shaders)
// Rayleigh and ozone as in Hillaire 2020; the haze (Mie) is set for a clear Aegean summer day and is a liberty (T-L11).
const RE = 6371e3, RA = 6471e3, HR = 8000, HM = 1200, BR = [5.802e-6, 13.558e-6, 33.1e-6], BM = 2.1e-5, BME = BM * 1.11, BO = [0.65e-6, 1.881e-6, 0.085e-6];
const SUNE = 3.3; // sunlight above the air, in the scene's units
// sunlight reaching sea level from a sun `el` radians above the horizon, into out[0..2]
function sunLight(el, out) {
  // the path through the air, from just above the sea; a sun under the horizon is cut off by the Earth
  const dy = sin(el), dx = cos(el), y0 = RE + 20; let oR = 0, oM = 0, oO = 0;
  const b = y0 * dy, tTop = -b + sqrt(b * b - y0 * y0 + RA * RA), hit = b < 0 && b * b - y0 * y0 + RE * RE > 0;
  for (let i = 0; i < 40; i++) {
    const t = tTop * (i + 0.5) / 40, h = hypot(dx * t, y0 + dy * t) - RE, ds = tTop / 40;
    oR += exp(-h / HR) * ds; oM += exp(-h / HM) * ds; oO += max(0, 1 - abs(h - 25000) / 15000) * ds;
  }
  const up = hit ? 0 : sstep(-0.012, 0.004, el); // the disc clears the horizon
  for (let c = 0; c < 3; c++) out[c] = SUNE * up * exp(-(BR[c] * oR + BME * oM + BO[c] * oO));
}

// ---------------------------------------------------------------- the sea's waves (read by the shaders and by the camera)
// NWAVE waves, longest first: [dir x, dir z, wavenumber, amplitude], [angular speed, phase, steepness, 0]. They run before a
// north wind, the long ones nearly straight south and the short ones fanned out. Amplitudes are for a breezy sea; the
// shaders and seaAt() scale them down for a calm one.
const NWAVE = 24, WAVES = new Float32Array(NWAVE * 8);
{
  _seed = 1615;
  for (let i = 0; i < NWAVE; i++) {
    const lam = 64 * pow(0.82, i) * rr(0.92, 1.08), k = TAU / lam, a = rr(-1, 1) * (0.35 + 0.035 * i), A = 0.0125 * pow(lam, 0.75) * exp(-lam * lam / 3000) * rr(0.8, 1.2);
    WAVES.set([sin(a), cos(a), k, A, sqrt(9.81 * k), rr(0, TAU), 0.55 / (k * A * NWAVE) * min(1, i / 3 + 0.4), 0], i * 8);
  }
}
const NWG = 12; // the waves that move the surface mesh; the shorter ones only tilt its shading
// height of the sea surface at (x, z) and time t, over water `dep` metres deep, with breeze w (per frame: no allocations)
function seaAt(x, z, t, dep, w) {
  let h = 0; const amp = 0.22 + w;
  for (let i = 0; i < NWG; i++) { const o = i * 8, k = WAVES[o + 2]; h += WAVES[o + 3] * amp * clamp(dep * k * 0.6, 0.1, 1) * sin((WAVES[o] * x + WAVES[o + 1] * z) * k - WAVES[o + 4] * t + WAVES[o + 5]); }
  return h;
}

// ---------------------------------------------------------------- the meshes
// One square grid of GN x GN cells serves every ring of the terrain and of the sea: level L draws it with cells of 2^L m
// around the camera. Vertices are grid coordinates; the vertex shader places and blends them (W_TERR).
// LK: a point d metres from the camera is drawn at level log2(d / LK), so level L's ring is fully blended into level L+1
// by the time its mesh ends.
const LK = GN / 4.8;
const TLV = Math.ceil(log2(45000 / (GN / 2))) + 1, SLV = Math.ceil(log2(600000 / (GN / 2))) + 1; // levels of terrain, of sea
function gridMesh() {
  const n = GN + 1, v = new Int16Array(n * n * 2), full = [], ring = [], h = GN / 4 - 2;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { v[(j * n + i) * 2] = i - GN / 2; v[(j * n + i) * 2 + 1] = j - GN / 2; }
  for (let j = 0; j < GN; j++) for (let i = 0; i < GN; i++) {
    const a = j * n + i, b = a + 1, c = a + n, d = c + 1, x = i - GN / 2, z = j - GN / 2;
    full.push(a, c, b, b, c, d);
    if (!(x >= -h && x < h && z >= -h && z < h)) ring.push(a, c, b, b, c, d); // the middle belongs to the finer level
  }
  return { v, idx: new Uint16Array([...full, ...ring]), nFull: full.length, nRing: ring.length };
}

// ---------------------------------------------------------------- viewpoints (keys 1-6): position and look-at
// y is metres above the ground (or above the sea surface, where the ground is under water); a negative y is a depth below
// the surface. main.js turns it into a height once the terrain is built.
const POSES = [
  [-40, 2.6, 6900, -135, 30, 5937],        // 1 the Akrotiri terrace from the sea to its south
  [-250, 6, 1345, -1250, 40, -2500],       // 2 the north bay and Pre-Kameni (a modern label) from the ring rim
  [300, 9200, 13800, -300, 0, -200],       // 3 high above the whole island, looking north
  [5270, 2.5, 4050, -900, 100, -1600],     // 4 Profitis Ilias summit, looking across the island
  [1250, 1.3, -450, -900, 150, -2700],     // 5 sea level inside the bay
  [250, -7, 6560, -135, -1, 6200],         // 6 under water off the south shore
];
