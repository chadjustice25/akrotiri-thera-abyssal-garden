#!/usr/bin/env node
// Shows what a change to edits.json moved and what it left alone (written for work order 004, Part A).
//   git show main:tools/terrain/edits.json > /tmp/old-edits.json
//   node tools/terrain/build.mjs --edits /tmp/old-edits.json --dump /tmp/old.grid
//   node tools/terrain/build.mjs --dump /tmp/new.grid
//   node tools/terrain/compare.mjs /tmp/old.grid /tmp/new.grid
// A grid file holds the model's heights and the heights as the page gets them back after packing. The two are compared
// apart, because packing rounds each height from the cells packed before it: a change in one place re-rounds the cells
// after it, within the packing's accuracy, though the model there is the same. Cells are sorted by the outlines in the
// present edits.json: E4's land (southLand and fromTheBay), the bay floor beside E4's shore (E5 shelves it from the shore),
// E6's low ground, and all other land and sea. It writes nothing, and exits 1 if the model moved anywhere else.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Grid, distance, inPoly } from './lib.mjs';
import { UNIT } from './codec.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const E = JSON.parse(readFileSync(path.join(here, 'edits.json'), 'utf8')), N = E.grid.cells, CELL = E.grid.cellMetres, NN = N * N;
const read = (f) => { const b = readFileSync(f); if (b.length !== NN * 9) throw new Error(f + ' is not a grid written by build.mjs --dump'); const a = b.buffer.slice(b.byteOffset, b.byteOffset + b.length); return { h: new Float32Array(a, 0, NN), q: new Int32Array(a, NN * 4, NN), rock: new Uint8Array(a, NN * 8, NN) }; };
const a = read(process.argv[2]), b = read(process.argv[3]);
const g = new Grid(N, CELL), X = (k) => g.gx(k % N), Z = (k) => g.gz((k / N) | 0);
const polys = [E.E4.southLand, ...(E.E4.fromTheBay || [])], e4 = new Uint8Array(NN), e6 = new Uint8Array(NN);
for (let k = 0; k < NN; k++) { for (const p of polys) if (inPoly(p, X(k), Z(k))) { e4[k] = 1; break; } if (!e4[k] && inPoly(E.E6.bridge, X(k), Z(k))) e6[k] = 1; }
const dE4 = distance(e4, N), shelf = E.E5.shoreShelfMetres + 2 * CELL;
const names = ["E4's land (southLand and fromTheBay)", "the bay floor within " + shelf + " m of E4's land", "E6's low ground and channel", 'all other land', 'all other sea and bay floor'];
const st = names.map(() => ({ cells: 0, model: 0, modelMost: 0, packed: 0, packedMost: 0, sq: 0, rock: 0 }));
const [sx, sz] = E.E8.site, sr = E.E8.radiusMetres + E.E8.blendMetres, site = { cells: 0, model: 0, packed: 0, packedMost: 0, sq: 0 };
for (let k = 0; k < NN; k++) {
  const s = st[e4[k] ? 0 : e6[k] ? 2 : dE4[k] * CELL <= shelf && a.h[k] <= 0 && b.h[k] <= 0 ? 1 : a.h[k] > 0 || b.h[k] > 0 ? 3 : 4], dm = Math.abs(a.h[k] - b.h[k]), dp = Math.abs(a.q[k] - b.q[k]) * UNIT;
  s.cells++; if (dm) { s.model++; if (dm > s.modelMost) s.modelMost = dm; } if (dp) { s.packed++; s.sq += dp * dp; if (dp > s.packedMost) s.packedMost = dp; } if (a.rock[k] !== b.rock[k]) s.rock++;
  if (Math.hypot(X(k) - sx, Z(k) - sz) <= sr) { site.cells++; if (dm) site.model++; if (dp) { site.packed++; site.sq += dp * dp; if (dp > site.packedMost) site.packedMost = dp; } }
}
const line = (n, s) => console.log(`${n}: ${s.cells} cells\n    the model: ${s.model} differ` + (s.model ? `, by ${s.modelMost.toFixed(1)} m at most` : '') + (s.rock === undefined ? '' : `; ${s.rock} changed rock class`)
  + `\n    as packed: ${s.packed} differ` + (s.packed ? `, by ${Math.sqrt(s.sq / s.cells).toFixed(2)} m (rms over all its cells), ${s.packedMost.toFixed(2)} m at most` : ''));
names.forEach((n, i) => line(n, st[i]));
line(`of which the Akrotiri terrace (E8, within ${sr} m of the site)`, site);
const ok = [2, 3, 4].every((i) => st[i].model === 0 && st[i].rock === 0);
console.log(ok ? '\nPASS: the model is the same everywhere outside E4 and the bay floor beside its shore' : '\nFAIL: the model moved outside E4');
process.exit(ok ? 0 : 1);
