#!/usr/bin/env node
// ============================================================================
// Rebuilds the island of 1615 BCE from today's elevation data, through the named edits in edits.json
// ============================================================================
//   node tools/terrain/fetch.mjs                  once: downloads the two datasets into tools/terrain/cache/
//   node tools/terrain/build.mjs [--preview DIR]  writes source/src/terrain-data.js and docs/terrain/build-report.json
// The output is deterministic: the same inputs give the same bytes. --preview also writes shaded-relief PNGs to look at.
// The record of every edit, its claims and its liberties is docs/terrain/README.md.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readTiff } from './tiff.mjs';
import { Grid, blur, clamp, distance, distPolyline, fbm, inPoly, mix, relief, sampleGeo, sstep, toLat, toLon, toX, toZ } from './lib.mjs';
import { encodeTerrain, UNIT } from './codec.mjs';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..', '..');
const E = JSON.parse(readFileSync(path.join(here, 'edits.json'), 'utf8'));
const N = E.grid.cells, CELL = E.grid.cellMetres, CF = E.grid.coarseFactor, A = CELL * CELL;
const pv = process.argv.indexOf('--preview'), PREVIEW = pv > 0 ? path.resolve(process.argv[pv + 1]) : null;
const src = (f) => { const p = path.join(here, 'cache', f); if (!existsSync(p)) { console.error(`missing ${p}: run node tools/terrain/fetch.mjs first`); process.exit(3); } return readFileSync(p); };
const demBuf = src('Copernicus_DSM_COG_10_N36_00_E025_00_DEM.tif'), batBuf = src('emodnet_dtm2024_mean_santorini.tif');
const dem = readTiff(demBuf), bat = readTiff(batBuf);
const report = { grid: E.grid, inputs: { 'Copernicus_DSM_COG_10_N36_00_E025_00_DEM.tif': createHash('sha256').update(demBuf).digest('hex'), 'emodnet_dtm2024_mean_santorini.tif': createHash('sha256').update(batBuf).digest('hex') }, edits: {} };
const r1 = (v) => Math.round(v * 10) / 10, r2 = (v) => Math.round(v * 100) / 100, r3 = (v) => Math.round(v * 1000) / 1000;
const g0 = new Grid(N, CELL), X = (k) => g0.gx(k % N), Z = (k) => g0.gz((k / N) | 0);
const mask = (poly) => { const m = new Uint8Array(N * N); for (let k = 0; k < N * N; k++) m[k] = inPoly(poly, X(k), Z(k)) ? 1 : 0; return m; };
const near = (m) => distance(m, N); // cells -> distance in cells to the nearest set cell

// ---------------------------------------------------------------- E0: the surface model's buildings
{
  let changed = 0, lowered = 0;
  for (const name in E.E0.towns) {
    const poly = E.E0.towns[name], xs = poly.map((p) => p[0]), zs = poly.map((p) => p[1]);
    const px0 = Math.floor((toLon(Math.min(...xs)) - dem.lon0) / dem.dLon) - 2, px1 = Math.ceil((toLon(Math.max(...xs)) - dem.lon0) / dem.dLon) + 2;
    const py0 = Math.floor((dem.lat0 - toLat(Math.min(...zs))) / dem.dLat) - 2, py1 = Math.ceil((dem.lat0 - toLat(Math.max(...zs))) / dem.dLat) + 2;
    const w = px1 - px0, h = py1 - py0, at = (x, y) => dem.data[(py0 + clamp(y, 0, h - 1)) * dem.width + px0 + clamp(x, 0, w - 1)];
    const ero = new Float32Array(w * h), opn = new Float32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 1e9; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) m = Math.min(m, at(x + a, y + b)); ero[y * w + x] = m; }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = -1e9; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) m = Math.max(m, ero[clamp(y + b, 0, h - 1) * w + clamp(x + a, 0, w - 1)]); opn[y * w + x] = m; }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (py0 + y) * dem.width + px0 + x, lon = dem.lon0 + (px0 + x + 0.5) * dem.dLon, lat = dem.lat0 - (py0 + y + 0.5) * dem.dLat;
      if (dem.data[i] > 0.25 && inPoly(poly, toX(lon), toZ(lat)) && opn[y * w + x] < dem.data[i]) { lowered += dem.data[i] - opn[y * w + x]; dem.data[i] = opn[y * w + x]; changed++; }
    }
  }
  report.edits.E0 = { cellsChanged: changed, meanLoweringMetres: r2(lowered / Math.max(changed, 1)) };
}

