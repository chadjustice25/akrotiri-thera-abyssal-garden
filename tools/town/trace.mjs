#!/usr/bin/env node
// ============================================================================
// Traces the plan of the excavated town: its walls, the edge of the evidence, and how well each building's outline is
// supported by the walls the plan draws
// ============================================================================
//   node tools/town/fetch.mjs                  once: downloads the plan into tools/town/cache/ and checks its SHA-1
//   node tools/town/trace.mjs [--preview DIR] [--crop x,y,w,h] [--zoom Z]
// Reads the plan and tools/town/town.json; writes tools/town/traced.json. The same plan and the same town.json give the
// same file. --preview also writes PNGs to look at: the plan with the traced walls, the edge and the outlines over it.
//
// What is automatic: finding the plan's yellow wall shapes and turning them into outlines; the edge of the excavated
// walls; the scale, position and north of the plan (numbers from town.json, as checked in T2b's verification).
// What is by hand, and recorded in town.json: each building's outline (which walls belong to one building, and how its
// outline closes where the plan draws no wall). This script measures every edge of those outlines against the traced
// walls, so the record shows which edges stand on a drawn wall and which are inferred.
//
// The plan: "Akrotiri in the Bronze Age, about 1600 B.C." (File:Map Akrotiri 1600 BC-en.png) by Maximilian Dörrbecker,
// Wikimedia Commons, CC BY-SA 2.5. traced.json is an adaptation of it and is under CC BY-SA 4.0 (docs/town/README.md).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLAN, planPath } from './fetch.mjs';
import { Canvas, readPng } from './png.mjs';
import { area, bbox, centroid, clipHalf, distanceTo, fillHoles, grow, inPoly, outlines, polysOverlap, shrink, simplify } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(readFileSync(path.join(here, 'town.json'), 'utf8')), P = T.plan, TR = T.trace;
const argAt = (n) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
const PREVIEW = argAt('preview') && path.resolve(argAt('preview'));
if (!existsSync(planPath)) { console.error(`missing ${planPath}: run node tools/town/fetch.mjs first`); process.exit(3); }
const im = readPng(readFileSync(planPath)), W = im.width, H = im.height;
if (W !== PLAN.width || H !== PLAN.height) { console.error('the plan is not the size the research measured'); process.exit(1); }
const r2 = (v) => Math.round(v * 100) / 100;

// ---------------------------------------------------------------- the walls: the plan's yellow, with its black outline
const [wr, wg, wb] = TR.wallColour, [lx, ly] = TR.legendBelowRight; // the legend's own yellow box is left out
let yellow = new Uint8Array(W * H);
for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) yellow[i] = im.rgba[i * 4] === wr && im.rgba[i * 4 + 1] === wg && im.rgba[i * 4 + 2] === wb && !(x < lx && y < ly) ? 1 : 0;
const all = grow(yellow, W, H, TR.outlinePx);
// thick strokes are building walls; thin double lines are low walls (terrace edges, drains), kept apart
const thick = grow(shrink(all, W, H, TR.thinWallPx / 2), W, H, TR.thinWallPx / 2 + 0.5).map((v, i) => v & all[i]);
const thin = all.map((v, i) => (v && !thick[i] ? 1 : 0));
let x0 = W, y0 = H, x1 = 0, y1 = 0, n = 0;
for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) if (yellow[i]) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
const box = [x0, y0, x1, y1];
if (box.some((v, i) => Math.abs(v - P.wallBoxPx[i]) > 2)) { console.error(`the wall box measured here, ${box}, is not town.json's ${P.wallBoxPx}`); process.exit(1); }

// ---------------------------------------------------------------- plan pixels -> the world's metres (x east, z south)
// The plan is stretched: its east-west and north-south scales differ (T2b verification, correction 3). Up is true north
// within 3 degrees (correction 4), so no turn is applied. The centre of the wall box sits on the shelter's centre.
const SX = P.pxPerMetreEastWest, SZ = P.pxPerMetreNorthSouth, PCX = (P.wallBoxPx[0] + P.wallBoxPx[2]) / 2, PCY = (P.wallBoxPx[1] + P.wallBoxPx[3]) / 2;
const wx = (px) => P.centreWorld[0] + (px - PCX) / SX, wz = (py) => P.centreWorld[1] + (py - PCY) / SZ;
const toWorld = (p) => [r2(wx(p[0])), r2(wz(p[1]))];
const trace = (mask) => outlines(mask, W, H).map((l) => simplify(l, TR.simplifyPx)).filter((l) => l.length > 2 && Math.abs(area(l)) > TR.minWallAreaPx);
const walls = trace(thick), lows = trace(thin);

