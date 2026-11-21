// ============================================================================
// development tools: only in dev.html (npm run build:dev), never in index.html
// ============================================================================
//   F    fly the camera along the scripted path (FLY in main.js), one minute through the whole world
//   B    the same flight as a benchmark: the resolution stays fixed, every frame is timed, the result is shown at the end
//   F, B or 1-9 during a flight stop it
//   dev.look(x, y, z, tx, ty, tz), dev.hour(h), dev.day(d, now), dev.F: for scripts that take pictures (y is an absolute height)
//   dev.layer(n, now), dev.year(y), dev.pick(choice, option): the layer, the year and the chooser, for scripts;
//   dev.at(0.4) holds the layer part of the way through a change, for a still picture of a fade
//   dev.hold(1) keeps the resolution full, so that a slower state shows as more milliseconds and not as fewer pixels;
//   dev.time(ms) times the frames for ms; dev.change(n) changes the layer and times every frame until the change is over.
//   tools/town/layers.mjs uses the three to measure the layers (docs/layers/README.md).
//
// THE CHOOSER (work order 004). Three choices are Chad's, and the panel at the foot of the screen names each and the
// option in force in plain words; a click or the key shown beside it goes to the next option. What the released page does
// is the option marked "built" (TONE, CROSS and LIFT in main.js). docs/layers/README.md has what each costs.
//   U, I    the year back and on by 25 (no control in the released page: nothing in the world is dated). To show that the
//           year's plumbing works, DATED below gives four buildings years of their own HERE ONLY. They are dice, not evidence.
{
  const CH = [
    { name: 'The plain tone of Found', key: 'Z', code: 'KeyZ', at: 0, opts: [['Plaster', 'a warm off-white, as an unpainted model', [0.31, 0.3, 0.275]], ['Clay', 'a pale earth, nearer the ground\'s own tones', [0.25, 0.215, 0.17]], ['Grey', 'a neutral grey, as in a drawing of evidence', [0.21, 0.21, 0.21]]], set: (o) => { TONE = o[2]; } },
    { name: 'The wave crosses the town in', key: 'V', code: 'KeyV', at: 1, opts: [['3 seconds', 'brisk', 3], ['5 seconds', 'unhurried', 5], ['10 seconds', 'slow enough to follow house by house', 10]], set: (o) => { CROSS = o[2]; } },
    { name: 'A viewer standing where a house appears', key: 'C', code: 'KeyC', at: 0, opts: [['is lifted to its roof', 'never inside a wall', 1], ['is left inside it', 'its walls are not solid for them until they walk out', 0]], set: (o) => { LIFT = o[2]; } },
  ], BUILT = CH.map((c) => c.at);
  const panel = document.createElement('div');
  panel.style.cssText = 'position:absolute;left:1.2em;bottom:1em;font:.78em/1.5 ui-monospace,monospace;text-shadow:0 1px 4px #000;background:#03131cb3;border-radius:.6em;padding:.6em .9em;max-width:46em';
  body.append(panel);
  const pick = (i, k) => { const c = CH[i]; c.at = k === undefined ? (c.at + 1) % c.opts.length : k; c.set(c.opts[c.at]); paint(); return c.opts[c.at][0]; };
  const paint = () => {
    panel.replaceChildren(...['Choices for Chad (work order 004). Click a line, or press its key, for the next option.', ...CH.map((c) => `[${c.key}]  ${c.name}: ${c.opts[c.at][0].toUpperCase()} (${c.opts[c.at][1]})${c.at === BUILT[CH.indexOf(c)] ? '  · built' : ''}   — ${c.at + 1} of ${c.opts.length}`), `[K] layer: ${['Found', 'Inferred', 'Imagined'][layTo] || 'held at ' + layTo}   [U] [I] year: ${yearTo} BCE (four buildings are dated here, by dice)`]
      .map((t, i) => { const d = document.createElement('div'); d.textContent = t; if (i > 0 && i <= CH.length) { d.style.cursor = 'pointer'; d.onclick = () => pick(i - 1); } else d.style.opacity = i ? 1 : 0.7; return d; }));
    panel.style.display = menu ? 'none' : '';
  };
  setInterval(paint, 400);
  // four buildings with years of their own, for the development build only: [building's number, first year, last year] (BCE)
  const DATED = [[40, 1640, 0], [120, 1660, 1600], [200, 9999, 1620], [300, 1700, 1610]]; // (all four stand in 1628)
  for (const [id, a, b] of DATED) { TBU[id * 4 + 2] = a; TBU[id * 4 + 3] = b; }
  Q.writeBuffer(uboTab, 0, TBU); showAll();
  addEventListener('keydown', (e) => {
    if (menu || e.repeat) return;
    const c = CH.findIndex((q) => q.code === e.code);
    if (c >= 0) pick(c); else if (e.code === 'KeyU') setYear(yearTo + 25); else if (e.code === 'KeyI') setYear(yearTo - 25);
  });
  const LOGN = 1 << 16, logFrame = new Float32Array(LOGN), logGpu = new Float32Array(LOGN);
  let flying = false, bench = false, last = 0, nFrame = 0, nGpu = 0;
  const stop = () => { flying = bench = false; dynT = 0; };
  const report = () => {
    const st = (a, n) => { const s = Array.from(a.subarray(0, n)).sort((x, y) => x - y); let sum = 0; for (const v of s) sum += v; return { n, avg: sum / n, p99: s[min(n - 1, floor(n * 0.99))], max: s[n - 1] }; };
    const fm = (o) => `avg ${o.avg.toFixed(2)}  p99 ${o.p99.toFixed(2)}  max ${o.max.toFixed(2)} ms`;
    const f = st(logFrame, nFrame);
    info.textContent = `Fly-through ${W}x${H}, ${f.n} frames\nframe  ${fm(f)}\nGPU    ${nGpu ? fm(st(logGpu, nGpu)) : 'timestamp-query unavailable'}`;
  };
  // ---- timing: every frame's length and the GPU's time for it (the engine's own timestamp queries), into two fixed arrays
  const TN = 1 << 15, tF = new Float32Array(TN), tG = new Float32Array(TN); let tn = -1, tEnd = 0, tTo = -1, tLast = 0, tDone = null, held = 0;
  const tStat = () => {
    const n = tn, f = Array.from(tF.subarray(0, n)), g = Array.from(tG.subarray(0, n)).sort((a, b) => a - b), sum = (a) => a.reduce((p, q) => p + q, 0);
    // the lowest frame rate over any half second: the frames that ended in it
    let low = 1e9; for (let i = 0, j = 0, w = 0; i < n; i++) { w += f[i]; while (w - f[j] >= 500) w -= f[j++]; if (w >= 500) low = min(low, (i - j + 1) * 1000 / w); }
    return { frames: n, seconds: +(sum(f) / 1000).toFixed(2), fps: +(n * 1000 / sum(f)).toFixed(1), fpsLowestHalfSecond: low > 1e8 ? null : +low.toFixed(1), slowestFrameMs: +Math.max(...f).toFixed(1), gpuMs: +(sum(g) / n).toFixed(2), gpuP95Ms: +g[min(n - 1, floor(n * 0.95))].toFixed(2), gpuMaxMs: +g[n - 1].toFixed(2), res: `${W}x${H}` };
  };
  const time = (ms = 3000, settle = 700) => new Promise((done) => setTimeout(() => { tn = 0; tTo = -1; tEnd = performance.now() + ms; tLast = 0; tDone = done; }, settle));
  const change = (to) => new Promise((done) => { setLayer(to); tn = 0; tTo = to; tEnd = 0; tLast = 0; tDone = done; });
  // frame() moves the free camera and then calls render(): step in between and put the camera on the path instead
  const draw = render;
  render = () => {
    if (held) dynT = -Infinity;
    if (tn >= 0) {
      const now = performance.now();
      if (tLast && tn < TN) { tF[tn] = now - tLast; tG[tn++] = F[GPU]; }
      tLast = now;
      if (tTo >= 0 && !tEnd && F[LAY] === tTo && !fading) tEnd = now + 300; // (a little past the end, for the last shadow map)
      if (tEnd && now > tEnd) { const r = tStat(); tn = -1; tDone(r); }
    }
    if (flying) {
      const dtr = F[LAST] - last; last = F[LAST];
      F[FLT] += min(dtr / 1000, 0.1); flyAt();
      if (bench) { if (nFrame < LOGN) logFrame[nFrame++] = dtr; if (F[GPU] > 0 && nGpu < LOGN) logGpu[nGpu++] = F[GPU]; }
      if (F[FLT] >= FLYT) { if (bench) report(); stop(); }
    }
    draw();
  };
  addEventListener('keydown', (e) => {
    if (menu || e.repeat) return;
    if (e.code === 'KeyF' || e.code === 'KeyB') {
      if (flying) stop();
      else {
        flying = true; bench = e.code === 'KeyB'; F[FLT] = 0; last = F[LAST]; nFrame = nGpu = 0;
        // a benchmark hides the stats line and holds the resolution: dynT at -Infinity keeps frame() from tuning it
        if (bench) { hud = false; info.textContent = ''; dynT = -Infinity; }
      }
    } else if (/Digit[1-9]/.test(e.code)) stop();
  });
  window.dev = { look: lookAt, hour: (h) => { hourTo = F[HOUR] = h; }, F, hAt, solid, pick, year: setYear, day: (d, now) => { setDay(d); if (now) { const w = hourTo === hourOf(tIdx, F[DAY]); F[DAY] = dayTo; if (w) hourTo = F[HOUR] = hourOf(tIdx, dayTo); } return $('z').textContent; }, time, change, hold: (on) => { held = on; pix = DW * DH; resize(); return `${W}x${H}`; }, layer: (n, now) => { setLayer(n); if (now) { F[LAY] = n; showAll(); } return n; }, at: (v) => { layTo = F[LAY] = v; showAll(); return v; },
    state: () => ({ walk, show, x: F[CX], y: F[CY], z: F[CZ], feet: F[FEET], sea: F[HSEA], ground: hAt(F[CX], F[CZ]), top: tAt(F[CX], F[CZ]), layer: +F[LAY].toFixed(3), fading, year: F[YEAR], day: +F[DAY].toFixed(2), hour: +F[HOUR].toFixed(3), building: ((i, j) => (i < 0 || j < 0 || i >= TGW || j >= TGH ? 0 : TGRID[j * TGW + i]))(floor((F[CX] - TGX) / TCELL), floor((F[CZ] - TGZ) / TCELL)), inside: ghost }) };
}
