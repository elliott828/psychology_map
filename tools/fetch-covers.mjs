// Stage 3: download small cover thumbnails for the books in data/book-links.json.
// Usage: node tools/fetch-covers.mjs [--only <workId>] [--limit N] [--force] [--no-zh]
// --no-zh: Open Library only; never contacts book.douban.com or doubanio.com.
// Polite client: single-threaded, honest UA, no cookies, no Referer, no spoofed headers.
// Gaps: >= 2.5 s between requests to book.douban.com, >= 1 s to every other host.
// A 403/418/429, captcha or login page stops all further requests to that host for the run.
// Writes covers/<workId>.zh.jpg|.en.jpg and data/covers.json; lookups are cached in data/cache/covers/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, CACHE_DIR, UA, OUT_FILE, readJson, writeJson } from './lib.mjs';

export const COVERS_DIR = path.join(ROOT, 'covers');
export const COVERS_JSON = path.join(ROOT, 'data', 'covers.json');
const LOOKUP_DIR = path.join(CACHE_DIR, 'covers');
const LOG_FILE = path.join(ROOT, 'tools', 'covers.log');
const MIN_BYTES = 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---- pure helpers (selftested) ---- */

// The cover image URL on a Douban subject page, or null (no cover / Douban's default placeholder).
export function extractDoubanCover(html) {
  const s = String(html || '');
  const m = s.match(/<a[^>]*\bclass="[^"]*\bnbg\b[^"]*"[^>]*\bhref="([^"]+)"/i) || s.match(/<a[^>]*\bhref="([^"]+)"[^>]*\bclass="[^"]*\bnbg\b/i)
    || s.match(/id="mainpic"[\s\S]{0,800}?<img[^>]*\bsrc="([^"]+)"/i);
  if (!m) return null;
  let u = m[1].replace(/&amp;/g, '&').trim();
  if (u.startsWith('//')) u = 'https:' + u;
  u = u.replace(/^http:\/\//i, 'https://');
  if (/book-default/i.test(u)) return null;
  try { const h = new URL(u).hostname; if (!/(^|\.)doubanio\.com$/i.test(h)) return null; } catch { return null; }
  return u;
}
// Same image at another size: size is one of 'm', 's', 'l'.
export function doubanSize(url, size) { return url.replace(/\/view\/subject\/[lsm]\//, `/view/subject/${size}/`); }
// "/works/OL123W" or an Open Library work URL -> "/works/OL123W", else null.
export function workKeyOf(url) { const m = String(url || '').match(/^https:\/\/openlibrary\.org(\/works\/OL\d+W)\/?$/); return m ? m[1] : null; }
// First positive id in the `covers` array of an Open Library work record.
export function firstCoverId(json) { const c = json && Array.isArray(json.covers) ? json.covers.find((x) => Number.isInteger(x) && x > 0) : null; return c || null; }

/* ---- polite client ---- */
class Blocked extends Error {}
const BLOCK_STATUS = new Set([403, 418, 429]);
const BLOCK_BODY = /sec\.douban\.com|accounts\.douban\.com\/(passport|login)|异常请求|检测到有异常|captcha|验证码|<title>\s*登录/i;
const groupOf = (host) => (/(^|\.)doubanio\.com$/.test(host) ? 'doubanio.com' : /(^|\.)archive\.org$/.test(host) ? 'archive.org' : host);
const gapOf = (group) => (group === 'book.douban.com' ? 2500 : 1000);
const lastReq = new Map();
const blockedHosts = new Map(); // group -> reason

function log(msg) {
  console.log(msg);
  try { fs.appendFileSync(LOG_FILE, msg + '\n'); } catch { /* ignore */ }
}

// One request. Follows at most 3 redirects, only inside the same host group
// (covers.openlibrary.org may hand over to archive.org, which holds the files).
async function get(url, { binary = false } = {}) {
  let cur = url;
  for (let hop = 0; hop < 4; hop++) {
    const u = new URL(cur);
    if (u.protocol !== 'https:') return { status: 0, error: 'non-https URL' };
    const group = groupOf(u.hostname);
    if (blockedHosts.has(group)) throw new Blocked(`${group} already blocked: ${blockedHosts.get(group)}`);
    const wait = (lastReq.get(group) || 0) + gapOf(group) - Date.now();
    if (wait > 0) await sleep(wait);
    lastReq.set(group, Date.now());
    let res;
    try {
      res = await fetch(cur, { headers: { 'User-Agent': UA }, redirect: 'manual', signal: AbortSignal.timeout(30000) });
    } catch (e) { return { status: 0, error: String(e.cause?.code || e.message) }; }
    const location = res.headers.get('location') || '';
    if (BLOCK_STATUS.has(res.status)) { const why = `HTTP ${res.status} from ${cur}`; blockedHosts.set(group, why); throw new Blocked(why); }
    if (res.status >= 300 && res.status < 400 && location) {
      if (/login|passport|sec\.douban|misc\/sorry/i.test(location)) { const why = `redirect to login/verification (${location}) from ${cur}`; blockedHosts.set(group, why); throw new Blocked(why); }
      const next = new URL(location, cur);
      const ng = groupOf(next.hostname);
      const okHop = ng === group || (group === 'covers.openlibrary.org' && ng === 'archive.org');
      if (!okHop) return { status: res.status, error: `redirect to ${next.hostname} not followed` };
      cur = next.href; continue;
    }
    const type = res.headers.get('content-type') || '';
    if (binary) { const buf = Buffer.from(await res.arrayBuffer()); return { status: res.status, type, buf }; }
    const text = await res.text();
    if (group === 'book.douban.com') {
      const normal = /property="v:itemreviewed"|<div id="info"|id="mainpic"/.test(text);
      if (!normal && BLOCK_BODY.test(text.slice(0, 20000))) { const why = `captcha/login page from ${cur}`; blockedHosts.set(group, why); throw new Blocked(why); }
    }
    return { status: res.status, type, text };
  }
  return { status: 0, error: 'too many redirects' };
}

/* ---- per-side lookups: return { url } | { none: true } | { failed: reason } ---- */
async function lookupZh(doubanId) {
  const r = await get(`https://book.douban.com/subject/${doubanId}/`);
  if (r.error) return { failed: r.error };
  if (r.status === 404 || r.status === 410) return { none: true };
  if (r.status !== 200) return { failed: `HTTP ${r.status}` };
  const u = extractDoubanCover(r.text);
  if (u) return { url: u };
  return /property="v:itemreviewed"|<div id="info"|id="mainpic"/.test(r.text) ? { none: true } : { failed: 'unrecognised page' };
}
async function lookupEn(workKey) {
  const r = await get(`https://openlibrary.org${workKey}.json`);
  if (r.error) return { failed: r.error };
  if (r.status === 404) return { none: true };
  if (r.status !== 200) return { failed: `HTTP ${r.status}` };
  let j; try { j = JSON.parse(r.text); } catch { return { failed: 'bad JSON' }; }
  const id = firstCoverId(j);
  return id ? { url: `https://covers.openlibrary.org/b/id/${id}-M.jpg` } : { none: true };
}

// Download an image URL. Returns { buf } | { none: true } | { failed }.
async function download(url) {
  const r = await get(url, { binary: true });
  if (r.error) return { failed: r.error };
  if (r.status === 404) return { notFound: true };
  if (r.status !== 200) return { failed: `HTTP ${r.status}` };
  if (!/^image\//i.test(r.type) || r.buf.length < MIN_BYTES) return { none: true };
  return { buf: r.buf };
}
function saveFile(file, buf) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp'; fs.writeFileSync(tmp, buf); fs.renameSync(tmp, file);
}

async function main() {
  const args = process.argv.slice(2);
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const force = args.includes('--force'), noZh = args.includes('--no-zh');
  const links = readJson(OUT_FILE, {});
  let ids = Object.keys(links);
  if (arg('--only')) ids = ids.filter((i) => i === arg('--only'));
  if (arg('--limit')) ids = ids.slice(0, +arg('--limit'));
  fs.mkdirSync(LOOKUP_DIR, { recursive: true }); fs.mkdirSync(COVERS_DIR, { recursive: true });
  log(`\n=== ${new Date().toISOString()} fetch-covers: ${ids.length} books${force ? ' (force)' : ''}`);
  const stat = { zh: { downloaded: 0, none: 0, failed: 0, existing: 0, blocked: 0 }, en: { downloaded: 0, none: 0, failed: 0, existing: 0, blocked: 0 } };

  async function side(id, lang, key, lookup, sizes) {
    const file = path.join(COVERS_DIR, `${id}.${lang}.jpg`), S = stat[lang];
    if (!force && fs.existsSync(file)) { S.existing++; return; }
    // a host that refused us is left alone for the rest of the run (zh needs both Douban hosts)
    if (lang === 'zh' && (blockedHosts.has('doubanio.com') || blockedHosts.has('book.douban.com'))) { S.blocked++; return; }
    const cfile = path.join(LOOKUP_DIR, `${id}.json`), cache = readJson(cfile, {}) || {};
    let rec = !force && cache[lang] && cache[lang].key === key ? cache[lang] : null;
    try {
      if (!rec) {
        const r = await lookup(key);
        if (r.failed) { S.failed++; log(`  ${id} ${lang}: lookup failed (${r.failed})`); return; }
        rec = { key, url: r.url || null, fetchedAt: new Date().toISOString() };
        cache[lang] = rec; writeJson(cfile, cache);
      }
      if (!rec.url) { S.none++; log(`  ${id} ${lang}: no cover`); return; }
      let got = null;
      for (const u of sizes(rec.url)) {
        const d = await download(u);
        if (d.buf) { got = d; break; }
        if (d.failed) { S.failed++; log(`  ${id} ${lang}: download failed (${d.failed})`); return; }
        // notFound or not-an-image: try the next size
      }
      if (!got) { S.none++; log(`  ${id} ${lang}: no usable image`); return; }
      saveFile(file, got.buf); S.downloaded++; log(`  ${id} ${lang}: ok ${got.buf.length} bytes`);
    } catch (e) {
      if (!(e instanceof Blocked)) throw e;
      S.blocked++; // already recorded in blockedHosts; later requests to that host throw immediately
    }
  }

  let i = 0;
  for (const id of ids) {
    i++;
    const l = links[id] || {};
    log(`[${i}/${ids.length}] ${id}`);
    if (!noZh && l.zh && l.zh.doubanId) await side(id, 'zh', String(l.zh.doubanId), lookupZh, (u) => [doubanSize(u, 'm'), doubanSize(u, 's')]);
    const wk = l.en && workKeyOf(l.en.openLibrary);
    if (wk) await side(id, 'en', wk, lookupEn, (u) => [u]);
    if (blockedHosts.size) { /* keep going: the blocked host is skipped, the other still runs */ }
  }

  // covers.json lists only files that exist (for every book, not only this run's selection)
  const out = {};
  for (const id of Object.keys(links)) {
    const e = {};
    for (const lang of ['zh', 'en']) if (fs.existsSync(path.join(COVERS_DIR, `${id}.${lang}.jpg`))) e[lang] = `covers/${id}.${lang}.jpg`;
    if (Object.keys(e).length) out[id] = e;
  }
  writeJson(COVERS_JSON, out);
  let bytes = 0; for (const f of fs.readdirSync(COVERS_DIR)) { try { bytes += fs.statSync(path.join(COVERS_DIR, f)).size; } catch { /* ignore */ } }
  log(`\nSummary: ${JSON.stringify(stat)}`);
  log(`covers.json: ${Object.keys(out).length} books, covers/ total ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  for (const [g, why] of blockedHosts) log(`HOST REFUSED: ${g} (${why}); requests to it were stopped`);
  log('Done.');
  process.exitCode = blockedHosts.size ? 2 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
