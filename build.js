// Builds index.html (single file, zero external requests) from
// src/index.template.html + src/styles.css + src/logo.svg + src/app/*.js + data/psychologymap-data.js
// plus two optional overlays that may be missing or partial:
//   data/en/*.json        English translations of content fields ({ "<id>": { "<field path>": "text" } }, relations keyed "<from>-><to>:<type>")
//   data/book-links.json  Douban / Open Library links per work
// Usage: node build.js
// Options (for tests): build({ write, enDir, linksPath }) or env PSYMAP_EN_DIR / PSYMAP_LINKS.
// If the data file does not parse (it may be mid-edit by another worker), exits 1 and keeps the previous output.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const P = (...a) => path.join(root, ...a);
export const OUT = P('index.html');

export function readParts() {
  const appDir = P('src', 'app');
  const files = fs.readdirSync(appDir).filter((f) => f.endsWith('.js')).sort();
  return {
    template: fs.readFileSync(P('src', 'index.template.html'), 'utf8'),
    css: fs.readFileSync(P('src', 'styles.css'), 'utf8'),
    logo: fs.readFileSync(P('src', 'logo.svg'), 'utf8'),
    files,
    app: files.map((f) => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(appDir, f), 'utf8')),
    data: fs.readFileSync(P('data', 'psychologymap-data.js'), 'utf8'),
  };
}

const safeScript = (s) => s.replace(/<\/(script)/gi, '<\\/$1');
const safeStyle = (s) => s.replace(/<\/(style)/gi, '<\\/$1');

