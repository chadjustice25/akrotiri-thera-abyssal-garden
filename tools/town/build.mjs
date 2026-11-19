#!/usr/bin/env node
// ============================================================================
// Builds the town at Akrotiri in 1615 BCE from its rules (town.json) and the traced plan (traced.json)
// ============================================================================
//   node tools/town/build.mjs [--preview DIR]   writes source/src/town-data.js and docs/town/build-report.json
// The output is deterministic: the same town.json, traced.json and terrain give the same bytes.
// What it does:
//   1. takes the outlines of the excavated part as trace.mjs drew them from the plan, with what town.json records of each;
//   2. fills the rest of the town (beyond the edge of the excavated walls) with houses by rule: streets, alleys and
//      blind alleys cut each district into blocks and lots, the lots step in and out along the streets, and the town
//      thins towards its edge. All of that is reconstruction (liberty A-L1) and is marked so in the data;
//   3. packs everything into a small binary block that the page reads at start (source/src/world.js).
// The record of every rule, claim and liberty is docs/town/README.md.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Canvas } from './png.mjs';
import { area, bbox, centroid, clamp, clipHalf, distPoly, distSeg, inPoly, polysOverlap, rng, sstep } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..', '..');
const T = JSON.parse(readFileSync(path.join(here, 'town.json'), 'utf8')), TRC = JSON.parse(readFileSync(path.join(here, 'traced.json'), 'utf8'));
const P = T.plan, TW = T.town, RU = T.rules;
const pv = process.argv.indexOf('--preview'), PREVIEW = pv > 0 ? path.resolve(process.argv[pv + 1]) : null;
const r1 = (v) => Math.round(v * 10) / 10, r2 = (v) => Math.round(v * 100) / 100;
const fail = (m) => { console.error(m); process.exit(1); };

// ---------------------------------------------------------------- the frame, and the ground
const PCX = (P.wallBoxPx[0] + P.wallBoxPx[2]) / 2, PCY = (P.wallBoxPx[1] + P.wallBoxPx[3]) / 2;
const toWorld = (p) => [P.centreWorld[0] + (p[0] - PCX) / P.pxPerMetreEastWest, P.centreWorld[1] + (p[1] - PCY) / P.pxPerMetreNorthSouth];
// the terrain as the page will decode it (the 40 m grid; the page smooths it and adds detail under a metre here)
const ground = (() => {
  const w = readFileSync(path.join(root, 'source', 'src', 'world.js'), 'utf8'), a = w.indexOf('// <terrain-decoder>'), b = w.indexOf('// </terrain-decoder>');
  const D = new Function(w.slice(a, b) + '\nreturn decodeTerrain;')()(Uint8Array.from(Buffer.from(readFileSync(path.join(root, 'source', 'src', 'terrain-data.js'), 'utf8').match(/TERRAIN = '([^']+)'/)[1], 'base64')));
  const N = D.N, at = (i, j) => D.q[clamp(j, 0, N - 1) * N + clamp(i, 0, N - 1)] * 0.25;
  return (x, z) => { const u = x / 40 + N / 2 - 0.5, v = z / 40 + N / 2 - 0.5, i = Math.floor(u), j = Math.floor(v), fu = u - i, fv = v - j; return (at(i, j) * (1 - fu) + at(i + 1, j) * fu) * (1 - fv) + (at(i, j + 1) * (1 - fu) + at(i + 1, j + 1) * fu) * fv; };
})();
const slope = (x, z) => Math.hypot(ground(x + 10, z) - ground(x - 10, z), ground(x, z + 10) - ground(x, z - 10)) / 20;

// ---------------------------------------------------------------- 1. the excavated part, from the plan
const STONE = { undefined: 0, tuff: 1, ignimbrite: 2 }, KIND = { undefined: 0, porch: 1 }, FEAT = { door: 1, lowWindow: 2, bigUpperWindow: 3, pierWindows: 4, penthouse: 5, lightWell: 6, benches: 7, horns: 8 };
const masses = TRC.buildings.map((t) => {
  const m = T.masses[t.id]; if (!m) fail(`town.json has no record (masses) for ${t.id}`);
  const status = m.status || (t.shareOnDrawnWalls >= T.trace.excavatedIfShareAtLeast ? 'excavated' : 'reconstructed'), o = t.outline;
  const features = (m.features || []).map((f) => {
    const p = toWorld(f.nearPx); let k = 0, best = 1e9;
    for (let i = 0; i < o.length; i++) { const d = distSeg(p[0], p[1], o[i], o[(i + 1) % o.length]); if (d < best) { best = d; k = i; } }
    const a = o[k], b = o[(k + 1) % o.length], dx = b[0] - a[0], dz = b[1] - a[1], t01 = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz), 0, 1);
    if (!FEAT[f.type]) fail(`${t.id}: unknown feature ${f.type}`);
    return { type: f.type, edge: k, t: t01, param: f.sill !== undefined ? Math.round(f.sill * 100) : 0 };
  });
  return { id: t.id, label: m.label, group: m.group || t.id, partOf: m.partOf || null, status, by: 'plan', share: t.shareOnDrawnWalls, outline: o, storeys: m.storeys, stone: m.stone, kind: m.kind, stringCourses: !!m.stringCourses, bigWindows: !!m.bigWindows, lowStorey: !!m.lowStorey, features, area: Math.abs(area(o)) };
});
const edge = TRC.edge;
const terraces = T.open.terraces.map((t) => ({ label: t.label, outline: t.outlinePx.map(toWorld) }));
for (const t of terraces) for (const m of masses) if (polysOverlap(t.outline, m.outline)) fail(`a terrace overlaps ${m.id}`);
const pithos = toWorld(T.open.pithos.atPx);
for (const m of masses) if (inPoly(m.outline, pithos[0], pithos[1])) fail(`the pithos stands inside ${m.id}`);

