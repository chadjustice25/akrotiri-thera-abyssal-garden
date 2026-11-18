#!/usr/bin/env node
// ============================================================================
// check `views`: render the page in headless Chrome on this Mac's GPU and photograph the six viewpoints
// ============================================================================
//   node checks/views.mjs [--page index.html] [--level high|medium|low] [--size 1600x900] [--out DIR] [--settle 2.5]
//   (also: cd source && npm run views)
// It serves the page from 127.0.0.1, opens it in headless Chrome (WebGPU on the real Metal adapter), waits for the
// world to finish building, presses Dive in, then keys 1-6 and saves a JPEG of each view, with the stats line (key H)
// read after each one. It writes DIR/view-1.jpg ... view-6.jpg, DIR/report.json and DIR/index.html (a gallery that
// Claude publishes as the "Thera Views" artifact so the views can be looked at from the iPad). DIR defaults to
// .harness/views/<time>/ (ignored by git), and the run is also copied to .harness/views/latest/, the folder Claude publishes.
// PASS: the page started on a hardware adapter, no error was logged, and all six views have picture content.
// The check proves the page renders and shows what it rendered. It does not judge whether the picture is right:
// that is still a person looking at the views (AGENTS.md section 6).
// Exit 0 PASS, 1 FAIL, 3 ERROR; the last line is the result.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, dflt) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : dflt; };
const done = (code, line) => { console.log(line); process.exit(code); };
const error = (msg) => done(3, `ERROR views: ${msg}`);

const PAGE = path.resolve(ROOT, arg('page', 'index.html'));
const LEVELS = { high: 0, medium: 1, low: 2 };
const LEVEL = arg('level', 'high');
if (!(LEVEL in LEVELS)) error(`--level must be high, medium or low, not ${LEVEL}`);
const [W, H] = arg('size', '1600x900').split('x').map(Number);
if (!(W > 0 && H > 0)) error('--size must look like 1600x900');
const SETTLE = Number(arg('settle', '2.5')) * 1000; // after each jump: let shadows, exposure and plants settle
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const OUT = path.resolve(ROOT, arg('out', path.join('.harness', 'views', stamp)));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(CHROME)) error(`Chrome not found at ${CHROME} (set CHROME to its binary)`);
if (!existsSync(PAGE)) error(`no page at ${PAGE}`);
if (typeof WebSocket !== 'function') error(`Node ${process.version} has no built-in WebSocket; use Node 22 or later`);