// ---------------------------------------------------------------- a metric grid, for anything measured in metres
const CELL = 0.1, MARGIN = 25, GX0 = wx(box[0]) - MARGIN, GZ0 = wz(box[1]) - MARGIN, GW = Math.ceil((wx(box[2]) - wx(box[0]) + 2 * MARGIN) / CELL), GH = Math.ceil((wz(box[3]) - wz(box[1]) + 2 * MARGIN) / CELL);
const metric = new Uint8Array(GW * GH);
for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
  const px = Math.round(PCX + (GX0 + (i + 0.5) * CELL - P.centreWorld[0]) * SX), py = Math.round(PCY + (GZ0 + (j + 0.5) * CELL - P.centreWorld[1]) * SZ);
  if (px >= 0 && py >= 0 && px < W && py < H && thick[py * W + px]) metric[j * GW + i] = 1;
}
const dWall = distanceTo(metric, GW, GH); // cells
const wallDist = (x, z) => { const i = Math.floor((x - GX0) / CELL), j = Math.floor((z - GZ0) / CELL); return i < 0 || j < 0 || i >= GW || j >= GH ? 1e9 : dWall[j * GW + i] * CELL; };

// ---------------------------------------------------------------- the edge of the evidence
// The outline of the excavated walls: the walls joined across gaps narrower than twice `edgeClosingMetres`, with the
// holes filled. Nothing measured exists beyond this line in any direction (T2b verification, section 6, answer 4).
const Q = 4, EW = Math.ceil(GW / Q), EH = Math.ceil(GH / Q), coarse = new Uint8Array(EW * EH);
for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) if (metric[j * GW + i]) coarse[((j / Q) | 0) * EW + ((i / Q) | 0)] = 1;
const R = TR.edgeClosingMetres / (CELL * Q), closed = fillHoles(shrink(grow(coarse, EW, EH, R), EW, EH, R - 0.5).map((v, i) => v | coarse[i]), EW, EH);
const edgeLoops = outlines(closed, EW, EH).filter((l) => area(l) > 0).sort((a, b) => area(b) - area(a));
const edge = simplify(edgeLoops[0], TR.edgeSimplifyMetres / (CELL * Q)).map((p) => [r2(GX0 + p[0] * CELL * Q), r2(GZ0 + p[1] * CELL * Q)]);
const stray = edgeLoops.slice(1).reduce((s, l) => s + area(l), 0) * (CELL * Q) ** 2;