// ---------------------------------------------------------------- 2. the rest of the town, by rule
// Each district is cut in two again and again. A cut through a large piece leaves a main street, through a smaller one a
// street, then an alley (sometimes blind: open only part of the way), and through a block a party wall, until every piece
// is a lot of a house's size. Then the streets are taken out of the lots, some fronts are set back, and the whole is bent
// a little so that no street runs ruler-straight.
const lots = [];
{
  const S = TW.streetMetres, B = TW.blockSquareMetres, between = (r, a) => a[0] + (a[1] - a[0]) * r();
  for (const D of TW.districts) {
    const r = rng(D.seed), th0 = D.angleDegrees * Math.PI / 180, lines = [], out = [];
    // a polygon with a tag on each edge: -1 the district's own edge, otherwise the cut it lies on
    const clip = (g, a, b, keep, tag) => {
      const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz), nx = -dz / l * keep, nz = dx / l * keep, p = [], t = [], n = g.p.length;
      const side = (q) => (q[0] - a[0]) * nx + (q[1] - a[1]) * nz;
      for (let i = 0; i < n; i++) {
        const c = g.p[i], d = g.p[(i + 1) % n], sc = side(c), sd = side(d), X = () => { const u = sc / (sc - sd); return [c[0] + (d[0] - c[0]) * u, c[1] + (d[1] - c[1]) * u]; };
        if (sc >= 0) { p.push(c); t.push(g.t[i]); if (sd < 0) { p.push(X()); t.push(tag); } } else if (sd >= 0) { p.push(X()); t.push(g.t[i]); }
      }
      return { p, t };
    };
    const cut = (g, th) => {
      const A = Math.abs(area(g.p)), ux = Math.cos(th), uz = Math.sin(th); let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
      for (const q of g.p) { const u = q[0] * ux + q[1] * uz, v = -q[0] * uz + q[1] * ux; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
      const w = u1 - u0, h = v1 - v0, least = TW.lotSquareMetresBeforeStreets[0];
      // a piece too small to give two houses is one lot
      if (A < 2 * least || g.p.length < 3) { if (A > 40) out.push(g); return; }
      // cut across the longer side, a little off the middle (never so far off that a half is too small for a house) and a little off square
      const alongU = w >= h, off = Math.min(A > B.alley ? 0.15 : 0.08, 0.5 - least / A), f = 0.5 + (r() * 2 - 1) * off, jit = (r() - 0.5) * (A > B.street ? 0.2 : 0.09);
      const cu = alongU ? u0 + w * f : (u0 + u1) / 2, cv = alongU ? (v0 + v1) / 2 : v0 + h * f, cx = cu * ux - cv * uz, cz = cu * uz + cv * ux;
      const da = th + (alongU ? Math.PI / 2 : 0) + jit, L = Math.max(w, h) * 2, a = [cx - Math.cos(da) * L, cz - Math.sin(da) * L], b = [cx + Math.cos(da) * L, cz + Math.sin(da) * L];
      let half = 0, blind = null;
      if (A > B.main) half = between(r, S.main) / 2; else if (A > B.street) half = between(r, S.street) / 2;
      else if (A > B.alley) { half = between(r, S.alley) / 2; if (r() < 0.4) { const span = alongU ? h : w, open = (0.45 + 0.3 * r()) * span; blind = r() < 0.5 ? [L - span / 2 - 1, L - span / 2 + open] : [L + span / 2 - open, L + span / 2 + 1]; } }
      lines.push({ a, b, half, blind });
      cut(clip(g, a, b, 1, lines.length - 1), th + (r() - 0.5) * 0.06); cut(clip(g, a, b, -1, lines.length - 1), th + (r() - 0.5) * 0.06);
    };
    cut({ p: D.outline.map((q) => q.slice()), t: D.outline.map(() => -1) }, th0);
    const cen = centroid(D.outline);
    for (const g of out) {
      // take the streets out: every edge moves in by half the width of the street it lies on
      let p = g.p; const n = p.length, moves = [];
      for (let i = 0; i < n; i++) {
        const a = g.p[i], b = g.p[(i + 1) % n], tag = g.t[i]; let half = S.street[0] / 2;
        if (tag >= 0) { const ln = lines[tag]; half = ln.half; if (ln.blind) { const mx = (a[0] + b[0]) / 2 - ln.a[0], mz = (a[1] + b[1]) / 2 - ln.a[1], s = (mx * (ln.b[0] - ln.a[0]) + mz * (ln.b[1] - ln.a[1])) / Math.hypot(ln.b[0] - ln.a[0], ln.b[1] - ln.a[1]); if (s < ln.blind[0] || s > ln.blind[1]) half = 0; } }
        // fronts step in and out along the streets (T2#9); party walls stay where they are
        const back = half > 0 && r() < 0.45 ? between(r, TW.setbackMetres) : 0;
        moves.push([a, b, half + back + 0.04, half > 0]);
      }
      const sgn = area(g.p) > 0 ? 1 : -1; let open = 0;
      for (const [a, b, d, street] of moves) { p = clipHalf(p, a, b, sgn, d); if (street) open++; }
      if (p.length < 3) continue;
      lots.push({ outline: p, district: D.id, cen, D, open, roll: [r(), r(), r(), r()] });
    }
  }
}
// bend: one smooth, slow displacement of the whole reconstruction. Where a neighbour's corner meets the middle of a
// lot's side, the side gets a corner there too, so that the two still fit after bending.
{
  const boxes = lots.map((l) => bbox(l.outline));
  lots.forEach((l, li) => {
    const o = l.outline, n = o.length, res = [], B = boxes[li];
    for (let i = 0; i < n; i++) {
      const a = o[i], b = o[(i + 1) % n], dx = b[0] - a[0], dz = b[1] - a[1], len2 = dx * dx + dz * dz, ts = [];
      lots.forEach((m, mi) => {
        const C = boxes[mi]; if (mi === li || C[2] < B[0] - 0.5 || B[2] < C[0] - 0.5 || C[3] < B[1] - 0.5 || B[3] < C[1] - 0.5) return;
        for (const v of m.outline) { const t = ((v[0] - a[0]) * dx + (v[1] - a[1]) * dz) / len2; if (t > 0.04 && t < 0.96 && Math.hypot(v[0] - a[0] - dx * t, v[1] - a[1] - dz * t) < 0.3) ts.push(t); }
      });
      res.push(a); ts.sort((u, v) => u - v);
      let last = 0; for (const t of ts) if (t - last > 0.04) { res.push([a[0] + dx * t, a[1] + dz * t]); last = t; }
    }
    l.fitted = res;
  });
  for (const l of lots) l.outline = l.fitted;
}
{
  const A = TW.bendMetres, k = 2 * Math.PI / TW.bendEveryMetres;
  const bend = (q) => [q[0] + A * (Math.sin(k * q[1] + 1.3) + 0.5 * Math.sin(k * 0.61 * (q[0] + q[1]) + 4.1)), q[1] + A * (Math.sin(k * 0.8 * q[0] + 2.2) + 0.5 * Math.sin(k * 0.53 * (q[0] - q[1]) + 0.7))];
  for (const l of lots) l.outline = l.outline.map(bend);
}
// keep clear of the excavated part, keep to the size of a house, keep off steep ground, and thin towards the edge
const dropped = { nearThePlan: 0, size: 0, steep: 0, thinned: 0, outsideTheTown: 0 };
const [fpLo, fpHi] = RU.footprint.typicalSquareMetres, clear = TW.clearOfExcavatedMetres;
const growConvex = (o, d) => { const s = area(o) > 0 ? 1 : -1, n = o.length, ln = o.map((a, i) => { const b = o[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (b[1] - a[1]) / l * s, nz = -(b[0] - a[0]) / l * s; return [a[0] + nx * d, a[1] + nz * d, b[0] - a[0], b[1] - a[1]]; }); return ln.map((L, i) => { const M = ln[(i + n - 1) % n], den = M[2] * L[3] - M[3] * L[2]; if (Math.abs(den) < 1e-9) return [L[0], L[1]]; const u = ((L[0] - M[0]) * L[3] - (L[1] - M[1]) * L[2]) / den; return [M[0] + M[2] * u, M[1] + M[3] * u]; }); };
const obstacles = [...masses.map((m) => m.outline), ...terraces.map((t) => t.outline)].map((o) => ({ o, grown: growConvex(o, clear), box: bbox(growConvex(o, clear)) }));
const nearEdge = (o) => polysOverlap(o, edge) || o.some((q) => distPoly(edge, q[0], q[1]) < clear) || edge.some((q) => distPoly(o, q[0], q[1]) < clear && !inPoly(o, q[0], q[1]) === true);
const town = [];
for (const l of lots) {
  let o = l.outline, ok = true;
  // a lot that comes too close to an excavated building is cut back along that building's nearest side
  for (const ob of obstacles) {
    const b = bbox(o); if (b[2] < ob.box[0] || ob.box[2] < b[0] || b[3] < ob.box[1] || ob.box[3] < b[1] || !polysOverlap(o, ob.grown)) continue;
    const c = centroid(o), s = area(ob.o) > 0 ? 1 : -1, n = ob.o.length; let best = -1e9, k = -1;
    for (let i = 0; i < n; i++) { const a = ob.o[i], e = ob.o[(i + 1) % n], len = Math.hypot(e[0] - a[0], e[1] - a[1]), d = ((c[0] - a[0]) * (e[1] - a[1]) - (c[1] - a[1]) * (e[0] - a[0])) / len * s; if (d > best) { best = d; k = i; } }
    if (best <= 0) { ok = false; break; }
    o = clipHalf(o, ob.o[k], ob.o[(k + 1) % n], -s, clear);
    if (o.length < 3 || polysOverlap(o, ob.grown.map((q, i) => [(q[0] * 9 + ob.o[i][0]) / 10, (q[1] * 9 + ob.o[i][1]) / 10]))) { ok = false; break; }
  }
  // and no lot stands inside the edge of the excavated walls: there the plan alone speaks
  if (ok && o.length > 2 && nearEdge(o)) {
    const c = centroid(o); let best = 1e9, k = 0;
    for (let i = 0; i < edge.length; i++) { const d = distSeg(c[0], c[1], edge[i], edge[(i + 1) % edge.length]); if (d < best) { best = d; k = i; } }
    if (inPoly(edge, c[0], c[1])) ok = false;
    else { const a = edge[k], e = edge[(k + 1) % edge.length], side = (c[0] - a[0]) * (e[1] - a[1]) - (c[1] - a[1]) * (e[0] - a[0]) > 0 ? 1 : -1; o = clipHalf(o, a, e, -side, clear); if (o.length < 3 || nearEdge(o)) ok = false; }
  }
  if (!ok || o.length < 3) { dropped.nearThePlan++; continue; }
  // a lot larger than a typical house gives up ground on its longest side until it is one (a wider street or a yard's width)
  for (let tries = 0; Math.abs(area(o)) > fpHi && tries < 40; tries++) {
    let k = 0, best = 0; for (let i = 0; i < o.length; i++) { const d = Math.hypot(o[(i + 1) % o.length][0] - o[i][0], o[(i + 1) % o.length][1] - o[i][1]); if (d > best) { best = d; k = i; } }
    o = clipHalf(o, o[k], o[(k + 1) % o.length], area(o) > 0 ? 1 : -1, Math.max(0.15, (Math.abs(area(o)) - fpHi) / best));
  }
  const A = Math.abs(area(o)), c = centroid(o);
  if (A < fpLo || A > fpHi) { dropped.size++; continue; }
  if (slope(c[0], c[1]) > TW.maxSlope || ground(c[0], c[1]) < 2) { dropped.steep++; continue; }
  // thinning: the nearer the town's outer edge, the more lots stay empty
  let dOut = 1e9; for (const i of l.D.outer) dOut = Math.min(dOut, distSeg(c[0], c[1], l.D.outline[i], l.D.outline[(i + 1) % l.D.outline.length]));
  const dense = sstep(0, TW.fringeMetres, dOut);
  if (l.roll[0] > l.D.keep * (0.3 + 0.7 * dense)) { dropped.thinned++; continue; }
  const storeys = l.roll[1] < RU.storeys.shareOfThree * (0.4 + 0.6 * dense) ? 3 : 2;
  town.push({ id: `${l.district}-${town.length}`, label: 'house by rule', group: null, partOf: null, status: 'reconstructed', by: 'rule', outline: area(o) < 0 ? o.slice().reverse() : o, storeys, features: [], area: A, seed: Math.floor(l.roll[2] * 256) });
}
// no two buildings overlap
{
  const all = [...masses, ...town], boxes = all.map((m) => bbox(m.outline)), inset = (o) => { const c = centroid(o); return o.map((p) => { const d = Math.hypot(p[0] - c[0], p[1] - c[1]) || 1; return [p[0] + (c[0] - p[0]) * 0.06 / d, p[1] + (c[1] - p[1]) * 0.06 / d]; }); };
  for (let i = 0; i < all.length; i++) for (let j = Math.max(i + 1, masses.length); j < all.length; j++) { const a = boxes[i], b = boxes[j]; if (a[2] < b[0] || b[2] < a[0] || a[3] < b[1] || b[3] < a[1]) continue; if (polysOverlap(inset(all[i].outline), inset(all[j].outline))) fail(`OVERLAP: ${all[i].id} and ${all[j].id}`); }
}

// ---------------------------------------------------------------- the town's extent
// the area inside the town's outline: the excavated core and the districts together
let hectares = 0, builtM2 = 0;
{
  const polys = [TW.core, ...TW.districts.map((d) => d.outline)], b = bbox(polys.flat());
  for (let z = Math.floor(b[1]); z < b[3]; z++) for (let x = Math.floor(b[0]); x < b[2]; x++) if (polys.some((p) => inPoly(p, x + 0.5, z + 0.5))) hectares++;
  hectares /= 1e4; for (const m of [...masses, ...town]) builtM2 += m.area;
}

// ---------------------------------------------------------------- 3. pack it
const Q = 16, OX = P.centreWorld[0], OZ = P.centreWorld[1], bytes = [];
const u8 = (v) => { if (v < 0 || v > 255 || !Number.isInteger(v)) fail('byte out of range: ' + v); bytes.push(v); }, i16 = (v) => { v = Math.round(v); if (v < -32768 || v > 32767) fail('out of range: ' + v); bytes.push(v & 255, (v >> 8) & 255); };
const pt = (p) => { i16((p[0] - OX) * Q); i16((p[1] - OZ) * Q); };
const seedOf = (id) => createHash('sha1').update(id).digest()[0];
const all = [...masses, ...town];
u8(1); i16(OX); i16(OZ); i16(all.length); i16(edge.length); u8(terraces.length);
for (const m of all) {
  const o = m.outline; if (o.length > 30) fail(`${m.id} has too many corners`);
  u8(o.length);
  u8((m.status === 'excavated' ? 1 : 0) | ((m.storeys - 1) << 1) | ((STONE[m.stone] || 0) << 3) | (m.stringCourses ? 32 : 0) | (m.bigWindows ? 64 : 0) | (m.lowStorey ? 128 : 0));
  u8((KIND[m.kind] || 0) | (m.partOf ? 4 : 0) | (m.by === 'plan' ? 8 : 0) | (m.features.length << 4));
  u8(m.seed !== undefined ? m.seed : seedOf(m.id));
  for (const p of o) pt(p);
  for (const f of m.features) { u8(FEAT[f.type]); u8(f.edge); u8(Math.round(f.t * 255)); u8(clamp(f.param, 0, 255)); }
}
for (const p of edge) pt(p);
for (const t of terraces) { u8(t.outline.length); for (const p of t.outline) pt(p); }
pt(pithos);
const data = Uint8Array.from(bytes), b64 = Buffer.from(data).toString('base64');
const wrap = (s) => s.match(/.{1,118}(\s|$)/g).map((l) => '//   ' + l.trim()).join('\n');
const rules = {
  sh: RU.storeyHeightMetres.value, sunk: RU.groundFloorBelowStreetMetres.range, sunk16: RU.groundFloorBelowStreetMetres.atDelta16, rev: RU.wallThicknessMetres.revealDepth,
  door: [RU.door.widthMetres, RU.door.heightMetres, RU.door.thresholdMetres[0], RU.door.thresholdMetres[1], RU.door.thresholdShowsMetres],
  wdoor: [RU.windowByDoor.widthMetres, RU.windowByDoor.heightMetres, RU.windowByDoor.sillAboveStreetMetres],
  gwin: [RU.groundWindow.widthMetres, RU.groundWindow.heightMetres, RU.groundWindow.sillAboveStreetMetres],
  uwin: [RU.upperWindow.widthMetres, RU.upperWindow.heightMetres, RU.upperWindow.sillAboveFloorMetres, RU.upperWindow.spacingMetres],
  pier: [(RU.pierAndWindow.lengthsMetres[0] + RU.pierAndWindow.lengthsMetres[1]) / 2, RU.pierAndWindow.openings],
  low: [RU.largeLowWindow.widthMetres, RU.largeLowWindow.heightMetres, RU.largeLowWindow.sillAboveStreetMetres],
  par: [RU.roof.parapetHeightMetres, RU.roof.parapetThicknessMetres], roof: RU.roof.alternativeEarthMetres, spout: RU.roof.spoutLengthMetres, pithos: T.open.pithos.heightMetres,
  eye: RU.walking.eyeHeightMetres, pace: RU.walking.paceMetresPerSecond, hurry: RU.walking.hurryFactor, step: RU.walking.stepMetres,
};
writeFileSync(path.join(root, 'source', 'src', 'town-data.js'),
  `// GENERATED by tools/town/build.mjs from tools/town/town.json and tools/town/traced.json. Do not edit: change the rules and rebuild.\n`
  + `// The town at Akrotiri in 1615 BCE: ${all.length} building outlines, the edge of the excavated walls, and the numbers its houses are built from.\n`
  + `//\n`
  + `// THIS FILE IS NOT UNDER THE MIT LICENCE of the code around it. The outlines of the excavated part are an adaptation of a map\n`
  + `// under CC BY-SA 2.5, and the rest of the town is laid out round them, so this file is under CC BY-SA 4.0\n`
  + `// (https://creativecommons.org/licenses/by-sa/4.0/). Anyone who passes on this file, or the page built from it, must keep this credit:\n`
  + `//\n${wrap(T.credit.plan)}\n//\n${wrap(T.credit.position)}\n`
  + `//\n`
  + `// Each wall drawn from the plan is grade A that it exists and grade C in its exact line. Everything beyond the edge of the excavated\n`
  + `// walls is reconstruction by rule (docs/town/README.md, liberty A-L1). Every label is a modern one: no ancient name is known.\n`
  + `const TOWN = '${b64}';\n`
  + `const TOWNR = ${JSON.stringify(rules).replace(/"(\w+)":/g, '$1:')};\n`);

// ---------------------------------------------------------------- the report
const houses = all.filter((m) => !m.partOf && m.kind !== 'porch'), count = (f) => houses.filter(f).length, areas = town.map((m) => m.area).sort((a, b) => a - b);
const report = {
  inputs: { townJson: createHash('sha256').update(readFileSync(path.join(here, 'town.json'))).digest('hex'), tracedJson: createHash('sha256').update(readFileSync(path.join(here, 'traced.json'))).digest('hex'), plan: TRC.plan },
  town: { hectares: r2(hectares), hectaresAimedAt: TW.areaHectares.value, builtSquareMetres: Math.round(builtM2), shareBuilt: r2(builtM2 / (hectares * 1e4)) },
  masses: all.length,
  buildings: { all: houses.length, excavated: count((m) => m.status === 'excavated'), reconstructedInsideThePlan: count((m) => m.status === 'reconstructed' && m.by === 'plan'), reconstructedByRule: count((m) => m.by === 'rule') },
  storeys: { one: count((m) => m.storeys === 1), two: count((m) => m.storeys === 2), three: count((m) => m.storeys === 3) },
  byRule: { lotsCut: lots.length, kept: town.length, dropped, footprintSquareMetres: { smallest: Math.round(areas[0]), median: Math.round(areas[areas.length >> 1]), largest: Math.round(areas[areas.length - 1]), allowed: RU.footprint.typicalSquareMetres }, byDistrict: Object.fromEntries(TW.districts.map((d) => [d.id, town.filter((m) => m.id.startsWith(d.id + '-')).length])) },
  excavatedPart: {
    wallExtentMetres: TRC.wallExtentMetres, edgePoints: edge.length, edgeAreaSquareMetres: TRC.edgeAreaSquareMetres,
    masses: masses.map((m) => ({ id: m.id, label: m.label, status: m.status, shareOfOutlineOnDrawnWalls: m.share, squareMetres: Math.round(m.area), storeys: m.storeys, groundMetres: r1(ground(...centroid(m.outline))) })),
  },
  ground: { atXeste3Metres: r1(ground(...centroid(masses.find((m) => m.id === 'xeste3_e').outline))), sourcedAtXeste3Metres: 23.1, atTheEastEdgeByXeste2Metres: r1(ground(...toWorld([1935, 2100]))), sourcedBasementFloorThereMetres: [21.7, 21.8], claims: ['T2#19', 'T2#80', 'T2b#36'] },
  data: { bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), textKilobytes: r1(b64.length / 1024) },
};
mkdirSync(path.join(root, 'docs', 'town'), { recursive: true });
writeFileSync(path.join(root, 'docs', 'town', 'build-report.json'), JSON.stringify(report, null, 1) + '\n');
console.log(JSON.stringify({ ...report, excavatedPart: { ...report.excavatedPart, masses: report.excavatedPart.masses.length } }, null, 1));

