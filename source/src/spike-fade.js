// ============================================================================
// spike, measurement 1: a layer of the town fading in and out (dev.html only)
// ============================================================================
// The excavated buildings are Found (layer 0) and every other building is Inferred (layer 1). Each building's layer is
// four numbers in a small table, looked up in the vertex shader by the building's number. THE ENGINE'S VERTICES DO NOT
// CARRY THAT NUMBER (they carry a one-byte seed, which 452 buildings share), so this part works it out from the order
// buildTown() makes the buildings in and gives it to the shaders as a second vertex buffer, two bytes a corner.
// Collision follows the same table, and so do the paving and the street shading, which come from the town's plan map: a
// second plan map is made of the Found buildings alone and the ground's shader mixes the two by the layer.
{
  const t0 = performance.now();
  // buildTown() again, told to note where each building's corners start (SPKR) and, on request, to put only the Found
  // buildings on the collision grid and the plan map (SPKONLY)
  let SPKR = [], SPKONLY = 0, src = buildTown.toString();
  src = rep(src, 'const o = m.o, n = m.n, g = [], gp = [], len = [];', 'SPKR.push(nv); const o = m.o, n = m.n, g = [], gp = [], len = [];');
  src = rep(src, 'const n = o.length / 2, id = M.length + 1 + k;', 'SPKR.push(nv); const n = o.length / 2, id = M.length + 1 + k;');
  src = rep(src, 'const px = TOWNG.pithos[0],', 'SPKR.push(nv); const px = TOWNG.pithos[0],');
  src = rep(src, 'M.forEach((m, k) => fill(m.o, m.n, k + 1));', 'M.forEach((m, k) => { if (!SPKONLY || m.exc) fill(m.o, m.n, k + 1); });');
  const build2 = eval('(' + src + ')'), full = build2(hAt), nv = full.v.byteLength / 32, nB = SPKR.length, M = TOWNG.M;
  if (full.v.byteLength !== TB.v.byteLength || nB !== M.length + TOWNG.ter.length + 1) throw new Error('spike: the second build of the town differs from the first');
  const starts = SPKR; SPKONLY = 1; SPKR = []; const found = build2(hAt); SPKONLY = 0;
  // the building's number for every corner (0 is no building), and each building's table row
  const ids = new Uint16Array(nv * 2), FV = new Float32Array(full.v.buffer, full.v.byteOffset, nv * 8);
  const LAYER = new Uint8Array(nB + 1), DELAY = new Float32Array(nB + 1), BASE = new Float32Array(nB + 1), TOPV = new Float32Array(nB + 1), CEN = new Float32Array(nB * 2 + 2);
  let cx = 0, cz = 0, nf = 0, far = 0, tris = [0, 0];
  for (let b = 0; b < nB; b++) {
    const id = b + 1, v1 = b + 1 < nB ? starts[b + 1] : nv; let top = -1e9;
    for (let v = starts[b]; v < v1; v++) { ids[v * 2] = id; if (FV[v * 8 + 1] > top) top = FV[v * 8 + 1]; }
    TOPV[id] = top; BASE[id] = top;
    if (b < M.length) {
      const m = M[b]; let gx = 0, gz = 0, lo = 1e9;
      for (let i = 0; i < m.n; i++) { gx += m.o[i * 2] / m.n; gz += m.o[i * 2 + 1] / m.n; lo = min(lo, hAt(m.o[i * 2], m.o[i * 2 + 1])); }
      BASE[id] = lo - 0.3; CEN[id * 2] = gx; CEN[id * 2 + 1] = gz; LAYER[id] = m.exc ? 0 : 1;
      if (m.exc) { cx += gx; cz += gz; nf++; }
    }
  }
  cx /= nf; cz /= nf;
  for (let id = 1; id <= M.length; id++) if (LAYER[id]) far = max(far, hypot(CEN[id * 2] - cx, CEN[id * 2 + 1] - cz));
  const tab = new Float32Array(512 * 4);
  for (let id = 1; id <= nB; id++) { DELAY[id] = LAYER[id] ? hypot(CEN[id * 2] - cx, CEN[id * 2 + 1] - cz) / far : 0; tab.set([LAYER[id], DELAY[id], BASE[id], TOPV[id]], id * 4); }
  for (let i = 0; i < full.ix.length; i += 3) tris[LAYER[ids[full.ix[i] * 2]]]++;
  const tTab = tex(512, 1, 'rgba32float', TU.TEXTURE_BINDING | TU.COPY_DST), tT0 = tex(TMAPN, TMAPN, 'rgba8unorm', RT | TU.COPY_DST, TMM);
  Q.writeTexture({ texture: tTab }, tab, { bytesPerRow: 512 * 16 }, [512, 1]);
  Q.writeTexture({ texture: tT0 }, found.map, { bytesPerRow: TMAPN * 4 }, [TMAPN, TMAPN]);
  { const e = device.createCommandEncoder(); for (let i = 1; i < TMM; i++) { const r = e.beginRenderPass({ colorAttachments: [colorAtt(mipView(tT0, i), true)] }); r.setPipeline(pMip8); r.setBindGroup(0, blitBG(mipView(tT0, i - 1))); r.draw(3); r.end(); } Q.submit([e.finish()]); }
  xAdd('var tTab: texture_2d<f32>', { texture: { sampleType: 'unfilterable-float' } }, tTab);
  xAdd('var tT0: texture_2d<f32>', { texture: {} }, tT0);

  // how far building `id` is shown, 0 to 1: the layer, held back by the building's distance from the excavated centre
  // when the fade spreads as a wave (the same sum as bfade() in the shader)
  const prog = (id) => { const l = SPK.lay < 0 ? 0 : SPK.lay > 1 ? 1 : SPK.lay, s = l * (1 + SPK.wave) - DELAY[id] * SPK.wave; return s < 0 ? 0 : s > 1 ? 1 : s; };
  // Collision follows: a building that is hidden is not there, and one that is part shown stands part of its height, so
  // that a viewer on its roof is lowered as it goes and lifted as it comes (per frame: no allocations)
  tAt = (x, z) => {
    const i = floor((x - TGX) / TCELL), j = floor((z - TGZ) / TCELL); if (i < 0 || j < 0 || i >= TGW || j >= TGH) return -1e9;
    const id = TGRID[j * TGW + i]; if (!id) return -1e9;
    const t = TTOP[id]; if (!SPK.on || !LAYER[id]) return t;
    const s = prog(id); return s >= 1 ? t : s <= 0 ? -1e9 : BASE[id] + (t - BASE[id]) * s;
  };

  SPK.patches.push((code, what) => {
    if (what === 'terr') {
      // the paving and the shade of the streets belong to the buildings: mix the Found-only plan with the whole one
      return rep(code, 'let tw = textureSampleLevel(tT, sC, tu, 0.); let den = textureSampleLevel(tT, sC, tu, 4.).r;',
        'let lf = clamp(xu.a.x, 0., 1.); let tw = mix(textureSampleLevel(tT0, sC, tu, 0.), textureSampleLevel(tT, sC, tu, 0.), lf); let den = mix(textureSampleLevel(tT0, sC, tu, 4.).r, textureSampleLevel(tT, sC, tu, 4.).r, lf);');
    }
    if (what !== 'town') return code;
    code = rep(code, '@location(4) l: f32 };', '@location(4) l: f32, @location(5) id: vec2u };');
    code = rep(code, '@location(5) zen: vec3f };', /*wgsl*/`@location(5) zen: vec3f, @location(6) @interpolate(flat) fd: vec3f };
// The building's row of the table: its layer, its place in the wave, its foot and its top. fd = how far it is shown, foot, top.
// "Rise, with a lid" moves the corners themselves: everything above the climbing height is pressed down onto it.
struct FD { p: vec3f, v: f32, fd: vec3f };
fn bfade(i: TI) -> FD {
  let t = textureLoad(tTab, vec2i(i32(i.id.x), 0), 0); var o: FD; o.p = i.p; o.v = i.uv.y; var s = 1.;
  if (t.r > 0.) { s = clamp(vis(t.r, vec2f(9999., 0.), vec2f(0., 364.99)) * (1. + xu.b.y) - t.g * xu.b.y, 0., 1.); }
  if (u32(xu.a.y) == 4u && s < 1.) { let dy = max(i.p.y - mix(t.b, t.a, s), 0.); o.p.y -= dy; if (abs(i.n.y) < .7) { o.v -= dy; } }
  o.fd = vec3f(s, t.b, t.a);
  return o;
}`);
    code = rep(code, 'var o: TO; let dq = i.p.xz - g.cam.xz;', 'var o: TO; let dq = i.p.xz - g.cam.xz; let f = bfade(i);');
    code = rep(code, 'o.wp = i.p; o.uv = i.uv; o.n = i.n.xyz;', 'o.wp = f.p; o.uv = vec2f(i.uv.x, f.v); o.fd = f.fd; o.n = i.n.xyz;');
    // (a hidden building is dropped here, before a single pixel of it is worked out)
    code = rep(code, 'o.cp = g.vp * vec4f(i.p.x, i.p.y - dot(dq, dq) / (2. * RE), i.p.z, 1.);', 'o.cp = g.vp * vec4f(f.p.x, f.p.y - dot(dq, dq) / (2. * RE), f.p.z, 1.); if (f.fd.x <= 0.) { o.cp = vec4f(2., 2., 2., 1.); }');
    code = rep(code, '@vertex fn vsS(i: TI) -> @builtin(position) vec4f { return g.vp * vec4f(i.p, 1.); }', /*wgsl*/`
struct SO { @builtin(position) cp: vec4f, @location(0) wp: vec3f, @location(1) uv: vec2f, @location(2) @interpolate(flat) fd: vec3f };
@vertex fn vsS(i: TI) -> SO {
  let f = bfade(i); var o: SO; o.wp = f.p; o.uv = select(vec2f(i.uv.x, f.v), i.p.xz, abs(i.n.y) > .7); o.fd = f.fd;
  o.cp = g.vp * vec4f(f.p, 1.); if (f.fd.x <= 0.) { o.cp = vec4f(2., 2., 2., 1.); }
  return o;
}
// the shadow fades by the same pattern as its owner
@fragment fn fsS(i: SO) { if (cover(i.fd.x, i.cp.xy, i.uv, .1, (i.wp.y - i.fd.y) / max(i.fd.z - i.fd.y, .1), 1u) == 0u) { discard; } }`);
    code = rep(code, '@fragment fn fs(i: TO) -> @location(0) vec4f {', 'fn shade(i: TO) -> vec4f {');
    return code + /*wgsl*/`
struct FO { @location(0) c: vec4f, @builtin(sample_mask) m: u32 };
@fragment fn fs(i: TO) -> FO {
  var o: FO;
  o.m = cover(i.fd.x, i.cp.xy, select(i.uv, i.wp.xz, abs(i.n.y) > .7) + f32(i.m.y), length(i.wp - g.cam.xyz) * g.right.w * 2. * g.res.z, (i.wp.y - i.fd.y) / max(i.fd.z - i.fd.y, .1), ${AA}u);
  if (o.m == 0u) { discard; }
  o.c = shade(i);
  return o;
}
// the same without the test, for when nothing is fading: a shader that may discard costs the GPU its hidden-surface removal
@fragment fn fsO(i: TO) -> @location(0) vec4f { return shade(i); }`;
  });
  SPK.fade = { vbId: buf(ids, BU.VERTEX), layout: { arrayStride: 4, attributes: [A(5, 0, 'uint16x2')] }, prog, LAYER, DELAY, BASE, TOPV, CEN,
    info: { buildings: M.length, found: nf, inferred: M.length - nf, tableBytes: nB * 16, idBytes: ids.byteLength, corners: nv, triangles: full.ix.length / 3, trianglesFound: tris[0], trianglesInferred: tris[1], buildMs: +(performance.now() - t0).toFixed(1), planMapBytes: Math.round(TMAPN * TMAPN * 4 * 4 / 3) } };
  SPK.parts.push('fade');
}