/* ---- logo: one source (src/logo.svg), a distinct gradient id per inline copy, and a base64 favicon ---- */
const compactSvg = (s) => s.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
const logoInline = (logo, id) => compactSvg(logo).replace(/id="lg"/g, `id="${id}"`).replace(/url\(#lg\)/g, `url(#${id})`);
const faviconUri = (logo) => 'data:image/svg+xml;base64,' + Buffer.from(compactSvg(logo).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" ')).toString('base64');

/* ---- English overlay ---- */
function setField(obj, pathStr, text) {
  const seg = pathStr.split('.'); let cur = obj;
  for (let i = 0; i < seg.length - 1; i++) { cur = cur == null ? undefined : cur[seg[i]]; if (cur == null || typeof cur !== 'object') return 'path not found'; }
  const last = seg[seg.length - 1], v = cur[last];
  if (last === 'enShort' || last === 'en') { cur[last] = text; return null; }
  if (v && typeof v === 'object') { v.en = text; return null; }
  if (typeof v === 'string') { cur[last] = { zh: v, en: text }; return null; }
  return 'field not found';
}
export function mergeEnglish(D, overlays, warn) {
  const idx = new Map(), edge = new Map();
  [D.nodes, D.roots, D.questions, D.debates, D.myths].forEach((l) => (l || []).forEach((o) => { if (!idx.has(o.id)) idx.set(o.id, o); }));
  const threads = new Map((D.threads || []).map((t) => [t.id, t]));
  (D.edges || []).forEach((e) => edge.set(`${e.from}->${e.to}:${e.type}`, e));
  let applied = 0;
  for (const { name, json } of overlays) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) { warn(`en/${name}: not an object, ignored`); continue; }
    for (const [key, fields] of Object.entries(json)) {
      if (key.startsWith('_')) continue;
      const target = idx.get(key) || edge.get(key) || threads.get(key);
      if (!target) { warn(`en/${name}: no node or relation for key "${key}"`); continue; }
      if (!fields || typeof fields !== 'object') { warn(`en/${name}: "${key}" is not an object of fields`); continue; }
      for (const [fp, text] of Object.entries(fields)) {
        if (typeof text !== 'string' || !text) { warn(`en/${name}: ${key}.${fp} is not a non-empty string`); continue; }
        const err = setField(target, fp, text);
        if (err) warn(`en/${name}: ${key}.${fp}: ${err}`); else applied++;
      }
    }
  }
  return applied;
}

/* ---- book links overlay: keep only the two allowed hosts ---- */
const ALLOWED_URL = /^https:\/\/(book\.douban\.com|openlibrary\.org)\//;
function cleanLinks(links, D, warn) {
  const ids = new Set((D.nodes || []).filter((n) => n.type === 'work').map((n) => n.id)), out = {};
  const scrub = (v, where) => {
    if (typeof v === 'string') { if (/^(https?:)?\/\//i.test(v) && !ALLOWED_URL.test(v)) { warn(`book-links: ${where}: URL outside book.douban.com / openlibrary.org removed`); return ''; } return v; }
    if (Array.isArray(v)) return v.map((x, i) => scrub(x, `${where}[${i}]`));
    if (v && typeof v === 'object') { const o = {}; for (const [k, x] of Object.entries(v)) o[k] = scrub(x, `${where}.${k}`); return o; }
    return v;
  };
  for (const [id, entry] of Object.entries(links)) {
    if (!ids.has(id)) { warn(`book-links: "${id}" is not a work in the data, ignored`); continue; }
    out[id] = scrub(entry, id);
  }
  return out;
}

/* ---- covers overlay: data/covers.json { id: { zh, en } } -> D.bookCovers[id] = { zh?, en? }.
   Kept apart from bookLinks so a cover never depends on a link being present; only relative covers/<file> paths pass. ---- */
const COVER_PATH = /^covers\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp)$/;
function cleanCovers(raw, D, warn) {
  const ids = new Set((D.nodes || []).filter((n) => n.type === 'work').map((n) => n.id)), out = {};
  for (const [id, e] of Object.entries(raw)) {
    if (!ids.has(id)) { warn(`covers: "${id}" is not a work in the data, ignored`); continue; }
    if (!e || typeof e !== 'object') { warn(`covers: ${id} is not an object, ignored`); continue; }
    const o = {};
    for (const lang of ['zh', 'en']) {
      const v = e[lang]; if (v == null) continue;
      if (typeof v === 'string' && COVER_PATH.test(v) && !v.includes('..')) o[lang] = v; else warn(`covers: ${id}.${lang}: path not allowed, removed`);
    }
    if (Object.keys(o).length) out[id] = o;
  }
  return out;
}

export function build({ write = true, enDir, linksPath, coversPath } = {}) {
  const parts = readParts(), warnings = [], warn = (m) => warnings.push(m);
  // 1. data must parse and have the expected shape
  const sandbox = { window: {} };
  try {
    vm.runInNewContext(parts.data, sandbox, { filename: 'psychologymap-data.js' });
  } catch (e) {
    throw new Error('data file does not parse (probably mid-edit, retry): ' + e.message);
  }
  const D = sandbox.window.PSYMAP;
  for (const k of ['threads', 'roots', 'nodes', 'edges', 'questions', 'debates', 'myths']) {
    if (!D || !Array.isArray(D[k])) throw new Error('data file lacks array PSYMAP.' + k);
  }
  // 2. overlays (both optional)
  const enPath = enDir || process.env.PSYMAP_EN_DIR || P('data', 'en'), lnkPath = linksPath || process.env.PSYMAP_LINKS || P('data', 'book-links.json');
  let enFiles = 0, enApplied = 0, linkCount = 0, coverCount = 0;
  try {
    if (fs.existsSync(enPath) && fs.statSync(enPath).isDirectory()) {
      const overlays = [];
      for (const f of fs.readdirSync(enPath).filter((x) => x.endsWith('.json')).sort()) {
        try { overlays.push({ name: f, json: JSON.parse(fs.readFileSync(path.join(enPath, f), 'utf8')) }); } catch (e) { warn(`en/${f}: not valid JSON (${e.message}), ignored`); }
      }
      enFiles = overlays.length; enApplied = mergeEnglish(D, overlays, warn);
    }
  } catch (e) { warn('English overlay could not be read: ' + e.message); }
  try {
    if (fs.existsSync(lnkPath)) {
      const raw = JSON.parse(fs.readFileSync(lnkPath, 'utf8'));
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) { D.bookLinks = cleanLinks(raw, D, warn); linkCount = Object.keys(D.bookLinks).length; } else warn('book-links.json is not an object, ignored');
    }
  } catch (e) { warn('book-links.json could not be read (' + e.message + '), ignored'); }
  const cvPath = coversPath || process.env.PSYMAP_COVERS || P('data', 'covers.json');
  try {
    if (fs.existsSync(cvPath)) {
      const raw = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) { const c = cleanCovers(raw, D, warn); if (Object.keys(c).length) D.bookCovers = c; coverCount = Object.values(c).reduce((n, e) => n + Object.keys(e).length, 0); } else warn('covers.json is not an object, ignored');
    }
  } catch (e) { warn('covers.json could not be read (' + e.message + '), ignored'); }
  // 3. app code must be syntactically valid
  const appJs = parts.app.join('\n');
  try {
    new vm.Script(appJs, { filename: 'app.js' });
  } catch (e) {
    throw new Error('app scripts do not parse: ' + e.message);
  }
  const dataText = 'window.PSYMAP=' + JSON.stringify(D) + ';\n';
  // 4. assemble
  const app = `(function(){\n'use strict';\n${appJs}\n})();`;
  const html = parts.template
    .replace(/\{\{LOGO:(\w+)\}\}/g, (m, id) => logoInline(parts.logo, id))
    .replace('{{FAVICON}}', () => faviconUri(parts.logo))
    .replace('/*{{STYLES}}*/', () => safeStyle(parts.css))
    .replace('/*{{DATA}}*/', () => safeScript(dataText))
    .replace('/*{{APP}}*/', () => safeScript(app));
  if (/\{\{(STYLES|DATA|APP|LOGO|FAVICON)\b/.test(html)) throw new Error('template placeholder was not replaced');
  if (write) fs.writeFileSync(OUT, html);
  return { html, app: appJs, data: D, bytes: Buffer.byteLength(html), warnings, overlays: { enFiles, enApplied, linkCount, coverCount } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = build();
    console.log(`built ${path.basename(OUT)}: ${(r.bytes / 1024).toFixed(0)} KB, ${readParts().files.length} app files, data v${r.data.meta && r.data.meta.version}; English overlay: ${r.overlays.enFiles} file(s), ${r.overlays.enApplied} fields; book links: ${r.overlays.linkCount}; covers: ${r.overlays.coverCount}`);
    r.warnings.forEach((w) => console.warn('  warning: ' + w));
  } catch (e) {
    console.error('BUILD FAILED: ' + e.message + '\n(previous output kept)');
    process.exit(1);
  }
}
