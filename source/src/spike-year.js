// ============================================================================
// spike, measurement 3: two islands, blended by the year (dev.html only)
// ============================================================================
// The second island is TODAY'S ISLAND, AS A STAND-IN for the island after the eruption (spike-island.js, written by
// node tools/terrain/build.mjs --second). It is not a model of the eruption or of any year. It is stored as its
// difference from the island of 1628 BCE and read here; a second set of height, slope and rock maps is baked from it
// with the engine's own bake shaders; and one number, the island blend (spk.isl, 0 to 1), mixes the two sets in the
// ground's shader, in its shadow, in the sea's shader and in the height the walker stands on.
// The town is not drawn while the blend is above 0: it belongs to the first island only.

// <second-decoder> (tools/terrain/build.mjs --second runs this text against its own reader, so keep it self-contained)
// The second surface: the form of decodeTerrain() (world.js), except that each cell is predicted from the same cell of
// the first surface, B = { q, rock } as decodeTerrain() returns it, plus the difference its neighbours have shown.
function decodeSecond(b, B) {
  const N = b[0] * 16, CF = b[1], NC = N / CF, co = new Int32Array(NC * NC), bc = new Int32Array(NC * NC), q = new Int32Array(N * N), rock = new Uint8Array(N * N), mask = new Uint8Array(N * N);
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
  const layer = (a, f, n, mk, minStep) => {
    for (let j = 0, k = 0; j < n; j++) for (let i = 0; i < n; i++, k++) {
      if (mk && !mk[k]) continue;
      const L = i ? a[k - 1] : j ? a[k - n] : 0, U = j ? a[k - n] : L, UL = i && j ? a[k - n - 1] : j ? U : L, UR = j && i < n - 1 ? a[k - n + 1] : U;
      const act = Math.abs(L - UL) + Math.abs(U - UL) + Math.abs(UR - U), p0 = L + U - UL;
      let step = ((act + 9) / 18) | 0; const deep = p0 < 0 ? (-p0 / 20) | 0 : 0; if (deep > step) step = deep; step = step < minStep ? minStep : step > 255 ? 255 : step;
      const dL = i ? a[k - 1] - f[k - 1] : j ? a[k - n] - f[k - n] : 0, dU = j ? a[k - n] - f[k - n] : dL, dUL = i && j ? a[k - n - 1] - f[k - n - 1] : j ? dU : dL, dUR = j && i < n - 1 ? a[k - n + 1] - f[k - n + 1] : dU;
      a[k] = f[k] + ((dL + dU) >> 1) + res(Math.min(7, 31 - Math.clz32(1 + (((Math.abs(dL - dUL) + Math.abs(dU - dUL) + Math.abs(dUR - dU)) / step) | 0)))) * step;
    }
  };
  for (let J = 0, K = 0; J < NC; J++) for (let I = 0; I < NC; I++, K++) { let s = 0; for (let y = 0; y < CF; y++) for (let x = 0; x < CF; x++) s += B.q[(J * CF + y) * N + I * CF + x]; bc[K] = Math.round(s / (CF * CF)); }
  layer(co, bc, NC, null, 4);
  const cAt = (I, J) => co[(J < 0 ? 0 : J >= NC ? NC - 1 : J) * NC + (I < 0 ? 0 : I >= NC ? NC - 1 : I)];
  for (let j = 0, k = 0; j < N; j++) for (let i = 0; i < N; i++, k++) {
    const u = 2 * i + 1 - CF, v = 2 * j + 1 - CF, I = Math.floor(u / (2 * CF)), J = Math.floor(v / (2 * CF)), fu = u - I * 2 * CF, fv = v - J * 2 * CF;
    q[k] = Math.round(((cAt(I, J) * (2 * CF - fu) + cAt(I + 1, J) * fu) * (2 * CF - fv) + (cAt(I, J + 1) * (2 * CF - fu) + cAt(I + 1, J + 1) * fu) * fv) / (4 * CF * CF));
    const ci = (i / CF) | 0, cj = (j / CF) | 0; let top = -1e9; for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) top = Math.max(top, cAt(ci + x, cj + y));
    mask[k] = top > -60 ? 1 : 0;
  }
  layer(q, B.q, N, mask, 2);
  for (let k = 0, was = 0; k < N * N; k++) {
    was = bit(Rp, was);
    if (!was) { rock[k] = B.rock[k]; continue; }
    let node = 1; for (let c = 2; c >= 0; c--) node = node * 2 + bit(Rp, 4 + node);
    rock[k] = node - 8;
  }
  return { N, q, rock };
}
// </second-decoder>

