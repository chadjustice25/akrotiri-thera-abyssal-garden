// ============================================================================
// renderer, camera and input
// ============================================================================
const $ = (id) => document.getElementById(id);
const canvas = $('c'), info = $('i'), body = document.body;
// a phone held upright gets the page turned on its side (see template.html)
const rot = matchMedia('(orientation:portrait) and (pointer:coarse)');
// loading bar: each stage glides it to `to` (the share done) over ~`ms` on the compositor, so it moves while this
// thread is busy
let loaded = 0, dead; // dead: the graphics device was lost
const say = (m, to, ms) => {
  if (!dead) $('s').textContent = m;
  const a = $('b').animate({ transform: [`scaleX(${loaded})`, `scaleX(${to})`] }, { duration: ms, fill: 'forwards', easing: 'cubic-bezier(.3,.5,.5,1)' });
  loaded = to;
  // go on once the animation runs: one not started before the thread gets busy stays stuck (timer: hidden tabs)
  return new Promise((r) => { a.ready.then(() => setTimeout(r)); setTimeout(r, document.hidden ? 0 : 1e3); });
};
const fail = (m) => { throw new Error(m, { cause: 1 }); }; // cause marks a message that is shown as it is
if (!navigator.gpu) fail('This scene needs WebGPU. Try a current Chrome or Edge.');
const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
if (!adapter) fail('No WebGPU adapter found.');
$('w').hidden = !!navigator.userAgentData; // only Chromium-based browsers have it
const hasTS = adapter.features.has('timestamp-query');
const device = await adapter.requestDevice({ requiredFeatures: hasTS ? ['timestamp-query'] : [] });
device.addEventListener('uncapturederror', (e) => console.error('GPU: ' + e.error.message));
// out of memory or a GPU timeout: reload a level lower, or on Low say what happened
device.lost.then((l) => {
  if (l.reason === 'destroyed') return; // the page is closing
  if (LV < 2) { keep('abyssal', LV + 1); location.reload(); }
  dead = body.className = 'l e'; $('s').textContent = 'The graphics device was lost. Reload the page to try again.';
});
const ctx = canvas.getContext('webgpu'), FMT = navigator.gpu.getPreferredCanvasFormat();
const Q = device.queue, HDR = 'rgba16float', DEPTH = 'depth32float';
const TU = GPUTextureUsage, BU = GPUBufferUsage, SS = GPUShaderStage;

const mod = (code) => device.createShaderModule({ code });
const buf = (data, usage) => { const b = device.createBuffer({ size: (data.byteLength + 3) & ~3, usage: usage | BU.COPY_DST }); Q.writeBuffer(b, 0, data.buffer || data, data.byteOffset || 0, data.byteLength); return b; };
const tex = (w, h, format, usage, mips = 1, samples = 1) => device.createTexture({ size: [w, h], format, usage, mipLevelCount: mips, sampleCount: samples });
const RT = TU.RENDER_ATTACHMENT | TU.TEXTURE_BINDING;

