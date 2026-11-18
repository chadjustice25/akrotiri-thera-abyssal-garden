// ============================================================================
// WGSL sources
// ============================================================================

const W_NOISE = /*wgsl*/`
fn ss(a: f32, b: f32, x: f32) -> f32 { let t = clamp((x - a) / (b - a), 0., 1.); return t * t * (3. - 2. * t); }
fn h31(p: vec3f) -> f32 { var q = fract(p * vec3f(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
fn h33(p: vec3f) -> vec3f { var q = fract(p * vec3f(.1031, .1030, .0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yxx) * q.zyx); }
fn vn(p: vec3f) -> f32 {
  let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3f(1., 0., 0.)), u.x), mix(h31(i + vec3f(0., 1., 0.)), h31(i + vec3f(1., 1., 0.)), u.x), u.y),
             mix(mix(h31(i + vec3f(0., 0., 1.)), h31(i + vec3f(1., 0., 1.)), u.x), mix(h31(i + vec3f(0., 1., 1.)), h31(i + vec3f(1., 1., 1.)), u.x), u.y), u.z);
}
fn fbm(p: vec3f, n: i32) -> f32 {
  var a = .5; var s = 0.; var q = p;
  for (var i = 0; i < n; i++) { s += a * vn(q); q = q * 2.03 + vec3f(17.1, 31.7, 5.3); a *= .5; }
  return s / (1. - 2. * a);
}
fn wor(p: vec3f) -> f32 {
  let i = floor(p); let f = fract(p); var d = 9.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { for (var z = -1; z <= 1; z++) {
    let o = vec3f(f32(x), f32(y), f32(z)); let r = o + h33(i + o) - f; d = min(d, dot(r, r));
  } } }
  return sqrt(d);
}
`;

// ---------------------------------------------------------------- fullscreen helpers
const W_FS = /*wgsl*/`
@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f { return vec4f(f32(i32(i & 1u) * 4 - 1), f32(i32(i >> 1u) * 4 - 1), 0., 1.); }
`;

// rock detail texture (tileable): rg = slope, b = height, a = mottling
const W_DETAIL = W_NOISE + W_FS + /*wgsl*/`
fn hp(p: vec2f, per: f32) -> f32 { return h31(vec3f(p - per * floor(p / per), per)); }
fn tn(p: vec2f, per: f32) -> f32 {
  let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f);
  return mix(mix(hp(i, per), hp(i + vec2f(1., 0.), per), u.x), mix(hp(i + vec2f(0., 1.), per), hp(i + vec2f(1., 1.), per), u.x), u.y);
}
fn tf(uv: vec2f, per: f32, n: i32) -> f32 { var a = .5; var s = 0.; var pr = per; for (var i = 0; i < n; i++) { s += a * tn(uv * pr + f32(i) * 7.3, pr); pr *= 2.; a *= .5; } return s / (1. - 2. * a); }
fn tw(p: vec2f, per: f32) -> vec3f {
  let i = floor(p); let f = fract(p); var d = vec2f(9.); var id = 0.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) {
    let o = vec2f(f32(x), f32(y)); let c = i + o; let cw = c - per * floor(c / per);
    let hh = h33(vec3f(cw, per)); let r = o + hh.xy - f; let l = dot(r, r);
    if (l < d.x) { d.y = d.x; d.x = l; id = hh.z; } else if (l < d.y) { d.y = l; }
  } }
  return vec3f(sqrt(d), id);
}
fn H(uv: vec2f) -> f32 {
  let wq = uv + .11 * (vec2f(tf(uv, 3., 4), tf(uv + .5, 3., 4)) - .5);
  let f = tf(wq, 3., 8);
  let r1 = 1. - abs(tf(wq + 1.7, 5., 6) * 2. - 1.);
  let cr = min(abs(tf(wq + 4.1, 4., 5) * 2. - 1.) * 7., 1.);
  let cr2 = min(abs(tf(wq.yx + 2.3, 9., 4) * 2. - 1.) * 9., 1.);
  let pt = tw(wq * 29., 29.);
  let pit = (1. - ss(.0, .34, pt.x)) * step(.62, pt.z);
  return f * .50 + r1 * r1 * .24 + cr * cr2 * .26 - pit * .07;
}
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / 1024.; let e = 1. / 1024.;
  let h = H(uv);
  let gx = H(uv + vec2f(e, 0.)) - H(uv - vec2f(e, 0.)); let gy = H(uv + vec2f(0., e)) - H(uv - vec2f(0., e));
  let s = clamp(vec2f(gx, gy) * 1024. * .5 * .075, vec2f(-1.), vec2f(1.));
  return vec4f(-s * .5 + .5, h, tf(uv + 3.7, 3., 5));
}
`;

// blit / mip / bloom chain
const W_BLIT = W_FS + /*wgsl*/`
@group(0) @binding(0) var t: texture_2d<f32>;
@group(0) @binding(1) var s: sampler;
fn uvOf(fc: vec4f, k: f32) -> vec2f { return fc.xy * k / vec2f(textureDimensions(t)); }
@fragment fn fsMip(@builtin(position) fc: vec4f) -> @location(0) vec4f { return textureSampleLevel(t, s, uvOf(fc, 2.), 0.); }
fn kar(c: vec3f) -> vec4f { let w = 1. / (1. + max(c.r, max(c.g, c.b))); return vec4f(c * w, w); }
@fragment fn fsDown0(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = uvOf(fc, 2.); let e = 1. / vec2f(textureDimensions(t));
  let a = kar(min(textureSampleLevel(t, s, uv + e * vec2f(-1., -1.), 0.).rgb, vec3f(24.)));
  let b = kar(min(textureSampleLevel(t, s, uv + e * vec2f(1., -1.), 0.).rgb, vec3f(24.)));
  let c = kar(min(textureSampleLevel(t, s, uv + e * vec2f(-1., 1.), 0.).rgb, vec3f(24.)));
  let d = kar(min(textureSampleLevel(t, s, uv + e * vec2f(1., 1.), 0.).rgb, vec3f(24.)));
  let m = a + b + c + d;
  return vec4f(m.rgb / m.a, 1.);
}
@fragment fn fsDown(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = uvOf(fc, 2.); let e = 1. / vec2f(textureDimensions(t));
  return (textureSampleLevel(t, s, uv + e * vec2f(-1., -1.), 0.) + textureSampleLevel(t, s, uv + e * vec2f(1., -1.), 0.)
        + textureSampleLevel(t, s, uv + e * vec2f(-1., 1.), 0.) + textureSampleLevel(t, s, uv + e * vec2f(1., 1.), 0.)) * .25;
}
@fragment fn fsUp(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = uvOf(fc, .5); let e = .75 / vec2f(textureDimensions(t));
  return (textureSampleLevel(t, s, uv + e * vec2f(-1., -1.), 0.) + textureSampleLevel(t, s, uv + e * vec2f(1., -1.), 0.)
        + textureSampleLevel(t, s, uv + e * vec2f(-1., 1.), 0.) + textureSampleLevel(t, s, uv + e * vec2f(1., 1.), 0.)) * .25;
}
`;