{
  const t0 = performance.now(), bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const B = decodeTerrain(bytes(TERRAIN)), t1 = performance.now(); // (the engine does not keep the grid it read, so it is read again here)
  const D = decodeSecond(bytes(TERRAIN2), B), n = D.N, t2 = performance.now();
  // the second set of maps, baked exactly as main.js bakes the first
  const tH2 = tex(TS, TS, 'r16float', RT | TU.COPY_SRC, TM), tN2 = tex(TS, TS, 'rgba8unorm', RT, TM), tG2 = tex(1024, 1024, 'rgba8unorm', RT, 11);
  const HG2 = new Float32Array(HN * HN), HP2 = [];
  {
    const tC = tex(n, n, 'r32float', TU.TEXTURE_BINDING | TU.COPY_DST), tK = tex(n, n, 'r8uint', TU.TEXTURE_BINDING | TU.COPY_DST);
    Q.writeTexture({ texture: tC }, Float32Array.from(D.q, (v) => v * 0.25), { bytesPerRow: n * 4 }, [n, n]);
    Q.writeTexture({ texture: tK }, D.rock, { bytesPerRow: n }, [n, n]);
    const pH = fsPipe(W_BAKEH, 'r16float'), pN = fsPipe(W_BAKEN, 'rgba8unorm'), pG = fsPipe(W_BAKEG, 'rgba8unorm');
    const m = log2(TS / HN), br = device.createBuffer({ size: HN * HN * 2, usage: BU.MAP_READ | BU.COPY_DST });
    const e = device.createCommandEncoder();
    bake(e, tH2, TM, pH, fsBG(pH, [tC, tK]), pMipR);
    bake(e, tN2, TM, pN, fsBG(pN, [null, tK, tH2, sClamp]), pMip8);
    bake(e, tG2, 11, pG, fsBG(pG, [null, tK]), pMip8);
    e.copyTextureToBuffer({ texture: tH2, mipLevel: m }, { buffer: br, bytesPerRow: HN * 2 }, [HN, HN]);
    Q.submit([e.finish()]);
    await br.mapAsync(GPUMapMode.READ);
    const h = new Uint16Array(br.getMappedRange());
    for (let i = 0; i < h.length; i++) { const v = h[i], x = (v >> 10) & 31, f = x ? (1 + (v & 1023) / 1024) * 2 ** (x - 15) : (v & 1023) * 2 ** -24; HG2[i] = v & 32768 ? -f : f; }
    br.unmap(); br.destroy(); tC.destroy(); tK.destroy();
    for (let w = 128, src = HG2, sw = HN; w >= 1; sw = w, w >>= 1) {
      const d = new Float32Array(w * w).fill(-1e9), k = sw / w;
      for (let j = 0; j < sw; j++) for (let i = 0; i < sw; i++) { const o = ((j / k) | 0) * w + ((i / k) | 0); if (src[j * sw + i] > d[o]) d[o] = src[j * sw + i]; }
      HP2.push(d); src = d;
    }
  }
  const t3 = performance.now();
  xAdd('var tH2: texture_2d<f32>', { texture: {} }, tH2); xAdd('var tN2: texture_2d<f32>', { texture: {} }, tN2); xAdd('var tG2: texture_2d<f32>', { texture: {} }, tG2);

  // the height the walker stands on, and the highest ground near a point (which decides the rings drawn), follow the blend
  const hA = hAt, mA = hMax;
  const hB = (x, z) => {
    let u = (x / DOM + 0.5) * HN - 0.5, v = (z / DOM + 0.5) * HN - 0.5;
    u = u < 0 ? 0 : u > HN - 1.001 ? HN - 1.001 : u; v = v < 0 ? 0 : v > HN - 1.001 ? HN - 1.001 : v;
    const i = u | 0, j = v | 0, k = j * HN + i, a = HG2[k], b = HG2[k + HN];
    u -= i; v -= j;
    return (a + (HG2[k + 1] - a) * u) * (1 - v) + (b + (HG2[k + HN + 1] - b) * u) * v;
  };
  const mB = (x, z, r) => {
    let l = Math.ceil(log2(r / 200)); l = l < 0 ? 0 : l > 7 ? 7 : l;
    const w = 128 >> l, d = HP2[l], ci = floor((x / DOM + 0.5) * w), cj = floor((z / DOM + 0.5) * w); let m = -1e9;
    for (let j = cj - 1; j <= cj + 1; j++) for (let i = ci - 1; i <= ci + 1; i++) { const v = d[(j < 0 ? 0 : j >= w ? w - 1 : j) * w + (i < 0 ? 0 : i >= w ? w - 1 : i)]; if (v > m) m = v; }
    return m;
  };
  hAt = (x, z) => { const t = SPK.on ? SPK.isl : 0; if (t <= 0) return hA(x, z); if (t >= 1) return hB(x, z); const a = hA(x, z); return a + (hB(x, z) - a) * t; };
  hMax = (x, z, r) => { const t = SPK.on ? SPK.isl : 0; return t <= 0 ? mA(x, z, r) : t >= 1 ? mB(x, z, r) : max(mA(x, z, r), mB(x, z, r)); };
  // (the houses stand on the first island only)
  const tA = tAt; tAt = (x, z) => (SPK.on && SPK.isl > 0 ? -1e9 : tA(x, z));

  const HGT = 'fn hgt(p: vec2f, l: f32) -> f32 { return textureSampleLevel(tH, sC, tuv(p), l).r; }';
  SPK.patches.push((code, what) => {
    // every height any shader reads is the blend of the two islands' heights (one read while the blend is at rest)
    code = rep(code, HGT, /*wgsl*/`fn hgt(p: vec2f, l: f32) -> f32 {
  let t = xu.b.x;
  if (t <= 0.) { return textureSampleLevel(tH, sC, tuv(p), l).r; }
  if (t >= 1.) { return textureSampleLevel(tH2, sC, tuv(p), l).r; }
  return mix(textureSampleLevel(tH, sC, tuv(p), l).r, textureSampleLevel(tH2, sC, tuv(p), l).r, t);
}`);
    if (what === 'terr') {
      code = rep(code, 'let uv = tuv(i.wp.xz); let nt = textureSample(tN, sA, uv); let gw = textureSample(tG, sA, uv);',
        'let uv = tuv(i.wp.xz); var nt = textureSample(tN, sA, uv); var gw = textureSample(tG, sA, uv); if (xu.b.x > 0.) { nt = mix(nt, textureSample(tN2, sA, uv), xu.b.x); gw = mix(gw, textureSample(tG2, sA, uv), xu.b.x); }');
      code = rep(code, 'if (all(abs(tu - .5) < vec2f(.5)) && y > .5) {', 'if (all(abs(tu - .5) < vec2f(.5)) && y > .5 && xu.b.x <= 0.) {');
    }
    if (what === 'sea') code = rep(code, 'let bp = i.op + Rr.xz * pl; let bn = textureSample(tN, sA, tuv(bp)); let bg = textureSample(tG, sA, tuv(bp));',
      'let bp = i.op + Rr.xz * pl; var bn = textureSample(tN, sA, tuv(bp)); var bg = textureSample(tG, sA, tuv(bp)); if (xu.b.x > 0.) { bn = mix(bn, textureSample(tN2, sA, tuv(bp)), xu.b.x); bg = mix(bg, textureSample(tG2, sA, tuv(bp)), xu.b.x); }');
    if (what === 'place') code = rep(code, 'fn nrm(p: vec2f, l: f32) -> vec4f { return textureSampleLevel(tN, sC, tuv(p), l); }',
      'fn nrm(p: vec2f, l: f32) -> vec4f { let a = textureSampleLevel(tN, sC, tuv(p), l); if (xu.b.x <= 0.) { return a; } return mix(a, textureSampleLevel(tN2, sC, tuv(p), l), xu.b.x); }');
    return code;
  });
  const mip = 4 / 3;
  SPK.year = { info: { readFirstAgainMs: +(t1 - t0).toFixed(1), readSecondMs: +(t2 - t1).toFixed(1), bakeAndReadBackMs: +(t3 - t2).toFixed(1), totalMs: +(t3 - t0).toFixed(1),
    gpuBytes: Math.round(TS * TS * 2 * mip + TS * TS * 4 * mip + 1024 * 1024 * 4 * mip), cpuBytes: HG2.byteLength + HP2.reduce((s, d) => s + d.byteLength, 0), mapSide: TS, dataTextChars: TERRAIN2.length } };
  SPK.parts.push('year');
}