// ---------------------------------------------------------------- static resources
const sRep = device.createSampler({ addressModeU: 'repeat', addressModeV: 'repeat', magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear', maxAnisotropy: LV > 1 ? 1 : 8 });
const sClamp = device.createSampler({ magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear' });
const sAniso = device.createSampler({ magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear', maxAnisotropy: LV > 1 ? 1 : 8 });
const sCmp = device.createSampler({ compare: 'less-equal', magFilter: 'linear', minFilter: 'linear' });
const TM = log2(TS) + 1; // mip levels of the baked terrain textures
const tShadow = tex(SHADOW, SHADOW, DEPTH, RT), tDummy = tex(1, 1, DEPTH, RT);
const tWater = tex(WATER, WATER, HDR, RT, 5), tDetail = tex(1024, 1024, 'rgba8unorm', RT, 11);
const tH = tex(TS, TS, 'r16float', RT | TU.COPY_SRC, TM), tNrm = tex(TS, TS, 'rgba8unorm', RT, TM), tGeo = tex(1024, 1024, 'rgba8unorm', RT, 11);
const tSky = tex(SKYW, SKYH, HDR, RT);
// the town: its own shadow map, and its plan (what is built on, how far the nearest wall is, where the evidence ends)
const TMM = log2(TMAPN) + 1, tTownSh = tex(TSH, TSH, 'depth16unorm', RT), tTown = tex(TMAPN, TMAPN, 'rgba8unorm', RT | TU.COPY_DST, TMM), tTown2 = tex(TMAPN, TMAPN, 'rgba8unorm', RT | TU.COPY_DST, TMM);

// the per-frame block (struct G in shaders.js): one for the scene, one each for drawing the island's and the town's shadow map
const UB = new Float32Array(92), UBS = new Float32Array(92), UBT = new Float32Array(92);
const ubo = device.createBuffer({ size: 368, usage: BU.UNIFORM | BU.COPY_DST }), uboS = device.createBuffer({ size: 368, usage: BU.UNIFORM | BU.COPY_DST }), uboT = device.createBuffer({ size: 368, usage: BU.UNIFORM | BU.COPY_DST });
// the table of the town's buildings (struct TB): a row each, its layer, its turn in the wave, the first and last year it stands for
const TBU = new Float32Array(2048), uboTab = device.createBuffer({ size: 8192, usage: BU.UNIFORM | BU.COPY_DST });
const WT = new Float32Array(4), uboW = device.createBuffer({ size: 16, usage: BU.UNIFORM | BU.COPY_DST });
const uboWaves = buf(WAVES, BU.UNIFORM);

const VF = SS.VERTEX | SS.FRAGMENT, T2 = { binding: 0, visibility: VF, texture: {} };
const bgl0 = device.createBindGroupLayout({ entries: [
  { binding: 0, visibility: VF, buffer: {} },
  { binding: 1, visibility: VF, sampler: {} }, { binding: 2, visibility: VF, sampler: {} }, { binding: 3, visibility: VF, sampler: { type: 'comparison' } },
  { binding: 4, visibility: VF, texture: { sampleType: 'depth' } },
  ...[5, 6, 7, 8, 9, 10].map((binding) => ({ ...T2, binding })),
  { binding: 11, visibility: VF, buffer: {} }, { binding: 12, visibility: VF, sampler: {} },
  { binding: 13, visibility: VF, texture: { sampleType: 'depth' } }, { ...T2, binding: 14 }, { ...T2, binding: 15 }, { binding: 16, visibility: VF, buffer: {} }] });
const mkBG0 = (u, sh, ts) => device.createBindGroup({ layout: bgl0, entries: [u, sRep, sClamp, sCmp, sh, tWater, tDetail, tH, tNrm, tGeo, tSky, uboWaves, sAniso, ts, tTown, tTown2, uboTab]
  .map((r, binding) => ({ binding, resource: r.createView ? r.createView() : r.size ? { buffer: r } : r })) });
const bg0 = mkBG0(ubo, tShadow, tTownSh), bg0s = mkBG0(uboS, tDummy, tDummy), bg0t = mkBG0(uboT, tDummy, tDummy);
const pl0 = device.createPipelineLayout({ bindGroupLayouts: [bgl0] });

const bglBlit = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: SS.FRAGMENT, texture: {} }, { binding: 1, visibility: SS.FRAGMENT, sampler: {} }] });
const plBlit = device.createPipelineLayout({ bindGroupLayouts: [bglBlit] });
const mBlit = mod(W_BLIT);
const blitPipe = (entry, format, add) => device.createRenderPipeline({ layout: plBlit, vertex: { module: mBlit, entryPoint: 'vs' },
  fragment: { module: mBlit, entryPoint: entry, targets: [{ format, blend: add ? { color: { srcFactor: 'one', dstFactor: 'one' }, alpha: { srcFactor: 'one', dstFactor: 'one' } } : undefined }] } });
const pMip8 = blitPipe('fsMip', 'rgba8unorm'), pMip16 = blitPipe('fsMip', HDR), pMipR = blitPipe('fsMip', 'r16float'), pDown0 = blitPipe('fsDown0', HDR), pDown = blitPipe('fsDown', HDR), pUp = blitPipe('fsUp', HDR, true);
const mipView = (t, m) => t.createView({ baseMipLevel: m, mipLevelCount: 1 });
const blitBG = (view) => device.createBindGroup({ layout: bglBlit, entries: [{ binding: 0, resource: view }, { binding: 1, resource: sClamp }] });
const colorAtt = (view, clear) => ({ view, loadOp: clear ? 'clear' : 'load', storeOp: 'store', clearValue: [0, 0, 0, 0] });
// a full-screen pass with its own bindings: res = what goes in bindings 0, 1, 2 ... (null leaves a binding out)
const fsPipe = (code, format) => { const m = mod(code); return device.createRenderPipeline({ layout: 'auto', vertex: { module: m, entryPoint: 'vs' }, fragment: { module: m, entryPoint: 'fs', targets: [{ format }] } }); };
const fsBG = (p, res) => device.createBindGroup({ layout: p.getBindGroupLayout(0), entries: res.map((r, binding) => r && { binding, resource: r.createView ? r.createView() : r.size ? { buffer: r } : r }).filter((e) => e) });
// one draw into every mip of a texture: level 0 with `p`, the rest by halving
const bake = (e, t, mips, p, bg, pm) => {
  for (let i = 0; i < mips; i++) {
    const r = e.beginRenderPass({ colorAttachments: [colorAtt(mipView(t, i), true)] });
    r.setPipeline(i ? pm : p); if (i || bg) r.setBindGroup(0, i ? blitBG(mipView(t, i - 1)) : bg); r.draw(3); r.end();
  }
};

const BLEND = { color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } };
const ADD = { color: { srcFactor: 'one', dstFactor: 'one' }, alpha: { srcFactor: 'one', dstFactor: 'one' } };
const A = (shaderLocation, offset, format) => ({ shaderLocation, offset, format });
const vbGrid = { arrayStride: 4, attributes: [A(0, 0, 'sint16x2')] }, ibLevel = { arrayStride: 16, stepMode: 'instance', attributes: [A(1, 0, 'float32x4')] };
const vbTownL = { arrayStride: 32, attributes: [A(0, 0, 'float32x3'), A(1, 12, 'float32x2'), A(2, 20, 'snorm8x4'), A(3, 24, 'uint8x4'), A(4, 28, 'uint16x2')] };
const ibSpeck = { arrayStride: 16, stepMode: 'instance', attributes: [A(0, 0, 'float32x4')] };
const scenePipe = (m, vsE, fsE, buffers, o = {}) => device.createRenderPipeline({ layout: pl0,
  vertex: { module: m, entryPoint: vsE, buffers },
  fragment: { module: m, entryPoint: fsE, targets: [{ format: HDR, blend: o.blend }] },
  primitive: { topology: o.strip ? 'triangle-strip' : 'triangle-list', cullMode: o.cull || 'none' },
  depthStencil: { format: DEPTH, depthWriteEnabled: !o.blend || !!o.dw, depthCompare: 'greater' }, multisample: { count: AA } });

await say('Compiling shaders…', 0.08, 300);
const mTerr = mod(W_TERR), mSea = mod(W_SEA), mSky = mod(W_SKY), mTown = mod(W_TOWN);
const pTerrain = scenePipe(mTerr, 'vs', 'fs', [vbGrid, ibLevel], { cull: 'back' });
// The town has two pipelines, and its shadow two: an opaque one for when nothing is fading, and one that may discard
// for the frames of a fade (fsF, fsS). At rest the layers cost what the town cost before them.
const pTown = scenePipe(mTown, 'vs', 'fs', [vbTownL], { cull: 'back' }), pTownF = scenePipe(mTown, 'vs', 'fsF', [vbTownL], { cull: 'back' });
const townSh = (fragment) => device.createRenderPipeline({ layout: pl0, vertex: { module: mTown, entryPoint: 'vsS', buffers: [vbTownL] }, fragment, primitive: { cullMode: 'none' },
  depthStencil: { format: 'depth16unorm', depthWriteEnabled: true, depthCompare: 'less', depthBias: 3, depthBiasSlopeScale: 2.5 } });
const pTownSh = townSh(), pTownShF = townSh({ module: mTown, entryPoint: 'fsS', targets: [] });
const pSea = scenePipe(mSea, 'vs', 'fs', [vbGrid, ibLevel], { blend: BLEND, dw: 1 });
const pSky = scenePipe(mSky, 'vs', 'fs', []);
const pSpeck = scenePipe(mSky, 'vsP', 'fsP', [ibSpeck], { strip: true, blend: ADD });
const pShadow = device.createRenderPipeline({ layout: pl0, vertex: { module: mTerr, entryPoint: 'vsS' }, primitive: { cullMode: 'none' },
  depthStencil: { format: DEPTH, depthWriteEnabled: true, depthCompare: 'less', depthBias: 2, depthBiasSlopeScale: 2 } });
const pWater = fsPipe(W_WATER, HDR), bgWater = fsBG(pWater, [uboW]);
const waterViews = [0, 1, 2, 3, 4].map((m) => mipView(tWater, m)), waterBG = waterViews.map((v) => blitBG(v)), waterPass = waterViews.map((v) => ({ colorAttachments: [colorAtt(v, true)] }));
const pSkyLut = fsPipe(W_SKYLUT, HDR), bgSkyLut = fsBG(pSkyLut, [ubo]), passSky = { colorAttachments: [colorAtt(tSky.createView(), true)] };
const pRays = fsPipe(W_RAYS, HDR), pRB = fsPipe(W_RBLUR, HDR), pPost = fsPipe(W_POST, FMT);
const passShadow = { colorAttachments: [], depthStencilAttachment: { view: tShadow.createView(), depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'store' } };
const passTownSh = { colorAttachments: [], depthStencilAttachment: { view: tTownSh.createView(), depthClearValue: 1, depthLoadOp: 'clear', depthStoreOp: 'store' } };

// ---------------------------------------------------------------- the island: read the data, bake it into textures
await say('Reading the island…', 0.3, 700);
// marks a load in progress (quality.js); leaving the page before it ends is not a crash
keep('abyssalLoad', 1);
addEventListener('pagehide', () => keep('abyssalLoad', ''));
const HN = 2048, HG = new Float32Array(HN * HN), HP = []; // heights on the CPU, for the camera: a 12.5 m grid, and its maxima at 200 m, 400 m ...
{
  const D = decodeTerrain(Uint8Array.from(atob(TERRAIN), (c) => c.charCodeAt(0))), n = D.N;
  const tC = tex(n, n, 'r32float', TU.TEXTURE_BINDING | TU.COPY_DST), tK = tex(n, n, 'r8uint', TU.TEXTURE_BINDING | TU.COPY_DST);
  Q.writeTexture({ texture: tC }, Float32Array.from(D.q, (v) => v * 0.25), { bytesPerRow: n * 4 }, [n, n]);
  Q.writeTexture({ texture: tK }, D.rock, { bytesPerRow: n }, [n, n]);
  await say('Raising the land…', 0.75, 1500);
  const pH = fsPipe(W_BAKEH, 'r16float'), pN = fsPipe(W_BAKEN, 'rgba8unorm'), pG = fsPipe(W_BAKEG, 'rgba8unorm'), pD = fsPipe(W_DETAIL, 'rgba8unorm');
  const m = log2(TS / HN), br = device.createBuffer({ size: HN * HN * 2, usage: BU.MAP_READ | BU.COPY_DST });
  const e = device.createCommandEncoder();
  bake(e, tDetail, 11, pD, null, pMip8);
  bake(e, tH, TM, pH, fsBG(pH, [tC, tK]), pMipR);
  bake(e, tNrm, TM, pN, fsBG(pN, [null, tK, tH, sClamp]), pMip8);
  bake(e, tGeo, 11, pG, fsBG(pG, [null, tK]), pMip8);
  e.copyTextureToBuffer({ texture: tH, mipLevel: m }, { buffer: br, bytesPerRow: HN * 2 }, [HN, HN]);
  Q.submit([e.finish()]);
  await br.mapAsync(GPUMapMode.READ);
  const h = new Uint16Array(br.getMappedRange());
  for (let i = 0; i < h.length; i++) { const v = h[i], x = (v >> 10) & 31, f = x ? (1 + (v & 1023) / 1024) * 2 ** (x - 15) : (v & 1023) * 2 ** -24; HG[i] = v & 32768 ? -f : f; }
  br.unmap(); br.destroy(); tC.destroy(); tK.destroy();
  for (let w = 128, src = HG, sw = HN; w >= 1; sw = w, w >>= 1) {
    const d = new Float32Array(w * w).fill(-1e9), k = sw / w;
    for (let j = 0; j < sw; j++) for (let i = 0; i < sw; i++) { const o = ((j / k) | 0) * w + ((i / k) | 0); if (src[j * sw + i] > d[o]) d[o] = src[j * sw + i]; }
    HP.push(d); src = d;
  }
}
// ground height at (x, z) (per frame: no allocations)
function hAt(x, z) {
  let u = (x / DOM + 0.5) * HN - 0.5, v = (z / DOM + 0.5) * HN - 0.5;
  u = u < 0 ? 0 : u > HN - 1.001 ? HN - 1.001 : u; v = v < 0 ? 0 : v > HN - 1.001 ? HN - 1.001 : v;
  const i = u | 0, j = v | 0, k = j * HN + i, a = HG[k], b = HG[k + HN];
  u -= i; v -= j;
  return (a + (HG[k + 1] - a) * u) * (1 - v) + (b + (HG[k + HN + 1] - b) * u) * v;
}
// the highest ground within about r metres of (x, z)
function hMax(x, z, r) {
  let l = Math.ceil(log2(r / 200)); l = l < 0 ? 0 : l > 7 ? 7 : l;
  const w = 128 >> l, d = HP[l], ci = floor((x / DOM + 0.5) * w), cj = floor((z / DOM + 0.5) * w); let m = -1e9;
  for (let j = cj - 1; j <= cj + 1; j++) for (let i = ci - 1; i <= ci + 1; i++) { const v = d[(j < 0 ? 0 : j >= w ? w - 1 : j) * w + (i < 0 ? 0 : i >= w ? w - 1 : i)]; if (v > m) m = v; }
  return m;
}

// ---------------------------------------------------------------- the town: its houses, its plan, and what stands where
await say('Building the town…', 0.9, 500);
const TB = buildTown(hAt), vbTown = buf(TB.v, BU.VERTEX), ibTown = buf(TB.ix, BU.INDEX), nTown = TB.ix.length, TGRID = TB.grid, TROW = TB.rows, NTB = TROW.length / 4;
{
  const e = device.createCommandEncoder();
  for (const [t, m] of [[tTown, TB.map], [tTown2, TB.map2]]) {
    Q.writeTexture({ texture: t }, m, { bytesPerRow: TMAPN * 4 }, [TMAPN, TMAPN]);
    for (let i = 1; i < TMM; i++) { const r = e.beginRenderPass({ colorAttachments: [colorAtt(mipView(t, i), true)] }); r.setPipeline(pMip8); r.setBindGroup(0, blitBG(mipView(t, i - 1))); r.draw(3); r.end(); }
  }
  Q.submit([e.finish()]);
  // nothing in the town is dated yet (D34): every row stands for the whole span of years
  for (let i = 0; i < NTB; i++) { TBU[i * 4] = TROW[i * 4]; TBU[i * 4 + 1] = TROW[i * 4 + 1]; TBU[i * 4 + 2] = 9999; }
  Q.writeBuffer(uboTab, 0, TBU);
}
// ---------------------------------------------------------------- the layers, the year and the day (docs/layers/README.md)
// The three numbers every thing is shown by: the layer (0 Found, 1 Inferred, 2 Imagined), the year BCE and the day of the
// year, counted from the spring equinox. Each glides to the value it was set to; nothing is rebuilt and nothing waits.
// The choices put to Chad (docs/layers/README.md, "The choices"), as built: TONE and TONEB, the plain tones of the land
// (with the sea floor) and of buildings, where a colour has no source; CROSS, the seconds the wave takes to cross the
// town; LIFT, 1 if a viewer standing where a house appears is lifted to its roof, 0 if the house is not solid for them
// until they have walked out of it.
let TONE = [0.2, 0.193, 0.176], TONEB = [0.33, 0.32, 0.295], CROSS = 5, LIFT = 1, layTo = 1, yearTo = 1628, dayTo = DAY0, fading = 0, ghost = 0;
const WAVE = 3, SHOWN = new Float32Array(NTB), LAY = 25, YEAR = 26, DAY = 27;
// how far each building is shown, 0 to 1: the same sum as vis() in the shaders, worked out again only when a number has moved
function showAll() {
  const l = F[LAY], y = F[YEAR]; fading = l !== round(l) ? 1 : 0;
  for (let i = 1; i < NTB; i++) {
    let s = (l - TBU[i * 4] + 1) * (1 + WAVE) - TBU[i * 4 + 1] * WAVE, a = (TBU[i * 4 + 2] - y) / 3 + 1, b = (y - TBU[i * 4 + 3]) / 3 + 1;
    s = (s < 0 ? 0 : s > 1 ? 1 : s) * (a < 0 ? 0 : a > 1 ? 1 : a) * (b < 0 ? 0 : b > 1 ? 1 : b);
    SHOWN[i] = s; if (s > 0 && s < 1) fading = 1;
  }
}
// Collision follows what is shown. The top of whatever is built at (x, z), or far below the ground where nothing is: a
// hidden building is not there, and one that is part shown stands part of its height, so a viewer on its roof is let
// down as it goes and lifted as it comes (or, with LIFT 0, is left inside it: ghost is the building they are in).
function tAt(x, z) {
  const i = floor((x - TGX) / TCELL), j = floor((z - TGZ) / TCELL); if (i < 0 || j < 0 || i >= TGW || j >= TGH) return -1e9;
  const id = TGRID[j * TGW + i], s = SHOWN[id], o = id * 4;
  return !id || s <= 0 || id === ghost ? -1e9 : s >= 1 ? TROW[o + 3] : LIFT || layTo < F[LAY] ? TROW[o + 2] + (TROW[o + 3] - TROW[o + 2]) * s : -1e9;
}
function sAt(x, z) { const h = hAt(x, z), t = tAt(x, z); return t > h ? t : h; }
// the same two, for a body 40 cm across (the narrowest street on the plan is about a metre between its walls)
function wallAt(x, z) { return max(tAt(x, z), tAt(x - 0.2, z), tAt(x + 0.2, z), tAt(x, z - 0.2), tAt(x, z + 0.2)); }
function solid(x, z) { return max(sAt(x, z), sAt(x - 0.2, z), sAt(x + 0.2, z), sAt(x, z - 0.2), sAt(x, z + 0.2)); }

// ---------------------------------------------------------------- meshes
const GM = gridMesh(), vbMesh = buf(GM.v, BU.VERTEX), ibMesh = buf(GM.idx, BU.INDEX);
const LT = new Float32Array(64), LS = new Float32Array(64), ibTerr = buf(LT, BU.VERTEX), ibSea = buf(LS, BU.VERTEX); // one [x, z, cell, level] per ring
let ibShadowGrid;
{
  const n = SG + 1, ix = new Uint32Array(SG * SG * 6);
  for (let j = 0, k = 0; j < SG; j++) for (let i = 0; i < SG; i++) { const a = j * n + i; ix[k++] = a; ix[k++] = a + n; ix[k++] = a + 1; ix[k++] = a + 1; ix[k++] = a + n; ix[k++] = a + n + 1; }
  ibShadowGrid = buf(ix, BU.INDEX);
}
const NSPECK = 6000 >> LV, ibSpecks = buf(Float32Array.from({ length: NSPECK * 4 }, rnd), BU.VERTEX);

// ---------------------------------------------------------------- camera state, viewpoints, the scripted path
// per-frame float state lives in one preallocated array, so the frame loop allocates no heap numbers
const F = new Float64Array(40), P6 = new Float64Array(6), V3 = new Float64Array(3);
const CX = 0, CY = 1, CZ = 2, YAW = 3, PIT = 4, FX = 5, FY = 6, FZ = 7, RX = 8, RZ = 9, UX = 10, UY = 11, UZ = 12, VX = 13, VY = 14, VZ = 15, TIME = 16, FLT = 17, LAST = 18, GPU = 19, HUDT = 20, SPL = 21, HOUR = 22, HSEA = 23, FEET = 24;
F[LAY] = layTo; F[YEAR] = yearTo; F[DAY] = dayTo; showAll();
// a height given above the ground (or the sea), or a depth below the surface, as an absolute height
const lift = (p) => { p[1] = p[1] < 0 ? p[1] : max(hAt(p[0], p[2]), 0) + p[1]; };
for (const p of POSES) lift(p);
// The viewer swims, flies or walks (D12). walk: on foot, with FEET the height of the ground underfoot. Eye height and pace
// are liberties (A-L9): TOWNR.eye is the one figure a source gives, an architect's reading of one room's paintings (T2#35, grade B).
let walk = 0, show = 0; // show: the edge of the excavated walls is drawn
// aim the camera from P6 = position + look-at point
function aim() {
  const dx = P6[3] - P6[0], dy = P6[4] - P6[1], dz = P6[5] - P6[2];
  F[CX] = P6[0]; F[CY] = P6[1]; F[CZ] = P6[2];
  F[YAW] = atan2(dx, -dz); F[PIT] = atan2(dy, sqrt(dx * dx + dz * dz));
}
const lookAt = (x, y, z, tx, ty, tz, onFoot) => { P6[0] = x; P6[1] = y; P6[2] = z; P6[3] = tx; P6[4] = ty; P6[5] = tz; aim(); F[VX] = F[VY] = F[VZ] = 0; walk = onFoot | 0; F[FEET] = y - TOWNR.eye; };
// A two-minute camera path (position + look-at, Catmull-Rom) for dev.js: in from the sea to the town, over its roofs and
// along its streets from above, round it, then up over the island, down into the bay, to Profitis Ilias and under the sea.
const FLY = new Float32Array([
  -40, 2.6, 6900, -135, 30, 5937,
  -70, 8, 6420, -135, 28, 5937,
  -105, 22, 6090, -138, 24, 5930,
  -128, 20, 6000, -140, 24, 5900,
  -146, 15, 5962, -146, 22, 5890,
  -148, 13, 5930, -135, 22, 5870,
  -128, 16, 5905, -110, 20, 5840,
  -112, 18, 5872, -60, 22, 5760,
  -70, 22, 5800, 40, 26, 5640,
  10, 28, 5690, 60, 24, 5560,
  60, 34, 5580, -60, 22, 5700,
  20, 45, 5490, -120, 14, 5940,
  -150, 60, 5560, -110, 14, 5930,
  -330, 120, 5760, -130, 20, 5900,
  -250, 30, 2400, -900, 200, -1500,
  -250, 6, 1345, -1250, 40, -2500,
  900, 20, 300, -700, 160, -2600,
  1250, 1.5, -450, -900, 150, -2700,
  900, 500, -5000, -1200, 0, -2000,
  -6000, 6000, -3000, 0, 0, 0,
  300, 9200, 13800, -300, 0, -200,
  4000, 3000, 9000, 4500, 400, 4500,
  5270, 3, 4050, -900, 100, -1600,
  1800, 60, 6100, 400, 0, 6300,
  250, -7, 6560, -135, -1, 6200,
]);
for (let i = 0; i < FLY.length; i += 6) FLY[i + 1] = FLY[i + 1] < 0 ? FLY[i + 1] : max(hAt(FLY[i], FLY[i + 2]), 0) + FLY[i + 1];
const FLYN = FLY.length / 6, FLYT = 120, LUTN = 1024, flyLUT = new Float32Array(LUTN + 1);
// camera spline (Catmull-Rom over position + look-at) at parameter F[SPL]
function flyRaw() {
  const s = F[SPL]; let i = floor(s) | 0; if (i > FLYN - 2) i = FLYN - 2;
  const u = s - i, i0 = (i > 0 ? i - 1 : 0) * 6, i1 = i * 6, i2 = (i + 1) * 6, i3 = (i + 2 < FLYN ? i + 2 : FLYN - 1) * 6;
  for (let o = 0; o < 6; o++) {
    const a = FLY[i0 + o], b = FLY[i1 + o], c = FLY[i2 + o], d = FLY[i3 + o];
    P6[o] = 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u);
  }
  aim();
}
{ // time table: flyLUT[k] = spline parameter at fraction k/LUTN of the flight. It keeps the free camera's rule: slow when low, fast when
  // high, so that the flight crosses the island quickly, and it goes three times slower again over the town
  const M = 4096, len = new Float32Array(M + 1); let px = 0, py = 0, pz = 0;
  for (let k = 0; k <= M; k++) { F[SPL] = k / M * (FLYN - 1); flyRaw(); if (k) len[k] = len[k - 1] + hypot(F[CX] - px, F[CY] - py, F[CZ] - pz) / (7 + min(max(F[CY] - max(hAt(F[CX], F[CZ]), 0), 0) * 0.45, 500)) * (abs(F[CX] - TNX) < TNS / 2 && abs(F[CZ] - TNZ) < TNS / 2 ? 3 : 1); px = F[CX]; py = F[CY]; pz = F[CZ]; }
  for (let k = 0, j = 0; k <= LUTN; k++) { const d = k / LUTN * len[M]; while (j < M - 1 && len[j + 1] < d) j++; flyLUT[k] = (j + (d - len[j]) / max(len[j + 1] - len[j], 1e-6)) / M * (FLYN - 1); }
}
// camera on the scripted path at time F[FLT] (kept off the ground: the spline cuts corners)
function flyAt() {
  let s = F[FLT] / FLYT; s = s < 0 ? 0 : s > 1 ? 1 : s; s = s * s * (3 - 2 * s) * 0.25 + s * 0.75;
  s *= LUTN; let k = floor(s) | 0; if (k > LUTN - 1) k = LUTN - 1;
  F[SPL] = flyLUT[k] + (flyLUT[k + 1] - flyLUT[k]) * (s - k); flyRaw();
  F[CY] = max(F[CY], solid(F[CX], F[CZ]) + 1);
}

