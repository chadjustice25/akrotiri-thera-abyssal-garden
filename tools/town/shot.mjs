#!/usr/bin/env node
// ============================================================================
// Development pictures and scripted moves: drives dev.html in headless Chrome on this Mac's GPU
// ============================================================================
//   cd source && npm run build:dev        first: writes ../dev.html (never committed)
//   node tools/town/shot.mjs --out DIR --steps 'JSON' [--size 1600x900] [--level high|medium|low] [--page dev.html]
//        [--steps-file FILE]  the steps from a file      [--json FILE]  also write what every step returned, as JSON
//        [--device 820x1180]  a touch device of that size (so the menu can be looked at as an iPad or a phone shows it)
//        [--menu]             save DIR/menu.jpg before diving in      [--nohud]  leave the stats line out of the pictures
//        [--nokey]            do not press H after diving in (to test the other way of showing the stats line)
// The steps are a JSON list; each step may have:
//   name            save a picture DIR/<name>.jpg after the step
//   key             press this key once, e.g. "Digit7", "KeyL", "KeyT"
//   hold, ms        hold these keys (e.g. ["KeyW", "ShiftLeft"]) for ms milliseconds
//   look            [x, y, z, tx, ty, tz, onFoot]: put the camera there (y is a height above the sea of 1628 BCE)
//   above           with look: y is a height above the ground instead
//   hour            the solar hour, at once
//   run             JavaScript to run in the page (a promise is waited for); what it returns is printed
//   heap            collect garbage, then print the size of the JavaScript heap in bytes
//   png             save the picture as DIR/<name>.png instead, without loss
//   tap             a CSS selector: touch the middle of that element (with --device)
//   compare         [a, b]: two pictures saved earlier in this run with png; prints how many pixels differ, and by how much
//   wait            milliseconds to wait before the picture (default 1200)
// After every step it prints the camera's state (dev.state() in source/src/dev.js): on foot or not, place, the ground and
// what is built there. It is not a check: checks/views.mjs is. It exists so that a change can be looked at, and so that
// walking can be shown to work (docs/town/README.md says how it was used).
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (name, dflt) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : dflt; };
const PAGE = path.resolve(ROOT, arg('page', 'dev.html')), OUT = path.resolve(arg('out', path.join(ROOT, '.harness', 'views', 'dev'))); // (.harness/views/ is ignored by git)
const [W, H] = arg('size', '1600x900').split('x').map(Number), LEVEL = { high: 0, medium: 1, low: 2 }[arg('level', 'high')];
const STEPS = JSON.parse(arg('steps-file') ? readFileSync(arg('steps-file'), 'utf8') : arg('steps', '[]'));
const flag = (name) => process.argv.includes('--' + name), DEVICE = arg('device'), results = [], pngs = new Map();
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(PAGE)) { console.error(`no page at ${PAGE}: run (cd source && npm run build:dev)`); process.exit(3); }
const html = readFileSync(PAGE);
const server = createServer((req, res) => { if (req.url === '/' || req.url === '/index.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html); } else { res.writeHead(req.url === '/favicon.ico' ? 204 : 404); res.end(); } });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const profile = mkdtempSync(path.join(tmpdir(), 'shot-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, `--window-size=${W},${H}`, '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--mute-audio', '--hide-scrollbars', '--force-color-profile=srgb',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const cleanup = () => { try { chrome.kill(); } catch {} server.close(); try { rmSync(profile, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup);
setTimeout(() => { console.error('timed out'); process.exit(3); }, Number(arg('timeout', '300')) * 1e3).unref();
const wsUrl = await new Promise((res) => { let buf = ''; chrome.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\S+)/); if (m) res(m[1]); }); chrome.on('exit', () => res(null)); });
if (!wsUrl) { console.error('Chrome did not start'); process.exit(3); }
const target = (await (await fetch(`http://127.0.0.1:${new URL(wsUrl).port}/json`)).json()).find((t) => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let nextId = 0; const pending = new Map(), problems = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.j(new Error(m.error.message)) : p.r(m.result); return; }
  if (m.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) problems.push(`console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') problems.push('log: ' + m.params.entry.text);
};
const send = (method, params = {}) => new Promise((r, j) => { const id = ++nextId; pending.set(id, { r, j }); ws.send(JSON.stringify({ id, method, params })); });
const run = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VK = { Space: 32, ShiftLeft: 16, Escape: 27 }, vk = (c) => VK[c] || (c.startsWith('Digit') ? 48 + Number(c.slice(5)) : c.startsWith('Key') ? c.charCodeAt(3) : 0);
const keyEv = (type, code) => send('Input.dispatchKeyEvent', { type, code, key: code.startsWith('Key') ? code.slice(3).toLowerCase() : code.startsWith('Digit') ? code.slice(5) : code === 'Space' ? ' ' : code, windowsVirtualKeyCode: vk(code) });

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
if (DEVICE) { const [w, h] = DEVICE.split('x').map(Number); await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); }
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.abyssal='${LEVEL}';localStorage.abyssalLoad=''}catch{}` });
const t0 = Date.now();
await send('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
let state = '';
for (let i = 0; i < 240; i++) { await sleep(500); try { state = await run(`document.body.className + '|' + document.getElementById('s').textContent`); } catch { continue; } if (state.startsWith('m|') || state.startsWith('l e|')) break; }
console.log(`page: ${state} after ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (state.startsWith('m|')) {
  mkdirSync(OUT, { recursive: true });
  if (flag('menu')) { await sleep(1500); writeFileSync(path.join(OUT, 'menu.jpg'), Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 })).data, 'base64')); }
  // the measuring spike (source/src/spike*.js) builds its own pipelines after the menu appears: wait for it
  const spike = await run(`window.spk ? spk.ready : null`); if (spike !== null) console.log(`spike: ${spike} after ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await run(`document.getElementById('d').click()`); await sleep(400);
  await run(`(()=>{const s=document.createElement('style');s.textContent='#o${flag('nohud') ? ',#i' : ''}{visibility:hidden!important}';document.head.append(s)})()`);
  if (!flag('nokey')) { await keyEv('keyDown', 'KeyH'); await keyEv('keyUp', 'KeyH'); }
  for (const st of STEPS) {
    if (st.hour !== undefined) await run(`dev.hour(${st.hour})`);
    if (st.look) await run(st.above ? `dev.look(${st.look[0]},${st.look[1]}+Math.max(dev.hAt(${st.look[0]},${st.look[2]}),0),${st.look.slice(2).join(',')})` : `dev.look(${st.look.join(',')})`);
    if (st.run) { const v = await run(st.run); console.log('  run ->', JSON.stringify(v)); results.push({ step: st.name || st.id || null, run: st.run, value: v }); }
    if (st.heap) { await send('HeapProfiler.collectGarbage'); const u = await send('Runtime.getHeapUsage'); console.log(`  heap -> ${u.usedSize} bytes used`); results.push({ step: st.name || st.id || null, heap: u.usedSize }); }
    if (st.key) { await keyEv('keyDown', st.key); await keyEv('keyUp', st.key); }
    if (st.tap) { const [x, y] = await run(`(()=>{const b=document.querySelector('${st.tap}').getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]})()`); await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    if (st.hold) { for (const c of st.hold) await keyEv('keyDown', c); await sleep(st.ms || 1000); for (const c of st.hold) await keyEv('keyUp', c); }
    await sleep(st.wait ?? 1200);
    const s = await run(`window.dev ? JSON.stringify(dev.state()) : '(the released page)'`), info = await run(`document.getElementById('i').textContent`);
    console.log(`${st.name || '(step)'}: ${s.replace(/(\.\d\d)\d+/g, '$1')}  |  ${info.split('\n')[0]}`);
    if (st.name) { const data = (await send('Page.captureScreenshot', st.png ? { format: 'png' } : { format: 'jpeg', quality: 85 })).data; if (st.png) pngs.set(st.name, data); writeFileSync(path.join(OUT, st.name + (st.png ? '.png' : '.jpg')), Buffer.from(data, 'base64')); }
    if (st.compare) {
      const v = await run(`(async()=>{const px=async(d)=>{const im=await createImageBitmap(await (await fetch('data:image/png;base64,'+d)).blob());const c=new OffscreenCanvas(im.width,im.height),g=c.getContext('2d');g.drawImage(im,0,0);return g.getImageData(0,0,im.width,im.height).data};
        const a=await px('${pngs.get(st.compare[0])}'),b=await px('${pngs.get(st.compare[1])}');let n=0,mx=0,sum=0;for(let i=0;i<a.length;i+=4){const d=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),Math.abs(a[i+2]-b[i+2]));if(d){n++;sum+=d;if(d>mx)mx=d}}
        return{pixels:a.length/4,differ:n,greatest:mx,meanOfThoseThatDiffer:n?+(sum/n).toFixed(2):0}})()`);
      console.log(`  compare ${st.compare.join(' with ')} ->`, JSON.stringify(v)); results.push({ step: st.id || `compare ${st.compare.join(' with ')}`, value: v });
    }
  }
}
for (const p of problems.slice(0, 12)) console.log('PROBLEM ' + p.slice(0, 600));
console.log(problems.length ? `${problems.length} problem(s) logged` : 'no problem logged');
if (arg('json')) writeFileSync(path.resolve(arg('json')), JSON.stringify({ page: path.basename(PAGE), level: arg('level', 'high'), size: `${W}x${H}`, results, problems }, null, 1) + '\n');
process.exit(0);