// ---------------------------------------------------------------- today's surface on the world grid (land from the DEM, sea from the bathymetry)
const today = new Grid(N, CELL);
for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
  let s = 0;
  for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) {
    const lon = toLon(today.gx(i) + a * CELL / 3), lat = toLat(today.gz(j) + b * CELL / 3), d = sampleGeo(dem, lon, lat);
    s += d > 0.25 ? d : Math.min(sampleGeo(bat, lon, lat), -0.3);
  }
  today.d[j * N + i] = s / 9;
}

// ---------------------------------------------------------------- E9, first part: summits at their published heights
// 30 m cells shave peaks: the data reads several metres low on both basement summits (T1c correction 3)
report.edits.E9 = { summits: {} };
for (const sm of E.E9.summits) {
  let top = -1; for (let k = 0; k < N * N; k++) if (Math.hypot(X(k) - sm.at[0], Z(k) - sm.at[1]) < 200 && today.d[k] > top) top = today.d[k];
  for (let k = 0; k < N * N; k++) { const d = Math.hypot(X(k) - sm.at[0], Z(k) - sm.at[1]); if (d < sm.radiusMetres) today.d[k] += (sm.metres - top) * (0.5 + 0.5 * Math.cos(Math.PI * d / sm.radiusMetres)) ** 2; }
  report.edits.E9.summits[sm.name] = { publishedMetres: sm.metres, onTheGridBeforeMetres: r1(top), raisedByMetres: r1(sm.metres - top) };
}

// ---------------------------------------------------------------- E1: sea level
const T = today.clone(); // today's surface in the 1615 BCE datum
for (let k = 0; k < N * N; k++) T.d[k] += E.E1.seaLevelBelowPresent;
{
  let gained = 0; for (let k = 0; k < N * N; k++) if (today.d[k] <= 0 && T.d[k] > 0) gained++;
  report.edits.E1 = { seaLevelBelowPresentMetres: E.E1.seaLevelBelowPresent, landGainedKm2: r2(gained * A / 1e6) };
}
const h = T.clone();

// ---------------------------------------------------------------- E9 (first, because E3 needs it): the old basement
const basement = new Uint8Array(N * N); // 0 none, 1 + index of the massif
Object.keys(E.E9.basement).forEach((name, n) => { const m = mask(E.E9.basement[name]); for (let k = 0; k < N * N; k++) if (m[k]) basement[k] = n + 1; });

// ---------------------------------------------------------------- where the caldera side will be rebuilt (E2, E4, E5, E6), needed by E3 too
const inSouth = mask(E.E4.southLand), inBridge = mask(E.E6.bridge), inKameni = mask(E.E2.outline);
const M = new Uint8Array(N * N), bay = new Uint8Array(N * N); // M: modelled (restored) land and its submarine slope; bay: the bay floor
for (let k = 0; k < N * N; k++) if (inSouth[k] || inBridge[k]) M[k] = 1;
{ // the bay: today's caldera water (and the Kameni islands) reached from the seed without crossing restored land
  const seed = Math.round(g0.fi(E.E5.seed[1])) * N + Math.round(g0.fi(E.E5.seed[0])), stack = [seed]; bay[seed] = 1;
  while (stack.length) { const k = stack.pop(); for (const o of [-1, 1, -N, N]) { const q = k + o; if (q < 0 || q >= N * N || bay[q] || M[q] || !(T.d[q] <= 0.5 || inKameni[q])) continue; bay[q] = 1; stack.push(q); } }
  for (let i = 0; i < N; i++) if (bay[i] || bay[(N - 1) * N + i] || bay[i * N] || bay[i * N + N - 1]) { console.error('E5: the bay leaks to the open sea: E4 southLand or E6 bridge does not close the ring'); process.exit(1); }
}