// ---------------------------------------------------------------- the sun, the time of day and the day of the year
// The hour moves towards hourTo (always forwards, as the sun does), and the day towards dayTo (the short way round the
// year). While either moves, and whenever the sun has moved since the shadow map was drawn, the map is drawn again from
// the new direction. Only the sun follows the date: the wind, the haze and the sea do not, and the ground is bare all year.
let hourTo = TIMES[2][1], tIdx = 2, shadowAt = -1, shDay = -1, shLay = -1, shYear = 0, expo = 1, wet = 0; // wet: 0 in the air to 1 under water, following the camera with a short delay, as eyes do
F[HOUR] = hourTo;
function setSun() {
  const el = sunAt(F[HOUR], declAt(F[DAY]), V3);
  UB[48] = V3[0]; UB[49] = V3[1]; UB[50] = V3[2]; UB[51] = windAt(F[HOUR]);
  sunLight(el, V3); UB[60] = V3[0]; UB[61] = V3[1]; UB[62] = V3[2];
  const deg = el * 180 / PI, nt = sstep(-3, -11, deg);
  UB[63] = nt;
  // exposure: steady by day, opening up through dusk to a night lit only by stars (far brighter than the eye would see it)
  expo = 0.42 * exp(2.9 * sstep(9, -5, deg) + 2 * sstep(-3, -12, deg));
  // the shadow map looks along the sun's rays at the whole island (a sun under the horizon lights nothing)
  let lx = UB[48], ly = max(UB[49], 0.03), lz = UB[50]; const ll = hypot(lx, ly, lz); lx /= ll; ly /= ll; lz /= ll;
  const rl = hypot(ly, lx), rx = ly / rl, ry = -lx / rl, ux = -lz * ry, uy = lz * rx, uz = lx * ry - ly * rx, R = 18200, D = 19000, m = UBS;
  m[0] = rx / R; m[4] = ry / R; m[8] = 0; m[12] = 0;
  m[1] = ux / R; m[5] = uy / R; m[9] = uz / R; m[13] = 0;
  m[2] = -lx / (2 * D); m[6] = -ly / (2 * D); m[10] = -lz / (2 * D); m[14] = 0.5;
  m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1;
  for (let i = 0; i < 16; i++) UB[16 + i] = m[i];
  // the town's own map looks the same way, at a box just large enough to hold the town from that side
  let r0 = 1e9, r1 = -1e9, u0 = 1e9, u1 = -1e9, d0 = 1e9, d1 = -1e9; const t = UBT, hs = TNS / 2 - 45;
  for (let i = 0; i < 8; i++) {
    const x = TNX + (i & 1 ? hs : -hs), y = i & 2 ? 70 : 8, z = TNZ + (i & 4 ? hs : -hs), a = rx * x + ry * y, b = ux * x + uy * y + uz * z, c = -(lx * x + ly * y + lz * z);
    r0 = min(r0, a); r1 = max(r1, a); u0 = min(u0, b); u1 = max(u1, b); d0 = min(d0, c); d1 = max(d1, c);
  }
  const sr = 2 / (r1 - r0), su = 2 / (u1 - u0), sd = 1 / (d1 - d0);
  t[0] = rx * sr; t[4] = ry * sr; t[8] = 0; t[12] = -(r0 + r1) / (r1 - r0);
  t[1] = ux * su; t[5] = uy * su; t[9] = uz * su; t[13] = -(u0 + u1) / (u1 - u0);
  t[2] = -lx * sd; t[6] = -ly * sd; t[10] = -lz * sd; t[14] = -d0 * sd;
  t[3] = 0; t[7] = 0; t[11] = 0; t[15] = 1;
  for (let i = 0; i < 16; i++) UB[64 + i] = t[i];
}
setSun();