// ---------------------------------------------------------------- serve the page (WebGPU needs a secure context)
const html = readFileSync(PAGE), missing = []; // anything else the page asks the server for is a runtime load
const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html); }
  else if (req.url === '/favicon.ico') { res.writeHead(204); res.end(); } // Chrome asks for it; the page has none
  else { missing.push(req.url); res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

// ---------------------------------------------------------------- launch Chrome
const profile = mkdtempSync(path.join(tmpdir(), 'views-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, `--window-size=${W},${H}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--mute-audio', '--hide-scrollbars', '--force-color-profile=srgb',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
let finished = false;
const cleanup = () => { if (finished) return; finished = true; try { chrome.kill(); } catch {} server.close(); try { rmSync(profile, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup);
const deadline = setTimeout(() => { cleanup(); error('timed out after 4 minutes'); }, 240e3);

const wsUrl = await new Promise((res) => {
  let buf = '';
  const t = setTimeout(() => res(null), 20e3);
  chrome.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\S+)/); if (m) { clearTimeout(t); res(m[1]); } });
  chrome.on('exit', () => { clearTimeout(t); res(null); });
});
if (!wsUrl) { cleanup(); error('Chrome did not start (no DevTools address within 20 s)'); }

// ---------------------------------------------------------------- a minimal DevTools protocol client (no npm packages)
const port = new URL(wsUrl).port;
const target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('DevTools socket failed')); });
let nextId = 0;
const pending = new Map(), problems = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.j(new Error(`${p.method}: ${m.error.message}`)) : p.r(m.result); return; }
  if (m.method === 'Runtime.exceptionThrown') problems.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning'))
    problems.push(`console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') problems.push('log: ' + m.params.entry.text);
};
const send = (method, params = {}) => new Promise((r, j) => { const id = ++nextId; pending.set(id, { r, j, method }); ws.send(JSON.stringify({ id, method, params })); });
const run = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const key = async (code, k) => {
  const vk = { Digit1: 49, Digit2: 50, Digit3: 51, Digit4: 52, Digit5: 53, Digit6: 54, KeyH: 72 }[code];
  await send('Input.dispatchKeyEvent', { type: 'keyDown', code, key: k, windowsVirtualKeyCode: vk });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk });
};

const report = { page: path.relative(ROOT, PAGE), level: LEVEL, size: `${W}x${H}`, chrome: '', adapter: null, loadSeconds: 0, views: [], problems };
try {
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  report.chrome = (await send('Browser.getVersion')).product;
  // a fixed detail level, so runs compare; the crash marker cleared so the page does not lower it by itself
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.abyssal='${LEVELS[LEVEL]}';localStorage.abyssalLoad=''}catch{}` });
  const t0 = Date.now();
  await send('Page.navigate', { url: URL_ });

  // the world is built when the menu appears (body class "m"); "l e" is the page's own failure screen
  let state = '';
  for (let i = 0; i < 180; i++) {
    await sleep(500);
    try { state = await run(`document.body.className + '|' + document.getElementById('s').textContent`); } catch { continue; }
    if (state.startsWith('m|') || state.startsWith('l e|')) break;
  }
  report.loadSeconds = +((Date.now() - t0) / 1000).toFixed(1);
  report.adapter = await run(`(async()=>{const a=navigator.gpu&&await navigator.gpu.requestAdapter({powerPreference:'high-performance'});if(!a)return null;const i=a.info||{};return{vendor:i.vendor,architecture:i.architecture,fallback:!!i.isFallbackAdapter}})()`);
  if (!state.startsWith('m|')) throw Object.assign(new Error(`the page did not reach its menu: "${state.split('|')[1] || state}"`), { fail: true });

  // dive in (pointer lock is refused headless, which leaves the menu closed), and hide the two overlay controls
  await run(`document.getElementById('d').click()`);
  await sleep(500);
  await run(`(()=>{const s=document.createElement('style');s.textContent='#o,#i{visibility:hidden!important}';document.head.append(s)})()`);
  await key('KeyH', 'h'); // the stats line: read after each view, hidden from the picture

  mkdirSync(OUT, { recursive: true });
  for (let v = 1; v <= 6; v++) {
    await key('Digit' + v, String(v));
    await sleep(SETTLE);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
    const file = `view-${v}.jpg`;
    writeFileSync(path.join(OUT, file), Buffer.from(shot.data, 'base64'));
    // picture content: decode the screenshot in the page and measure its brightness and spread
    const px = await run(`(async()=>{const b=await (await fetch('data:image/jpeg;base64,${shot.data}')).blob();const im=await createImageBitmap(b);
      const c=new OffscreenCanvas(160,90),g=c.getContext('2d');g.drawImage(im,0,0,160,90);const d=g.getImageData(0,0,160,90).data;
      let s=0,q=0,n=d.length/4;for(let i=0;i<d.length;i+=4){const l=(0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2]);s+=l;q+=l*l}
      const m=s/n;return{mean:+m.toFixed(1),spread:+Math.sqrt(Math.max(0,q/n-m*m)).toFixed(1)}})()`);
    const stats = (await run(`document.getElementById('i').textContent`)) || '';
    report.views.push({ view: v, file, ...px, stats, ok: px.spread >= 4 && px.mean >= 3 });
  }
} catch (e) {
  report.fatal = e.message;
  if (!e.fail) problems.push('driver: ' + e.message);
}
clearTimeout(deadline);
cleanup();

