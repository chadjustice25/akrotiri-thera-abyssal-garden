// ============================================================================
// quality level, chosen before anything is built
// ============================================================================
// LV: 0 High, 1 Medium, 2 Low. Medium bakes the terrain at half the resolution and a smaller shadow map; Low also drops
// anti-aliasing and uses a coarser terrain mesh, cheaper filtering and fewer light shaft steps.
// localStorage.abyssal = "level,pixels,detail". abyssalLoad is set while the world is built: still set on the next
// visit means that load crashed the tab, so this one runs a level lower.
const mob = matchMedia('(pointer:coarse)').matches, mem = navigator.deviceMemory;
const keep = (k, v) => { try { localStorage[k] = v; } catch {} };
let SV = [], LV, bad;
try { SV = (localStorage.abyssal || '').split(','); bad = localStorage.abyssalLoad; } catch {}
LV = SV[0] ? +SV[0] : mob ? (mem > 7 ? 1 : 2) : mem <= 4 ? 2 : 0;
if (bad && LV < 2) { SV = [++LV]; keep('abyssal', LV); }
const SHADOW = LV ? 2048 : 4096, AA = LV > 1 ? 1 : 4, WATER = LV > 1 ? 256 : 512, RAYN = LV > 1 ? 12 : 30;
// TS: the baked terrain textures (height, normal) are TS x TS texels over the world square; GN: cells along one side of
// each ring of the terrain and sea meshes; SG: cells along one side of the mesh the shadow map is drawn from
const TS = LV ? 2048 : 4096, GN = LV > 1 ? 128 : 192, SG = LV ? 256 : 512;
// TSH: the map of the town's own shadows, which must hold at the scale of a street a metre wide
const TSH = LV ? 2048 : 4096;