// ---------------------------------------------------------------- render targets (rebuilt on resize)
// The scene is drawn at `pix` pixels and scaled up to the window. frame() tunes it for 60 fps; it starts where the last
// visit left it.
const PIXMAX = 2560 * 1440, PIXMIN = mob ? 25e4 : 5e5;
let W = 0, H = 0, DW = 0, DH = 0, pix = +SV[1] || (LV > 1 ? 41e4 : mob ? 1280 * 720 : PIXMAX), dynN = 0, dynT = 0, dynG = 0, dynGN = 0, dynBad = 0, dynOk = 0, dynWait = 3;
let passScene, passRays, passBlur, bgBlur, passPost, bgRays, bgPost, bloomPass = [], bloomBG = [], targets = [];
const NB = 6;
function resize() {
  DW = max(2, round(canvas.clientWidth * devicePixelRatio)); DH = max(2, round(canvas.clientHeight * devicePixelRatio));
  const s = min(1, sqrt(pix / (DW * DH)));
  const w = max(2, round(DW * s) & ~1), h = max(2, round(DH * s) & ~1);
  if (w === W && h === H) return;
  dynN = dynG = dynGN = 0; dynT = -300; // let the new size settle before measuring again
  W = w; H = h; canvas.width = W; canvas.height = H;
  ctx.configure({ device, format: FMT, alphaMode: 'opaque' });
  for (const t of targets) t.destroy();
  const tMS = tex(AA > 1 ? W : 1, H, HDR, TU.RENDER_ATTACHMENT, 1, AA), tDp = tex(W, H, DEPTH, RT, 1, AA);
  const tRes = tex(W, H, HDR, RT), tRay = tex(W / 2, H / 2, HDR, RT), tRay2 = tex(W / 2, H / 2, HDR, RT);
  targets = [tMS, tDp, tRes, tRay, tRay2];
  const bl = [];
  for (let i = 0; i < NB; i++) { const t = tex(max(1, W >> (i + 1)), max(1, H >> (i + 1)), HDR, RT); bl.push(t); targets.push(t); }
  const vRes = tRes.createView(), vBl = bl.map((t) => t.createView());
  // without anti-aliasing (Low) the scene goes straight into the resolve target, and tMS is one unused column
  passScene = { colorAttachments: [{ view: AA > 1 ? tMS.createView() : vRes, resolveTarget: AA > 1 ? vRes : undefined, loadOp: 'clear', storeOp: AA > 1 ? 'discard' : 'store', clearValue: [0, 0, 0, 1] }],
    depthStencilAttachment: { view: tDp.createView(), depthClearValue: 0, depthLoadOp: 'clear', depthStoreOp: 'store' } };
  passRays = { colorAttachments: [colorAtt(tRay.createView(), true)] };
  passBlur = { colorAttachments: [colorAtt(tRay2.createView(), true)] };
  bgBlur = fsBG(pRB, [tRay]);
  passPost = { colorAttachments: [{ view: null, loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] }] };
  bgRays = fsBG(pRays, [ubo, sRep, sCmp, tShadow, tWater, tDp]);
  bgPost = fsBG(pPost, [ubo, sClamp, tRes, tRay2, bl[0], tDp]);
  bloomPass = []; bloomBG = [];
  // down: res -> b0 -> ... -> b5 ; up: b5 -> b4 (additive) ... -> b0
  for (let i = 0; i < NB; i++) { bloomPass.push({ colorAttachments: [colorAtt(vBl[i], true)] }); bloomBG.push(blitBG(i ? vBl[i - 1] : vRes)); }
  for (let i = NB - 1; i > 0; i--) { bloomPass.push({ colorAttachments: [colorAtt(vBl[i - 1], false)] }); bloomBG.push(blitBG(vBl[i])); }
  UB[52] = W; UB[53] = H; UB[54] = 1 / W; UB[55] = 1 / H;
}
resize();
addEventListener('resize', resize);

