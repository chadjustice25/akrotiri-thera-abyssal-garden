// Bundles src/*.js into the single self-contained ../index.html
//   npm run build            minified
//   npm run build:readable   unminified, for debugging
//   npm run build:dev        ../dev.html: unminified, plus the development tools in src/dev.js (the chooser of work order
//                            004 among them) and what is left of the measuring spike (work order 003) in src/spike*.js.
//                            --only a,b keeps just those spike parts (place, year; --only none leaves both out) and
//                            --out NAME writes ../NAME instead, so that each part can be measured by itself.
//   npm run size             prints where the released page's bytes go, part by part; writes nothing
//   npm run spike:size       prints what each part of the spike would add to the page; writes nothing
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const FILES = ['quality.js', 'math.js', 'terrain-data.js', 'town-data.js', 'world.js', 'shaders.js', 'main.js', 'audio.js']; // concatenation order matters
const has = (f) => process.argv.includes(f), opt = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
const dev = has('--dev'), readable = dev || has('--readable');
const out = dev ? opt('--out') || 'dev.html' : 'index.html';
// The measuring spike: prototypes that exist in the development build only. spike.js is what they share, spike-go.js
// turns them on; each part between the two can be left out.
const SPIKE = { place: ['spike-place.js'], year: ['spike-island.js', 'spike-year.js'] };
const spikeFiles = (parts) => ['spike.js', ...parts.flatMap((p) => SPIKE[p]), 'spike-go.js'];
const read = (f) => readFileSync(path.join(here, 'src', f), 'utf8');
const tpl = readFileSync(path.join(here, 'template.html'), 'utf8');
// everything runs inside one async function; startup errors are shown on screen
const wrap = (body) => `(async()=>{${body}\n})().catch(e=>{console.error(e);document.body.className='l e';document.getElementById('s').textContent=(e.cause?'':'Failed to start: ')+e.message});`;
// shrink the WGSL inside /*wgsl*/ template literals, then minify the JS and the page's CSS
const minWgsl = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/ ?([{}()\[\];,:=+\-*\/<>&|!%@]) ?/g, '$1').trim();
const minJs = (js) => transformSync(wrap(js.replace(/\/\*wgsl\*\/`([^`]*)`/g, (_, w) => '`' + minWgsl(w) + '`')), { minify: true, target: 'es2022', legalComments: 'none' }).code.trim();
const page = (code) => {
  const css = (_, s) => '<style>' + transformSync(s, { loader: 'css', minify: true }).code.trim();
  return tpl.replace(/<style>([^]*?)(?=<\/style>)/, css).replace(/>\s+</g, '><').replace('/*SCRIPT*/', () => code).replace(/<script>\s+/, '<script>').replace(/\s+<\/script>/, '</script>');
};
const gz = (s) => gzipSync(Buffer.from(s), { level: 9 }).length, kB = (n) => (n / 1024).toFixed(1).padStart(7);

if (has('--size')) {
  // Where the released page's bytes go. The script is minified as one piece, so a marker is put between the source files
  // and the minified text is cut at the markers. A marker can keep two statements from being joined, so the parts are a few
  // bytes off the real page; the last line is the real page, and the line before it says how far off the sum is.
  const real = page(minJs(FILES.map(read).join('\n')));
  const PARTS = { 'terrain-data.js': 'terrain data', 'town-data.js': 'town data', 'shaders.js': 'shaders', 'audio.js': 'sound' };
  const cut = minJs(FILES.map((f, i) => `__PART__(${i});\n` + read(f)).join('\n')).split(/__PART__\(\d\)[;,]/);
  const sum = {}, add = (k, s) => { sum[k] = (sum[k] || '') + s; };
  add('engine code', cut[0]); FILES.forEach((f, i) => add(PARTS[f] || 'engine code', cut[i + 1]));
  add('menu and styles', page(''));
  console.log('The released page, part by part (kB = 1024 bytes; "gzip" is each part compressed by itself, so the column does not add up)\n');
  console.log('  part                 bytes       kB   gzip kB   share');
  let tot = 0;
  for (const k of ['terrain data', 'town data', 'shaders', 'engine code', 'sound', 'menu and styles']) { const n = Buffer.byteLength(sum[k]); tot += n; console.log(`  ${k.padEnd(16)} ${String(n).padStart(9)}  ${kB(n)}   ${kB(gz(sum[k]))}   ${(n * 100 / Buffer.byteLength(real)).toFixed(1).padStart(5)}%`); }
  console.log(`  ${'(markers)'.padEnd(16)} ${String(Buffer.byteLength(real) - tot).padStart(9)}`);
  console.log(`  ${'the whole page'.padEnd(16)} ${String(Buffer.byteLength(real)).padStart(9)}  ${kB(Buffer.byteLength(real))}   ${kB(gz(real))}   100.0%`);
  process.exit(0);
}
if (has('--spike-size')) {
  // What each part of the spike adds: to the development page as it is written (readable), and to the page if it were
  // minified into it as the release build would. Each part is measured by leaving it out.
  const all = Object.keys(SPIKE), dv = (parts) => tpl.replace('/*SCRIPT*/', () => wrap([...FILES, ...spikeFiles(parts), 'dev.js'].map(read).join('\n')));
  const mn = (parts) => page(minJs([...FILES, ...(parts ? spikeFiles(parts) : [])].map(read).join('\n')));
  const base = mn(null), full = mn(all), dfull = dv(all), b = (s) => Buffer.byteLength(s);
  console.log('What the spike adds (bytes). "dev" is dev.html as written; "minified" is what the part would add to index.html.\n');
  console.log('  part                         dev raw   dev gzip   minified raw   minified gzip');
  const row = (name, d, m) => console.log(`  ${name.padEnd(26)} ${String(b(dfull) - b(d)).padStart(9)}  ${String(gz(dfull) - gz(d)).padStart(9)}  ${String(b(full) - b(m)).padStart(13)}  ${String(gz(full) - gz(m)).padStart(14)}`);
  for (const p of all) row(`${p} (${SPIKE[p].join(', ')})`, dv(all.filter((q) => q !== p)), mn(all.filter((q) => q !== p)));
  // the shared part is what is left when every part is taken out
  { const d0 = tpl.replace('/*SCRIPT*/', () => wrap([...FILES, 'dev.js'].map(read).join('\n'))); console.log(`  ${'shared (spike.js, spike-go.js)'.padEnd(26)} ${String(b(dv([])) - b(d0)).padStart(5)}  ${String(gz(dv([])) - gz(d0)).padStart(9)}  ${String(b(mn([])) - b(base)).padStart(13)}  ${String(gz(mn([])) - gz(base)).padStart(14)}`); }
  console.log(`  ${'the whole spike'.padEnd(26)} ${''.padStart(9)}  ${''.padStart(9)}  ${String(b(full) - b(base)).padStart(13)}  ${String(gz(full) - gz(base)).padStart(14)}`);
  console.log(`\n  index.html today ${b(base)} bytes (${gz(base)} gzipped); with the whole spike minified in ${b(full)} (${gz(full)})`);
  process.exit(0);
}

const only = opt('--only');
if (dev) FILES.push(...spikeFiles(only === null ? Object.keys(SPIKE) : only.split(',').filter((p) => SPIKE[p])), 'dev.js');
const js = FILES.map(read).join('\n');
const html = readable ? tpl.replace('/*SCRIPT*/', () => wrap(js)) : page(minJs(js));
writeFileSync(path.join(here, '..', out), html);
console.log(`${out}: ${(html.length / 1024).toFixed(1)} kB${readable ? ' (readable)' : ''}, ${(gz(html) / 1024).toFixed(1)} kB gzipped`);