// ---------------------------------------------------------------- E3: strip the Minoan deposits (a liberty: no sourced thickness map)
{
  const p = E.E3, pos = blur(T.d, N, Math.round(p.positionWindowMetres / CELL)), base = blur(Float32Array.from(basement, (v) => (v ? 1 : 0)), N, 3), t = new Float32Array(N * N);
  const zones = (p.zones || []).map((zn) => ({ ...zn, w: blur(Float32Array.from(mask(zn.outline)), N, 3, 2) })), dRim = near(Uint8Array.from(M, (v, k) => (v || bay[k] ? 1 : 0)));
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, v = T.d[k]; if (v <= 0) continue;
    const valley = sstep(p.positionRangeMetres, -p.positionRangeMetres, v - pos[k]); // 1 in valleys, 0.5 on even ground, 0 on ridges
    const sl = Math.hypot(T.at(i + 1, j) - T.at(i - 1, j), T.at(i, j + 1) - T.at(i, j - 1)) / (2 * CELL);
    let d = mix(p.ridgeMetres, p.valleyMetres, valley);
    d = mix(d, p.rimMetres, 1 - sstep(0, p.rimWidthMetres, dRim[k] * CELL)); // thickest along the caldera rim
    // a checked figure for a named place replaces or scales the model there
    for (const zn of zones) { const w = zn.w[k] * (zn.aboveMetres === undefined ? 1 : sstep(zn.aboveMetres - 40, zn.aboveMetres + 40, v)); if (w > 0) d = mix(d, zn.metres !== undefined ? zn.metres : d * zn.scale, w); }
    d *= (1 - sstep(p.slopeThinStart, p.slopeThinEnd, sl)) * mix(1, p.basementFactor, base[k]);
    t[k] = Math.min(d, p.maxMetres, v * (1 - p.keepAboveSeaFraction));
  }
  const ts = blur(t, N, 1, 2); let sum = 0, n = 0, mx = 0;
  for (let k = 0; k < N * N; k++) if (T.d[k] > 0) { const d = Math.min(ts[k], T.d[k] * (1 - p.keepAboveSeaFraction)); h.d[k] = T.d[k] - d; sum += d; n++; if (d > mx) mx = d; }
  report.edits.E3 = { landKm2: r2(n * A / 1e6), meanThicknessMetres: r2(sum / n), maxThicknessMetres: r2(mx), volumeStrippedKm3: r3(sum * A / 1e9) };
}
const afterE3 = h.clone();
// what the model strips at the town site, beside the figures first reported there (recorded, not used: T1c#22)
report.edits.E3.atTownSite = { modelStripsMetres: r1(T.sample(...E.E8.site) - afterE3.sample(...E.E8.site)), reportedFirstPumiceFallCentimetres: E.E3.atTown.firstPumiceFallCentimetres, reportedThenAshFallMetres: E.E3.atTown.thenAshFallMetres, reportedFiguresUsed: E.E3.atTown.setsStripDepth };