// ---------------------------------------------------------------- the report and the gallery
mkdirSync(OUT, { recursive: true });
report.when = new Date().toISOString();
const hw = report.adapter && !report.adapter.fallback;
for (const u of missing) problems.push('the page requested ' + u + ' (nothing may load at run time)');
const blank = report.views.filter((v) => !v.ok).map((v) => v.view);
const pass = hw && !report.fatal && report.views.length === 6 && !blank.length && !problems.length;
report.result = pass ? 'PASS' : 'FAIL';
writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2) + '\n');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<title>Thera Views</title><style>
:root{--bg:#f6f4ef;--fg:#1d1b18;--mut:#6b655c;--card:#fff;--line:#e2ddd3;--ok:#2f7a3d;--bad:#b3261e}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#15140f;--fg:#ece8df;--mut:#a39d92;--card:#1f1d18;--line:#35322b;--ok:#7ccf8a;--bad:#ff8a80}}
:root[data-theme=dark]{--bg:#15140f;--fg:#ece8df;--mut:#a39d92;--card:#1f1d18;--line:#35322b;--ok:#7ccf8a;--bad:#ff8a80}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,system-ui,sans-serif}
main{max-width:1100px;margin:0 auto;padding:20px 16px 48px}h1{font-size:1.5rem;margin:0 0 4px}.mut{color:var(--mut);font-size:.9rem}
.r{font-weight:700;color:${pass ? 'var(--ok)' : 'var(--bad)'}}ul{padding-left:1.2em}
.grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(min(100%,480px),1fr));margin-top:16px}
figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
figure a{display:block}img{display:block;width:100%;height:auto}figcaption{padding:8px 12px;font-size:.85rem;color:var(--mut)}figcaption b{color:var(--fg)}
</style></head><body><main>
<h1>Thera Views</h1>
<p class=mut>The six preset viewpoints (keys 1–6), rendered in headless Chrome on the Mac's GPU. Tap a view to open it full size.</p>
<p><span class=r>${report.result}</span> · ${esc(report.page)} · detail ${esc(LEVEL)} · ${esc(report.size)} · built in ${report.loadSeconds} s · ${esc(report.when.slice(0, 16).replace('T', ' '))} UTC<br>
<span class=mut>${esc(report.chrome)} · adapter ${esc(report.adapter ? `${report.adapter.vendor} ${report.adapter.architecture}${report.adapter.fallback ? ' (software fallback)' : ''}` : 'none')}</span></p>
${report.fatal ? `<p class=r>${esc(report.fatal)}</p>` : ''}${problems.length ? `<ul>${problems.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
<p class=mut>A pass means the page rendered all six views. Whether they look right is for a person to judge.</p>
<div class=grid>${report.views.map((v) => `<figure><a href="${v.file}" target=_blank><img src="${v.file}" alt="Viewpoint ${v.view}" loading=lazy width=${W} height=${H}></a>
<figcaption><b>View ${v.view}</b>${v.ok ? '' : ' · <span class=r>no picture content</span>'} · ${esc(v.stats || 'no stats line')}</figcaption></figure>`).join('\n')}</div>
</main></body></html>
`);

if (!arg('out')) { const latest = path.join(ROOT, '.harness', 'views', 'latest'); rmSync(latest, { recursive: true, force: true }); cpSync(OUT, latest, { recursive: true }); }
const rel = path.relative(ROOT, OUT);
if (!report.adapter) done(1, `FAIL views: no WebGPU adapter in headless Chrome; see ${rel}/report.json`);
if (!hw) done(1, `FAIL views: only a software fallback adapter; see ${rel}/report.json`);
if (report.fatal) done(1, `FAIL views: ${report.fatal}; see ${rel}/report.json`);
if (blank.length) done(1, `FAIL views: view ${blank.join(', ')} has no picture content; see ${rel}/`);
if (problems.length) done(1, `FAIL views: ${problems.length} error(s) logged, first: ${problems[0].slice(0, 160)}; see ${rel}/report.json`);
done(0, `PASS views: six viewpoints rendered on ${report.adapter.vendor} ${report.adapter.architecture} at ${LEVEL} detail, ${report.size}, world built in ${report.loadSeconds} s; pictures in ${rel}/`);
