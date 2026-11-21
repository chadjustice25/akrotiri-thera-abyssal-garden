#!/usr/bin/env node
// ============================================================================
// Measures the layers (work order 004): at rest in each layer, and during a change of layer, on High, Medium and Low
// ============================================================================
//   cd source && node build.mjs --dev --only none --out dev-none.html     first: the development page without work order
//                                                                         003's prototypes (never committed)
//   node tools/town/layers.mjs [--out DIR] [--page dev-none.html] [--levels high,medium,low] [--rest-ms 2500] [--quick]
// It drives the page with tools/town/shot.mjs, once for each detail level, and prints two tables in Markdown:
//   rest      the frame rate and the GPU's time for a frame at each of the nine views, in Found, Inferred and Imagined
//   change    at views 7, 8 and 9: Inferred to Found and back, with every frame timed until the change is over: the GPU's
//             time added to the two layers' mean at rest (taken in the same run), the frame rate, the lowest frame rate
//             over any half second, and the slowest single frame
// The page's resolution scaler is held at full size, so a slower state shows as more milliseconds and not as fewer pixels.
// It writes what it measured as DIR/layers-<level>.json. It is not a check: it exits 0 whatever it measures, and says at
// the end whether every change held 55 frames a second. Every time is this Mac's (docs/layers/README.md says how to read them).
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('out', path.join(ROOT, '.harness', 'layers'))), PAGE = arg('page', 'dev-none.html'), LEVELS = arg('levels', 'high,medium,low').split(','), REST = Number(arg('rest-ms', '2500'));
const VIEWS = process.argv.includes('--quick') ? [7, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9], LAYERS = ['Found', 'Inferred', 'Imagined'];
mkdirSync(OUT, { recursive: true });
const steps = [{ run: 'dev.hold(1)', wait: 300 }];
for (const v of VIEWS) {
  steps.push({ key: 'Digit' + v, wait: 900 });
  for (const l of [1, 0, 2]) steps.push({ id: `rest v${v} ${LAYERS[l]}`, run: `(dev.layer(${l}, 1), dev.time(${REST}))`, wait: 0 });
  if (v >= 7) { steps.push({ run: 'dev.layer(1, 1)', wait: 600 }); steps.push({ id: `change v${v} down`, run: 'dev.change(0)', wait: 300 }); steps.push({ id: `change v${v} up`, run: 'dev.change(1)', wait: 300 }); }
}
const all = {};
for (const level of LEVELS) {
  const json = path.join(OUT, `layers-${level}.json`);
  const r = spawnSync('node', [path.join(ROOT, 'tools', 'town', 'shot.mjs'), '--page', PAGE, '--level', level, '--out', OUT, '--json', json, '--timeout', '900', '--steps', JSON.stringify(steps)], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(3); }
  const d = JSON.parse(readFileSync(json, 'utf8')); all[level] = Object.fromEntries(d.results.filter((x) => x.step).map((x) => [x.step, x.value]));
  if (d.problems.length) console.error(`${level}: ${d.problems.length} problem(s) logged: ${d.problems[0]}`);
}
const f = (v, n = 2) => (v === null || v === undefined ? '–' : v.toFixed(n)), sg = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
console.log(`\nAt rest: GPU time a frame in milliseconds (mean over ${REST / 1000} s), and the frame rate where it was not 60. ${all[LEVELS[0]]['rest v' + VIEWS[0] + ' Inferred'].res}.\n`);
console.log('| view | ' + LEVELS.flatMap((l) => LAYERS.map((n) => `${l[0].toUpperCase()} ${n}`)).join(' | ') + ' |\n|---|' + LEVELS.flatMap(() => LAYERS.map(() => '--:')).join('|') + '|');
for (const v of VIEWS) console.log(`| ${v} | ` + LEVELS.flatMap((l) => LAYERS.map((n) => { const m = all[l][`rest v${v} ${n}`]; return f(m.gpuMs) + (m.fps < 59.5 ? ` (${f(m.fps, 0)} fps)` : ''); })).join(' | ') + ' |');
console.log('\nDuring a change of layer (every frame from the change to its end): GPU ms added to the mean of the two layers at rest; the frame rate; the lowest over any half second; the slowest frame.\n');
console.log('| view and change | ' + LEVELS.map((l) => `${l}: seconds | added GPU ms | highest GPU ms | fps | lowest fps | slowest frame ms`).join(' | ') + ' |\n|---|' + LEVELS.map(() => '--:|--:|--:|--:|--:|--:').join('|') + '|');
let held = true;
for (const v of VIEWS.filter((x) => x >= 7)) for (const dir of ['down', 'up']) {
  console.log(`| view ${v}, ${dir === 'down' ? 'Inferred to Found' : 'Found to Inferred'} | ` + LEVELS.map((l) => {
    const m = all[l][`change v${v} ${dir}`], rest = (all[l][`rest v${v} Found`].gpuMs + all[l][`rest v${v} Inferred`].gpuMs) / 2;
    if (m.fps < 55 || (m.fpsLowestHalfSecond !== null && m.fpsLowestHalfSecond < 55)) held = false;
    return `${f(m.seconds, 1)} | ${sg(m.gpuMs - rest)} | ${f(m.gpuMaxMs)} | ${f(m.fps, 1)} | ${f(m.fpsLowestHalfSecond, 1)} | ${f(m.slowestFrameMs, 1)}`;
  }).join(' | ') + ' |');
}
console.log(`\n${held ? 'Every change of layer held 55 frames a second or more' : 'NOT every change of layer held 55 frames a second'}, on this Mac. Data: ${OUT}/layers-<level>.json`);
