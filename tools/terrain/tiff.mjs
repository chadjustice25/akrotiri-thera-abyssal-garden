// A minimal GeoTIFF reader for the two files this project uses (no dependencies): one band, float32 or int16,
// strips or tiles, uncompressed, LZW or Deflate, with the horizontal (2) or floating-point (3) predictor.
// Returns { width, height, data: Float32Array (row 0 = north), lon0, lat0, dLon, dLat, nodata } where (lon0, lat0) is the
// outer corner of the north-west pixel and dLon, dLat are the pixel sizes in degrees (dLat > 0, rows run south).
import { inflateSync } from 'node:zlib';

function lzw(src, outLen) {
  const out = new Uint8Array(outLen); let op = 0, bits = 0, nb = 0, ip = 0, width = 9, next = 258, prev = -1;
  const pre = new Int32Array(4096), suf = new Uint8Array(4096), len = new Uint16Array(4096), first = new Uint8Array(4096);
  for (let i = 0; i < 256; i++) { suf[i] = first[i] = i; len[i] = 1; pre[i] = -1; }
  for (;;) {
    while (nb < width && ip < src.length) { bits = (bits << 8) | src[ip++]; nb += 8; }
    if (nb < width) break;
    const code = (bits >> (nb - width)) & ((1 << width) - 1); nb -= width; bits &= (1 << nb) - 1;
    if (code === 257) break;
    if (code === 256) { width = 9; next = 258; prev = -1; continue; }
    let c = code;
    if (prev >= 0 && next < 4096) { pre[next] = prev; first[next] = first[prev]; len[next] = len[prev] + 1; suf[next] = code < next ? first[code] : first[prev]; next++; }
    if (c >= next) throw new Error('LZW: bad code');
    const n = len[c]; let p = op + n; if (p > outLen) throw new Error('LZW: output overrun');
    while (c >= 0) { out[--p] = suf[c]; c = pre[c]; }
    op += n; prev = code;
    if (next + 1 >= (1 << width) && width < 12) width++;
  }
  return out;
}

export function readTiff(buf) {
  const le = buf[0] === 0x49, dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (dv.getUint16(2, le) !== 42) throw new Error('not a classic TIFF');
  const ifd = dv.getUint32(4, le), n = dv.getUint16(ifd, le), tags = {};
  const SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };
  for (let i = 0; i < n; i++) {
    const e = ifd + 2 + i * 12, tag = dv.getUint16(e, le), type = dv.getUint16(e + 2, le), count = dv.getUint32(e + 4, le);
    const off = SIZE[type] * count <= 4 ? e + 8 : dv.getUint32(e + 8, le), v = [];
    for (let k = 0; k < count; k++) {
      const o = off + k * SIZE[type];
      v.push(type === 3 ? dv.getUint16(o, le) : type === 4 ? dv.getUint32(o, le) : type === 12 ? dv.getFloat64(o, le) : type === 11 ? dv.getFloat32(o, le) : type === 2 ? String.fromCharCode(buf[o]) : buf[o]);
    }
    tags[tag] = type === 2 ? v.join('').replace(/\0+$/, '') : v;
  }
  const width = tags[256][0], height = tags[257][0], bps = tags[258][0], comp = (tags[259] || [1])[0], fmt = (tags[339] || [1])[0], pred = (tags[317] || [1])[0];
  if ((tags[277] || [1])[0] !== 1) throw new Error('more than one band');
  const tiled = !!tags[322], tw = tiled ? tags[322][0] : width, th = tiled ? tags[323][0] : (tags[278] || [height])[0];
  const offs = tags[tiled ? 324 : 273], cnts = tags[tiled ? 325 : 279], bpp = bps / 8, data = new Float32Array(width * height);
  const across = Math.ceil(width / tw);
  for (let t = 0; t < offs.length; t++) {
    let raw = buf.subarray(offs[t], offs[t] + cnts[t]);
    const rows = tiled ? th : Math.min(th, height - t * th), want = tw * rows * bpp;
    if (comp === 8 || comp === 32946) raw = inflateSync(raw); else if (comp === 5) raw = lzw(raw, want); else if (comp !== 1) throw new Error('compression ' + comp + ' is not supported');
    const x0 = tiled ? (t % across) * tw : 0, y0 = (tiled ? Math.floor(t / across) : t) * th;
    const row = new Uint8Array(tw * bpp), px = new DataView(new ArrayBuffer(bpp));
    for (let y = 0; y < rows && y0 + y < height; y++) {
      row.set(raw.subarray(y * tw * bpp, (y + 1) * tw * bpp));
      if (pred === 3) { for (let i = 1; i < row.length; i++) row[i] = (row[i] + row[i - 1]) & 255; }
      for (let x = 0; x < tw && x0 + x < width; x++) {
        let v;
        if (pred === 3) { for (let b = 0; b < bpp; b++) px.setUint8(b, row[b * tw + x]); v = px.getFloat32(0, false); }
        else { for (let b = 0; b < bpp; b++) px.setUint8(b, row[x * bpp + b]); v = fmt === 3 ? px.getFloat32(0, le) : px.getInt16(0, le); }
        data[(y0 + y) * width + x0 + x] = v;
      }
      if (pred === 2) throw new Error('predictor 2 is not supported');
    }
  }
  const sc = tags[33550], tp = tags[33922], mt = tags[34264]; // pixel scale + tie point, or a 4x4 transformation
  const nodata = tags[42113] !== undefined ? Number(tags[42113]) : null;
  if (sc && tp) return { width, height, data, lon0: tp[3] - tp[0] * sc[0], lat0: tp[4] + tp[1] * sc[1], dLon: sc[0], dLat: sc[1], nodata };
  if (mt && !mt[1] && !mt[4]) return { width, height, data, lon0: mt[3], lat0: mt[7], dLon: mt[0], dLat: -mt[5], nodata };
  throw new Error('no georeference tags');
}