// ---------------------------------------------------------------- E2, E4, E5, E6: the caldera side
{ // E2: what the Kameni outline removes from today's surface
  let area = 0, vol = 0, top = 0;
  for (let k = 0; k < N * N; k++) if (inKameni[k] && today.d[k] > 0) { area++; vol += today.d[k]; if (today.d[k] > top) top = today.d[k]; }
  report.edits.E2 = { landRemovedKm2: r2(area * A / 1e6), volumeAboveTodaysSeaKm3: r3(vol * A / 1e9), highestPointRemovedMetres: r1(top) };
}
// the membrane: fixed where it meets kept terrain, on the crest lines and on the outer coasts; free elsewhere; the bay is not a neighbour
const P = new Float32Array(N * N), fixed = new Uint8Array(N * N), crest = new Uint8Array(N * N);
const wob = (k, s) => E.E4.coastWobbleMetres * 2 * (fbm(X(k) / 900, Z(k) / 900, 3, s) - 0.5); // drawn lines wander a little, as real coasts and crests do
const line3 = (pts, hOf, isCrest) => { const flat = pts.map((q) => [q[0], q[1]]); for (let k = 0; k < N * N; k++) if (M[k]) { const [d, t] = distPolyline(flat, X(k) + wob(k, 21), Z(k) + wob(k, 22)); if (d < CELL * 0.75) { fixed[k] = 1; crest[k] = isCrest; P[k] = hOf(t); } } };
const along = (pts) => (t) => { const a = Math.min(Math.floor(t), pts.length - 2), f = t - a; return mix(pts[a][2], pts[a + 1][2], f); };
line3(E.E4.rimCrest, along(E.E4.rimCrest), 1); line3(E.E4.southWestCrest, along(E.E4.southWestCrest), 1); line3(E.E6.saddle, along(E.E6.saddle), 1);
line3(E.E4.outerCoast, () => 1, 0); line3(E.E6.outerCoast, () => 1, 0);
for (let k = 0; k < N * N; k++) if (M[k] && !fixed[k]) P[k] = 60;
for (let it = 0, w = 1.94; it < 2500; it++) {
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i; if (!M[k] || fixed[k]) continue;
    let s = 0, n = 0;
    for (const o of [-1, 1, -N, N]) { const q = k + o; if (bay[q]) continue; s += M[q] ? P[q] : h.d[q]; n++; }
    if (n) P[k] += w * (s / n - P[k]);
  }
}
// the inner wall: within wallWidth of the bay the land falls to the water with a cliff profile
const dBay = blur(near(bay), N, 1, 2), dKept = near(Uint8Array.from(M, (v, k) => (v || bay[k] ? 0 : 1))), dCrest = near(crest);
for (let k = 0; k < N * N; k++) if (M[k]) {
  let v = P[k];
  if (v > 0) { const t = clamp((dBay[k] * CELL - CELL * 0.6) / E.E4.wallWidthMetres, 0, 1); v *= Math.pow(Math.sin(t * Math.PI / 2), E.E4.wallExponent); if (dBay[k] * CELL < E.E4.wallWidthMetres) v = Math.max(v, 0.6); }
  // modelled relief, fading out towards kept terrain, the crest lines and the shores
  if (v > 2) { const amp = E.E4.reliefMetres * Math.min(sstep(0, 12, dKept[k]), sstep(0, 8, dCrest[k]), sstep(2, 40, v)); v += amp * 2 * (fbm(X(k) / E.E4.reliefWavelengthMetres, Z(k) / E.E4.reliefWavelengthMetres, 4, 3) - 0.5); if (v < 0.6) v = 0.6; }
  h.d[k] = v;
}
// E5: the bay floor, shelving from its shores
const dShore = near(Uint8Array.from(bay, (v) => (v ? 0 : 1)));
for (let k = 0; k < N * N; k++) if (bay[k]) h.d[k] = -0.4 - (E.E5.depthMetres - 0.4) * sstep(0, E.E5.shoreShelfMetres, (dShore[k] - 0.5) * CELL);
// Rain on the restored land: a stream-power erosion model cuts gullies into the membrane, as on the surviving slopes.
// Each round: every cell drains to its lowest neighbour, drainage areas are added up from the top down, and each cell is
// lowered by rate * sqrt(area) * slope, never below the cell it drains to. Kept terrain, the bay and the sea do not change.
{
  const p = E.E4.erosion, land = []; for (let k = 0; k < N * N; k++) if (M[k] && h.d[k] > 0.6) land.push(k);
  const rec = new Int32Array(N * N), area = new Float32Array(N * N), O = [-1, 1, -N, N, -N - 1, -N + 1, N - 1, N + 1], OD = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
  const jit = new Float32Array(N * N); for (const k of land) jit[k] = p.routingJitterMetres * 2 * (fbm(X(k) / 110, Z(k) / 110, 2, 77) - 0.5);
  for (let it = 0; it < p.rounds; it++) {
    land.sort((a, b) => h.d[b] - h.d[a] || a - b);
    // (the choice of neighbour looks at a slightly jittered surface, so channels do not run along the grid)
    for (const k of land) { let best = -1, bs = 0; for (let o = 0; o < 8; o++) { const q = k + O[o], s = (h.d[k] + jit[k] - h.d[q] - jit[q]) / OD[o]; if (s > bs && h.d[q] < h.d[k]) { bs = s; best = o; } } rec[k] = best; area[k] = 1; }
    for (const k of land) { const o = rec[k]; if (o < 0) { let lo = 1e9; for (let n = 0; n < 8; n++) lo = Math.min(lo, h.d[k + O[n]]); h.d[k] = lo + 0.05; continue; } // a pit: fill it
      const q = k + O[o]; if (M[q] && h.d[q] > 0.6) area[q] += area[k]; }
    for (let n = land.length - 1; n >= 0; n--) { const k = land[n], o = rec[k]; if (o < 0) continue; const q = k + O[o], drop = h.d[k] - h.d[q];
      h.d[k] -= Math.min(p.rate * Math.sqrt(area[k]) * drop / (OD[o] * CELL) * CELL, drop * 0.6) * sstep(0, 3, dKept[k]); }
    // soil creep: a little smoothing, so gully walls are slopes and not steps
    for (const k of land) area[k] = (h.d[k - 1] + h.d[k + 1] + h.d[k - N] + h.d[k + N]) / 4;
    for (const k of land) if (dBay[k] > 1.5 && h.d[k] > 2) h.d[k] = mix(h.d[k], Math.max(area[k], 0.6), p.creep);
  }
}
// E6: the channel through the low ground
{
  const p = E.E6, half = p.channelWidthMetres / 2; let cells = 0;
  for (let k = 0; k < N * N; k++) if (M[k] || bay[k]) { const [d] = distPolyline(p.channel, X(k), Z(k)); if (d < half + p.channelBankMetres) { const v = mix(-p.channelDepthMetres, h.d[k], sstep(half, half + p.channelBankMetres, d)); if (v < h.d[k]) { h.d[k] = v; if (d < half) cells++; } } }
  let low = 1e9; for (let k = 0; k < N * N; k++) if (inBridge[k] && crest[k] && h.d[k] > 2) low = Math.min(low, h.d[k]);
  report.edits.E6 = { channelWidthMetres: p.channelWidthMetres, channelDepthMetres: p.channelDepthMetres, channelFloorKm2: r2(cells * A / 1e6) };
}
{ // the volumes of E4 (with the low ground of E6) and E5, measured against today's surface in the same datum
  let add = 0, above = 0, area = 0, top = 0, bayArea = 0, bayFill = 0, landIn = 0;
  for (let k = 0; k < N * N; k++) {
    if (M[k]) { const d = h.d[k] - T.d[k]; add += d; if (h.d[k] > 0) { area++; above += h.d[k] - Math.max(T.d[k], 0); if (h.d[k] > top) top = h.d[k]; } }
    if (bay[k]) { bayArea++; bayFill += h.d[k] - T.d[k]; }
  }
  const v = add * A / 1e9, [lo, hi] = E.E4.volumeRangeKm3;
  report.edits.E4 = { volumeAddedKm3: r2(v), volumeAddedAboveSeaKm3: r2(above * A / 1e9), restoredLandKm2: r2(area * A / 1e6), highestRestoredPointMetres: r1(top), allowedRangeKm3: [lo, hi] };
  report.edits.E5 = { bayKm2: r2(bayArea * A / 1e6), depthMetres: E.E5.depthMetres, volumeBetweenTodaysFloorAndBayFloorKm3: r2(bayFill * A / 1e9) };
  if (v < lo || v > hi) { console.error(`E4 adds ${v.toFixed(2)} km3, outside ${lo}-${hi} km3 (T1#14): change edits.json`); process.exit(1); }
}

