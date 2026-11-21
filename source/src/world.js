// ============================================================================
// the world: Thera's terrain data, the sun over it, the sea's waves, the meshes (load-time only unless noted)
// ============================================================================
// The frame: x east, z south, y up, in metres. The origin is 36.405 N, 25.405 E and y = 0 is the sea level of 1628 BCE.
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
// Thera is at 36.4 N. The Earth's axis is tilted as it was around 1628 BCE (23.89 degrees, from Laskar's 1986 series).
// Time is local solar time: the sun is due south at 12.
// THE DAY OF THE YEAR is counted from the spring equinox, 0 to 365, and the viewer can move it (D33; docs/layers/README.md).
// The sun goes round its yearly path at an even pace here: a liberty (L-L4) that the sky order ends. The world opens in
// late May, DAY0 (the sun 65 degrees along its path: T-L9, as before the date could be moved).
const LAT = 36.4 * PI / 180, TILT = 23.89 * PI / 180, DAY0 = 65 * 365 / 360;
// how far north of the equator the sun stands on a day (its declination, in radians)
const declAt = (day) => asin(sin(TILT) * sin(TAU * day / 365));
// direction to the sun at `hour` on a day whose declination is dc, into out[0..2]; returns its height above the horizon in radians
function sunAt(hour, dc, out) {
  const H = (hour - 12) * PI / 12, sa = sin(LAT) * sin(dc) + cos(LAT) * cos(dc) * cos(H);
  out[0] = -cos(dc) * sin(H); out[1] = sa; out[2] = -(cos(LAT) * sin(dc) - sin(LAT) * cos(dc) * cos(H)); // east, up, south
  return asin(sa);
}
// the hours after noon at which the sun stands `alt` radians above the horizon on such a day (0 if it never climbs so
// high, 12 if it never sinks so low)
const hoursTo = (alt, dc) => acos(clamp((sin(alt) - sin(LAT) * sin(dc)) / (cos(LAT) * cos(dc)), -1, 1)) * 12 / PI;
// The moments the T key and the menu step through: name, and the solar hour it had in late May, when these were fixed
// hours. THE NAMED MOMENTS FOLLOW THE SUN: Dawn, Golden and Dusk are the hours at which the sun stands as high as it did
// at those hours in late May (1.6 degrees up, 8.6 up, 4.0 down), so each has the same light all year; Afternoon keeps its
// share of the time from noon to sunset; Noon and Night are 12 and 23.5.
const TIMES = [['Dawn', 5.02], ['Noon', 12], ['Afternoon', 15.7], ['Golden', 18.35], ['Dusk', 19.5], ['Night', 23.5]];
{
  const d = declAt(DAY0), V = [0, 0, 0], set = hoursTo(0, d);
  for (const t of TIMES) t[2] = sunAt(t[1], d, V);  // the sun's height at that hour in late May
  TIMES[2][2] = (TIMES[2][1] - 12) / set;           // Afternoon: its share of the afternoon
}
// the solar hour of named moment i on a day (per frame while the date moves: no allocations)
function hourOf(i, day) {
  const t = TIMES[i], d = declAt(day);
  return i === 1 || i === 5 ? t[1] : i === 2 ? 12 + t[2] * hoursTo(0, d) : i ? 12 + hoursTo(t[2], d) : 12 - hoursTo(t[2], d);
}
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

