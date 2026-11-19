// A small PNG reader and writer for the town tools (Node's zlib only; 8-bit images, not interlaced).
import { deflateSync, inflateSync } from 'node:zlib';

// -> { width, height, rgba: Uint8Array(width * height * 4) }
export function readPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8, width = 0, height = 0, depth = 0, type = 0, lace = 0, pal = null, trns = null; const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), name = buf.toString('latin1', pos + 4, pos + 8), d = buf.subarray(pos + 8, pos + 8 + len); pos += 12 + len;
    if (name === 'IHDR') { width = d.readUInt32BE(0); height = d.readUInt32BE(4); depth = d[8]; type = d[9]; lace = d[12]; }
    else if (name === 'PLTE') pal = d; else if (name === 'tRNS') trns = d; else if (name === 'IDAT') idat.push(d); else if (name === 'IEND') break;
  }
  if (depth !== 8 || lace) throw new Error(`unsupported PNG (bit depth ${depth}, interlace ${lace})`);
  const ch = [1, 0, 3, 1, 2, 0, 4][type], bpp = ch, stride = width * bpp, raw = inflateSync(Buffer.concat(idat)), px = new Uint8Array(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[dst + x - bpp] : 0, b = y ? px[dst + x - stride] : 0, c = x >= bpp && y ? px[dst + x - stride - bpp] : 0;
      let v = raw[src + x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[dst + x] = v;
    }
  }
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4, s = i * bpp;
    if (type === 2) { rgba[o] = px[s]; rgba[o + 1] = px[s + 1]; rgba[o + 2] = px[s + 2]; rgba[o + 3] = 255; }
    else if (type === 6) { rgba[o] = px[s]; rgba[o + 1] = px[s + 1]; rgba[o + 2] = px[s + 2]; rgba[o + 3] = px[s + 3]; }
    else if (type === 3) { const k = px[s] * 3; rgba[o] = pal[k]; rgba[o + 1] = pal[k + 1]; rgba[o + 2] = pal[k + 2]; rgba[o + 3] = trns && px[s] < trns.length ? trns[px[s]] : 255; }
    else if (type === 0) { rgba[o] = rgba[o + 1] = rgba[o + 2] = px[s]; rgba[o + 3] = 255; }
    else { rgba[o] = rgba[o + 1] = rgba[o + 2] = px[s]; rgba[o + 3] = px[s + 1]; }
  }
  return { width, height, rgba };
}

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
// rgb: Uint8Array(width * height * 3) -> Buffer
export function writePng(width, height, rgb) {
  const raw = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) Buffer.from(rgb.buffer, rgb.byteOffset + y * width * 3, width * 3).copy(raw, y * (width * 3 + 1) + 1);
  const chunk = (name, d) => { const b = Buffer.alloc(12 + d.length); b.writeUInt32BE(d.length, 0); b.write(name, 4, 'latin1'); d.copy(b, 8); b.writeUInt32BE(crc(b.subarray(4, 8 + d.length)), 8 + d.length); return b; };
  const hd = Buffer.alloc(13); hd.writeUInt32BE(width, 0); hd.writeUInt32BE(height, 4); hd[8] = 8; hd[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10]), chunk('IHDR', hd), chunk('IDAT', deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}

// a canvas to draw previews on: pixels, lines, polygons outlines and small numbers
export class Canvas {
  constructor(w, h, fill = [255, 255, 255]) { this.w = w; this.h = h; this.d = new Uint8Array(w * h * 3); for (let i = 0; i < w * h; i++) this.d.set(fill, i * 3); }
  px(x, y, c, a = 1) { x |= 0; y |= 0; if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; const o = (y * this.w + x) * 3; for (let k = 0; k < 3; k++) this.d[o + k] = this.d[o + k] * (1 - a) + c[k] * a; }
  line(x0, y0, x1, y1, c, a = 1) { const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) || 1; for (let i = 0; i <= n; i++) this.px(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), c, a); }
  poly(pts, c, a = 1, close = true) { for (let i = 0; i < pts.length - (close ? 0 : 1); i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; this.line(p[0], p[1], q[0], q[1], c, a); } }
  fill(pts, c, a = 1) {
    let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(this.h - 1, Math.ceil(y1)); y++) {
      const xs = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; if ((p[1] <= y + 0.5) !== (q[1] <= y + 0.5)) xs.push(p[0] + (y + 0.5 - p[1]) / (q[1] - p[1]) * (q[0] - p[0])); }
      xs.sort((u, v) => u - v); for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.max(0, Math.round(xs[k])); x < Math.min(this.w, Math.round(xs[k + 1])); x++) this.px(x, y, c, a);
    }
  }
  text(x, y, s, c, sc = 1) {
    const F = { 0: '757', 1: '262', 2: '623', 3: '727', 4: '571', 5: '326', 6: '376', 7: '711', 8: '777', 9: '773', '-': '020', '.': '002' }, G = { 0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'], 2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '111', '001', '111'], 4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'], 6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'], 8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'], '-': ['000', '000', '111', '000', '000'], '.': ['000', '000', '000', '000', '010'] };
    void F; let cx = x; for (const chr of String(s)) { const g = G[chr]; if (g) for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (g[j][i] === '1') for (let b = 0; b < sc; b++) for (let a = 0; a < sc; a++) this.px(cx + i * sc + a, y + j * sc + b, c); cx += 4 * sc; }
  }
  png() { return writePng(this.w, this.h, this.d); }
}