// ---------------------------------------------------------------- E7: Pre-Kameni (a modern label)
const dome = new Uint8Array(N * N);
{
  const p = E.E7, az = p.longAxisAzimuthDegrees * Math.PI / 180, ax = Math.sin(az), az_ = -Math.cos(az), [a, b] = p.semiAxesMetres; let vol = 0, top = -1e9, tk = 0, area = 0;
  const rho = (x, z) => { const dx = x - p.centre[0], dz = z - p.centre[1], u = dx * ax + dz * az_, v = dx * -az_ + dz * ax; return Math.hypot(u / a, v / b); };
  const dh = new Float32Array(N * N);
  for (let k = 0; k < N * N; k++) {
    const x = X(k), z = Z(k), r0 = rho(x, z); if (r0 >= 1.12) continue;
    // lava-flow lobes: the outline wanders by a few per cent around the drawn ellipse, and the surface is ridged
    const r = r0 * (1 + p.outlineWobble * 2 * (fbm(x / 700, z / 700, 3, 31) - 0.5)); if (r >= 1) continue;
    if (!bay[k]) { console.error('E7: Pre-Kameni touches land outside the bay at', x, z); process.exit(1); }
    let d = p.heightMetres * (1 - Math.pow(r, p.exponent));
    const ridged = 1 - Math.abs(2 * fbm(x / 520 + 3 * fbm(x / 1300, z / 1300, 2, 5), z / 520, 4, 9) - 1);
    d += p.roughnessMetres * (2 * ridged - 1.1) * sstep(0, 30, d) * sstep(p.heightMetres, p.heightMetres - 25, d);
    if (d > 0) { dh[k] = d; vol += d; }
  }
  const scale = p.volumeTargetKm3 / (vol * A / 1e9); vol = 0; // the wandering outline changes the volume a little: scale the heights back to the target
  for (let k = 0; k < N * N; k++) if (dh[k]) { const d = dh[k] * scale; vol += d; h.d[k] += d; if (h.d[k] > 0) { dome[k] = 1; area++; } if (h.d[k] > top) { top = h.d[k]; tk = k; } }
  const vent = p.ventWestOfFiraMetres.map((w) => r2(rho(p.fira[0] - w, p.fira[1])));
  report.edits.E7 = { volumeAboveBayFloorKm3: r3(vol * A / 1e9), formulaVolumeKm3: r3(Math.PI * a * b * p.heightMetres * p.exponent / (p.exponent + 2) / 1e9), summitMetres: r1(top), islandKm2: r2(area * A / 1e6),
    ventPositionsAsFractionOfTheDomeRadius: { '1 km west of Fira': vent[0], '2 km west of Fira': vent[1] } };
  if (top >= 260) { console.error('E7: the summit must stay below the 260 m rim (T1b correction 1)'); process.exit(1); }
}

