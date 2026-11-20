// ============================================================================
// spike, measurement 2: placing by rule on the GPU (dev.html only)
// ============================================================================
// A compute pass places things round the viewer every frame. Nothing is stored and JavaScript does no work for any one
// thing. THE THINGS ARE PLAIN GREY SHAPES, STAND-INS: they are not plants, and where they stand says nothing about the
// island. Their "layer", "years" and "days" are dice, there only to show that the three tags fit in the same pass.
//
// The ground round the viewer is cut into cells at NL sizes: level L has G x G cells of C0 * 2^L metres, centred on the
// viewer. A level is a size of thing: its things are about a third of a cell across and are kept out to G/2 cells, where
// they are a few pixels high. The five finest levels (things up to 8 m across) are there from the viewer's feet outward.
// The four coarsest stand for clumps seen from far off, and come in only beyond a third of their reach: without them a
// view from high above the island would have nothing to count. For each cell, up to K spots come from a hash of the cell's number, so the same spots come
// out every frame. A spot is kept if it is on land, passes the stand-in rule (slope, height and a patchy noise), is shown
// by its layer, years and days (vis() in spike.js), and is in view. Kept things go into one of three lists by how large
// they look (a two-tier box, a plain box, an upright card), with counts the GPU draws from directly (indirect draws).
{
  const G = 256, NL = 9, C0 = 1, CAP = [32768, 131072, 262144], VERTS = [60, 30, 6];
  const W_PLACE = S_G + /*wgsl*/`
@group(0) @binding(0) var<uniform> g: G;
@group(0) @binding(1) var sC: sampler;
@group(0) @binding(2) var tH: texture_2d<f32>;
@group(0) @binding(3) var tN: texture_2d<f32>;
struct I { p: vec4f, q: vec4f };   // p: where it stands, and its size; q: how far it is shown, the way it is turned, its height, its own number
@group(0) @binding(4) var<storage, read_write> cnt: array<atomic<u32>, 4>;
@group(0) @binding(5) var<storage, read_write> ind: array<u32, 12>;
@group(0) @binding(6) var<storage, read_write> ia: array<I>;
@group(0) @binding(7) var<storage, read_write> ib: array<I>;
@group(0) @binding(8) var<storage, read_write> ic: array<I>;
fn tuv(p: vec2f) -> vec2f { return p / DOM + .5; }
fn hgt(p: vec2f, l: f32) -> f32 { return textureSampleLevel(tH, sC, tuv(p), l).r; }
fn nrm(p: vec2f, l: f32) -> vec4f { return textureSampleLevel(tN, sC, tuv(p), l); }
fn pcg(v: u32) -> u32 { let s = v * 747796405u + 2891336453u; let w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
// four numbers, 0 to 1, for spot k of cell c at level l: the same every frame, on every GPU
fn dice(c: vec2i, l: u32, k: u32) -> vec4f {
  var h = pcg(u32(c.x) + pcg(u32(c.y) + pcg(l * 31u + k))); let a = h; h = pcg(h); let b = h; h = pcg(h); let d = h; h = pcg(h);
  return vec4f(f32(a >> 8u), f32(b >> 8u), f32(d >> 8u), f32(h >> 8u)) / 16777216.;
}
@compute @workgroup_size(1) fn begin() { atomicStore(&cnt[0], 0u); atomicStore(&cnt[1], 0u); atomicStore(&cnt[2], 0u); }
@compute @workgroup_size(1) fn end() { ind[1] = min(atomicLoad(&cnt[0]), ${CAP[0]}u); ind[5] = min(atomicLoad(&cnt[1]), ${CAP[1]}u); ind[9] = min(atomicLoad(&cnt[2]), ${CAP[2]}u); }
@compute @workgroup_size(8, 8, 1) fn cull(@builtin(global_invocation_id) id: vec3u) {
  let L = id.z; let c = ${C0}. * exp2(f32(L)); let r1 = c * ${G / 2}.;
  let o = vec2i(floor(g.cam.xz / (2. * c))) * 2 + vec2i(id.xy) - ${G / 2};
  let K = u32(xu.c.y); let lod = max(log2(c) - ${log2(DOM / TS)}, 0.);
  for (var k = 0u; k < K; k++) {
    let hh = dice(o, L, k);
    // the cheap tests first: thinned out by the density dial; too far for a thing of this size
    if (hh.z >= xu.c.x) { continue; }
    let pz = (vec2f(o) + hh.xy) * c;
    if (distance(pz, g.cam.xz) > r1 * .98) { continue; }
    let y = hgt(pz, lod);
    if (y < .6) { continue; }                                   // on land
    let p = vec3f(pz.x, y, pz.y); let d = distance(p, g.cam.xyz); var far = 1. - ss(.78, .98, d / r1);
    if (L >= 5u) { far *= ss(.3, .45, d / r1); }
    if (far <= 0.) { continue; }
    // the stand-in rule: gentle ground, not too high, in patches
    let n = nrm(pz, lod).xy * 2. - 1.; let slope = 1. - sqrt(max(1. - dot(n, n), 0.));
    let rule = ss(.35, .15, slope) * (1. - ss(300., 520., y)) * (.25 + .75 * ss(.35, .65, n2(pz / 350.)));
    let t = hh.z / max(xu.c.x * rule, 1e-6);
    if (t >= 1.) { continue; }
    // the three tags, from the dice: a layer (Inferred or Imagined), the years it stands for (some patches are "cleared"
    // in a year of their own), the days of the year it is there (a quarter are there for part of the year only)
    let layer = 1. + step(.7, hh.w); let m = n2(pz / 500. + 40.);
    let years = vec2f(9999., select(0., 1700. - (m - .6) / .4 * 180., m > .6));
    let days = select(vec2f(0., 364.99), vec2f(60. + 40. * fract(hh.w * 13.7), 200. + 60. * fract(hh.w * 3.1)), fract(hh.w * 7.3) < .25);
    // (a thing comes and goes by the same fade whether it is its layer, its years, its days or the distance that hides it)
    let f = clamp((far - t * .8) / .2, 0., 1.) * vis(layer, years, days);
    if (f <= 0.) { continue; }
    let s = c * (.25 + .25 * fract(hh.w * 5.9)); let hs = 1.2 + fract(hh.w * 11.3);
    // in view
    let dq = pz - g.cam.xz; let cp = g.vp * vec4f(p.x, p.y - dot(dq, dq) / (2. * RE), p.z, 1.); let mg = 4. * s;
    if (cp.w < -mg || abs(cp.x) > cp.w + mg || abs(cp.y) > cp.w + mg) { continue; }
    var it: I; it.p = vec4f(p, s); it.q = vec4f(f, hh.w * TAU, hs, fract(hh.w * 17.9));
    let ps = s / max(d, 1.);
    if (ps > .05) { let i = atomicAdd(&cnt[0], 1u); if (i < ${CAP[0]}u) { ia[i] = it; } }
    else if (ps > .012) { let i = atomicAdd(&cnt[1], 1u); if (i < ${CAP[1]}u) { ib[i] = it; } }
    else { let i = atomicAdd(&cnt[2], 1u); if (i < ${CAP[2]}u) { ic[i] = it; } }
  }
}
`;
  // drawing: no vertex buffer; a corner's place comes from its number, the thing from the list
  const W_INST = S_B + /*wgsl*/`
struct I { p: vec4f, q: vec4f };
@group(2) @binding(0) var<storage, read> inst: array<I>;
struct VO { @builtin(position) cp: vec4f, @location(0) wp: vec3f, @location(1) n: vec3f, @location(2) @interpolate(flat) fq: vec4f, @location(3) lp: vec3f, @location(4) zen: vec3f };
// a box without a floor: 5 faces of 6 corners. Returns the corner's place (x, z from -.5 to .5; y from 0 to 1) and, in nn, the way the face looks
fn box(vi: u32, nn: ptr<function, vec3f>) -> vec3f {
  let f = vi / 6u; let c = array<u32, 6>(0u, 1u, 2u, 2u, 1u, 3u)[vi % 6u]; let u = f32(c & 1u); let v = f32(c >> 1u);
  if (f == 4u) { *nn = vec3f(0., 1., 0.); return vec3f(u - .5, 1., v - .5); }
  let a = f32(f) * 1.5707963; let n = vec3f(cos(a), 0., sin(a)); *nn = n;
  return n * .5 + vec3f(-n.z, 0., n.x) * (u - .5) + vec3f(0., v, 0.);
}
fn put(it: I, l: vec3f, n: vec3f) -> VO {
  var o: VO; let cs = cos(it.q.y); let sn = sin(it.q.y); let k = u32(xu.a.y);
  // rising from the ground is the same fade as the town's: a thing part shown stands part of its height
  let hy = it.p.w * it.q.z * select(1., it.q.x, k >= 3u);
  let w = it.p.xyz + vec3f((l.x * cs - l.z * sn) * it.p.w, l.y * hy, (l.x * sn + l.z * cs) * it.p.w);
  let dq = w.xz - g.cam.xz;
  o.wp = w; o.n = vec3f(n.x * cs - n.z * sn, n.y, n.x * sn + n.z * cs); o.fq = it.q; o.lp = l; o.zen = skyL(vec3f(0., 1., 0.));
  o.cp = g.vp * vec4f(w.x, w.y - dot(dq, dq) / (2. * RE), w.z, 1.);
  return o;
}
// the nearest form: a box with a smaller box on it
@vertex fn vsA(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VO {
  var n: vec3f; var l = box(vi % 30u, &n);
  if (vi < 30u) { l.y *= .6; } else { l = vec3f(l.x * .6, .6 + l.y * .4, l.z * .6); }
  return put(inst[ii], l, n);
}
@vertex fn vsB(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VO { var n: vec3f; let l = box(vi, &n); return put(inst[ii], l, n); }
// the far form: a flat card that stands upright and turns to face the viewer
@vertex fn vsC(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VO {
  var it = inst[ii]; let c = array<u32, 6>(0u, 1u, 2u, 2u, 1u, 3u)[vi]; let to = normalize(g.cam.xz - it.p.xz + vec2f(1e-4, 0.));
  it.q.y = atan2(-to.x, to.y);
  return put(it, vec3f(f32(c & 1u) - .5, f32(c >> 1u), 0.), vec3f(0., 0., 1.));
}
fn lit(i: VO) -> vec4f {
  let N = normalize(i.n); let L = g.sun.xyz;
  let E = g.sunc.rgb * shadow(i.wp + vec3f(0., 2., 0.));
  let am = i.zen * (.3 + .7 * (N.y * .5 + .5)) + g.sunc.rgb * max(L.y, 0.) * vec3f(.3, .25, .19) * .2;
  // plain grey: a stand-in, not a plant
  return fin(medium(vec3f(.3) * (.8 + .4 * i.fq.w) * (E * sat(abs(dot(N, L))) + am + vec3f(.0016, .0022, .004) * g.sunc.w), i.wp));
}
struct FO { @location(0) c: vec4f, @builtin(sample_mask) m: u32 };
@fragment fn fs(i: VO) -> FO {
  var o: FO;
  o.m = cover(i.fq.x, i.cp.xy, (i.lp.xz + i.lp.y) * 3. + i.fq.w * 37., length(i.wp - g.cam.xyz) * g.right.w * 2. * g.res.z, 0., ${AA}u);
  if (o.m == 0u) { discard; }
  o.c = lit(i);
  return o;
}
// the same without the fade (things then pop in and out): what the fade's test costs is the difference
@fragment fn fsO(i: VO) -> @location(0) vec4f { return lit(i); }
`;
  const P = { K: 4, dens: 0.5, D: 2, kept: [0, 0, 0], opaque: 0, info: { levels: NL, cellsASide: G, finestCellMetres: C0, listCaps: CAP, cornersAForm: VERTS, instanceBytes: 32, listBytes: (CAP[0] + CAP[1] + CAP[2]) * 32, dispatch: [G / 8, G / 8, NL] } };
  const iBuf = CAP.map((n) => device.createBuffer({ size: n * 32, usage: BU.STORAGE })), cntBuf = device.createBuffer({ size: 16, usage: BU.STORAGE | BU.COPY_SRC });
  const indBuf = buf(new Uint32Array([VERTS[0], 0, 0, 0, VERTS[1], 0, 0, 0, VERTS[2], 0, 0, 0]), BU.STORAGE | BU.INDIRECT), stage = device.createBuffer({ size: 16, usage: BU.MAP_READ | BU.COPY_DST });
  let pBegin, pCull, pEnd, bgC, pForm = [], pFormO = [], bgI = [], busy = false;
  // called by spike-go.js once every part has said what it adds to the shaders
  P.build = () => {
    const C = SS.COMPUTE, sto = { buffer: { type: 'storage' } };
    const bglC = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: C, buffer: {} }, { binding: 1, visibility: C, sampler: {} }, { binding: 2, visibility: C, texture: {} }, { binding: 3, visibility: C, texture: {} },
      ...[4, 5, 6, 7, 8].map((binding) => ({ binding, visibility: C, ...sto }))] });
    bgC = device.createBindGroup({ layout: bglC, entries: [ubo, sClamp, tH, tNrm, cntBuf, indBuf, ...iBuf].map((r, binding) => ({ binding, resource: r.createView ? r.createView() : r.size ? { buffer: r } : r })) });
    const mC = mod(SPK.code(W_PLACE, 'place')), plC = device.createPipelineLayout({ bindGroupLayouts: [bglC, SPK.bglX] });
    [pBegin, pCull, pEnd] = ['begin', 'cull', 'end'].map((entryPoint) => device.createComputePipeline({ layout: plC, compute: { module: mC, entryPoint } }));
    const bglI = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: SS.VERTEX, buffer: { type: 'read-only-storage' } }] });
    const mI = mod(SPK.code(W_INST, 'inst')), plI = device.createPipelineLayout({ bindGroupLayouts: [bgl0, SPK.bglX, bglI] });
    ['vsA', 'vsB', 'vsC'].forEach((v, i) => { pForm[i] = SPK.xPipe(mI, v, 'fs', [], { layout: plI }); pFormO[i] = SPK.xPipe(mI, v, 'fsO', [], { layout: plI }); bgI[i] = device.createBindGroup({ layout: bglI, entries: [{ binding: 0, resource: { buffer: iBuf[i] } }] }); });
  };
  P.compute = (e) => {
    SPK.U[8] = P.dens; SPK.U[9] = P.K; Q.writeBuffer(uboX, 32, SPK.U, 8, 4);
    const c = e.beginComputePass(); c.setBindGroup(0, bgC); c.setBindGroup(1, SPK.bgX);
    c.setPipeline(pBegin); c.dispatchWorkgroups(1);
    c.setPipeline(pCull); c.dispatchWorkgroups(G / 8, G / 8, NL);
    c.setPipeline(pEnd); c.dispatchWorkgroups(1); c.end();
  };
  P.draw = (r) => { if (P.noDraw) return; for (let i = 0; i < 3; i++) { r.setPipeline(P.opaque ? pFormO[i] : pForm[i]); r.setBindGroup(2, bgI[i]); r.drawIndirect(indBuf, i * 16); } };
  // how many things the last frame kept, by form (read back from the GPU: for reports only, never for drawing)
  P.count = async () => {
    if (busy) return P.kept; busy = true;
    const e = device.createCommandEncoder(); e.copyBufferToBuffer(cntBuf, 0, stage, 0, 16); Q.submit([e.finish()]);
    await stage.mapAsync(GPUMapMode.READ); const a = new Uint32Array(stage.getMappedRange()); P.kept = [a[0], a[1], a[2]]; stage.unmap(); busy = false;
    return P.kept;
  };
  // the density dial: D spots a cell on average, as K tries each kept with chance D / K
  P.set = (D) => { P.D = D; P.K = min(32, max(1, Math.ceil(D))); P.dens = min(1, D / P.K); return P.D; };
  // turn the dial until about n things are kept in this view
  P.aim = async (n) => {
    const frames = (k) => new Promise((r) => { const f = () => (k-- > 0 ? requestAnimationFrame(f) : r()); f(); });
    for (let i = 0; i < 9; i++) { await frames(3); const a = await P.count(), s = a[0] + a[1] + a[2]; if (abs(s - n) < n * 0.03) break; P.set(min(32, max(0.001, P.D * (s ? n / s : 4)))); }
    await frames(3); const a = await P.count();
    return { kept: a[0] + a[1] + a[2], byForm: a, triesACell: P.K, chance: +P.dens.toFixed(4), spotsTried: G * G * NL * P.K, full: a.map((v, i) => v > CAP[i]) };
  };
  P.more = () => P.set(P.D >= 32 ? 0.05 : P.D * 2);
  P.say = () => `${P.kept[0] + P.kept[1] + P.kept[2]} (${P.kept}), ${P.K} tries a cell`;
  setInterval(() => { if (!menu && SPK.on && !SPK.quiet) P.count(); }, 500);
  P.set(2);
  SPK.place = P; SPK.parts.push('place');
}