// animated water texture: r = caustic, ba = surface slope
const W_WATER = W_FS + /*wgsl*/`
@group(0) @binding(0) var<uniform> tm: vec4f;
fn caus(uv: vec2f, t: f32) -> f32 {
  let p = uv * 6.2831853;
  var i = p; var c = 0.;
  for (var n = 1; n <= 5; n++) {
    let tt = t * (1. - 3.5 / f32(n));
    i = p + vec2f(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    let s = sin(i.x + tt); let k = cos(i.y + tt);
    c += abs(s * k) / (1.25 * sqrt(s * s + k * k) + 1e-4);
  }
  c = 1.17 - pow(c / 5., 1.4);
  return pow(abs(c), 8.);
}
const WK = array<vec3f, 10>(vec3f(1., 2., 1.), vec3f(-2., 1., .9), vec3f(3., 1., .6), vec3f(1., -4., .5), vec3f(4., 3., .4),
  vec3f(-3., 5., .32), vec3f(6., -2., .28), vec3f(5., 7., .2), vec3f(-8., 3., .18), vec3f(2., 11., .14));
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / ${WATER}.; let t = tm.x;
  let c = caus(uv, t * .45 + 23.);
  let wu = uv + .02 * vec2f(sin(6.2831853 * (uv.y * 2. + .1 * t)), cos(6.2831853 * (uv.x * 3. - .07 * t)));
  var s = vec2f(0.);
  for (var i = 0; i < 10; i++) {
    let k = WK[i];
    s += k.xy * k.z * cos(dot(k.xy, wu) * 6.2831853 + t * (.5 + .35 * sqrt(length(k.xy))) * select(-1., 1., (i & 1) == 0) + f32(i) * 1.7);
  }
  return vec4f(c, c, s * .06);
}
`;

// ---------------------------------------------------------------- shared scene code
// G is the per-frame block: sun.w = how fresh the breeze is (0-1); mis = exposure, light-shaft strength, unused, the height
// of the sea surface at the camera; sunc = sunlight at sea level (w: 1 at night); cam.w = time in seconds.
const S_G = /*wgsl*/`
struct G { vp: mat4x4f, sm: mat4x4f, cam: vec4f, right: vec4f, up: vec4f, fwd: vec4f, sun: vec4f, res: vec4f, mis: vec4f, sunc: vec4f };
const TAU = 6.2831853;
const LOW = ${LV > 1};
const DOM = ${DOM}.;
const RE = ${RE}.;
const RA = ${RA}.;
const HR = ${HR}.;
const HM = ${HM}.;
const BR = vec3f(5.802e-6, 13.558e-6, 33.1e-6);
const BO = vec3f(.65e-6, 1.881e-6, .085e-6);
const BM = ${BM};
const BME = ${BME};
const SKYI = ${SUNE * PI};
const SIG = vec3f(.058, .0235, .0195);
const KD = vec3f(.056, .0245, .0170);
const WCOL = vec3f(.13, .52, .92);
fn sat(x: f32) -> f32 { return clamp(x, 0., 1.); }
fn ss(a: f32, b: f32, x: f32) -> f32 { let t = clamp((x - a) / (b - a), 0., 1.); return t * t * (3. - 2. * t); }
fn ign(p: vec2f) -> f32 { return fract(52.9829189 * fract(dot(p, vec2f(.06711056, .00583715)))); }
fn hs(x: f32) -> f32 { return fract(sin(x * 127.1) * 43758.5453); }
fn fin(c: vec3f) -> vec4f { return vec4f(min(max(c, vec3f(0.)), vec3f(60.)), 1.); }
fn h21(p: vec2f) -> f32 { var q = fract(p.xyx * vec3f(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
fn n2(p: vec2f) -> f32 { let i = floor(p); let f = fract(p); let u = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2f(1., 0.)), u.x), mix(h21(i + vec2f(0., 1.)), h21(i + vec2f(1., 1.)), u.x), u.y); }
// soft noise over the ground, 0 to 1, with features about 1/f metres across
fn gn(p: vec2f, f: f32) -> f32 { return n2(p * f) * .6 + n2(p * f * 2.7 + 11.3) * .28 + n2(p * f * 7.1 + 5.7) * .12; }
`;

// ---------------------------------------------------------------- the sky, looked up by direction
// A small picture of the whole sky as the camera sees it, redrawn every frame: single scattering by air (Rayleigh), haze
// (Mie) and ozone along each view ray on a round Earth, plus a flat share for light scattered more than once. u is the
// compass angle from the sun, v the height above the horizon (stretched near it).
const SKYW = 192, SKYH = 108;
const W_SKYLUT = S_G + W_FS + /*wgsl*/`
@group(0) @binding(0) var<uniform> g: G;
fn rsi(ro: vec3f, rd: vec3f, r: f32) -> vec2f {
  let b = dot(ro, rd); let h = b * b - dot(ro, ro) + r * r;
  if (h < 0.) { return vec2f(-1.); }
  let q = sqrt(h); return vec2f(-b - q, -b + q);
}
fn dn(h: f32) -> vec3f { return vec3f(exp(-h / HR), exp(-h / HM), max(0., 1. - abs(h - 25000.) / 15000.)); }
fn tSun(p: vec3f, L: vec3f) -> vec3f {
  if (rsi(p, L, RE).x > 0.) { return vec3f(0.); }
  let tt = rsi(p, L, RA).y; var o = vec3f(0.);
  for (var i = 0; i < 8; i++) { o += dn(length(p + L * (tt * (f32(i) + .5) / 8.)) - RE); }
  o *= tt / 8.;
  return exp(-(BR * o.x + vec3f(BME * o.y) + BO * o.z));
}
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / vec2f(${SKYW}., ${SKYH}.);
  let c = uv.y * 2. - 1.; let el = sign(c) * c * c * 1.5708; let az = uv.x * TAU;
  let rd = vec3f(cos(el) * cos(az), sin(el), cos(el) * sin(az));
  let L = vec3f(sqrt(max(1. - g.sun.y * g.sun.y, 0.)), g.sun.y, 0.);
  let ro = vec3f(0., RE + max(g.cam.y, 2.), 0.);
  var tm = rsi(ro, rd, RA).y; let gh = rsi(ro, rd, RE).x; let ground = gh > 0.;
  if (ground) { tm = gh; }
  let mu = dot(rd, L); let pr = .0596831 * (1. + mu * mu);
  let pm = .0795775 * .36 / pow(1.64 - 1.6 * mu, 1.5);
  var T = vec3f(1.); var S = vec3f(0.);
  for (var i = 0; i < 32; i++) {
    let u = (f32(i) + .5) / 32.; let ds = tm * u / 16.;
    let p = ro + rd * (tm * u * u); let d = dn(length(p) - RE);
    let sr = BR * d.x; let sm = BM * d.y; let ex = sr + vec3f(BME * d.y) + BO * d.z;
    let ts = tSun(p, L);
    let ins = ts * (sr * pr + sm * pm) + (sr + vec3f(sm)) * (ts * .028 + vec3f(.0012, .0016, .0022) * ss(-.38, .1, g.sun.y));
    let sg = exp(-ex * ds);
    S += T * ins * (1. - sg) / max(ex, vec3f(1e-9));
    T *= sg;
  }
  // past the edge of the sea mesh the ray ends on open water
  if (ground) { S += T * vec3f(.004, .010, .018) * (tSun(ro + rd * tm, L) * max(L.y, 0.) + .03); }
  return vec4f(S, 1.);
}
`;