// ---------------------------------------------------------------- E8: the terrace at Akrotiri
{
  const p = E.E8, sl = Math.hypot(...p.seaDirection), sx = p.seaDirection[0] / sl, sz = p.seaDirection[1] / sl; let n = 0, lo = 1e9, hi = -1e9;
  for (let k = 0; k < N * N; k++) {
    const dx = X(k) - p.site[0], dz = Z(k) - p.site[1], d = Math.hypot(dx, dz); if (d > p.radiusMetres + p.blendMetres || h.d[k] <= 0.5) continue;
    const target = Math.max(1.2, p.hillTopMetres - p.slopeTowardsSea * (dx * sx + dz * sz)), w = 1 - sstep(p.radiusMetres, p.radiusMetres + p.blendMetres, d);
    h.d[k] = mix(h.d[k], target, w); if (w > 0.99) { n++; lo = Math.min(lo, h.d[k]); hi = Math.max(hi, h.d[k]); }
  }
  report.edits.E8 = { siteLonLat: [r3(toLon(p.site[0]) * 10) / 10, r3(toLat(p.site[1]) * 10) / 10], terraceKm2: r2(n * A / 1e6), terraceHeightsMetres: [r1(lo), r1(hi)], groundAtSiteBeforeMetres: r1(afterE3.sample(...p.site)), groundAtSiteMetres: r1(h.sample(...p.site)) };
}

// ---------------------------------------------------------------- E9: Profitis Ilias, checked
{
  let top = -1, tk = 0, raw = -1; for (let k = 0; k < N * N; k++) if (basement[k] === 1 && h.d[k] > top) { top = h.d[k]; tk = k; }
  for (let la = 36.36; la < 36.38; la += dem.dLat) for (let lo = 25.455; lo < 25.47; lo += dem.dLon) raw = Math.max(raw, sampleGeo(dem, lo, la));
  Object.assign(report.edits.E9, { summitInTheSourceDemMetres: r1(raw), summitOnTheGridMetresAbove1615Sea: r1(top), summitLonLat: [r3(toLon(X(tk)) * 10) / 10, r3(toLat(Z(tk)) * 10) / 10], strippedAtSummitMetres: r2(T.d[tk] - h.d[tk]) });
}

