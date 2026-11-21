// ============================================================================
// THE MEASURING SPIKE (work order 003): only in dev.html (npm run build:dev), never in index.html
// ============================================================================
// Prototypes that measured the design in docs/ARCHITECTURE.md section 4 before it was built. NOTHING HERE IS EVIDENCE, and
// nothing here is a feature: the placed things are grey shapes, the second island is today's island as a stand-in, and
// the "years" and "days" a placed thing stands for are dice. docs/spike/003-measurements.md has the numbers.
//
// Work order 004 built the first prototype, a layer of the town fading, into the engine itself (docs/layers/README.md)
// and took its file out. Two are left: spike-place.js (placing by rule on the GPU) and spike-year.js (two islands blended
// by one number). This file is what they share; spike-go.js builds their pipelines and takes over the frame. Each can be
// left out of the build (node build.mjs --dev --only place), which is how each was measured. Both now follow the
// engine's own layer, year and day (K in the page; U and I in dev.js): the placed things are shown by the same three numbers.
//
// The engine is not changed by them. Every scene shader is the engine's own text with marked replacements (rep() fails
// loudly if the engine's text has moved on), and everything a part adds is in bind group 1, so that group 0 stays the engine's.
//
// In the page: spk.isl / spk.set({ isl }) the island blend by hand; spk.mode(kind) how a placed thing fades;
// spk.swing(seconds) keeps the island blend moving; spk.on = 0 hands the frame back to the engine untouched;
// spk.meas(ms) times the GPU (with the spike on or off); keys are listed in spike-go.js.
const SPK = {
  on: 0,                     // off when the page opens, so that dev.html looks as the released page does: P turns them on
  isl: 0, islTo: 0,          // the island: 0 the island of 1628 BCE, 1 the stand-in for the island after the eruption
  kind: 1,                   // how a placed thing fades (KINDS below)
  secs: 2.5,                 // half of how long the island takes to change
  swing: 0,                  // > 0: the island goes back and forth with this period, for timing a blend in motion
  hold: 0, freeze: 0,        // hold: the page's own resolution scaler is off; freeze: the sea and the stars stand still
  parts: [], patches: [], wgsl: '', entries: [], res: [], // what the parts add: shader replacements, bindings, resources
  U: new Float32Array(16),   // struct XU in the shaders
  mT: new Float32Array(8192), mG: new Float32Array(8192), mN: -1, mEnd: 0, mDone: null,
};
window.spk = SPK;
SPK.ready = new Promise((r) => { SPK.go = r; }); // resolves when spike-go.js has taken over the frame
const KINDS = ['dither by pixel', 'dither by coverage', 'dither on the surface', 'rise, clipped', 'rise, with a lid'];
// a replacement in the engine's shader text that must find its place
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('spike: the engine text has changed, not found: ' + a.slice(0, 70)); return s.replace(a, () => b); };
// a part adds a binding to group 1: its WGSL declaration, its layout entry, its resource. Returns the binding number.
const xAdd = (decl, layout, resource) => { const n = SPK.entries.length + 1; SPK.wgsl += `@group(1) @binding(${n}) ${decl};\n`; SPK.entries.push({ binding: n, visibility: SS.VERTEX | SS.FRAGMENT | SS.COMPUTE, ...layout }); SPK.res.push(resource); return n; };
const uboX = device.createBuffer({ size: 64, usage: BU.UNIFORM | BU.COPY_DST });

