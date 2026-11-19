#!/usr/bin/env node
// ============================================================================
// Development pictures and scripted moves: drives dev.html in headless Chrome on this Mac's GPU
// ============================================================================
//   cd source && npm run build:dev        first: writes ../dev.html (never committed)
//   node tools/town/shot.mjs --out DIR --steps 'JSON' [--size 1600x900] [--level high|medium|low] [--page dev.html]
// The steps are a JSON list; each step may have:
//   name            save a picture DIR/<name>.jpg after the step
//   key             press this key once, e.g. "Digit7", "KeyL", "KeyT"
//   hold, ms        hold these keys (e.g. ["KeyW", "ShiftLeft"]) for ms milliseconds
//   look            [x, y, z, tx, ty, tz, onFoot]: put the camera there (y is a height above the sea of 1615 BCE)
//   above           with look: y is a height above the ground instead
//   hour            the solar hour, at once
//   run             JavaScript to run in the page
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
const PAGE = path.resolve(ROOT, arg('page', 'dev.html')), OUT = path.resolve(arg('out', path.join(ROOT, '.harness', 'shots')));
const [W, H] = arg('size', '1600x900').split('x').map(Number), LEVEL = { high: 0, medium: 1, low: 2 }[arg('level', 'high')];
const STEPS = JSON.parse(arg('steps', '[]'));
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
setTimeout(() => { console.error('timed out'); process.exit(3); }, 300e3).unref();
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
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.abyssal='${LEVEL}';localStorage.abyssalLoad=''}catch{}` });
const t0 = Date.now();
await send('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
let state = '';
for (let i = 0; i < 240; i++) { await sleep(500); try { state = await run(`document.body.className + '|' + document.getElementById('s').textContent`); } catch { continue; } if (state.startsWith('m|') || state.startsWith('l e|')) break; }
console.log(`page: ${state} after ${((Date.now() - t0) / 1000).toFixed(1)} s`);
if (state.startsWith('m|')) {
  mkdirSync(OUT, { recursive: true });
  if (arg('menu')) writeFileSync(path.join(OUT, 'menu.jpg'), Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 })).data, 'base64'));
  await run(`document.getElementById('d').click()`); await sleep(400);
  await run(`(()=>{const s=document.createElement('style');s.textContent='#o{visibility:hidden!important}';document.head.append(s)})()`);
  await keyEv('keyDown', 'KeyH'); await keyEv('keyUp', 'KeyH');
  for (const st of STEPS) {
    if (st.hour !== undefined) await run(`dev.hour(${st.hour})`);
    if (st.look) await run(st.above ? `dev.look(${st.look[0]},${st.look[1]}+Math.max(dev.hAt(${st.look[0]},${st.look[2]}),0),${st.look.slice(2).join(',')})` : `dev.look(${st.look.join(',')})`);
    if (st.run) console.log('  run ->', JSON.stringify(await run(st.run)));
    if (st.key) { await keyEv('keyDown', st.key); await keyEv('keyUp', st.key); }
    if (st.hold) { for (const c of st.hold) await keyEv('keyDown', c); await sleep(st.ms || 1000); for (const c of st.hold) await keyEv('keyUp', c); }
    await sleep(st.wait ?? 1200);
    const s = await run(`JSON.stringify(dev.state())`), info = await run(`document.getElementById('i').textContent`);
    console.log(`${st.name || '(step)'}: ${s.replace(/(\.\d\d)\d+/g, '$1')}  |  ${info.split('\n')[0]}`);
    if (st.name) writeFileSync(path.join(OUT, st.name + '.jpg'), Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 })).data, 'base64'));
  }
}
for (const p of problems.slice(0, 12)) console.log('PROBLEM ' + p.slice(0, 600));
console.log(problems.length ? `${problems.length} problem(s) logged` : 'no problem logged');
process.exit(0);