// ---------------------------------------------------------------- timing (GPU timestamp queries)
let qs, qResolve, qRead = [], tsBegin, tsEnd;
if (hasTS) {
  qs = device.createQuerySet({ type: 'timestamp', count: 2 });
  qResolve = device.createBuffer({ size: 16, usage: BU.QUERY_RESOLVE | BU.COPY_SRC });
  for (let i = 0; i < 6; i++) {
    const b = device.createBuffer({ size: 16, usage: BU.MAP_READ | BU.COPY_DST });
    const o = { b, busy: false, done: null };
    o.done = () => {
      const a = new BigInt64Array(b.getMappedRange());
      const ms = Number(a[1] - a[0]) / 1e6; F[GPU] = ms; b.unmap(); o.busy = false;
      if (dynT > 0 && ms > 0 && ms < 1e3) { dynG += ms; dynGN++; }
    };
    qRead.push(o);
  }
  tsBegin = { querySet: qs, beginningOfPassWriteIndex: 0 }; tsEnd = { querySet: qs, endOfPassWriteIndex: 1 };
}

// ---------------------------------------------------------------- frame
let hud = false;
let kf = 0, kb = 0, kl = 0, kr = 0, ku = 0, kd = 0, ks = 0, mdx = 0, mdy = 0, lkx = 0, lky = 0, l2x = 0, l2y = 0, hN = 0, hMax_ = 0, hMin = 1e9, hPer = 1e9, hLate = 0, hTot = 0, tId = -1, tN = 0, tx0 = 0, ty0 = 0, tx = 0, ty = 0;
const TANH = 0.6, NEAR = 0.1, RAYS = 0.5;
const submitList = [null];
// The rings to draw around the camera: fills `out` with [x, z, cell, level] from the finest level worth drawing to the
// coarsest, and returns how many. A level is skipped when the camera is so far above everything it could show (the
// sea, or the highest ground under that ring) that the shader would blend all of it into the next level anyway.
function rings(out, n, sea) {
  let l0 = 0; while (l0 < n - 1 && (sea ? abs(F[CY]) - 2 : F[CY] - hMax(F[CX], F[CZ], GN / 2 * 2 ** l0)) >= 2 * LK * 2 ** l0) l0++;
  for (let l = l0, k = 0; l < n; l++, k += 4) { const s = 2 ** l; out[k] = floor(F[CX] / (2 * s)) * 2 * s; out[k + 1] = floor(F[CZ] / (2 * s)) * 2 * s; out[k + 2] = s; out[k + 3] = l; }
  return n - l0;
}
function render() {
  // camera basis (right vector is horizontal)
  const cx = F[CX], cy = F[CY], cz = F[CZ], pitch = F[PIT], yaw = F[YAW];
  const cp = cos(pitch), fy = sin(pitch), rx = cos(yaw), rz = sin(yaw), fx = cp * rz, fz = -cp * rx;
  const ux = -rz * fy, uy = rz * fx - rx * fz, uz = rx * fy;
  F[FX] = fx; F[FY] = fy; F[FZ] = fz; F[RX] = rx; F[RZ] = rz; F[UX] = ux; F[UY] = uy; F[UZ] = uz;
  const asp = W / H, sx = 1 / (TANH * asp), sy = 1 / TANH, m = UB;
  m[0] = rx * sx; m[4] = 0; m[8] = rz * sx; m[12] = -(rx * cx + rz * cz) * sx;
  m[1] = ux * sy; m[5] = uy * sy; m[9] = uz * sy; m[13] = -(ux * cx + uy * cy + uz * cz) * sy;
  m[2] = 0; m[6] = 0; m[10] = 0; m[14] = NEAR;
  m[3] = fx; m[7] = fy; m[11] = fz; m[15] = -(fx * cx + fy * cy + fz * cz);
  m[32] = cx; m[33] = cy; m[34] = cz; m[35] = F[TIME];
  m[36] = rx; m[37] = 0; m[38] = rz; m[39] = TANH * asp;
  m[40] = ux; m[41] = uy; m[42] = uz; m[43] = TANH;
  m[44] = fx; m[45] = fy; m[46] = fz; m[47] = NEAR;
  m[57] = RAYS; m[58] = show; m[59] = F[HSEA];
  m[80] = F[LAY]; m[81] = F[YEAR]; m[82] = F[DAY]; m[83] = WAVE; m[84] = TONE[0]; m[85] = TONE[1]; m[86] = TONE[2]; m[87] = fading; m[88] = TONEB[0]; m[89] = TONEB[1]; m[90] = TONEB[2];
  const moved = shadowAt !== F[HOUR] || shDay !== F[DAY];
  if (moved) { setSun(); Q.writeBuffer(uboS, 0, UBS); shadowAt = F[HOUR]; shDay = F[DAY]; }
  // the town's shadow map is drawn again while its owners change: when the sun moves, and on every frame of a fade
  const townSh = moved || shLay !== m[80] || shYear !== m[81];
  if (townSh) { shLay = UBT[80] = m[80]; shYear = UBT[81] = m[81]; UBT[83] = WAVE; Q.writeBuffer(uboT, 0, UBT); }
  // at rest in the Found layer only what was found is drawn: its triangles come first
  const nDraw = m[80] ? nTown : TB.nF;
  m[56] = expo * (1 + 0.6 * wet);
  Q.writeBuffer(ubo, 0, UB);
  WT[0] = F[TIME]; Q.writeBuffer(uboW, 0, WT);
  const nT = rings(LT, TLV, 0), nS = rings(LS, SLV, 1);
  Q.writeBuffer(ibTerr, 0, LT); Q.writeBuffer(ibSea, 0, LS);

  const e = device.createCommandEncoder();
  let slot = null;
  if (hasTS) { for (let i = 0; i < qRead.length; i++) if (!qRead[i].busy) { slot = qRead[i]; break; } }
  waterPass[0].timestampWrites = slot ? tsBegin : undefined;
  passPost.timestampWrites = slot ? tsEnd : undefined;
  // animated water texture + mips
  let r = e.beginRenderPass(waterPass[0]); r.setPipeline(pWater); r.setBindGroup(0, bgWater); r.draw(3); r.end();
  for (let i = 1; i < 5; i++) { r = e.beginRenderPass(waterPass[i]); r.setPipeline(pMip16); r.setBindGroup(0, waterBG[i - 1]); r.draw(3); r.end(); }
  // the sky, and the shadow map when the sun has moved
  r = e.beginRenderPass(passSky); r.setPipeline(pSkyLut); r.setBindGroup(0, bgSkyLut); r.draw(3); r.end();
  if (moved) { r = e.beginRenderPass(passShadow); r.setPipeline(pShadow); r.setBindGroup(0, bg0s); r.setIndexBuffer(ibShadowGrid, 'uint32'); r.drawIndexed(SG * SG * 6); r.end(); }
  if (townSh) { r = e.beginRenderPass(passTownSh); r.setPipeline(fading ? pTownShF : pTownSh); r.setBindGroup(0, bg0t); r.setVertexBuffer(0, vbTown); r.setIndexBuffer(ibTown, 'uint32'); r.drawIndexed(nDraw); r.end(); }
  // scene: land, sea, sky, and specks in the water when the camera is in it
  r = e.beginRenderPass(passScene);
  r.setBindGroup(0, bg0); r.setVertexBuffer(0, vbMesh); r.setIndexBuffer(ibMesh, 'uint16');
  r.setPipeline(pTerrain); r.setVertexBuffer(1, ibTerr);
  r.drawIndexed(GM.nFull, 1, 0, 0, 0); if (nT > 1) r.drawIndexed(GM.nRing, nT - 1, GM.nFull, 0, 1);
  r.setPipeline(fading ? pTownF : pTown); r.setVertexBuffer(0, vbTown); r.setIndexBuffer(ibTown, 'uint32'); r.drawIndexed(nDraw);
  r.setPipeline(pSea); r.setVertexBuffer(0, vbMesh); r.setIndexBuffer(ibMesh, 'uint16'); r.setVertexBuffer(1, ibSea);
  r.drawIndexed(GM.nFull, 1, 0, 0, 0); if (nS > 1) r.drawIndexed(GM.nRing, nS - 1, GM.nFull, 0, 1);
  r.setPipeline(pSky); r.draw(3);
  if (cy < F[HSEA]) { r.setPipeline(pSpeck); r.setVertexBuffer(0, ibSpecks); r.draw(4, NSPECK); }
  r.end();
  // light shafts
  r = e.beginRenderPass(passRays); r.setPipeline(pRays); r.setBindGroup(0, bgRays); r.draw(3); r.end();
  r = e.beginRenderPass(passBlur); r.setPipeline(pRB); r.setBindGroup(0, bgBlur); r.draw(3); r.end();
  // bloom
  for (let i = 0; i < bloomPass.length; i++) {
    r = e.beginRenderPass(bloomPass[i]); r.setPipeline(i === 0 ? pDown0 : i < NB ? pDown : pUp); r.setBindGroup(0, bloomBG[i]); r.draw(3); r.end();
  }
  // composite
  passPost.colorAttachments[0].view = ctx.getCurrentTexture().createView();
  r = e.beginRenderPass(passPost); r.setPipeline(pPost); r.setBindGroup(0, bgPost); r.draw(3); r.end();
  if (slot) { e.resolveQuerySet(qs, 0, 2, qResolve, 0); e.copyBufferToBuffer(qResolve, 0, slot.b, 0, 16); }
  submitList[0] = e.finish();
  Q.submit(submitList);
  if (slot) { slot.busy = true; slot.b.mapAsync(GPUMapMode.READ).then(slot.done); }
}