// What every spike shader shares. xvis(): the engine's one visibility function (vis() in shaders.js) without the wave, for
// the placing pass, which does not include the scene's shared text: a thing's layer, the years it stands for (from, to,
// BCE, so from > to) and its days of the year give one number, 0 hidden to 1 shown, from the engine's own three numbers
// (g.ly). cover(): how a partly shown placed thing is drawn, with no sorting and no blending: the samples it keeps.
const S_X = /*wgsl*/`
struct XU { a: vec4f, b: vec4f, c: vec4f, d: vec4f };
@group(1) @binding(0) var<uniform> xu: XU;
fn xvis(layer: f32, y: vec2f, d: vec2f) -> f32 {
  let h = fract((d.y - d.x) / 365.) * 182.5; let q = abs(fract((g.ly.z - d.x - h) / 365. + .5) - .5) * 365.;
  return clamp(g.ly.x - layer + 1., 0., 1.) * clamp((y.x - g.ly.y) / 3. + 1., 0., 1.) * clamp((g.ly.y - y.y) / 3. + 1., 0., 1.) * clamp((h - q) / 8. + 1., 0., 1.);
}
fn xign(p: vec2f) -> f32 { return fract(52.9829189 * fract(dot(p, vec2f(.06711056, .00583715)))); }
fn xh21(p: vec2f) -> f32 { var q = fract(p.xyx * vec3f(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
// v: visibility; fc: the pixel; key: a place on the thing's own surface, in metres; px: the width of a pixel there, in
// metres; h: how high up the thing the fragment is, 0 its foot to 1 its top; ns: samples in a pixel
fn cover(v: f32, fc: vec2f, key: vec2f, px: f32, h: f32, ns: u32) -> u32 {
  let all = (1u << ns) - 1u; let k = u32(xu.a.y);
  if (v >= 1.) { return all; }
  if (v <= 0.) { return 0u; }
  if (k == 0u) { return select(0u, all, xign(fc) < v); }
  if (k == 1u) { let n = xign(fc); var m = 0u; for (var s = 0u; s < ns; s++) { if ((f32(s) + n) / f32(ns) < v) { m |= 1u << s; } } return m; }
  if (k == 2u) { let c = exp2(ceil(log2(max(px, .004) * 1.6))); return select(0u, all, xh21(floor(key / c) + c) < v); }
  if (k == 3u) { return select(0u, all, h < v); }
  return all;
}
`;

SPK.set = (o) => { Object.assign(SPK, o); if (o.isl !== undefined && o.islTo === undefined) SPK.islTo = SPK.isl; return 1; };
SPK.mode = (kind) => { SPK.kind = kind; return KINDS[kind]; };
// the resolution: s is the share of the window's pixels along each side; it stays there until spk.res(0)
SPK.resTo = (s) => { SPK.hold = s; if (s) { pix = DW * DH * s * s; resize(); dynT = -Infinity; } else { pix = DW * DH; resize(); } return `${W}x${H}`; };
// time the GPU for ms milliseconds: resolves to the mean, median and 95th percentile of the frame's GPU time, the frame
// rate and the slowest frame
SPK.meas = (ms = 3000, settle = 700) => new Promise((done) => setTimeout(() => { SPK.mN = 0; SPK.mEnd = performance.now() + ms; SPK.mDone = done; }, settle));
const xStat = (a, n) => { const s = Array.from(a.subarray(0, n)).sort((p, q) => p - q); let t = 0; for (const v of s) t += v; return { avg: +(t / n).toFixed(2), med: +s[n >> 1].toFixed(2), p95: +s[min(n - 1, floor(n * 0.95))].toFixed(2), max: +s[n - 1].toFixed(2) }; };
// called once a frame by spike-go.js with the time since the last frame in seconds
function xStep(dt) {
  if (SPK.swing) { const u = (performance.now() / 1000 / SPK.swing) % 1; SPK.isl = SPK.islTo = u < 0.5 ? u * 2 : 2 - u * 2; }
  else { const e = SPK.islTo - SPK.isl, se = dt / (SPK.secs * 2); SPK.isl = abs(e) <= se ? SPK.islTo : SPK.isl + Math.sign(e) * se; }
  const U = SPK.U;
  U[1] = SPK.kind; U[4] = SPK.isl;
  Q.writeBuffer(uboX, 0, U);
}
// called every frame, spike on or off: the timing that spk.meas() asked for
function xMeas(dt) {
  if (SPK.mN >= 0) {
    if (SPK.mN < 8192) { SPK.mT[SPK.mN] = dt * 1000; SPK.mG[SPK.mN] = F[GPU]; SPK.mN++; }
    if (performance.now() > SPK.mEnd) { const n = SPK.mN, g = xStat(SPK.mG, n), f = xStat(SPK.mT, n); SPK.mN = -1; SPK.mDone({ frames: n, fps: +(1000 / f.avg).toFixed(1), gpu: g.avg, gpuMed: g.med, gpuP95: g.p95, gpuMax: g.max, worstFrame: f.max, res: `${W}x${H}` }); }
  }
}
