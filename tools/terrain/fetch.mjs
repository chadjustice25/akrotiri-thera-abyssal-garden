#!/usr/bin/env node
// Downloads the two elevation datasets the 1615 BCE island is rebuilt from, into tools/terrain/cache/ (ignored by git).
// Their licences, attribution texts and terms are recorded in docs/terrain/README.md; read that before using the data.
//   node tools/terrain/fetch.mjs [--force]
// 1. Copernicus DEM GLO-30 (30 m surface model), tile N36 E025, from the open AWS bucket (no account).
// 2. EMODnet Digital Bathymetry (DTM 2024), mean depth, cut to the sea around Santorini through EMODnet's own WCS.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), cache = path.join(here, 'cache');
const force = process.argv.includes('--force');
// the cut of the bathymetry: a margin around the island wide enough for the world's 30 km square
export const BBOX = { south: 36.22, north: 36.60, west: 25.18, east: 25.64 };
export const SOURCES = [
  { file: 'Copernicus_DSM_COG_10_N36_00_E025_00_DEM.tif',
    url: 'https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N36_00_E025_00_DEM/Copernicus_DSM_COG_10_N36_00_E025_00_DEM.tif' },
  { file: 'emodnet_dtm2024_mean_santorini.tif',
    url: 'https://ows.emodnet-bathymetry.eu/wcs?service=WCS&version=2.0.1&request=GetCoverage&coverageId=emodnet__mean&format=image/tiff'
      + `&subset=Lat(${BBOX.south},${BBOX.north})&subset=Long(${BBOX.west},${BBOX.east})` },
];
mkdirSync(cache, { recursive: true });
for (const s of SOURCES) {
  const to = path.join(cache, s.file);
  if (!existsSync(to) || force) {
    const r = await fetch(s.url, { headers: { 'user-agent': 'terrain-fetch (node)' } });
    if (!r.ok) { console.error(`FAILED ${r.status} ${s.url}`); process.exit(1); }
    const b = Buffer.from(await r.arrayBuffer());
    if (b[0] !== 0x49 && b[0] !== 0x4d) { console.error(`FAILED: ${s.url} did not return a TIFF:\n${b.subarray(0, 300)}`); process.exit(1); }
    writeFileSync(to, b);
  }
  const b = readFileSync(to);
  console.log(`${s.file}  ${b.length} bytes  sha256 ${createHash('sha256').update(b).digest('hex')}`);
}