// ---------------------------------------------------------------- the town at Akrotiri
// town-data.js (written by tools/town/build.mjs from tools/town/town.json) holds every building's outline, the edge of
// the excavated walls and the numbers a house is built from. docs/town/README.md records the claim behind each rule and
// every liberty. Here the outlines become houses: buildTown() is the generator.
function decodeTown(s) {
  const b = Uint8Array.from(atob(s), (c) => c.charCodeAt(0)); let p = 1;
  const i16 = () => { const v = b[p] | (b[p + 1] << 8); p += 2; return v > 32767 ? v - 65536 : v; };
  const ox = i16(), oz = i16(), nm = i16(), ne = i16(), nt = b[p++], M = [];
  const pts = (n) => { const a = new Float32Array(n * 2); for (let i = 0; i < n; i++) { a[i * 2] = ox + i16() / 16; a[i * 2 + 1] = oz + i16() / 16; } return a; };
  for (let k = 0; k < nm; k++) {
    const n = b[p++], f1 = b[p++], f2 = b[p++], seed = b[p++], tn = b[p++] / 255, o = pts(n), ft = [];
    for (let i = f2 >> 4; i--;) { ft.push([b[p], b[p + 1], b[p + 2] / 255, b[p + 3]]); p += 4; } // what, on which wall, how far along it, a number
    // exc: drawn from the excavated plan (else reconstructed); st: storeys; stone: 0 rubble, 1 dressed tuff, 2 dressed ignimbrite;
    // sc: string courses; big: large windows; low: one low storey; kind: 0 house, 1 porch; part: part of a house whose door is elsewhere;
    // tn: its turn in the wave a change of layer spreads as, 0 first to 1 last (docs/layers/README.md)
    M.push({ o, n, exc: f1 & 1, st: ((f1 >> 1) & 3) + 1, stone: (f1 >> 3) & 3, sc: (f1 >> 5) & 1, big: (f1 >> 6) & 1, low: f1 >> 7, kind: f2 & 3, part: (f2 >> 2) & 1, seed, tn, ft });
  }
  const edge = pts(ne), ter = [], tt = []; for (let k = 0; k < nt; k++) { ter.push(pts(b[p++])); tt.push(b[p++] / 255); } // tt: the turns of the terraces, then the pithos's
  const pithos = pts(1); tt.push(b[p] / 255);
  return { M, edge, ter, pithos, tt };
}
const TOWNG = decodeTown(TOWN);
// The ground the town stands on: its textures (the plan, the houses' shadows) cover a square of side TNS metres centred
// on TNX, TNZ; its collision grid has TGW x TGH cells of TCELL metres from TGX, TGZ.
let TNX, TNZ, TNS, TGX, TGZ, TGW, TGH;
const TCELL = 0.25, TMAPN = 1024;
{
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const m of TOWNG.M) for (let i = 0; i < m.n; i++) { x0 = min(x0, m.o[i * 2]); x1 = max(x1, m.o[i * 2]); z0 = min(z0, m.o[i * 2 + 1]); z1 = max(z1, m.o[i * 2 + 1]); }
  TNX = round((x0 + x1) / 2); TNZ = round((z0 + z1) / 2); TNS = Math.ceil((max(x1 - x0, z1 - z0) + 110) / 16) * 16;
  TGX = floor(x0) - 12; TGZ = floor(z0) - 12; TGW = Math.ceil((x1 - TGX + 12) / TCELL); TGH = Math.ceil((z1 - TGZ + 12) / TCELL);
}
// Builds every house from its outline: walls with their openings, parapet, roof and spout, by the rules in TOWNR. hAt(x, z) is
// the ground. Returns the mesh (32 bytes a corner: place; where it is on its wall; the way it faces and the wall's height;
// material, the house's own dice, flags, the free ground before the wall; the wall's length in 2048ths of a metre (the
// longest wall is 26.5 m) and THE BUILDING'S NUMBER, 16 bits each), with the triangles of what was found first (nF of them); the collision grid (a
// building's number per cell, 0 for none); each number's row (rows: its layer, its turn in the wave, its foot, its top);
// and the plan as two textures for the ground's shader.
function buildTown(hAt) {
  const R = TOWNR, SH = R.sh, M = TOWNG.M;
  let cap = 1 << 18, F = new Float32Array(cap * 8), B = new Uint8Array(F.buffer), S = new Uint16Array(F.buffer), nv = 0, IX = new Uint32Array(cap * 2), ni = 0;
  let cm = 0, cs = 0, cf = 0, cg = 255, cl = 0, ch = 0, nx = 0, ny = 1, nz = 0, cid = 0; // what the next corners are made of, the way they face, whose they are
  const V = (x, y, z, u, v) => {
    if (nv === cap) { cap *= 2; const f = new Float32Array(cap * 8); f.set(F); F = f; B = new Uint8Array(F.buffer); S = new Uint16Array(F.buffer); }
    const o = nv * 8, b = nv * 32; F[o] = x; F[o + 1] = y; F[o + 2] = z; F[o + 3] = u; F[o + 4] = v; S[nv * 16 + 14] = min(cl * 2048 + 0.5, 65535); S[nv * 16 + 15] = cid;
    B[b + 20] = nx * 127; B[b + 21] = ny * 127; B[b + 22] = nz * 127; B[b + 23] = ch; B[b + 24] = cm; B[b + 25] = cs; B[b + 26] = cf; B[b + 27] = cg;
    return nv++;
  };
  // triangles are wound to face the way set in nx, ny, nz, whatever order their corners came in
  const tri = (a, b, c) => {
    const p = a * 8, q = b * 8, r = c * 8, ux = F[q] - F[p], uy = F[q + 1] - F[p + 1], uz = F[q + 2] - F[p + 2], vx = F[r] - F[p], vy = F[r + 1] - F[p + 1], vz = F[r + 2] - F[p + 2];
    if (ni + 3 > IX.length) { const n = new Uint32Array(IX.length * 2); n.set(IX); IX = n; }
    IX[ni++] = a; if ((uy * vz - uz * vy) * nx + (uz * vx - ux * vz) * ny + (ux * vy - uy * vx) * nz > 0) { IX[ni++] = b; IX[ni++] = c; } else { IX[ni++] = c; IX[ni++] = b; }
  };
  const quad = () => { const a = nv - 4; tri(a, a + 1, a + 2); tri(a, a + 2, a + 3); }; // the last four corners, in order round it
  // ---- the wall being built: its start, direction, outward side, the ground at its ends, its length
  let ax, az, dx, dz, ox, oz, ga, gb, L;
  const gl = (u) => ga + (gb - ga) * u / L;
  const W = (u, y, inn) => V(ax + dx * u - ox * inn, y, az + dz * u - oz * inn, u, y - gl(u)); // u metres along, `inn` metres behind the face
  const rect = (u0, u1, y0, y1, inn) => { if (u1 - u0 < 1e-3 || y1 - y0 < 1e-3) return; W(u0, y0, inn); W(u0, y1, inn); W(u1, y1, inn); W(u1, y0, inn); quad(); };
  // an opening: a frame of dressed tuff flush with the wall (T2#68), a reveal lined with the timbers its wooden frame was
  // fixed to (T2#39, T2#41), and what closes it (3 a dark room, 4 a door leaf)
  const hole = (u0, u1, y0, y1, fw, fb, d, back) => {
    const m = cm, n0 = nx, n2 = nz;
    cm = 1; W(u0, y1, 0); W(u0 - fw, y1 + fw, 0); W(u1 + fw, y1 + fw, 0); W(u1, y1, 0); quad();
    W(u0 - fw, y0 - fb, 0); W(u0 - fw, y1 + fw, 0); W(u0, y1, 0); W(u0, y0, 0); quad();
    W(u1, y0, 0); W(u1, y1, 0); W(u1 + fw, y1 + fw, 0); W(u1 + fw, y0 - fb, 0); quad();
    if (fb) { W(u0 - fw, y0 - fb, 0); W(u0, y0, 0); W(u1, y0, 0); W(u1 + fw, y0 - fb, 0); quad(); }
    cm = 9; nx = dx; nz = dz; W(u0, y0, 0); W(u0, y1, 0); W(u0, y1, d); W(u0, y0, d); quad();
    nx = -dx; nz = -dz; W(u1, y0, 0); W(u1, y1, 0); W(u1, y1, d); W(u1, y0, d); quad();
    nx = 0; nz = 0; ny = -1; W(u0, y1, 0); W(u1, y1, 0); W(u1, y1, d); W(u0, y1, d); quad();
    ny = 1; cm = fb ? 9 : 8; W(u0, y0, 0); W(u1, y0, 0); W(u1, y0, d); W(u0, y0, d); quad(); // a sill, or a threshold of dark stone (T2#40)
    ny = 0; nx = n0; nz = n2; cm = back; W(u0, y0, d); W(u0, y1, d); W(u1, y1, d); W(u1, y0, d); quad();
    cm = m;
  };
  // a block standing out d metres from the wall
  const box = (u0, u1, y0, y1, d) => {
    const n0 = nx, n2 = nz;
    W(u0, y0, -d); W(u0, y1, -d); W(u1, y1, -d); W(u1, y0, -d); quad();
    nx = -dx; nz = -dz; W(u0, y0, 0); W(u0, y1, 0); W(u0, y1, -d); W(u0, y0, -d); quad();
    nx = dx; nz = dz; W(u1, y0, 0); W(u1, y1, 0); W(u1, y1, -d); W(u1, y0, -d); quad();
    nx = 0; nz = 0; ny = 1; W(u0, y1, 0); W(u1, y1, 0); W(u1, y1, -d); W(u0, y1, -d); quad();
    ny = -1; W(u0, y0, 0); W(u1, y0, 0); W(u1, y0, -d); W(u0, y0, -d); quad();
    ny = 0; nx = n0; nz = n2;
  };
  // ---- outlines: Float32Arrays of x, z pairs, clockwise on the map (so a wall's outward side is on the left of its direction)
  // triangles of an outline (ear clipping), as corner numbers
  const ears = (p, n) => {
    const id = [], out = [], cr = (a, b, c) => (p[b * 2] - p[a * 2]) * (p[c * 2 + 1] - p[a * 2 + 1]) - (p[b * 2 + 1] - p[a * 2 + 1]) * (p[c * 2] - p[a * 2]);
    for (let i = 0; i < n; i++) id.push(i);
    for (let guard = 0; id.length > 3 && guard < 200; guard++) {
      let cut = 0;
      for (let i = 0; i < id.length && !cut; i++) {
        const a = id[(i + id.length - 1) % id.length], b = id[i], c = id[(i + 1) % id.length]; if (cr(a, b, c) <= 0) continue;
        let ok = 1; for (const k of id) if (k !== a && k !== b && k !== c && cr(a, b, k) >= 0 && cr(b, c, k) >= 0 && cr(c, a, k) >= 0) ok = 0;
        if (ok) { out.push(a, b, c); id.splice(i, 1); cut = 1; }
      }
      if (!cut) id.splice(1, 1);
    }
    out.push(id[0], id[1], id[2]); return out;
  };
  // an outline moved in by d metres on every side; null where the building is too small for it
  const inset = (o, n, d) => {
    const r = new Float32Array(n * 2); let a0 = 0, a1 = 0;
    for (let i = 0; i < n; i++) {
      const p = ((i + n - 1) % n) * 2, c = i * 2, q = ((i + 1) % n) * 2;
      let ex = o[c] - o[p], ez = o[c + 1] - o[p + 1], fx = o[q] - o[c], fz = o[q + 1] - o[c + 1]; const le = hypot(ex, ez), lf = hypot(fx, fz);
      ex /= le; ez /= le; fx /= lf; fz /= lf;
      const k = d / max(1 + ex * fx + ez * fz, 0.35); r[c] = o[c] + (-ez - fz) * k; r[c + 1] = o[c + 1] + (ex + fx) * k;
    }
    for (let i = 0; i < n; i++) { const c = i * 2, q = ((i + 1) % n) * 2; a0 += o[c] * o[q + 1] - o[q] * o[c + 1]; a1 += r[c] * r[q + 1] - r[q] * r[c + 1]; }
    return a1 > a0 * 0.15 && a1 < a0 ? r : null;
  };
  // ---- the collision grid: which building stands on each cell
  const NT = M.length + TOWNG.ter.length + 2, grid = new Uint16Array(TGW * TGH), rows = new Float32Array(NT * 4), xs = [];
  // a row: the thing's layer (0 Found, 1 Inferred, 2 Imagined), its turn in the wave, its foot, its top. A thing's layer
  // follows from what it already carries: drawn from the excavated plan, or not (docs/layers/README.md)
  const row = (id, layer, turn, foot, top) => { rows[id * 4] = layer; rows[id * 4 + 1] = turn; rows[id * 4 + 2] = foot; rows[id * 4 + 3] = top; };
  row(0, 0, 0, -1e9, -1e9);
  const fill = (o, n, id) => {
    let z0 = 1e9, z1 = -1e9; for (let i = 0; i < n; i++) { z0 = min(z0, o[i * 2 + 1]); z1 = max(z1, o[i * 2 + 1]); }
    for (let j = max(0, floor((z0 - TGZ) / TCELL)); j <= min(TGH - 1, floor((z1 - TGZ) / TCELL)); j++) {
      const z = TGZ + (j + 0.5) * TCELL; xs.length = 0;
      for (let i = 0; i < n; i++) { const a = i * 2, b = ((i + 1) % n) * 2; if ((o[a + 1] <= z) !== (o[b + 1] <= z)) xs.push(o[a] + (z - o[a + 1]) / (o[b + 1] - o[a + 1]) * (o[b] - o[a])); }
      xs.sort((p, q) => p - q);
      for (let e = 0; e + 1 < xs.length; e += 2) for (let i = max(0, round((xs[e] - TGX) / TCELL)); i < min(TGW, round((xs[e + 1] - TGX) / TCELL)); i++) grid[j * TGW + i] = id;
    }
  };
  const idAt = (x, z) => { const i = floor((x - TGX) / TCELL), j = floor((z - TGZ) / TCELL); return i < 0 || j < 0 || i >= TGW || j >= TGH ? 0 : grid[j * TGW + i]; };
  M.forEach((m, k) => fill(m.o, m.n, k + 1));

  // ---- the houses
  M.forEach((m, k) => {
    const o = m.o, n = m.n, g = [], gp = [], len = []; let rs = m.seed * 7919 + k * 131 + 1, gmin = 1e9, gsum = 0;
    const rn = () => (rs = (rs * 16807 + 11) % 2147483647) / 2147483647; // the house's own dice: the same house every time
    for (let i = 0; i < n; i++) { const h = hAt(o[i * 2], o[i * 2 + 1]); g.push(h); gmin = min(gmin, h); gsum += h; }
    // how much free ground lies before each wall (a neighbour's wall right against it makes it a party wall)
    for (let i = 0; i < n; i++) {
      const a = i * 2, b = ((i + 1) % n) * 2, ex = o[b] - o[a], ez = o[b + 1] - o[a + 1], l = hypot(ex, ez), pr = [0, 0, 0];
      for (let s = 0; s < 3; s++) { const x = o[a] + ex * (s + 1) / 4, z = o[a + 1] + ez * (s + 1) / 4; let t = 0.3; for (; t < 12.7; t += 0.25) { const id = idAt(x + ez / l * t, z - ex / l * t); if (id && id !== k + 1) break; } pr[s] = t; }
      pr.sort((p, q) => p - q); gp.push(pr[1]); len.push(l);
    }
    const edge = (i) => { const a = i * 2, b = ((i + 1) % n) * 2; ax = o[a]; az = o[a + 1]; L = len[i]; dx = (o[b] - ax) / L; dz = (o[b + 1] - az) / L; ox = dz; oz = -dx; ga = g[i]; gb = g[(i + 1) % n]; nx = ox; ny = 0; nz = oz; cg = min(255, gp[i] * 20); cl = L; };
    // the entrance: where the record puts it; otherwise on the wall with most room before it, at one of its ends (T2#14, T2#111)
    let de = -1, dt = 0, best = 0;
    for (const f of m.ft) if (f[0] === 1) { de = f[1]; dt = f[2]; }
    if (de < 0 && !m.part) for (let i = 0; i < n; i++) { const s = gp[i] < 1.1 || len[i] < 3.2 ? 0 : min(gp[i], 6) * min(len[i], 8) + rn(); if (s > best) { best = s; de = i; dt = m.kind ? 0.5 : rn() < 0.5 ? 0 : 1; } }
    // levels: the street at the door; the ground floor a few steps below it (T2#11, T2#14); floors; the roof; the parapet's top
    const D = de < 0 ? gsum / n : g[de] + (g[(de + 1) % n] - g[de]) * dt, sunk = m.low ? R.sunk16 : R.sunk[0] + rn() * (R.sunk[1] - R.sunk[0]);
    const F0 = D - sunk, roofY = F0 + m.st * SH + R.roof, topY = roofY + R.par[0], base = gmin - 2, e0 = 0.6;
    row(cid = k + 1, m.exc ? 0 : 1, m.tn, gmin - 0.3, topY); cs = m.seed; cf = m.stone | (m.exc << 2) | (m.sc << 3);
    const lim = (s) => (s < m.st - 1 ? F0 + (s + 1) * SH : roofY) - 0.3; // the highest an opening of storey s may reach
    for (let i = 0; i < n; i++) {
      edge(i); const gap = gp[i], ops = [];
      // openings keep clear of the wall's ends (where the corner stones are) and of each other
      const add = (band, u0, u1, y0, y1, kind, fb, sp, d) => { if (u0 < e0 || u1 > L - e0 || y1 - y0 < 0.3) return; for (const q of ops) if (q[0] === band && u0 < q[2] + sp && u1 > q[1] - sp) return; ops.push([band, u0, u1, y0, y1, kind, fb, d]); };
      if (gap >= 0.9 && L > 2.6) {
        if (i === de) {
          if (m.kind) { const w = min(L - 1.3, 1.7), y0 = gl(L / 2) + 0.06; add(0, L / 2 - w / 2, L / 2 + w / 2, y0, min(y0 + 2.05, lim(0)), 4, 0, 0.5, 1.3); } // a porch: open to the street, the door at its back
          else {
            // the door (T2#39) on its threshold, and the window beside it (T2#41)
            const w = R.door[0], uc = clamp(dt * L, e0 + w / 2 + 0.25, L - e0 - w / 2 - 0.25), y0 = gl(uc) + R.door[4], uw = uc + (uc < L / 2 ? 1 : -1) * (w / 2 + 0.8 + R.wdoor[0] / 2), s0 = gl(uw) + R.wdoor[2];
            add(0, uc - w / 2, uc + w / 2, y0, min(y0 + R.door[1], lim(0)), 4, 0, 0.5, R.rev);
            add(0, uw - R.wdoor[0] / 2, uw + R.wdoor[0] / 2, s0, min(s0 + R.wdoor[1], lim(0)), 3, 0.2, 0.5, R.rev);
          }
        }
        for (const f of m.ft) if (f[1] === i) {
          const uc = f[2] * L, F1 = F0 + SH;
          if (f[0] === 2) { const w = min(R.low[0], L - 2 * e0 - 0.5), u = clamp(uc, e0 + w / 2 + 0.2, L - e0 - w / 2 - 0.2), y0 = gl(u) + (f[3] ? f[3] / 100 : R.low[2]); add(0, u - w / 2, u + w / 2, y0, min(y0 + R.low[1], lim(0)), 3, 0.2, 0.5, R.rev); } // a large low window (T2#58)
          if (f[0] === 3 && m.st > 1) { const w = min(2.4, L - 2 * e0 - 0.5), u = clamp(uc, e0 + w / 2 + 0.2, L - e0 - w / 2 - 0.2); add(1, u - w / 2, u + w / 2, F1 + 0.8, min(F1 + 2.25, lim(1)), 3, 0.2, 0.5, R.rev); } // a very large upper window (T2#32)
          if (f[0] === 4 && m.st > 1) { // a wall of piers and windows (T2#34, T2#42)
            const tot = min(R.pier[0], L - 2 * e0 - 0.4), nw = R.pier[1], w = (tot - (nw - 1) * 0.3) / nw, u0 = clamp(uc - tot / 2, e0 + 0.2, L - e0 - tot - 0.2);
            for (let j = 0; j < nw; j++) add(1, u0 + j * (w + 0.3), u0 + j * (w + 0.3) + w, F1 + 0.75, min(F1 + 2.05, lim(1)), 3, 0.15, 0.04, R.rev);
          }
        }
        if (!m.kind) {
          // small windows low on the ground storey (T2#61); a house with large windows has them here too (T2#20)
          for (let u = e0 + 0.9 + rn() * 1.5; u < L - e0 - 0.9; u += 3.2 + rn() * 1.6) if (rn() < (m.big ? 0.9 : 0.55)) { const w = m.big ? 1.2 : R.gwin[0], y0 = gl(u) + (m.big ? 0.95 : R.gwin[2]); add(0, u - w / 2, u + w / 2, y0, min(y0 + (m.big ? 1.25 : R.gwin[1]), lim(0)), 3, 0.2, 0.5, R.rev); }
          // upper storeys: larger windows, fewer where the street is an alley
          for (let s = 1; s < m.st; s++) {
            const Fs = F0 + s * SH, w = m.big ? 1.5 : R.uwin[0], cnt = max(1, floor((L - 2 * e0 + 0.4) / R.uwin[3]));
            for (let j = 0; j < cnt; j++) { const u = e0 + (L - 2 * e0) * (j + 0.5) / cnt + (rn() - 0.5) * 0.5; if (gap < 1.5 && rn() < 0.5) continue; add(s, u - w / 2, u + w / 2, Fs + R.uwin[2], min(Fs + R.uwin[2] + (m.big ? 1.55 : R.uwin[1]), lim(s)), 3, 0.2, 0.5, R.rev); }
          }
        }
      }
      // the wall, storey by storey, built round its openings
      cm = 0; ch = clamp((topY - (ga + gb) / 2) * 4, 0, 127);
      for (let s = 0; s < m.st; s++) {
        const Y0 = s ? F0 + s * SH - 0.004 : base, Y1 = s < m.st - 1 ? F0 + (s + 1) * SH : topY, row = ops.filter((q) => q[0] === s).sort((p, q) => p[1] - q[1]); let uc = 0;
        for (const q of row) {
          const fw = 0.2, U0 = q[1] - fw, U1 = q[2] + fw, YA = q[3] - q[6], YB = q[4] + fw;
          rect(uc, U0, Y0, Y1, 0); rect(U0 - 0.004, U1 + 0.004, YB, Y1, 0);
          if (q[5] === 4 && q[7] < 1) { rect(U0 - 0.004, U1 + 0.004, Y0, YA - 0.3, 0); cm = 8; rect(U0, U1, YA - 0.3, YA, 0); cm = 0; } else rect(U0 - 0.004, U1 + 0.004, Y0, YA, 0);
          hole(q[1], q[2], q[3], q[4], fw, q[6], q[7], q[5]); uc = U1;
        }
        rect(uc, L, Y0, Y1, 0);
        // rows of dressed stone standing out at each floor (T2#68; Xeste 2: T2b#42)
        if (m.sc && s && gap >= 0.9) { cm = 1; box(0, L, F0 + s * SH - 0.14, F0 + s * SH + 0.14, 0.07); cm = 0; }
      }
    }
    // the roof: a flat terrace of earth inside a parapet (T2#70, T2#73)
    const inn = inset(o, n, R.par[1]), ro = inn || o, ry = inn ? roofY : topY, v0 = nv, t = ears(ro, n);
    cm = 5; cg = 255; ch = 0; nx = 0; ny = 1; nz = 0;
    for (let i = 0; i < n; i++) V(ro[i * 2], ry, ro[i * 2 + 1], ro[i * 2], ro[i * 2 + 1]);
    for (let i = 0; i < t.length; i += 3) tri(v0 + t[i], v0 + t[i + 1], v0 + t[i + 2]);
    if (inn) for (let i = 0; i < n; i++) {
      const a = i * 2, b = ((i + 1) % n) * 2;
      cm = 6; nx = 0; ny = 1; nz = 0; V(o[a], topY, o[a + 1], o[a], o[a + 1]); V(o[b], topY, o[b + 1], o[b], o[b + 1]); V(inn[b], topY, inn[b + 1], inn[b], inn[b + 1]); V(inn[a], topY, inn[a + 1], inn[a], inn[a + 1]); quad();
      edge(i); cm = 0; cg = 255; nx = -ox; nz = -oz; V(inn[a], roofY, inn[a + 1], 0, 3); V(inn[a], topY, inn[a + 1], 0, 3 + R.par[0]); V(inn[b], topY, inn[b + 1], L, 3 + R.par[0]); V(inn[b], roofY, inn[b + 1], L, 3); quad();
    }
    // a terracotta spout through the parapet, over the widest street (T2#73)
    best = 1; let se = -1; for (let i = 0; i < n; i++) if (gp[i] > best && len[i] > 3) { best = gp[i]; se = i; }
    if (se >= 0 && inn) { edge(se); cm = 7; const u = L * (0.25 + 0.5 * rn()); box(u - 0.1, u + 0.1, roofY - 0.02, roofY + 0.11, R.spout); }
    // what the record adds to this house
    for (const f of m.ft) {
      edge(f[1]); const uc = f[2] * L; cg = 255;
      if (f[0] === 7) { cm = 8; const u = clamp(uc, 1.6, L - 1.6), y = gl(u); box(u - 1.2, u + 1.2, y - 0.4, y + 0.42, 0.45); } // stone benches by the entrance (T2#22)
      if (f[0] === 8) { // horns of dressed tuff over the entrance (T2#49, grade B)
        cm = 1; const P = [-0.55, 0, 0.55, 0, 0.62, 0.72, 0.44, 0.68, 0.26, 0.2, -0.26, 0.2, -0.44, 0.68, -0.62, 0.72], h = ears(new Float32Array(P), 8), u = clamp(uc, 1, L - 1);
        for (const d of [0.08, 0.3]) { nx = d < 0.1 ? ox : -ox; nz = d < 0.1 ? oz : -oz; const a = nv; for (let j = 0; j < 8; j++) W(u + P[j * 2], topY + P[j * 2 + 1], d); for (let j = 0; j < h.length; j += 3) tri(a + h[j], a + h[j + 1], a + h[j + 2]); }
        for (let j = 0; j < 8; j++) { const p = j * 2, q = ((j + 1) % 8) * 2, eu = P[q] - P[p], ey = P[q + 1] - P[p + 1], l = hypot(eu, ey), s = (-ey * (P[p] + P[q]) / 2 + eu * ((P[p + 1] + P[q + 1]) / 2 - 0.3)) > 0 ? 1 : -1; nx = -ey / l * s * dx; nz = -ey / l * s * dz; ny = eu / l * s; W(u + P[p], topY + P[p + 1], 0.08); W(u + P[q], topY + P[q + 1], 0.08); W(u + P[q], topY + P[q + 1], 0.3); W(u + P[p], topY + P[p + 1], 0.3); quad(); }
      }
      if (f[0] === 5 || f[0] === 6) {
        // 5: a room standing above the roof at this corner (the West House's partial third storey, T2#38, grade B)
        // 6: a light-well, shown as a square opening in the roof (the House of the Ladies, T2#45)
        let cx = 0, cz = 0; for (let i = 0; i < n; i++) { cx += o[i * 2] / n; cz += o[i * 2 + 1] / n; }
        const room = f[0] === 5, w = room ? 4.4 : 2.2, u0 = room ? clamp(uc - w / 2, 0.5, L - w - 0.5) : 0, y1 = roofY + (room ? 2.5 : 0.25), k2 = room ? 0 : 0.14;
        const bx = room ? ax + dx * u0 - ox * 0.45 : cx - dx * 1.1 + ox * 1.1, bz = room ? az + dz * u0 - oz * 0.45 : cz - dz * 1.1 + oz * 1.1, dp = room ? 4 : 2.2;
        const c = [bx, bz, bx + dx * w, bz + dz * w, bx + dx * w - ox * dp, bz + dz * w - oz * dp, bx - ox * dp, bz - oz * dp], q = [];
        for (let j = 0; j < 4; j++) { const p = j * 2, r = (j ^ 2) * 2; q.push(c[p] + (c[r] - c[p]) * k2, c[p + 1] + (c[r + 1] - c[p + 1]) * k2); } // the same square, a little smaller
        for (let j = 0; j < 4; j++) {
          const p = j * 2, r = ((j + 1) % 4) * 2, ex = c[r] - c[p], ez = c[r + 1] - c[p + 1], l = hypot(ex, ez);
          cm = 0; cl = l; ch = 10; ny = 0; nx = ez / l; nz = -ex / l; V(c[p], roofY, c[p + 1], 0, 3); V(c[p], y1, c[p + 1], 0, 5.5); V(c[r], y1, c[r + 1], l, 5.5); V(c[r], roofY, c[r + 1], l, 3); quad();
          if (!room) { cm = 6; nx = 0; ny = 1; nz = 0; V(c[p], y1, c[p + 1], c[p], c[p + 1]); V(c[r], y1, c[r + 1], c[r], c[r + 1]); V(q[r], y1, q[r + 1], q[r], q[r + 1]); V(q[p], y1, q[p + 1], q[p], q[p + 1]); quad(); }
        }
        cm = room ? 5 : 3; nx = 0; ny = 1; nz = 0; for (let j = 0; j < 4; j++) V(q[j * 2], y1, q[j * 2 + 1], q[j * 2], q[j * 2 + 1]); quad();
      }
    }
  });
  // ---- the terraces of Double Horns Square (T2b#47), and the stone pithos in Cenotaph Square (T2#53)
  TOWNG.ter.forEach((o, k) => {
    const n = o.length / 2, id = M.length + 1 + k; let y = -1e9, lo = 1e9; for (let i = 0; i < n; i++) { const h = hAt(o[i * 2], o[i * 2 + 1]); y = max(y, h); lo = min(lo, h); }
    y += 0.04; row(cid = id, 0, TOWNG.tt[k], lo, y); fill(o, n, id); cs = 90 + k * 40; cf = 4; cg = 255; ch = 0;
    for (let i = 0; i < n; i++) { const a = i * 2, b = ((i + 1) % n) * 2; ax = o[a]; az = o[a + 1]; L = hypot(o[b] - ax, o[b + 1] - az); dx = (o[b] - ax) / L; dz = (o[b + 1] - az) / L; ox = dz; oz = -dx; ga = gb = y - 1; cl = L; cm = 0; nx = ox; ny = 0; nz = oz; rect(0, L, lo - 1.5, y, 0); }
    cm = 10; nx = 0; ny = 1; nz = 0; const v0 = nv, t = ears(o, n); for (let i = 0; i < n; i++) V(o[i * 2], y, o[i * 2 + 1], o[i * 2], o[i * 2 + 1]);
    for (let i = 0; i < t.length; i += 3) tri(v0 + t[i], v0 + t[i + 1], v0 + t[i + 2]);
  });
  {
    const px = TOWNG.pithos[0], pz = TOWNG.pithos[1], y = hAt(px, pz), P = [0.2, 0, 0.34, 0.2, 0.43, 0.55, 0.42, 0.85, 0.32, 1.08, 0.24, 1.18, 0.3, 1.3, 0.22, 1.3], id = M.length + 1 + TOWNG.ter.length, k = R.pithos / 1.3;
    cm = 8; cs = 9; cf = 4; cg = 255; cl = 9; ch = 0; row(cid = id, 0, TOWNG.tt[TOWNG.ter.length], y, y + R.pithos);
    for (let j = 0; j < 7; j++) for (let s = 0; s < 12; s++) {
      const a0 = s / 12 * TAU, a1 = (s + 1) / 12 * TAU, r0 = P[j * 2] * k, r1 = P[j * 2 + 2] * k, y0 = y + P[j * 2 + 1] * k, y1 = y + P[j * 2 + 3] * k, sl = (r0 - r1) / hypot(r0 - r1, y1 - y0);
      nx = cos(a0); nz = sin(a0); ny = sl; V(px + nx * r0, y0, pz + nz * r0, a0, y0 - y); V(px + nx * r1, y1, pz + nz * r1, a0, y1 - y);
      nx = cos(a1); nz = sin(a1); V(px + nx * r1, y1, pz + nz * r1, a1, y1 - y); V(px + nx * r0, y0, pz + nz * r0, a1, y0 - y); nx = cos((a0 + a1) / 2); nz = sin((a0 + a1) / 2); quad();
    }
    for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (i * i + j * j < 6) { const gi = floor((px - TGX) / TCELL) + i, gj = floor((pz - TGZ) / TCELL) + j; grid[gj * TGW + gi] = id; }
  }
  // ---- the plan as two textures for the ground's shader. map: r built on; g metres to the nearest wall / 8; b metres to
  // the edge of the excavated walls / 4; a inside that edge. map2, for the layers: r built on by what was found; g metres
  // to the nearest wall of what was found / 8; b the turn in the wave of the nearest building, so that the paving and the
  // shade of a street arrive with its houses
  const N = TMAPN, map = new Uint8Array(N * N * 4), map2 = new Uint8Array(N * N * 4), ms = TNS / N, d = new Float32Array(N * N), d0 = new Float32Array(N * N), who = new Uint16Array(N * N), E = TOWNG.edge, en = E.length / 2;
  let ex0 = 1e9, ex1 = -1e9, ez0 = 1e9, ez1 = -1e9; for (let i = 0; i < en; i++) { ex0 = min(ex0, E[i * 2]); ex1 = max(ex1, E[i * 2]); ez0 = min(ez0, E[i * 2 + 1]); ez1 = max(ez1, E[i * 2 + 1]); }
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const x = TNX - TNS / 2 + (i + 0.5) * ms, z = TNZ - TNS / 2 + (j + 0.5) * ms, id = idAt(x, z), built = id > 0 && id <= M.length, f = built && M[id - 1].exc;
    map[k * 4] = built ? 255 : 0; d[k] = built ? 0 : 1e9; map[k * 4 + 2] = 255; map2[k * 4] = f ? 255 : 0; d0[k] = f ? 0 : 1e9; who[k] = built ? id : 0;
    if (x > ex0 - 5 && x < ex1 + 5 && z > ez0 - 5 && z < ez1 + 5) {
      let dm = 1e9, ins = false;
      for (let e = 0; e < en; e++) {
        const a = e * 2, b = ((e + 1) % en) * 2, sx = E[b] - E[a], sz = E[b + 1] - E[a + 1], u = clamp(((x - E[a]) * sx + (z - E[a + 1]) * sz) / (sx * sx + sz * sz), 0, 1), q = hypot(x - E[a] - sx * u, z - E[a + 1] - sz * u);
        if (q < dm) dm = q; if ((E[a + 1] > z) !== (E[b + 1] > z) && x < sx * (z - E[a + 1]) / sz + E[a]) ins = !ins;
      }
      map[k * 4 + 2] = min(255, dm * 63.75); map[k * 4 + 3] = ins ? 255 : 0;
    }
  }
  // distances in cells to the nearest built cell (two sweeps); w, if given, takes the number of the building it belongs to
  const sweep = (d, w) => {
    for (let pass = 0; pass < 2; pass++) for (let q = 0; q < N * N; q++) {
      const k = pass ? N * N - 1 - q : q, i = k % N, s = pass ? 1 : -1; let v = d[k], f = k;
      if (i + s >= 0 && i + s < N && d[k + s] + 1 < v) { v = d[k + s] + 1; f = k + s; } // (one pass looks back, the other ahead)
      const r = k + s * N; if (r >= 0 && r < N * N) { if (d[r] + 1 < v) { v = d[r] + 1; f = r; } if (i > 0 && d[r - 1] + 1.414 < v) { v = d[r - 1] + 1.414; f = r - 1; } if (i < N - 1 && d[r + 1] + 1.414 < v) { v = d[r + 1] + 1.414; f = r + 1; } }
      d[k] = v; if (w) w[k] = w[f];
    }
  };
  sweep(d, who); sweep(d0);
  for (let k = 0; k < N * N; k++) { map[k * 4 + 1] = min(255, d[k] * ms * 31.875); map2[k * 4 + 1] = min(255, d0[k] * ms * 31.875); map2[k * 4 + 2] = rows[who[k] * 4 + 1] * 255; }
  // ---- what was found is drawn first, so that the Found layer at rest draws only that
  const ix = new Uint32Array(ni); let nF = 0, a = 0;
  for (let i = 0; i < ni; i += 3) if (!rows[S[IX[i] * 16 + 15] * 4]) nF += 3;
  for (let i = 0, b = nF; i < ni; i += 3) { const o = rows[S[IX[i] * 16 + 15] * 4] ? b : a; ix[o] = IX[i]; ix[o + 1] = IX[i + 1]; ix[o + 2] = IX[i + 2]; if (o === a) a += 3; else b += 3; }
  return { v: new Uint8Array(F.buffer, 0, nv * 32), ix, nF, grid, rows, map, map2 };
}