// ---------------------------------------------------------------- the buildings' outlines, measured against the walls
// A building's outline is the convex hull of the plan's walls inside the region town.json gives for it, and of any
// points town.json adds where the plan draws no wall (addPx). A building that is not convex is given as several parts.
// (outlines are kept clockwise as the plan shows them)
const clockwise = (o) => (area(o) < 0 ? o.slice().reverse() : o);
const hull = (pts) => {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};
const outlinePx = (b) => {
  if (b.outlinePx) return clockwise(b.outlinePx);
  const pts = (b.addPx || []).map((p) => p.slice());
  if (b.regionPx) {
    const [bx0, by0, bx1, by1] = bbox(b.regionPx);
    for (let y = Math.max(0, Math.floor(by0)); y <= Math.min(H - 1, by1); y++) for (let x = Math.max(0, Math.floor(bx0)); x <= Math.min(W - 1, bx1); x++) {
      if (!thick[y * W + x] || !inPoly(b.regionPx, x + 0.5, y + 0.5)) continue;
      if (thick[y * W + x - 1] && thick[y * W + x + 1] && thick[(y - 1) * W + x] && thick[(y + 1) * W + x] && inPoly(b.regionPx, x - 0.5, y + 0.5) && inPoly(b.regionPx, x + 1.5, y + 0.5) && inPoly(b.regionPx, x + 0.5, y - 0.5) && inPoly(b.regionPx, x + 0.5, y + 1.5)) continue;
      pts.push([x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]);
    }
  }
  if (pts.length < 3) { console.error(`building ${b.id}: no walls in its region and fewer than three added points`); process.exit(1); }
  return clockwise(simplify(hull(pts), TR.hullSimplifyPx));
};
const convex = (p) => { const q = clockwise(p); for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length], c = q[(i + 2) % q.length]; if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) < 0) return false; } return true; };
for (const b of T.buildings) {
  if (b.regionPx && !convex(b.regionPx)) { console.error(`building ${b.id}: its region is not convex`); process.exit(1); }
  for (const p of (b.regionPx && b.addPx) || []) if (!inPoly(b.regionPx, p[0], p[1])) { console.error(`building ${b.id}: the added point ${p} is outside its region`); process.exit(1); }
}
// a building may be cut in two along a line (split.linePx): the parts get split.ids. For a line drawn down the plan,
// the first id is the part on the plan's left (the west)
const parts = T.buildings.flatMap((b) => {
  const o = outlinePx(b); if (!b.split) return [{ id: b.id, of: b.id, opx: o }];
  const [p, q] = b.split.linePx;
  return [1, -1].map((keep, k) => ({ id: b.split.ids[k], of: b.id, opx: clockwise(clipHalf(o, p, q, keep)) }));
});
const buildings = parts.map((b) => {
  const opx = b.opx, out = opx.map(toWorld), sup = [], len = [];
  for (let k = 0; k < out.length; k++) {
    const a = out[k], c = out[(k + 1) % out.length], l = Math.hypot(c[0] - a[0], c[1] - a[1]), m = Math.max(2, Math.ceil(l / 0.1)); let hit = 0;
    for (let s = 0; s <= m; s++) if (wallDist(a[0] + (c[0] - a[0]) * s / m, a[1] + (c[1] - a[1]) * s / m) <= TR.supportToleranceMetres) hit++;
    sup.push(r2(hit / (m + 1))); len.push(l);
  }
  const total = len.reduce((s, v) => s + v, 0), share = r2(sup.reduce((s, v, k) => s + v * len[k], 0) / total);
  return { id: b.id, of: b.of, outline: out, outlinePx: opx.map((p) => [Math.round(p[0]), Math.round(p[1])]), edgeOnDrawnWall: sup, shareOnDrawnWalls: share, areaSquareMetres: Math.round(Math.abs(area(out))) };
});
// no two outlines may overlap (regions that do not overlap guarantee it; outlines given directly are checked here).
// Parts of one building share their cut, so they are tested shrunk by a hand's width.
{
  const inset = (o) => { const c = centroid(o); return o.map((p) => { const d = Math.hypot(p[0] - c[0], p[1] - c[1]); return [p[0] + (c[0] - p[0]) * 0.05 / d, p[1] + (c[1] - p[1]) * 0.05 / d]; }); };
  let bad = 0;
  for (let i = 0; i < buildings.length; i++) for (let j = i + 1; j < buildings.length; j++) if (polysOverlap(inset(buildings[i].outline), inset(buildings[j].outline))) { console.error(`OVERLAP: ${buildings[i].id} and ${buildings[j].id}`); bad++; }
  if (bad && !process.argv.includes('--allow-overlap')) process.exit(1);
}