const S_B = S_G + /*wgsl*/`
@group(0) @binding(0) var<uniform> g: G;
@group(0) @binding(1) var sR: sampler;
@group(0) @binding(2) var sC: sampler;
@group(0) @binding(3) var sS: sampler_comparison;
@group(0) @binding(4) var tSh: texture_depth_2d;
@group(0) @binding(5) var tW: texture_2d<f32>;
@group(0) @binding(6) var tD: texture_2d<f32>;
@group(0) @binding(7) var tH: texture_2d<f32>;
@group(0) @binding(8) var tN: texture_2d<f32>;
@group(0) @binding(9) var tG: texture_2d<f32>;
@group(0) @binding(10) var tSky: texture_2d<f32>;
struct WV { w: array<vec4f, ${NWAVE * 2}> };
@group(0) @binding(11) var<uniform> wv: WV;
@group(0) @binding(12) var sA: sampler;
const MIP0 = ${log2(DOM / TS)};
const LK = ${LK};
fn tuv(p: vec2f) -> vec2f { return p / DOM + .5; }
fn hgt(p: vec2f, l: f32) -> f32 { return textureSampleLevel(tH, sC, tuv(p), l).r; }
// the terrain's shadow: one map over the whole island, drawn again whenever the sun moves
fn shadow(p: vec3f) -> f32 {
  let s = g.sm * vec4f(p, 1.); let uv = vec2f(s.x * .5 + .5, .5 - s.y * .5); let z = s.z - .00004;
  if (any(abs(uv - .5) > vec2f(.499)) || z > 1.) { return 1.; }
  if (LOW) { return textureSampleCompareLevel(tSh, sS, uv, z); }
  let e = 1.3 / ${SHADOW}.; var a = 0.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { a += textureSampleCompareLevel(tSh, sS, uv + vec2f(f32(x), f32(y)) * e, z); } }
  return a / 9.;
}
// ---- air
fn skyUV(d: vec3f) -> vec2f {
  let el = asin(clamp(d.y, -1., 1.));
  return vec2f((atan2(d.z, d.x) - atan2(g.sun.z, g.sun.x)) / TAU, clamp(.5 + .5 * sign(el) * sqrt(abs(el) / 1.5708), .006, .994));
}
fn skyL(d: vec3f) -> vec3f { return textureSampleLevel(tSky, sR, skyUV(d), 0.).rgb * SKYI + vec3f(.0005, .0008, .0016) * g.sunc.w; }
fn seg(a: f32, d: f32) -> f32 { let x = a * d; if (abs(x) < .002) { return d * (1. - .5 * x); } return (1. - exp(-x)) / a; }
// what is left of light after d metres through the air from ro along rd (flat Earth: fine for the distances drawn)
fn airT(ro: vec3f, rd: vec3f, d: f32) -> vec3f {
  let y = max(ro.y, 0.);
  return exp(-(BR * (exp(-y / HR) * seg(rd.y / HR, d)) + vec3f(BME * exp(-y / HM) * seg(rd.y / HM, d))));
}
// haze: the lost light is replaced by the sky's own colour near the horizon in that direction
fn air(c: vec3f, ro: vec3f, rd: vec3f, d: f32) -> vec3f {
  let T = airT(ro, rd, d);
  return c * T + skyL(normalize(vec3f(rd.x, .035 + max(rd.y, 0.) * .5, rd.z))) * (1. - T);
}
// ---- water (the colours and falloffs are upstream's, lit by this world's sun and sky)
fn wlit() -> vec3f { return (g.sunc.rgb * (.25 + .75 * max(g.sun.y, 0.)) + skyL(vec3f(0., 1., 0.)) * 1.6) / 1.9; }
fn fogIn(ro: vec3f, rd: vec3f, d: f32) -> vec3f {
  let a = max(SIG - KD * rd.y, vec3f(1e-4));
  let I = (1. - exp(-a * d)) / a;
  let mu = max(dot(rd, g.sun.xyz), 0.); let m2 = mu * mu;
  return WCOL * SIG * exp(KD * min(ro.y, 0.)) * I * (1.22 + .3 * m2 * m2) * wlit() * .3;
}
fn wfog(c: vec3f, ro: vec3f, rd: vec3f, d: f32) -> vec3f { return c * exp(-SIG * d) + fogIn(ro, rd, d); }
// Everything between the eye and a point: air, water, or one after the other where the view crosses the sea surface.
// That is what makes going under and coming up seamless: no switch is thrown, the lengths just change.
fn medium(c: vec3f, wp: vec3f) -> vec3f {
  let v = wp - g.cam.xyz; let d = length(v); let rd = v / d; let hw = g.mis.w;
  let cu = g.cam.y < hw; let pu = wp.y < select(0., hw, d < 40.);
  if (cu == pu) { if (cu) { return wfog(c, g.cam.xyz, rd, d); } return air(c, g.cam.xyz, rd, d); }
  let tc = clamp((hw - g.cam.y) / (rd.y + select(-1e-6, 1e-6, rd.y >= 0.)), 0., d);
  let x = g.cam.xyz + rd * tc;
  if (cu) { return wfog(air(c, x, rd, d - tc), g.cam.xyz, rd, tc); }
  return air(wfog(c, x, rd, d - tc), g.cam.xyz, rd, tc);
}
fn cuv(p: vec3f) -> vec2f { return p.xz - g.sun.xz * (p.y / max(g.sun.y, .25)); }
fn caus(p: vec3f, d: f32) -> vec3f {
  let q = cuv(p); let o = vec2f(.004, .0025);
  let a = vec3f(textureSample(tW, sR, q / 3.3 + o).r, textureSample(tW, sR, q / 3.3).r, textureSample(tW, sR, q / 3.3 - o).r);
  let b = textureSample(tW, sR, q.yx / 6.9 + .37).r;
  return mix(min(pow(a, vec3f(2.3)) * 5. * (.45 + b * 1.3), vec3f(4.)), vec3f(.33), ss(35., 100., d));
}
// ---- waves (the table is WAVES in world.js)
fn wamp() -> f32 { return .22 + g.sun.w; }
// how far the surface point that rests at p is moved, on a mesh with cells of sp metres, over water dep metres deep
fn seaD(p: vec2f, sp: f32, dep: f32) -> vec3f {
  var o = vec3f(0.);
  for (var i = 0; i < ${NWG}; i++) {
    let a = wv.w[i * 2]; let b = wv.w[i * 2 + 1];
    let A = a.w * wamp() * clamp(dep * a.z * .6, .1, 1.) * sat(TAU / a.z / sp / 4. - .5);
    let th = dot(a.xy, p) * a.z - b.x * g.cam.w + b.y;
    o += vec3f(a.x * b.z * cos(th), sin(th), a.y * b.z * cos(th)) * A;
  }
  return o;
}
// the surface's slopes at rest point p, seen with pixels px metres wide: xy = slope, z = how much the crests pinch
fn seaS(p: vec2f, px: f32, dep: f32) -> vec3f {
  var o = vec3f(0.);
  for (var i = 0; i < ${NWAVE}; i++) {
    let a = wv.w[i * 2]; let b = wv.w[i * 2 + 1];
    let A = a.w * a.z * wamp() * clamp(dep * a.z * .6, .1, 1.) * sat(TAU / a.z / px / 5. - .8);
    let th = dot(a.xy, p) * a.z - b.x * g.cam.w + b.y;
    o += vec3f(a.xy * cos(th), b.z * sin(th)) * A;
  }
  return o;
}
// ---- the grid meshes: a vertex of level L (cells of s metres) is moved onto the coarser grids as it gets far from the
// camera, one level per doubling of distance, so neighbouring rings meet exactly and nothing pops. y0 is the height the
// distance is measured to. Returns xy = the position, z = the level it ended at (fractional while blending).
fn ring(q: vec2i, lv: vec4f, sea: bool) -> vec3f {
  var s = lv.z; var L = lv.w; var p = lv.xy + vec2f(q) * s; var e = L;
  for (var k = 0; k < 3; k++) {
    var y = 0.; if (!sea) { y = hgt(p, ${log2(TS / 128)}.); }
    let t = clamp(log2(max(distance(vec3f(p.x, y, p.y), g.cam.xyz), 1.) / LK) - L, 0., 1.);
    p = mix(p, floor(p / (2. * s)) * 2. * s, t); e = L + t;
    if (t < 1.) { break; }
    L += 1.; s *= 2.;
  }
  return vec3f(p, e);
}
`;