// ---------------------------------------------------------------- preview
if (PREVIEW) {
  mkdirSync(PREVIEW, { recursive: true });
  const b = bbox([...TW.core, ...TW.districts.flatMap((d) => d.outline)]), S = 2.4, M = 20, c = new Canvas(Math.ceil((b[2] - b[0] + 2 * M) * S), Math.ceil((b[3] - b[1] + 2 * M) * S), [236, 228, 208]);
  const X = (x) => (x - b[0] + M) * S, Y = (z) => (z - b[1] + M) * S, px = (o) => o.map((q) => [X(q[0]), Y(q[1])]);
  for (let y = 0; y < c.h; y += 2) for (let x = 0; x < c.w; x += 2) { const h = ground(x / S + b[0] - M, y / S + b[1] - M); if (Math.abs(h / 2 - Math.round(h / 2)) < 0.04) c.px(x, y, [150, 130, 100], 0.6); }
  for (const d of TW.districts) c.poly(px(d.outline), [0, 120, 200], 0.6);
  c.poly(px(TW.core), [0, 0, 0], 0.5);
  for (const t of terraces) c.fill(px(t.outline), [200, 190, 160]);
  for (const m of all) { c.fill(px(m.outline), m.status === 'excavated' ? [70, 110, 60] : m.by === 'plan' ? [150, 110, 190] : m.storeys === 3 ? [150, 105, 70] : [185, 140, 100]); c.poly(px(m.outline), [40, 30, 20]); }
  c.poly(px(edge), [230, 0, 0]);
  for (let gx = Math.ceil(b[0] / 50) * 50; gx < b[2]; gx += 50) { for (let y = 0; y < c.h; y += 3) c.px(X(gx), y, [0, 60, 200], 0.4); c.text(X(gx) + 2, 2, gx, [0, 0, 160]); }
  for (let gz = Math.ceil(b[1] / 50) * 50; gz < b[3]; gz += 50) { for (let x = 0; x < c.w; x += 3) c.px(x, Y(gz), [200, 0, 60], 0.4); c.text(2, Y(gz) + 2, gz, [160, 0, 0]); }
  writeFileSync(path.join(PREVIEW, 'town.png'), c.png());
  console.log('preview:', path.join(PREVIEW, 'town.png'));
}