function frame(now) {
  requestAnimationFrame(frame);
  const dtr = now - F[LAST]; F[LAST] = now;
  let dt = dtr / 1000; if (dt > 0.1) dt = 0.1;
  // Dynamic resolution for 60 fps: every second (0.4 s behind the menu) scale the pixel count by k
  if (dtr < 1e3 && (dynT += dtr) > 0 && (dynN++, dynT > (menu ? 400 : 1000))) {
    const a = dynT / dynN, g = dynGN ? dynG / dynGN : 0; let k = 1;
    // with GPU timing: keep it between 9.8 and 13.6 ms
    if (g) { if (g > 13.6 || g < 9.8) k = 11.7 / g; }
    // without: slow for two periods in a row means fewer pixels, and twice as long before trying to go back up
    else if (a > 17.6) { dynOk = 0; if (++dynBad > 1) { k = 15 / a; dynBad = 0; dynWait = min(dynWait * 2, 60); } }
    // at the display's rate there is no telling if there is room, so try a little more now and then
    else { dynBad = 0; if (a < 12.5) k = 15 / a; else if (++dynOk > dynWait) { k = 1.17; dynOk = 0; } }
    k = k < 0.5 ? 0.5 : k > 1.7 ? 1.7 : k; const top = min(PIXMAX, DW * DH), was = pix;
    pix *= k; pix = pix < PIXMIN ? PIXMIN : pix > top ? top : pix;
    if (was !== pix) keep('abyssal', [LV, pix < top ? pix | 0 : '']); // nothing kept at full resolution
    dynN = dynT = dynG = dynGN = 0; resize();
  }
  F[TIME] += dt;
  wet += ((F[CY] < F[HSEA] ? 1 : 0) - wet) * (1 - exp(-dt * 4));
  // The layer glides to the one chosen, and can be turned round on the way: nothing jumps, because every thing is shown
  // by where the number is. The wave crosses the town in CROSS seconds (the town has the first TOWNR.wave[3] of the turns).
  // The year glides too (no control in the released page: nothing is dated yet).
  if (F[LAY] !== layTo || F[YEAR] !== yearTo) {
    const d = layTo - F[LAY], st = dt * TOWNR.wave[3] * WAVE / (1 + WAVE) / CROSS, e = yearTo - F[YEAR], se = dt * 12;
    F[LAY] = abs(d) <= st ? layTo : F[LAY] + (d < 0 ? -st : st); F[YEAR] = abs(e) <= se ? yearTo : F[YEAR] + (e < 0 ? -se : se);
    showAll();
  }
  // (with LIFT 0: a viewer standing where a house is appearing is inside it, and it is not solid for them until they leave)
  if (!LIFT) { const i = floor((F[CX] - TGX) / TCELL), j = floor((F[CZ] - TGZ) / TCELL), id = i < 0 || j < 0 || i >= TGW || j >= TGH ? 0 : TGRID[j * TGW + i]; if (id && SHOWN[id] < 1 && layTo > F[LAY]) ghost = id; else if (id !== ghost) ghost = 0; } else ghost = 0;
  // The day glides to the one chosen, the short way round the year. A named moment follows the sun: if the hour is at
  // one (or on its way to one), it stays with it as the day moves, so Golden stays golden from midsummer to midwinter.
  if (F[DAY] !== dayTo) {
    const was = hourOf(tIdx, F[DAY]), gap = ((dayTo - F[DAY]) % 365 + 547.5) % 365 - 182.5, st = max(abs(gap) * 2.5, 25) * dt;
    F[DAY] = st >= abs(gap) ? dayTo : (F[DAY] + (gap < 0 ? -st : st) + 365) % 365;
    if (hourTo === was) { const h = hourOf(tIdx, F[DAY]); if (F[HOUR] === hourTo) F[HOUR] = h; hourTo = h; }
  }
  // the hour glides to the chosen moment, forwards through the day
  if (F[HOUR] !== hourTo) { const gap = (hourTo - F[HOUR] + 24) % 24, st = max(gap * 2.2, 1.5) * dt; F[HOUR] = st >= gap ? hourTo : (F[HOUR] + st) % 24; }
  {
    // touch: holding the finger away from where it went down keeps turning, like a joystick
    if (tId >= 0) {
      const tr = 4 / (innerWidth < innerHeight ? innerWidth : innerHeight); let jx = (tx - tx0) * tr, jy = (ty - ty0) * tr;
      jx = jx > 1 ? 1 : jx < -1 ? -1 : jx; jy = jy > 1 ? 1 : jy < -1 ? -1 : jy;
      lkx += jx * 1.5 * dt; lky += jy * dt;
    }
    // mouse look through two cascaded low-pass stages
    const kq = 1 - exp(-dt * 30); lkx += mdx * 0.0022; lky += mdy * 0.0022; mdx = 0; mdy = 0;
    const ax = lkx * kq, ay = lky * kq; lkx -= ax; lky -= ay; l2x += ax; l2y += ay;
    const dyw = l2x * kq, dpt = l2y * kq; l2x -= dyw; l2y -= dpt;
    const yaw = F[YAW] + dyw; let pitch = F[PIT] - dpt; pitch = pitch < -1.55 ? -1.55 : pitch > 1.55 ? 1.55 : pitch;
    // Three ways to move (D12). Swimming under the surface and flying above it are one free camera: in the water it moves
    // at upstream's swimming pace, in the air the pace grows with the height above the ground, so the whole island is a
    // short flight from anywhere. Coming down onto land puts the viewer on foot; E or Space takes off again; walking out of
    // one's depth becomes swimming.
    const k = 1 - exp(-dt * 4.5), mf = tId >= 0 ? 0.7 : kf - kb, mr = kr - kl, mu = ku - kd, cp = cos(pitch), sy = sin(yaw), cw = cos(yaw), fast = ks || tN > 1;
    let x = F[CX], y = F[CY], z = F[CZ], vx = F[VX], vy = F[VY], vz = F[VZ];
    if (walk) {
      // on foot: along the ground at a walking pace. A wall, or anything higher than a step, stops the walker.
      const sp = TOWNR.pace * (fast ? TOWNR.hurry : 1), kw = 1 - exp(-dt * 9); let ft = F[FEET];
      vx += ((sy * mf + cw * mr) * sp - vx) * kw; vz += ((-cw * mf + sy * mr) * sp - vz) * kw;
      const nx = x + vx * dt, nz = z + vz * dt;
      if (solid(nx, z) - ft <= TOWNR.step) x = nx; else vx = 0;
      if (solid(x, nz) - ft <= TOWNR.step) z = nz; else vz = 0;
      const gr = solid(x, z);
      if (ft > gr + 0.02) { vy -= 9.8 * dt; ft += vy * dt; if (ft <= gr) { ft = gr; vy = 0; } } // down a step, or off a roof
      else { vy = 0; if (gr - ft <= TOWNR.step) ft += (gr - ft) * (1 - exp(-dt * 14)); }         // up a step
      F[FEET] = ft; y += (ft + TOWNR.eye - y) * (1 - exp(-dt * 12));
      // up and away (on a touch screen: look well up and keep going); or out of one's depth, and swimming
      if (ku || (tId >= 0 && pitch > 0.6)) { walk = 0; vy = 5; } else if (hAt(x, z) < 0.3 - TOWNR.eye) { walk = 0; vy = -2.5; }
    } else {
      const g0 = hAt(x, z), agl = y - (g0 > 0 ? g0 : 0), sp = (y < F[HSEA] ? 7 : 7 + min(max(agl, 0) * 0.45, 500)) * (fast ? 3.7 : 1);
      vx += ((sy * cp * mf + cw * mr) * sp - vx) * k; vy += ((sin(pitch) * mf + mu) * sp - vy) * k; vz += ((-cw * cp * mf + sy * mr) * sp - vz) * k;
      // the houses are solid from every side: a wall stops the camera, a roof carries it
      const nx = x + vx * dt, nz = z + vz * dt, was = solid(x, z) + 0.6; let t = wallAt(nx, z);
      if (t > y - 0.5 && t > was) vx = 0; else x = nx;
      t = wallAt(x, nz); if (t > y - 0.5 && t > was) vz = 0; else z = nz;
      x = x < -6e4 ? -6e4 : x > 6e4 ? 6e4 : x; z = z < -6e4 ? -6e4 : z > 6e4 ? 6e4 : z; y += vy * dt;
      // the ground is solid too: the camera rides over it and loses the speed that carried it down. Touching down on
      // land on purpose, or wading out of the sea, puts the viewer on foot.
      const gr = solid(x, z), lo = gr + 0.7;
      if (y < lo) {
        if (hAt(x, z) > 0.3 - TOWNR.eye && !ku && (kd || vy < -0.4 || y < F[HSEA] + 0.6)) { walk = 1; F[FEET] = gr; vx *= 0.3; vz *= 0.3; }
        y = lo; if (vy < 0) vy = 0;
      }
      if (y > 14e3) y = 14e3;
    }
    F[YAW] = yaw; F[PIT] = pitch; F[VX] = vx; F[VY] = vy; F[VZ] = vz; F[CX] = x; F[CY] = y; F[CZ] = z;
  }
  render();
  if (hud) {
    hN++; if (dtr > hMax_) hMax_ = dtr; if (dtr < hMin) hMin = dtr; if (dtr > hPer * 1.5) { hLate++; hTot++; }
    F[HUDT] += dtr / 1000;
    if (F[HUDT] > 0.5) { info.textContent = `${(hN / F[HUDT]).toFixed(0)} fps  ·  worst frame ${hMax_.toFixed(1)} ms  ·  late frames ${hLate} (total ${hTot})  ·  GPU ${F[GPU].toFixed(2)} ms  ·  ${W}x${H} (${W * 100 / DW | 0}%)`; F[HUDT] = 0; hPer = hMin; hN = 0; hMax_ = 0; hMin = 1e9; hLate = 0; }
  }
}
// the sea surface over the camera, for the shaders, the camera's pace and the sound; called before every drawn frame
const draw = render;
render = () => { F[HSEA] = seaAt(F[CX], F[CZ], F[TIME], max(-hAt(F[CX], F[CZ]), 0), UB[51]); draw(); };