// ---------------------------------------------------------------- one-time bakes of the terrain
// 1. Height: the 40 m data, smoothly interpolated, plus the detail the data cannot hold: gullies and spurs on slopes,
//    ledges on cliffs, blocky lava on Pre-Kameni, soft waves of sand under water. The detail has zero mean, stays within
//    a few metres, and fades out at the shore, so it never contradicts the data.
const S_BK = W_NOISE + W_FS + /*wgsl*/`
const DOM = ${DOM}.;
const TS = ${TS}.;
@group(0) @binding(0) var tC: texture_2d<f32>;
@group(0) @binding(1) var tK: texture_2d<u32>;
fn ld(p: vec2i) -> f32 { return textureLoad(tC, clamp(p, vec2i(0), vec2i(639)), 0).r; }
fn cl(p: vec2i, c: u32) -> f32 { return f32(textureLoad(tK, clamp(p, vec2i(0), vec2i(639)), 0).r == c); }
// share of rock class c at grid position u (cell centres at whole numbers)
fn cls(u: vec2f, c: u32) -> f32 {
  let i = vec2i(floor(u)); let f = fract(u);
  return mix(mix(cl(i, c), cl(i + vec2i(1, 0), c), f.x), mix(cl(i + vec2i(0, 1), c), cl(i + vec2i(1, 1), c), f.x), f.y);
}
`;
const W_BAKEH = S_BK + /*wgsl*/`
fn cw(f: f32) -> vec4f { let f2 = f * f; let f3 = f2 * f; return vec4f(-.5 * f3 + f2 - .5 * f, 1.5 * f3 - 2.5 * f2 + 1., -1.5 * f3 + 2. * f2 + .5 * f, .5 * f3 - .5 * f2); }
fn dw(f: f32) -> vec4f { let f2 = f * f; return vec4f(-1.5 * f2 + 2. * f - .5, 4.5 * f2 - 5. * f, -4.5 * f2 + 4. * f + .5, 1.5 * f2 - f); }
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / TS; let w = (uv - .5) * DOM;
  // Catmull-Rom through the 4 x 4 cells around the point, kept near the range of the four nearest so cliffs do not ring
  let u = uv * 640. - .5; let i = vec2i(floor(u)); let f = fract(u);
  let wx = cw(f.x); let wz = cw(f.y); let ex = dw(f.x); let ez = dw(f.y);
  var h = 0.; var gr = vec2f(0.); var lo = 1e9; var hi = -1e9;
  for (var b = 0; b < 4; b++) { for (var a = 0; a < 4; a++) {
    let v = ld(i + vec2i(a - 1, b - 1));
    h += v * wx[a] * wz[b]; gr += v * vec2f(ex[a] * wz[b], wx[a] * ez[b]);
    if (a > 0 && a < 3 && b > 0 && b < 3) { lo = min(lo, v); hi = max(hi, v); }
  } }
  let mg = (hi - lo) * .15 + 2.; h = clamp(h, lo - mg, hi + mg);
  let sl = length(gr) / 40.;
  let pk = cls(u, 3u);
  let p = vec3f(w.x, 0., w.y);
  let wa = vec2f(fbm(p * .004 + 3., 3), fbm(p * .004 + 19., 3)) - .5;
  let q = p + vec3f(wa.x, 0., wa.y) * 180.;
  let r1 = 1. - abs(fbm(q * .011, 4) * 2. - 1.);
  let r2 = 1. - abs(fbm(q * .037 + 7., 3) * 2. - 1.);
  var d = (r1 * r1 - .42) * 8. * ss(.06, .45, sl) + (r2 - .5) * 2.4 * ss(.03, .3, sl) + (fbm(p * .05, 3) - .5) * 1.4;
  // beds of lava and tuff stand out as ledges on steep faces
  let st = h / 16. + (fbm(p * .006, 2) - .5) * 3.;
  d += (ss(.3, .7, fract(st)) - fract(st)) * 16. * .5 * ss(.45, 1.1, sl);
  // Pre-Kameni: blocky lava with pressure ridges
  d = mix(d, (wor(p * .028 + wa.x * 4.) - .5) * 7. + (wor(p * .085 + 5.) - .5) * 3. + (r1 - .5) * 5., pk);
  h += d * ss(.4, 6., h);
  h += (fbm(p * .02 + 40., 3) - .5) * 1.3 * ss(-1.5, -9., h);
  return vec4f(h, 0., 0., 1.);
}
`;
// 2. Normal (rg), how much sky a point sees (b: horizon heights in 8 directions out to 450 m), and the pale share (a):
//    marble where the old basement is, pale sediment on the floor of the bay
const W_BAKEN = S_BK + /*wgsl*/`
@group(0) @binding(2) var tH: texture_2d<f32>;
@group(0) @binding(3) var sC: sampler;
fn H(uv: vec2f, l: f32) -> f32 { return textureSampleLevel(tH, sC, uv, l).r; }
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / TS; let e = 1. / TS; let m = DOM / TS;
  let n = normalize(vec3f(H(uv - vec2f(e, 0.), 0.) - H(uv + vec2f(e, 0.), 0.), 2. * m, H(uv - vec2f(0., e), 0.) - H(uv + vec2f(0., e), 0.)));
  let h0 = H(uv, 0.); var occ = 0.;
  for (var a = 0; a < 8; a++) {
    let dir = vec2f(cos(f32(a) * .7854 + .3), sin(f32(a) * .7854 + .3)); var mx = 0.;
    for (var r = 0; r < 5; r++) { let rad = 10. * pow(2.6, f32(r)); mx = max(mx, (H(uv + dir * rad / DOM, log2(rad / m) - 1.5) - h0) / rad); }
    occ += mx / sqrt(1. + mx * mx);
  }
  return vec4f(n.xz * .5 + .5, pow(1. - occ / 8., 1.6), cls(uv * 640. - .5, 5u) + cls(uv * 640. - .5, 6u));
}
`;
// 3. Rock shares: r light-grey andesite, g dark-grey andesite, b black glassy andesite, a the old basement
const W_BAKEG = S_BK + /*wgsl*/`
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = fc.xy / 1024.; let p = vec3f((uv - .5) * DOM, 0.).xzy;
  let u = uv * 640. - .5 + (vec2f(fbm(p * .006, 3), fbm(p * .006 + 31., 3)) - .5) * 5.;
  return vec4f(cls(u, 1u), cls(u, 2u), cls(u, 3u), cls(u, 4u) + cls(u, 5u));
}
`;