// ---------------------------------------------------------------- viewpoints (keys 1-9): position and look-at
// y is metres above the ground (or above the sea surface, where the ground is under water); a negative y is a depth below
// the surface. main.js turns it into a height once the terrain is built. A seventh number, 1, puts the viewer on foot.
const POSES = [
  [-40, 2.6, 6900, -135, 30, 5937],        // 1 the Akrotiri terrace from the sea to its south
  [-250, 6, 1345, -1250, 40, -2500],       // 2 the north bay and Pre-Kameni (a modern label) from the ring rim
  [300, 9200, 13800, -300, 0, -200],       // 3 high above the whole island, looking north
  [5270, 2.5, 4050, -900, 100, -1600],     // 4 Profitis Ilias summit, looking across the island
  [1250, 1.3, -450, -900, 150, -2700],     // 5 sea level inside the bay
  [250, -7, 6560, -135, -1, 6200],         // 6 under water off the south shore
  [-144.5, 1.5, 5924.6, -146.6, 26.3, 5948, 1],  // 7 on foot in Telchines Street (a modern label), looking down it past Complex Delta towards Sector Beta
  [-111.5, 1.5, 5916.4, -109, 28, 5929, 1],      // 8 on foot in Double Horns Square, facing Xeste 2's north front
  [-30, 34, 5490, -118, 6, 5900],                // 9 over the roofs from the town's north edge, looking across it to the sea
];