// ---------------------------------------------------------------- input
const bTime = $('t').querySelectorAll('button');
const setTime = (i) => { tIdx = i; hourTo = hourOf(i, F[DAY]); bTime.forEach((b, j) => { b.className = i === j ? 'on' : ''; }); };
bTime.forEach((b, i) => { b.onclick = () => setTime(i); });
setTime(2);
// the edge of the excavated walls, drawn on the ground on request (key L, or the menu): beyond it the town is reconstruction
const bShow = $('v').querySelectorAll('button');
const setShow = (on) => { show = on ? 1 : 0; bShow.forEach((b, j) => { b.className = show === j ? 'on' : ''; }); };
bShow.forEach((b, i) => { b.onclick = () => setShow(i); });
setShow(0);
// The layer: Found, Inferred, Imagined (D38). setLayer() is the one way in, for the menu, the K key and whatever comes
// later (a link, a headset: ARCHITECTURE 12). Imagined holds nothing yet, so its button waits and K passes it by.
const bLay = $('r').querySelectorAll('button'), LINES = ['Only what was dug up, where it was found', 'Adds what the evidence points to', 'Adds what brings the place to life'];
const setLayer = (i) => { layTo = i; bLay.forEach((b, j) => { b.className = i === j ? 'on' : ''; }); $('e').textContent = LINES[i]; };
bLay.forEach((b, i) => { b.onclick = () => setLayer(i); });
setLayer(1);
const setYear = (y) => { yearTo = y; };
// The date: a day of the year, counted from the spring equinox and named as today's calendar names that time of year.
// These are seasonal dates, not dates in any calendar of the time. setDay() is the one way in, for the menu's slider, its
// four marks (the equinoxes and the solstices) and the [ and ] keys.
const sDay = $('f'), ML = [31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28];
const setDay = (d) => {
  dayTo = ((d % 365) + 365) % 365; let n = round(dayTo) % 365 + 19, m = 0; while (n >= ML[m]) n -= ML[m++];
  sDay.value = round(dayTo) % 365; $('z').textContent = (n + 1) + ' ' + 'MarAprMayJunJulAugSepOctNovDecJanFeb'.substr(m * 3, 3);
};
sDay.oninput = () => setDay(+sDay.value);
$('n').querySelectorAll('button').forEach((b, i) => { b.onclick = () => setDay(round(i * 91.25)); });
setDay(dayTo);
// the stats line: key H, or the menu's Stats button on a touch screen
const stat = () => { hud = !hud; hTot = 0; hPer = 1e9; info.textContent = ''; };
$('y').onclick = stat;
const key = (e, v) => {
  switch (e.code) {
    case 'KeyW': kf = v; break; case 'KeyS': kb = v; break; case 'KeyA': kl = v; break; case 'KeyD': kr = v; break;
    case 'Space': if (!menu) e.preventDefault(); // up, like E; in the world it must not press the last button clicked
    case 'KeyE': ku = v; break; case 'KeyQ': case 'KeyX': kd = v; break; case 'ShiftLeft': case 'ShiftRight': ks = v; break;
    // the date, a week back or on (held down, it keeps going)
    case 'BracketLeft': if (v) setDay(round(dayTo) - 7); break; case 'BracketRight': if (v) setDay(round(dayTo) + 7); break;
    default: if (v && !e.repeat) {
      if (e.code === 'KeyH') stat();
      else if (e.code === 'KeyM') mute();
      else if (e.code === 'KeyT') setTime((tIdx + 1) % TIMES.length);
      else if (e.code === 'Escape') ui(true);
      else if (e.code === 'KeyL') setShow(!show);
      else if (e.code === 'KeyK') setLayer(layTo ? 0 : 1);
      else if (e.code >= 'Digit1' && e.code <= 'Digit9') lookAt(...POSES[e.code.charCodeAt(5) - 49]);
    }
  }
};
// behind the menu only the stats and mute keys work
addEventListener('keydown', (e) => { if (menu && e.code !== 'KeyH' && e.code !== 'KeyM') return; sound(); key(e, 1); });
addEventListener('keyup', (e) => key(e, 0));
const release = () => { kf = kb = kl = kr = ku = kd = ks = 0; tId = -1; tN = 0; };
const capture = () => { sound(); const p = canvas.requestPointerLock({ unadjustedMovement: true }); if (p && p.catch) p.catch(() => canvas.requestPointerLock()).catch(() => 0); };
canvas.addEventListener('click', capture);
addEventListener('mousemove', (e) => { if (document.pointerLockElement === canvas) { mdx += e.movementX; mdy += e.movementY; } });
addEventListener('blur', release);
const touch = (e) => {
  e.preventDefault(); sound(); tN = e.touches.length;
  let f = null, first = false; for (let i = 0; i < tN; i++) if (e.touches[i].identifier === tId) f = e.touches[i];
  if (!f) { tId = -1; if (tN) { f = e.touches[0]; tId = f.identifier; first = true; } }
  if (f) {
    // the touch axes turn with the page when it lies on its side
    const x = rot.matches ? f.clientY : f.clientX, y = rot.matches ? -f.clientX : f.clientY, s = 1100 / min(innerWidth, innerHeight);
    if (first) { tx0 = x; ty0 = y; } else { mdx += (x - tx) * s; mdy += (y - ty) * s; } // the view follows the finger at once
    tx = x; ty = y;
  }
};
for (const n of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) canvas.addEventListener(n, touch, { passive: false });