// ---------------------------------------------------------------- terrain
const W_TERR = S_B + /*wgsl*/`
struct VO { @builtin(position) cp: vec4f, @location(0) wp: vec3f, @location(1) zen: vec3f };
@vertex fn vs(@location(0) q: vec2i, @location(1) lv: vec4f) -> VO {
  let r = ring(q, lv, false); let p = r.xy;
  let h = hgt(p, r.z - MIP0);
  let dq = p - g.cam.xz;
  var o: VO; o.wp = vec3f(p.x, h, p.y); o.zen = skyL(vec3f(0., 1., 0.));
  o.cp = g.vp * vec4f(p.x, h - dot(dq, dq) / (2. * RE), p.y, 1.);
  return o;
}
// the shadow map is drawn from a plain grid over the whole square, 9 m low: the grid is too coarse for gullies, and
// would otherwise put them in their own shade
@vertex fn vsS(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {
  let n = ${SG + 1}u; let p = (vec2f(f32(vi % n), f32(vi / n)) / ${SG}. - .5) * DOM;
  return g.vp * vec4f(p.x, hgt(p, ${log2(TS / SG)}.) - 9., p.y, 1.);
}
struct TP { h: f32, c: f32, n: vec3f };
fn tri(p: vec3f, n: vec3f, s: f32) -> TP {
  var w = pow(abs(n), vec3f(4.)); w /= (w.x + w.y + w.z);
  let x = textureSample(tD, sR, p.zy * s); let y = textureSample(tD, sR, p.xz * s); let z = textureSample(tD, sR, p.xy * s);
  var o: TP;
  o.h = x.b * w.x + y.b * w.y + z.b * w.z;
  o.c = x.a * w.x + y.a * w.y + z.a * w.z;
  let a = x.rg * 2. - 1.; let b = y.rg * 2. - 1.; let c = z.rg * 2. - 1.;
  o.n = vec3f(0., a.y, a.x) * w.x + vec3f(b.x, 0., b.y) * w.y + vec3f(c.x, c.y, 0.) * w.z;
  return o;
}
@fragment fn fs(i: VO) -> @location(0) vec4f {
  let uv = tuv(i.wp.xz); let nt = textureSample(tN, sA, uv); let gw = textureSample(tG, sA, uv);
  var n0 = vec3f(nt.x * 2. - 1., 0., nt.y * 2. - 1.); n0.y = sqrt(max(1. - dot(n0.xz, n0.xz), .01));
  let y = i.wp.y; let dist = length(i.wp - g.cam.xyz); let slope = 1. - n0.y;
  // rock detail at three sizes, each turned a different way so the tiles never line up, each faded out before its repeats show
  let pa = vec3f(i.wp.x * .8 - i.wp.z * .6, y, i.wp.x * .6 + i.wp.z * .8); let na = vec3f(n0.x * .8 - n0.z * .6, n0.y, n0.x * .6 + n0.z * .8);
  let pb = vec3f(i.wp.x * .6 + i.wp.z * .8, y, i.wp.z * .6 - i.wp.x * .8); let nb = vec3f(n0.x * .6 + n0.z * .8, n0.y, n0.z * .6 - n0.x * .8);
  var A = tri(pa, na, .011); var B = tri(pb, nb, .085); let C = tri(i.wp, n0, .66); let Fd = tri(pb, nb, 3.7);
  let fa = ss(3500., 600., dist); let fb = ss(420., 60., dist); let fk = ss(60., 6., dist); let ff = ss(14., 1.5, dist);
  A.n = vec3f(A.n.x * .8 + A.n.z * .6, A.n.y, A.n.z * .8 - A.n.x * .6) * fa; A.h = mix(.5, A.h, fa); A.c = mix(.5, A.c, fa);
  B.n = vec3f(B.n.x * .6 - B.n.z * .8, B.n.y, B.n.x * .8 + B.n.z * .6) * fb; B.h = mix(.5, B.h, fb); B.c = mix(.5, B.c, fb);
  let big = gn(i.wp.xz, .0021); let big2 = gn(i.wp.zx + 4000., .0068); let big3 = gn(pa.xz + 9000., .0034);
  let hd = (A.h * .3 + B.h * .4 + C.h * .3 * fk + .15 * (1. - fk)) * mix(1., .6 + .8 * Fd.h, ff);
  // Every colour below is a liberty (T-L8): no source gives the colour of any rock or soil on the island.
  // The ring's volcanic pile: beds of lava, scoria and tuff, banded by height, in the red, blue-black and ochre of the
  // rocks painted in the Akrotiri miniature frieze (grade B: shown, not found).
  let st = y / 23. + big * 2.6 + big2 * 1.3 + B.h * .3; let bed = hs(floor(st)); let sf = fract(st);
  var rk = mix(vec3f(.21, .10, .075), vec3f(.07, .072, .085), ss(.34, .5, bed));
  rk = mix(rk, vec3f(.30, .22, .115), ss(.64, .76, bed));
  rk = mix(rk, vec3f(.31, .28, .24), ss(.92, .97, bed));
  rk *= mix(.8, 1.15, hs(bed * 7.3)) * (1. - .25 * ss(.12, 0., sf) * ss(.3, .6, slope));
  // away from the cliffs the beds are hidden under their own rubble: one weathered brown-grey
  rk = mix(vec3f(.20, .17, .14) * (.8 + .4 * big), rk, ss(.3, .62, slope));
  rk = mix(rk, vec3f(.40, .40, .39) * (.8 + .4 * big2), gw.r);
  rk = mix(rk, vec3f(.135, .135, .15) * (.75 + .5 * big2), gw.g);
  rk = mix(rk, vec3f(.022, .022, .026) * (.7 + .6 * big2), gw.b);
  let fol = .8 + .4 * textureSample(tD, sR, vec2f(i.wp.x * .02 + i.wp.z * .05, i.wp.y * .6)).b;
  rk = mix(rk, mix(vec3f(.21, .23, .20), vec3f(.33, .28, .21), big) * fol, gw.a * (1. - nt.a));
  rk = mix(rk, vec3f(.47, .46, .43) * (.85 + .3 * B.c), gw.a * nt.a);
  rk *= .68 + .62 * hd;
  // loose ground on gentle slopes; bare, because plants come in a later work order
  var earth = mix(vec3f(.19, .145, .095), vec3f(.265, .215, .15), big2);
  earth = mix(earth, vec3f(.24, .12, .075), ss(.52, .7, big) * .6);         // rusty scoria soil
  earth = mix(earth, vec3f(.095, .088, .085), ss(.56, .74, big3) * .6);     // dark cinder and lava rubble
  earth = mix(earth, rk, .3 * gw.a * nt.a + .25 * gw.r) * (.76 + .48 * B.h);
  var alb = mix(rk, earth, ss(.42, .2, slope + (C.h - .5) * .1 * fk) * (1. - .92 * gw.b));
  // the shore: dark sand and shingle, wet at the water's edge
  alb = mix(alb, mix(vec3f(.15, .145, .135), rk, gw.b) * (.6 + .8 * C.h), ss(3.4, .9, y + (B.h - .5) * 2.4) * ss(.5, .2, slope));
  let wet = ss(.8, -.1, y);
  alb *= 1. - .5 * wet;
  // under water: dark volcanic sand on the flats (pale sediment in the bay), rock on the steeps
  let sand = mix(vec3f(.15, .145, .13), vec3f(.44, .43, .36), nt.a * (1. - gw.a));
  alb = mix(alb, mix(sand, rk * 1.1, sat(ss(.2, .55, slope) + gw.b)) * (.7 + .5 * B.h), ss(.1, -1.5, y));
  let N = normalize(n0 + (A.n * .22 + B.n * .5 + C.n * .6 * fk + vec3f(Fd.n.x * .6 - Fd.n.z * .8, Fd.n.y, Fd.n.x * .8 + Fd.n.z * .6) * .5 * ff) * (1.25 - .6 * ss(.1, -1.5, y)));
  let L = g.sun.xyz; let V = normalize(g.cam.xyz - i.wp);
  var E = g.sunc.rgb * shadow(i.wp + n0 * 2.);
  let ao = nt.b;
  var am = i.zen * (.3 + .7 * (N.y * .5 + .5)) + skyL(normalize(vec3f(N.x, .1, N.z))) * (.5 - .25 * N.y);
  // sunlight thrown back by the ground around
  am += g.sunc.rgb * max(L.y, 0.) * vec3f(.30, .25, .19) * (.45 - .35 * N.y) * .5;
  let ca = caus(i.wp, dist);
  if (y < 0.) {
    // light under the sea: absorbed on the way down, gathered into caustics
    E *= exp(KD * (y / max(L.y, .25))) * (.3 + ca * .18); am = am * exp(KD * y * 1.3) * .8 + WCOL * wlit() * exp(KD * y) * .12;
  }
  let ndl = sat(dot(N, L));
  var c = alb * (E * ndl + (am + vec3f(.0016, .0022, .004) * g.sunc.w * (.4 + .6 * N.y)) * ao);
  // sheen on glassy lava and on wet shingle
  let gl = gw.b * .12 + wet * .5 * step(0., y);
  c += E * pow(sat(dot(N, normalize(V + L))), 24.) * gl * ndl;
  return fin(medium(c, i.wp));
}
`;