// ---------------------------------------------------------------- rock classes
const rock = new Uint8Array(N * N);
{
  const ak = mask(E.rock.akrotiriPeninsula), th = mask(E.rock.therasia), names = Object.keys(E.E9.basement), count = [0, 0, 0, 0, 0, 0, 0];
  const dDome = near(dome); // Pre-Kameni's rock carries on under the water around its shore
  for (let k = 0; k < N * N; k++) {
    let c = 0;
    if (dome[k] || (bay[k] && dDome[k] < 4)) c = 3;
    else if (bay[k]) c = 6;
    else if (basement[k]) c = h.d[k] > E.E9.marbleAboveMetres[names[basement[k] - 1]] ? 5 : 4;
    else if (th[k]) c = 2;
    else if (ak[k]) c = 1;
    rock[k] = c; if (h.d[k] > 0) count[c]++;
  }
  report.rockClassLandKm2 = Object.fromEntries(['0 undivided volcanic', '1 light-grey andesite', '2 dark-grey andesite', '3 black glassy andesite', '4 phyllite and schist', '5 marble'].map((n, i) => [n, r2(count[i] * A / 1e6)]));
}

// ---------------------------------------------------------------- the whole island, and the encoded data
{
  let land = 0, top = 0; for (let k = 0; k < N * N; k++) if (h.d[k] > 0) { land++; if (h.d[k] > top) top = h.d[k]; }
  let landT = 0; for (let k = 0; k < N * N; k++) if (today.d[k] > 0) landT++;
  report.island = { landKm2In1615: r2(land * A / 1e6), landKm2Today: r2(landT * A / 1e6), highestPointMetres: r1(top) };
}
const enc = encodeTerrain(h.d, rock, N, CF);
report.data = { bytes: enc.bytes.length, sha256: createHash('sha256').update(enc.bytes).digest('hex'), heightUnitMetres: UNIT, fineCellsStored: enc.fineStored, maxErrorMetresOnLand: r2(enc.maxErrLand), rmsErrorMetresOnLand: r2(enc.rmsLand), maxErrorMetresUnderwater: r2(enc.maxErrSea) };
// the page's own reader (source/src/world.js) must give back exactly this grid
{
  const w = readFileSync(path.join(root, 'source', 'src', 'world.js'), 'utf8'), a = w.indexOf('// <terrain-decoder>'), b = w.indexOf('// </terrain-decoder>');
  if (a < 0 || b < 0) { console.error('source/src/world.js has no terrain-decoder marks'); process.exit(1); }
  const page = new Function(w.slice(a, b) + '\nreturn decodeTerrain;')()(enc.bytes);
  for (let k = 0; k < N * N; k++) if (page.q[k] !== enc.q[k] || page.rock[k] !== rock[k]) { console.error('the page\'s terrain decoder disagrees with the data at cell ' + k); process.exit(1); }
  report.data.pageDecoderAgrees = true;
}
const b64 = Buffer.from(enc.bytes).toString('base64');
writeFileSync(path.join(root, 'source', 'src', 'terrain-data.js'),
  `// GENERATED by tools/terrain/build.mjs from tools/terrain/edits.json. Do not edit: change the edits and rebuild.\n`
  + `// The island of Thera in 1615 BCE: a ${N} x ${N} grid of ${CELL} m cells centred on 36.405 N, 25.405 E, with a rock class per cell.\n`
  + `//\n`
  + `// THIS FILE IS NOT UNDER THE MIT LICENCE of the code around it. It is data derived from two datasets and stays under their terms.\n`
  + `// The notices below are the licences' own words (as checked in docs/research/verification/T1c.md), each on one line.\n`
  + `//\n`
  + `// Land. Copernicus DEM GLO-30 (COP-DEM-GLO-30-F), Licence for the use of the Copernicus WorldDEM-30, article 6:\n`
  + `//   produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved\n`
  + `//   The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30\n`
  + `// Anyone who distributes this file or the page built from it, changed or not, must keep that notice and that sentence and bind those\n`
  + `// they pass it to to the same terms. The use of the data here is not endorsed by the Copernicus programme.\n`
  + `//\n`
  + `// Sea floor. EMODnet DTM 2024, EMODnet terms of use; licence text at https://creativecommons.org/licenses/by/4.0/ :\n`
  + `//   This data product was created by EMODnet ( https://emodnet.ec.europa.eu/en/ ), and is owned by the EU and licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license.\n`
  + `//   EMODnet Bathymetry Consortium (2024), EMODnet Digital Bathymetry (DTM 2024), https://doi.org/10.12770/cf51df64-56f9-4a99-b1aa-36b8d7b743a1.\n`
  + `//   Not to be used for navigation.\n`
  + `//\n`
  + `// Both datasets were changed: resampled, joined, and reshaped into a reconstruction of the island before the Late Bronze Age eruption\n`
  + `// by the edits recorded in docs/terrain/README.md. The heights here are a model of the past, not a survey of the present.\n`
  + `const TERRAIN = '${b64}';\n`);