// ---------------------------------------------------------------- menu
// The scene keeps rendering (blurred by CSS) behind the menu. Esc, losing the mouse or the corner button open it.
let menu = true;
const bDive = $('d');
const ui = (m) => {
  if (dead) return;
  menu = m; body.className = m ? 'm' : document.pointerLockElement ? 'g p' : 'g';
  // focus the start button so Enter works (delayed: it can't take focus while still hidden)
  if (m) { release(); setTimeout(() => menu && bDive.focus(), 100); } else document.activeElement.blur();
};
const go = () => {
  sound(); ui(false); bDive.textContent = 'Resume';
  // phones: go fullscreen and ask for landscape; where that is refused the CSS rotation still applies
  if (mob) document.documentElement.requestFullscreen?.()?.then(() => screen.orientation.lock('landscape')).catch(() => 0);
  if (!mob) capture();
};
bDive.onclick = go; $('o').onclick = () => ui(true);
// detail buttons: the current level is lit, the others reload the page with theirs
$('q').querySelectorAll('button').forEach((b, i) => { if (i === 2 - LV) b.className = 'on'; else b.onclick = () => { keep('abyssal', 2 - i); location.reload(); }; });
document.addEventListener('pointerlockchange', () => ui(!document.pointerLockElement));

// draw the first frame and wait for the GPU to finish it (pipelines get compiled on first use) before the reveal
lookAt(...POSES[0]);
await say('Letting the light in…', 1, 400);
render(); await Q.onSubmittedWorkDone();
setTimeout(keep, 15e3, 'abyssalLoad', ''); // the load counts as survived after 15 s of frames
ui(true);
requestAnimationFrame((t) => { F[LAST] = t; requestAnimationFrame(frame); });