// ---------------------------------------------------------------- the sea surface (from above and from below)
const W_SEA = S_B + /*wgsl*/`
struct VO { @builtin(position) cp: vec4f, @location(0) wp: vec3f, @location(1) op: vec2f };
@vertex fn vs(@location(0) q: vec2i, @location(1) lv: vec4f) -> VO {
  let r = ring(q, lv, true); let p = r.xy;
  let d = seaD(p, exp2(r.z), max(-hgt(p, r.z - MIP0 + 1.), 0.));
  let dq = p - g.cam.xz;
  var o: VO; o.op = p; o.wp = vec3f(p.x + d.x, d.y, p.y + d.z);
  o.cp = g.vp * vec4f(o.wp.x, o.wp.y - dot(dq, dq) / (2. * RE), o.wp.z, 1.);
  return o;
}
@fragment fn fs(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let v = i.wp - g.cam.xyz; let d = length(v); let V = v / d; let L = g.sun.xyz;
  let pp = d * g.right.w * 2. * g.res.z; let px = pp / max(abs(V.y), .06);
  let lod = log2(max(pp, 1.) / (DOM / ${TS}.));
  let dep = -hgt(i.op, lod); let dc = max(dep, 0.);
  let sl = seaS(i.op, px, dc);
  // ripples smaller than the wave sum carries: the moving slope texture, twice
  let rp = (textureSample(tW, sR, i.op / 11.).ba + textureSample(tW, sR, i.op.yx / 2.7 + .4).ba * .7) * (.3 + .8 * g.sun.w) * clamp(dc * 2., .25, 1.) * ss(2.5, .5, pp);
  let N = normalize(vec3f(-sl.x - rp.x, 1. - sl.z, -sl.y - rp.y));
  let sh = shadow(i.wp);
  // (every texture is read before the two cases part: the shader may not sample after branching on the facing)
  let Rr = refract(V, N, .75); let pl = dc / max(-Rr.y, .25);
  let bp = i.op + Rr.xz * pl; let bn = textureSample(tN, sA, tuv(bp)); let bg = textureSample(tG, sA, tuv(bp));
  let cf = ss(1.2, .25, pp); let cs = mix(.75, textureSample(tW, sR, bp / 3.3).r, cf); let cb = mix(.5, textureSample(tW, sR, bp.yx / 6.9 + .37).r, cf);
  let fm = textureSample(tW, sR, i.op / 5.).r + textureSample(tW, sR, i.op.yx / 1.7).r * .6;
  let zen = skyL(vec3f(0., 1., 0.));
  if (!ff) {
    // from below (upstream's): the sky in Snell's window, the deep reflected around it
    let ci = sat(dot(V, N)); let k = 1. - 1.769 * (1. - ci * ci); let win = ss(0., .22, k);
    let rr = refract(V, -N, 1.33); let sd = max(dot(rr, L), 0.);
    let fr = pow(1. - sqrt(max(k, 0.)), 5.);
    let sky = (skyL(normalize(vec3f(rr.x, max(rr.y, .03), rr.z))) * 1.6 + g.sunc.rgb * sh * (pow(sd, 120.) * .35 + pow(sd, 1500.) * 5.)) * (1. - fr);
    let c = mix(fogIn(i.wp, reflect(V, -N), 300.) * 1.15, sky, win);
    return fin(medium(c, i.wp));
  }
  let far = sat(log2(px * 30. + 1.) / 7.);
  let ci = max(sat(dot(-V, N)), .14 * far); let F = .02 + .98 * pow(1. - ci, 5.);
  var R = reflect(V, N); R.y = abs(R.y) + .02 + far * (.16 + .14 * g.sun.w);
  // the sun's glitter: far waves are smaller than a pixel, so their facets spread the sun wider
  let al = mix(.035, .16 + .12 * g.sun.w, far); let a2 = al * al;
  let nh = sat(dot(N, normalize(L - V))); let dd = nh * nh * (a2 - 1.) + 1.;
  let spec = g.sunc.rgb * sh * min(a2 / (dd * dd) * .25 / max(ci, .08), mix(120., 14., far)) * F;
  // into the water: the bottom through the water column, and the water's own colour
  let bsl = 1. - sqrt(max(1. - dot(bn.xy * 2. - 1., bn.xy * 2. - 1.), .01));
  let balb = mix(mix(vec3f(.15, .145, .13), vec3f(.44, .43, .36), bn.a * (1. - bg.a)), vec3f(.08, .08, .09), sat(ss(.2, .55, bsl) + bg.b)) * (.8 + .4 * cb);
  let bot = balb * (g.sunc.rgb * sh * max(L.y, 0.) * exp(KD * (-dc / max(L.y, .25))) * (.4 + min(pow(cs, 2.3) * 5., 3.) * (.45 + cb * 1.3) * .2 * ss(12., 2., dc)) + zen * exp(-KD * dc * 1.3) * .8);
  let body = wfog(bot, vec3f(i.wp.x, 0., i.wp.z), Rr, pl);
  var c = mix(body, skyL(normalize(R)), F) + spec;
  // foam: swash on the shore, and whitecaps where crests pinch in a breeze
  let swash = ss(.9, .0, dep) * ss(.25, .8, fm + .5 * sin(dep * 9. - g.cam.w * 1.1 + fm * 3.)) * ss(3000., 500., d);
  let cap = ss(.46, .8, sl.z + fm * .1) * ss(.3, .7, g.sun.w) * ss(2500., 300., d);
  let foam = sat(swash + cap);
  c = mix(c, (g.sunc.rgb * sh * (.3 + .7 * max(L.y, 0.)) + zen * 1.5) * .8, foam);
  let al2 = ss(.0, .18, dep + foam * .15);
  return vec4f(fin(medium(c, i.wp)).rgb * al2, al2);
}
`;

