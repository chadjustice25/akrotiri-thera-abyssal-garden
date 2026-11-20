// ============================================================================
// spike: the pipelines, and the frame (dev.html only)
// ============================================================================
// Builds every scene pipeline again from the engine's shader text with the parts' replacements, and draws the frame with
// them: the engine's own render() with the parts' passes added. spk.on = 0 goes back to the engine's frame, untouched,
// which is the baseline every measurement is compared with.
// Keys (dev.html): K layer on to the next (Found, Inferred, Imagined) · J the next way of fading · N the wave on and off
//   Y the island of 1628 and the stand-in · U and I the year back and on by 10 · O the day on by 30 · G more placed things
//   P the spike off and on
{
  const part = (p) => SPK.parts.includes(p), XW = S_X + SPK.wgsl;
  const code = (src, what) => { for (const p of SPK.patches) src = p(src, what); return src + XW; };
  const ALL = SS.VERTEX | SS.FRAGMENT | SS.COMPUTE, view = (r) => (r.createView ? r.createView() : r.size ? { buffer: r } : r);
  const bglX = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: ALL, buffer: {} }, ...SPK.entries] });
  const bgX = device.createBindGroup({ layout: bglX, entries: [uboX, ...SPK.res].map((r, binding) => ({ binding, resource: view(r) })) });
  const plX = device.createPipelineLayout({ bindGroupLayouts: [bgl0, bglX] });
  SPK.bglX = bglX; SPK.bgX = bgX; SPK.code = code;
  const xPipe = (m, vsE, fsE, buffers, o = {}) => device.createRenderPipeline({ layout: o.layout || plX,
    vertex: { module: m, entryPoint: vsE, buffers },
    fragment: { module: m, entryPoint: fsE, targets: [{ format: HDR, blend: o.blend }] },
    primitive: { topology: o.strip ? 'triangle-strip' : 'triangle-list', cullMode: o.cull || 'none' },
    depthStencil: { format: DEPTH, depthWriteEnabled: !o.blend || !!o.dw, depthCompare: 'greater' }, multisample: { count: AA } });
  SPK.xPipe = xPipe;
  const mTerrX = mod(code(W_TERR, 'terr')), mSeaX = mod(code(W_SEA, 'sea')), mSkyX = mod(code(W_SKY, 'sky')), mTownX = mod(code(W_TOWN, 'town'));
  const fade = SPK.fade, townBufs = fade ? [vbTownL, fade.layout] : [vbTownL];
  const pTerrainX = xPipe(mTerrX, 'vs', 'fs', [vbGrid, ibLevel], { cull: 'back' });
  const pTownX = xPipe(mTownX, 'vs', 'fs', townBufs, { cull: 'back' });
  // (spk.restOpaque = 0 keeps the discarding shader on at rest too, to measure what that costs)
  const pTownXO = fade ? xPipe(mTownX, 'vs', 'fsO', townBufs, { cull: 'back' }) : pTownX;
  SPK.restOpaque = 1;
  const pTownShX = device.createRenderPipeline({ layout: plX, vertex: { module: mTownX, entryPoint: 'vsS', buffers: townBufs }, fragment: fade ? { module: mTownX, entryPoint: 'fsS', targets: [] } : undefined, primitive: { cullMode: 'none' },
    depthStencil: { format: 'depth16unorm', depthWriteEnabled: true, depthCompare: 'less', depthBias: 3, depthBiasSlopeScale: 2.5 } });
  const pSeaX = xPipe(mSeaX, 'vs', 'fs', [vbGrid, ibLevel], { blend: BLEND, dw: 1 });
  const pSkyX = xPipe(mSkyX, 'vs', 'fs', []);
  const pSpeckX = xPipe(mSkyX, 'vsP', 'fsP', [ibSpeck], { strip: true, blend: ADD });
  const pShadowX = device.createRenderPipeline({ layout: plX, vertex: { module: mTerrX, entryPoint: 'vsS' }, primitive: { cullMode: 'none' },
    depthStencil: { format: DEPTH, depthWriteEnabled: true, depthCompare: 'less', depthBias: 2, depthBiasSlopeScale: 2 } });
  if (SPK.place) SPK.place.build();

  // ---- the frame: the engine's render() (main.js), with the parts' passes. Kept line for line where it is the same.
  const base = render;
  let wasOn = 0, lastT = performance.now(), tLay = -9, tKind = -9, tWave = -9, tIsl = -9;
  SPK.shadowDraws = 0; // how many times the town's shadow map has been drawn (it is drawn only while something moves)
  render = () => {
    const now = performance.now(), dt = min((now - lastT) / 1000, 0.1); lastT = now; xMeas(dt);
    if (SPK.hold) dynT = -Infinity;
    if (SPK.freeze) F[TIME] = 100;
    if (!SPK.on) { if (wasOn) { shadowAt = -1; wasOn = 0; } base(); return; }
    if (!wasOn) { shadowAt = -1; wasOn = 1; }
    xStep(dt);
    F[HSEA] = seaAt(F[CX], F[CZ], F[TIME], max(-hAt(F[CX], F[CZ]), 0), UB[51]);
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
    const moved = shadowAt !== F[HOUR];
    if (moved) { setSun(); Q.writeBuffer(uboS, 0, UBS); Q.writeBuffer(uboT, 0, UBT); shadowAt = F[HOUR]; }
    // a shadow map is drawn again only while its owners change: the town's while a layer fades, the island's while the year moves it
    // (the town belongs to the first island: it is not drawn while the second is blended in)
    const townOn = SPK.isl <= 0, townMoved = moved || townOn !== (tIsl <= 0) || (fade && (tLay !== SPK.lay || tKind !== SPK.kind || tWave !== SPK.wave)), islMoved = moved || tIsl !== SPK.isl;
    tLay = SPK.lay; tKind = SPK.kind; tWave = SPK.wave; tIsl = SPK.isl;
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
    let r = e.beginRenderPass(waterPass[0]); r.setPipeline(pWater); r.setBindGroup(0, bgWater); r.draw(3); r.end();
    for (let i = 1; i < 5; i++) { r = e.beginRenderPass(waterPass[i]); r.setPipeline(pMip16); r.setBindGroup(0, waterBG[i - 1]); r.draw(3); r.end(); }
    r = e.beginRenderPass(passSky); r.setPipeline(pSkyLut); r.setBindGroup(0, bgSkyLut); r.draw(3); r.end();
    if (islMoved) { r = e.beginRenderPass(passShadow); r.setPipeline(pShadowX); r.setBindGroup(0, bg0s); r.setBindGroup(1, bgX); r.setIndexBuffer(ibShadowGrid, 'uint32'); r.drawIndexed(SG * SG * 6); r.end(); }
    if (townMoved) {
      r = e.beginRenderPass(passTownSh); r.setPipeline(pTownShX); r.setBindGroup(0, bg0t); r.setBindGroup(1, bgX); r.setVertexBuffer(0, vbTown); if (fade) r.setVertexBuffer(1, fade.vbId);
      r.setIndexBuffer(ibTown, 'uint32'); if (townOn) r.drawIndexed(nTown); r.end(); SPK.shadowDraws++;
    }
    // placing by rule: one compute pass fills the lists the scene pass draws from
    if (SPK.place) SPK.place.compute(e);
    r = e.beginRenderPass(passScene);
    r.setBindGroup(0, bg0); r.setBindGroup(1, bgX); r.setVertexBuffer(0, vbMesh); r.setIndexBuffer(ibMesh, 'uint16');
    r.setPipeline(pTerrainX); r.setVertexBuffer(1, ibTerr);
    r.drawIndexed(GM.nFull, 1, 0, 0, 0); if (nT > 1) r.drawIndexed(GM.nRing, nT - 1, GM.nFull, 0, 1);
    // nothing fading (or the lidded rise, which only moves corners): the town is drawn opaque, as the engine draws it
    r.setPipeline(SPK.restOpaque && (SPK.kind === 4 || (SPK.lay === SPK.layTo && SPK.lay === round(SPK.lay))) ? pTownXO : pTownX); r.setVertexBuffer(0, vbTown); if (fade) r.setVertexBuffer(1, fade.vbId); r.setIndexBuffer(ibTown, 'uint32'); if (townOn) r.drawIndexed(nTown);
    if (SPK.place) SPK.place.draw(r);
    r.setPipeline(pSeaX); r.setVertexBuffer(0, vbMesh); r.setIndexBuffer(ibMesh, 'uint16'); r.setVertexBuffer(1, ibSea);
    r.drawIndexed(GM.nFull, 1, 0, 0, 0); if (nS > 1) r.drawIndexed(GM.nRing, nS - 1, GM.nFull, 0, 1);
    r.setPipeline(pSkyX); r.draw(3);
    if (cy < F[HSEA]) { r.setPipeline(pSpeckX); r.setVertexBuffer(0, ibSpecks); r.draw(4, NSPECK); }
    r.end();
    r = e.beginRenderPass(passRays); r.setPipeline(pRays); r.setBindGroup(0, bgRays); r.draw(3); r.end();
    r = e.beginRenderPass(passBlur); r.setPipeline(pRB); r.setBindGroup(0, bgBlur); r.draw(3); r.end();
    for (let i = 0; i < bloomPass.length; i++) {
      r = e.beginRenderPass(bloomPass[i]); r.setPipeline(i === 0 ? pDown0 : i < NB ? pDown : pUp); r.setBindGroup(0, bloomBG[i]); r.draw(3); r.end();
    }
    passPost.colorAttachments[0].view = ctx.getCurrentTexture().createView();
    r = e.beginRenderPass(passPost); r.setPipeline(pPost); r.setBindGroup(0, bgPost); r.draw(3); r.end();
    if (slot) { e.resolveQuerySet(qs, 0, 2, qResolve, 0); e.copyBufferToBuffer(qResolve, 0, slot.b, 0, 16); }
    submitList[0] = e.finish();
    Q.submit(submitList);
    if (slot) { slot.busy = true; slot.b.mapAsync(GPUMapMode.READ).then(slot.done); }
    if (SPK.hold) dynT = -Infinity;
  };

  // ---- a line saying where the spike stands, and its keys
  const line = document.createElement('pre');
  line.style.cssText = 'position:absolute;left:1.2em;bottom:1em;margin:0;font:.8em/1.6 ui-monospace,monospace;text-shadow:0 1px 4px #000;pointer-events:none;white-space:pre-wrap';
  body.append(line); SPK.line = line;
  const LAYERS = ['Found', 'Inferred', 'Imagined'];
  setInterval(() => { line.textContent = menu || SPK.quiet ? '' : SPK.on ? `spike [${SPK.parts}]  layer ${SPK.lay.toFixed(2)} (${LAYERS[round(SPK.layTo)] || ''})  ·  ${KINDS[SPK.kind]}${SPK.wave ? ', as a wave' : ''}  ·  year ${SPK.yr} BCE, day ${SPK.day}  ·  island ${SPK.isl.toFixed(2)}${SPK.place ? '  ·  placed ' + SPK.place.say() : ''}` : 'spike off (P)'; }, 250);
  addEventListener('keydown', (e) => {
    if (menu || e.repeat) return;
    const c = e.code;
    if (c === 'KeyK') SPK.layTo = (round(SPK.layTo) + 1) % 3;
    else if (c === 'KeyJ') SPK.kind = (SPK.kind + 1) % KINDS.length;
    else if (c === 'KeyN') SPK.wave = SPK.wave ? 0 : 3;
    else if (c === 'KeyY') SPK.islTo = SPK.islTo ? 0 : 1;
    else if (c === 'KeyU') SPK.yr += 10; else if (c === 'KeyI') SPK.yr -= 10;
    else if (c === 'KeyO') SPK.day = (SPK.day + 30) % 365;
    else if (c === 'KeyG' && SPK.place) SPK.place.more();
    else if (c === 'KeyP') SPK.on = SPK.on ? 0 : 1;
  });
  await Q.onSubmittedWorkDone();
  SPK.go(SPK.parts.join());
}
