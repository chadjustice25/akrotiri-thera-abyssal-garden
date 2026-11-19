#!/usr/bin/env node
// Downloads the one plan the excavated part of the town is drawn from, into tools/town/cache/ (ignored by git), and
// checks that it is the file the research checked (docs/research/verification/T2b.md, rows 1-5).
//   node tools/town/fetch.mjs [--force] [--from FILE]
// The plan: "Akrotiri in the Bronze Age, about 1600 B.C." (File:Map Akrotiri 1600 BC-en.png) by Maximilian Dörrbecker,
// Wikimedia Commons, CC BY-SA 2.5. Its licence, its credit text and how far it can be trusted are recorded in
// docs/town/README.md: read that before using it. The plan itself is never committed; only the outlines traced from it
// are (source/src/town-data.js, under CC BY-SA 4.0).
// --from FILE takes a copy already on disk instead of downloading; it must have the same checksum.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import http2 from 'node:http2';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), cache = path.join(here, 'cache');
export const PLAN = {
  file: 'Map_Akrotiri_1600_BC-en.png',
  page: 'https://commons.wikimedia.org/wiki/File:Map_Akrotiri_1600_BC-en.png',
  url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Map_Akrotiri_1600_BC-en.png',
  sha1: 'cd0dbc4a0107e624b511b7351d8d50497dc55eff',
  bytes: 541796, width: 2075, height: 3345,
};
export const planPath = path.join(cache, PLAN.file);
const sha1 = (b) => createHash('sha1').update(b).digest('hex');

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const force = process.argv.includes('--force'), fi = process.argv.indexOf('--from');
  mkdirSync(cache, { recursive: true });
  if (!existsSync(planPath) || force) {
    let b;
    if (fi > 0) b = readFileSync(process.argv[fi + 1]);
    else {
      // over HTTP/2: Commons answered a plain HTTP/1.1 request from Node with "429 Too Many Requests" (2026-11-18)
      const u = new URL(PLAN.url), parts = [];
      const status = await new Promise((res, rej) => {
        const c = http2.connect(u.origin); c.on('error', rej);
        const q = c.request({ ':path': u.pathname, 'user-agent': 'TownPlanFetch/1.0 (one checksum-verified file; generic client)', accept: '*/*' });
        let st = 0; q.on('response', (h) => { st = h[':status']; }); q.on('data', (d) => parts.push(d)); q.on('error', rej); q.on('end', () => { c.close(); res(st); }); q.end();
      });
      if (status !== 200) { console.error(`FAILED ${status} ${PLAN.url}\n(a copy already on disk can be given with --from FILE)`); process.exit(1); }
      b = Buffer.concat(parts);
    }
    if (sha1(b) !== PLAN.sha1) { console.error(`FAILED: got a file with SHA-1 ${sha1(b)}, not ${PLAN.sha1}. It is not the plan the research checked; nothing was written.`); process.exit(1); }
    writeFileSync(planPath, b);
  }
  const b = readFileSync(planPath);
  if (sha1(b) !== PLAN.sha1) { console.error(`FAILED: ${planPath} has SHA-1 ${sha1(b)}, not ${PLAN.sha1}. Delete it and fetch again.`); process.exit(1); }
  console.log(`${PLAN.file}  ${b.length} bytes  sha1 ${sha1(b)}  (matches the checked plan)`);
}