// ---------------------------------------------------------------- the sky behind everything, and specks drifting in the water
const W_SKY = S_B + /*wgsl*/`
struct VO { @builtin(position) cp: vec4f, @location(0) rd: vec3f };
@vertex fn vs(@builtin(vertex_index) i: u32) -> VO {
  var o: VO; let p = vec2f(f32(i & 1u), f32(i >> 1u)) * 4. - 1.;
  o.rd = g.fwd.xyz + g.right.xyz * (p.x * g.right.w) + g.up.xyz * (p.y * g.up.w);
  o.cp = vec4f(p, 1e-7, 1.);
  return o;
}
@fragment fn fs(i: VO) -> @location(0) vec4f {
  let rd = normalize(i.rd);
  // under water with nothing in the way: just the water
  if (g.cam.y < g.mis.w) { return fin(fogIn(g.cam.xyz, rd, 1e5)); }
  var c = skyL(rd);
  let q = rd - g.sun.xyz;
  c += g.sunc.rgb * ss(2.3e-5, 1.8e-5, dot(q, q)) * 45.;
  // stars: a random field, not the sky of 1615 BCE (T-L12)
  let sv = rd * 190.; let id = floor(sv); let hh = fract(sin(vec3f(dot(id, vec3f(12.99, 78.23, 37.72)), dot(id, vec3f(39.35, 11.14, 83.16)), dot(id, vec3f(73.16, 52.24, 9.15)))) * 43758.5453);
  let sd = length(fract(sv) - .5 - (hh - .5) * .7);
  c += vec3f(.9, .95, 1.) * step(.9, hh.x) * pow(hh.y, 3.) * ss(.11, 0., sd) * ss(-.02, .25, rd.y) * g.sunc.w * (.75 + .25 * sin(g.cam.w * (2. + hh.z * 4.) + hh.x * 90.)) * .3;
  return fin(c);
}
struct PO { @builtin(position) cp: vec4f, @location(0) uv: vec2f, @location(1) @interpolate(flat) pr: vec2f };
@vertex fn vsP(@builtin(vertex_index) vi: u32, @location(0) a: vec4f) -> PO {
  var o: PO; let q = vec2f(f32(vi & 1u), f32(vi >> 1u)) * 2. - 1.; let t = g.cam.w; let B = 44.;
  var p = a.xyz * B + vec3f(t * .22, t * .05, t * .13) + .5 * vec3f(sin(t * .3 + a.x * 60.), sin(t * .23 + a.y * 50.), cos(t * .27 + a.z * 70.));
  p = g.cam.xyz + (fract((p - g.cam.xyz) / B + .5) - .5) * B;
  let d = length(p - g.cam.xyz); let sz = .012 + .045 * a.w * a.w * a.w;
  let w = p + (g.right.xyz * q.x + g.up.xyz * q.y) * max(sz, d * .0011);
  o.cp = g.vp * vec4f(w, 1.); o.uv = q;
  let lit = dot(g.sunc.rgb * exp(KD * (p.y / max(g.sun.y, .25))) + skyL(vec3f(0., 1., 0.)) * exp(KD * p.y), vec3f(.2, .5, .3));
  o.pr = vec2f(ss(B * .5, B * .32, d) * ss(.6, 2.5, d) * min(1., sz / (d * .0011)) * ss(g.mis.w - .3, g.mis.w - 1.5, p.y) * step(hgt(p.xz, 1.), p.y) * (.6 + .4 * sin(t * (1. + a.w * 2.) + a.x * 100.)) * exp(-SIG.g * d) * lit, a.w);
  return o;
}
@fragment fn fsP(i: PO) -> @location(0) vec4f {
  let m = ss(1., .2, length(i.uv));
  return vec4f(mix(vec3f(1.), vec3f(.7, 1., .9), i.pr.y) * min(m * m * i.pr.x * .5, 6.), 0.);
}
`;