mkdirSync(path.join(root, 'docs', 'terrain'), { recursive: true });
writeFileSync(path.join(root, 'docs', 'terrain', 'build-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 1));
console.log(`terrain-data.js: ${enc.bytes.length} bytes of data, ${(b64.length / 1024).toFixed(1)} kB as text`);

// ---------------------------------------------------------------- previews
if (PREVIEW) {
  mkdirSync(PREVIEW, { recursive: true });
  const crop = [100, 80, 580, 580], dec = new Grid(N, CELL, enc.decoded);
  const lines = [[E.E4.rimCrest, [255, 60, 60]], [E.E4.southWestCrest, [255, 60, 60]], [E.E4.outerCoast, [60, 255, 255]], [E.E6.outerCoast, [60, 255, 255]], [E.E6.saddle, [255, 60, 60]], [E.E6.channel, [255, 255, 0]],
    [[...E.E4.southLand, E.E4.southLand[0]], [255, 0, 255]], [[...E.E6.bridge, E.E6.bridge[0]], [255, 0, 255]], [[...E.E2.outline, E.E2.outline[0]], [0, 0, 0]]];
  const overlay = (i, j) => { const x = g0.gx(i), z = g0.gz(j); for (const [pts, c] of lines) if (distPolyline(pts.map((q) => [q[0], q[1]]), x, z)[0] < CELL * 0.6) return [...c, 0.8]; const d = Math.hypot(x - E.E8.site[0], z - E.E8.site[1]); return d < 60 ? [255, 0, 0, 1] : null; };
  const RC = [null, [200, 200, 205], [90, 90, 100], [20, 20, 25], [120, 110, 90], [245, 245, 235], null];
  writeFileSync(path.join(PREVIEW, 'today.png'), relief(T, { crop, zoom: 2 }));
  writeFileSync(path.join(PREVIEW, 'today-edits.png'), relief(T, { crop, zoom: 2, overlay }));
  writeFileSync(path.join(PREVIEW, '1615.png'), relief(dec, { crop, zoom: 2 }));
  writeFileSync(path.join(PREVIEW, '1615-rock.png'), relief(dec, { crop, zoom: 2, overlay: (i, j) => { const c = RC[rock[j * N + i]]; return c && dec.at(i, j) > 0 ? [...c, 0.65] : null; } }));
  const strip = new Grid(N, CELL); for (let k = 0; k < N * N; k++) strip.d[k] = T.d[k] - afterE3.d[k];
  writeFileSync(path.join(PREVIEW, 'e3-thickness.png'), relief(T, { crop, zoom: 2, overlay: (i, j) => { const t = strip.at(i, j); return t > 0.2 ? [mix(255, 120, clamp(t / 40, 0, 1)), mix(240, 0, clamp(t / 40, 0, 1)), 40, 0.75] : null; } }));
  console.log('previews in', PREVIEW);
}