const result = {
  about: 'GENERATED by tools/town/trace.mjs from the plan and tools/town/town.json. Do not edit: change town.json and trace again.',
  licence: 'CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Not under the MIT licence of the code around it.',
  credit: T.credit.plan,
  plan: { file: PLAN.file, sha1: PLAN.sha1, page: PLAN.page },
  frame: 'metres; x east, z south, from 36.405 N, 25.405 E (the terrain\'s frame)',
  wallBoxPx: box,
  wallExtentMetres: { eastWest: r2((box[2] - box[0]) / SX), northSouth: r2((box[3] - box[1]) / SZ) },
  wallAreaSquareMetres: Math.round(n / (SX * SZ)),
  edge,
  edgeAreaSquareMetres: Math.round(Math.abs(area(edge))),
  buildings,
  walls: walls.map((l) => l.map(toWorld)),
  lowWalls: lows.map((l) => l.map(toWorld)),
};
writeFileSync(path.join(here, 'traced.json'), JSON.stringify(result).replace(/\],\[/g, '],[').replace(/"(edge|buildings|walls|lowWalls|plan|frame|wallBoxPx)"/g, '\n"$1"').replace(/\{"id"/g, '\n {"id"') + '\n');
console.log(`walls: ${walls.length} outlines (${result.wallAreaSquareMetres} m2 of wall), ${lows.length} low-wall outlines; walls span ${result.wallExtentMetres.eastWest} m east-west by ${result.wallExtentMetres.northSouth} m north-south`);
console.log(`edge of the evidence: ${edge.length} points round ${result.edgeAreaSquareMetres} m2${stray > 1 ? ` (plus ${Math.round(stray)} m2 in separate patches, left out)` : ''}`);
for (const b of buildings) console.log(`  ${b.id.padEnd(12)} ${String(b.areaSquareMetres).padStart(4)} m2  ${(b.shareOnDrawnWalls * 100).toFixed(0).padStart(3)}% on drawn walls  [${b.edgeOnDrawnWall.map((v) => (v * 100).toFixed(0)).join(' ')}]`);

// ---------------------------------------------------------------- previews
if (PREVIEW) {
  mkdirSync(PREVIEW, { recursive: true });
  const crop = (argAt('crop') || `0,0,${W},${H}`).split(',').map(Number), zoom = Number(argAt('zoom') || 0.5), cw = Math.round(crop[2] * zoom), ch = Math.round(crop[3] * zoom), c = new Canvas(cw, ch);
  const X = (px) => (px - crop[0]) * zoom, Y = (py) => (py - crop[1]) * zoom, bx = (x) => PCX + (x - P.centreWorld[0]) * SX, by = (z) => PCY + (z - P.centreWorld[1]) * SZ;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const sx = Math.min(W - 1, Math.floor(crop[0] + x / zoom)), sy = Math.min(H - 1, Math.floor(crop[1] + y / zoom)), o = (sy * W + sx) * 4; c.px(x, y, [im.rgba[o], im.rgba[o + 1], im.rgba[o + 2]], 0.45); }
  for (const l of lows) c.poly(l.map((p) => [X(p[0]), Y(p[1])]), [0, 160, 160]);
  for (const l of walls) c.poly(l.map((p) => [X(p[0]), Y(p[1])]), [40, 70, 230]);
  c.poly(edge.map((p) => [X(bx(p[0])), Y(by(p[1]))]), [230, 0, 0]);
  for (const b of T.buildings) {
    if (b.regionPx) c.poly(b.regionPx.map((p) => [X(p[0]), Y(p[1])]), [255, 140, 0], 0.7);
    for (const p of b.addPx || []) for (let w = -3; w <= 3; w++) { c.px(X(p[0]) + w, Y(p[1]), [255, 0, 0]); c.px(X(p[0]), Y(p[1]) + w, [255, 0, 0]); }
  }
  buildings.forEach((t, bi) => {
    const o = t.outlinePx, col = t.shareOnDrawnWalls < TR.excavatedIfShareAtLeast ? [150, 60, 200] : [0, 130, 30];
    c.fill(o.map((p) => [X(p[0]), Y(p[1])]), col, 0.16);
    for (let k = 0; k < o.length; k++) { const a = o[k], d = o[(k + 1) % o.length], s = t.edgeOnDrawnWall[k]; for (let w = -1; w <= 1; w++) c.line(X(a[0]) + w, Y(a[1]), X(d[0]) + w, Y(d[1]), s >= 0.5 ? [0, 150, 0] : [230, 0, 200]); c.text(X(a[0]) + 3, Y(a[1]) + 3, k, [0, 0, 0]); }
    let mx = 0, my = 0; for (const p of o) { mx += p[0] / o.length; my += p[1] / o.length; } c.text(X(mx) - 6, Y(my) - 5, bi, [200, 0, 0], 2);
  });
  for (let gx = Math.ceil(crop[0] / 100) * 100; gx < crop[0] + crop[2]; gx += 100) { for (let y = 0; y < ch; y++) c.px(X(gx), y, [0, 90, 255], 0.25); c.text(X(gx) + 2, 2, gx, [0, 0, 200]); }
  for (let gy = Math.ceil(crop[1] / 100) * 100; gy < crop[1] + crop[3]; gy += 100) { for (let x = 0; x < cw; x++) c.px(x, Y(gy), [255, 0, 60], 0.25); c.text(2, Y(gy) + 2, gy, [200, 0, 0]); }
  const name = argAt('crop') ? `trace-${crop.join('-')}.png` : 'trace.png';
  writeFileSync(path.join(PREVIEW, name), c.png());
  console.log('preview:', path.join(PREVIEW, name));
}