// ---------------------------------------------------------------- light shafts under water (half resolution; upstream's)
const W_RAYS = S_G + W_FS + /*wgsl*/`
@group(0) @binding(0) var<uniform> g: G;
@group(0) @binding(1) var sR: sampler;
@group(0) @binding(2) var sS: sampler_comparison;
@group(0) @binding(3) var tSh: texture_depth_2d;
@group(0) @binding(4) var tW: texture_2d<f32>;
@group(0) @binding(5) var tDp: texture_depth${AA > 1 ? '_multisampled' : ''}_2d;
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let dp = textureLoad(tDp, vec2i(fc.xy) * 2, 0);
  let zl = g.fwd.w / max(dp, 1e-6);
  if (g.cam.y >= g.mis.w) { return vec4f(0., 0., 0., zl); }
  let uv = fc.xy * 2. * g.res.zw;
  let nd = vec2f(uv.x * 2. - 1., 1. - uv.y * 2.);
  let rv = g.fwd.xyz + g.right.xyz * (nd.x * g.right.w) + g.up.xyz * (nd.y * g.up.w);
  let rl = length(rv); let rd = rv / rl;
  var tm = min(zl * rl, 110.);
  if (rd.y > 1e-4) { tm = min(tm, (g.mis.w - g.cam.y) / rd.y); }
  let ro = g.cam.xyz; let sx = vec3f(g.sun.x, max(g.sun.y, .25), g.sun.z);
  let dt = tm / ${RAYN}.; let j = ign(fc.xy);
  var acc = vec3f(0.);
  for (var n = 0; n < ${RAYN}; n++) {
    let t = (f32(n) + j) * dt; let p = ro + rd * t;
    let s = g.sm * vec4f(p, 1.);
    let vis = textureSampleCompareLevel(tSh, sS, vec2f(s.x * .5 + .5, .5 - s.y * .5), s.z - .0002);
    let q = p.xz - sx.xz * (p.y / sx.y);
    let pat = ss(.3, .7, textureSampleLevel(tW, sR, q / 27., 2.5).r) * ss(.15, .6, textureSampleLevel(tW, sR, q.yx / 11. + .3, 2.).r);
    acc += exp(-SIG * t + KD * (p.y / sx.y)) * (vis * (.012 + pat * 6.));
  }
  let mu = max(dot(rd, g.sun.xyz), 0.);
  return vec4f(min(acc * dt * SIG * (WCOL + vec3f(.04, .07, .05)) * g.sunc.rgb * (.2 + 2. * mu * mu * mu) * g.mis.y * .3, vec3f(20.)), zl);
}
`;
// depth-aware 3x3 blur of the half-res shafts (hides the sampling dither)
const W_RBLUR = W_FS + /*wgsl*/`
@group(0) @binding(0) var tR: texture_2d<f32>;
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let p = vec2i(fc.xy); let mx = vec2i(textureDimensions(tR)) - 1;
  let c = textureLoad(tR, p, 0);
  var acc = vec3f(0.); var ws = 0.;
  for (var y = -1; y <= 1; y++) { for (var x = -1; x <= 1; x++) {
    let r = textureLoad(tR, clamp(p + vec2i(x, y) , vec2i(0), mx), 0);
    let w = 1. / (.03 + abs(r.a - c.a) / c.a);
    acc += r.rgb * w; ws += w;
  } }
  return vec4f(acc / ws, c.a);
}
`;

// ---------------------------------------------------------------- final composite
const W_POST = S_G + W_FS + /*wgsl*/`
@group(0) @binding(0) var<uniform> g: G;
@group(0) @binding(1) var sC: sampler;
@group(0) @binding(2) var tS: texture_2d<f32>;
@group(0) @binding(3) var tR: texture_2d<f32>;
@group(0) @binding(4) var tB: texture_2d<f32>;
@group(0) @binding(5) var tDp: texture_depth${AA > 1 ? '_multisampled' : ''}_2d;
fn tmap(x: vec3f) -> vec3f { return sat3((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14)); }
fn sat3(x: vec3f) -> vec3f { return clamp(x, vec3f(0.), vec3f(1.)); }
@fragment fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let px = vec2i(fc.xy);
  let uv = fc.xy * g.res.zw;
  let zf = g.fwd.w / max(textureLoad(tDp, px, 0), 1e-6);
  // depth-aware upsample of the half-res shafts
  let h = fc.xy * .5 - .5; let b = floor(h); let f = h - b; let bi = vec2i(b);
  let mx = vec2i(textureDimensions(tR)) - 1;
  var acc = vec3f(0.); var ws = 0.;
  for (var k = 0; k < 4; k++) {
    let o = vec2i(k & 1, k >> 1);
    let r = textureLoad(tR, clamp(bi + o, vec2i(0), mx), 0);
    let bw = mix(1. - f.x, f.x, f32(o.x)) * mix(1. - f.y, f.y, f32(o.y));
    let w = (bw + .02) / (.02 + abs(r.a - zf) / zf);
    acc += r.rgb * w; ws += w;
  }
  var c = textureLoad(tS, px, 0).rgb + acc / ws;
  let bl = textureSampleLevel(tB, sC, uv, 0.).rgb;
  c = mix(c, bl, .05) + bl * .02;
  c *= g.mis.x;
  let q = uv - .5;
  c *= 1. - dot(q, q) * .4;
  c = tmap(c);
  let l0 = dot(c, vec3f(.2126, .7152, .0722));
  let l = mix(l0, l0 * l0 * (3. - 2. * l0), .4);
  c *= l / max(l0, 1e-4);
  c = mix(vec3f(l), c, .96);
  c = pow(max(c, vec3f(0.)), vec3f(1. / 2.2));
  let n = ign(fc.xy) + ign(fc.xy + 37.) - 1.;
  return vec4f(c + n / 255., 1.);
}
`;
