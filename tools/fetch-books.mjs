// Stage 1: fetch Douban candidates + Open Library candidates into data/cache/.
// Usage: node tools/fetch-books.mjs [--limit N] [--only <workId>]
// Polite client: single-threaded, >= 2.5 s between requests, honest UA, no cookies.
// Stops the Douban stage on 403/418/429, captcha or login pages. Resumable.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR, UA, loadBooks, readJson, writeJson, zhQueryVariants, olQueryVariants } from './lib.mjs';

const STRATEGY = 2; // v2: Douban title-only queries; Open Library main title + surname

const GAP_MS = 2500;
const TOP_N = 5;
const SUBJ_DIR = path.join(CACHE_DIR, 'douban');
const BOOK_DIR = path.join(CACHE_DIR, 'books');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastReq = 0;

class Blocked extends Error {}

async function get(url) {
  const wait = lastReq + GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastReq = Date.now();
  let res;
  try {
    res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
  } catch (e) {
    return { status: 0, text: '', error: String(e.cause?.code || e.message) };
  }
  const text = await res.text();
  return { status: res.status, text, location: res.headers.get('location') || '' };
}

const BLOCK_STATUS = new Set([403, 418, 429]);
const BLOCK_BODY = /sec\.douban\.com|accounts\.douban\.com\/(passport|login)|异常请求|captcha|验证码|<title>\s*登录/i;
function checkBlock(r, url, host) {
  if (BLOCK_STATUS.has(r.status)) throw new Blocked(`HTTP ${r.status} from ${url}`);
  if (host === 'douban') {
    if (r.status >= 300 && r.status < 400 && /login|passport|sec\.douban|misc\/sorry/i.test(r.location)) throw new Blocked(`redirect to login/verification (${r.location}) from ${url}`);
    // Normal pages also contain a login link in the nav bar; only a page without book content counts.
    const looksNormal = /property="v:itemreviewed"|<div id="info"|^\s*[\[{]/.test(r.text) && r.text.length > 20000 || /^\s*[\[{]/.test(r.text);
    if (!looksNormal && BLOCK_BODY.test(r.text.slice(0, 20000))) throw new Blocked(`captcha/login page from ${url}`);
  }
}

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
const strip = (s) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

// Parse a Douban subject page. Missing fields -> null. Keeps trimmed raw HTML for later re-parsing.
export function parseSubject(html, id) {
  const pick = (re) => { const m = html.match(re); return m ? m[1] : null; };
  const infoHtml = pick(/(<div id="info"[\s\S]*?<\/div>)/);
  const h1Html = pick(/(<h1[\s\S]*?<\/h1>)/);
  const ratingHtml = pick(/(<div class="rating_wrap[\s\S]*?<div class="rating_sum"[\s\S]*?<\/div>)/) ?? pick(/(<div class="rating_self[\s\S]{0,1500})/);
  const out = { doubanId: String(id), title: null, subtitle: null, author: null, translator: null, publisher: null, year: null, isbn: null, rating: null, votes: null,
    raw: { h1: h1Html, info: infoHtml, rating: ratingHtml } };
  const t = pick(/<span[^>]*property="v:itemreviewed"[^>]*>([\s\S]*?)<\/span>/);
  out.title = (t ? strip(t) : h1Html ? strip(h1Html) : '') || null;
  if (infoHtml) {
    const fields = {};
    for (const seg of infoHtml.replace(/^<div id="info"[^>]*>/, '').split(/<br\s*\/?>/i)) {
      const line = strip(seg).replace(/<\/div>/g, '');
      const m = line.match(/^([^:：]{1,10})\s*[:：]\s*(.*)$/);
      if (m && m[2]) fields[m[1].trim()] = m[2].replace(/\s*\/\s*/g, ' / ').trim();
    }
    out.subtitle = fields['副标题'] ?? null;
    out.author = fields['作者'] ?? null;
    out.translator = fields['译者'] ?? null;
    out.publisher = fields['出版社'] ?? null;
    const ym = (fields['出版年'] || fields['出版时间'] || '').match(/(\d{4})/);
    out.year = ym ? +ym[1] : null;
    const isbn = fields['ISBN'];
    out.isbn = isbn && /\d/.test(isbn) ? isbn.replace(/\s/g, '') : null;
  }
  const rt = pick(/<strong[^>]*class="[^"]*rating_num[^"]*"[^>]*>\s*([\d.]+)\s*<\/strong>/) ?? pick(/property="v:average"[^>]*>\s*([\d.]+)\s*</);
  out.rating = rt && +rt > 0 ? +rt : null;
  const vt = pick(/property="v:votes"[^>]*>\s*(\d+)\s*</);
  out.votes = vt ? +vt : null;
  return out;
}

async function fetchSubject(id) {
  const file = path.join(SUBJ_DIR, `${id}.json`);
  if (fs.existsSync(file)) return;
  const url = `https://book.douban.com/subject/${id}/`;
  const r = await get(url);
  checkBlock(r, url, 'douban');
  if (r.status === 404 || r.status === 410) { writeJson(file, { doubanId: String(id), missing: true, status: r.status, fetchedAt: new Date().toISOString() }); return; }
  if (r.status !== 200) { console.log(`  ! subject ${id}: HTTP ${r.status}${r.error ? ' ' + r.error : ''} (not cached, retried next run)`); return; }
  const s = parseSubject(r.text, id);
  s.fetchedAt = new Date().toISOString();
  writeJson(file, s);
}

async function doubanStage(book, rec, save) {
  const variants = zhQueryVariants(book);
  if (!variants) { rec.zh = { skipped: 'zhQuery is null (no Chinese edition)' }; return; }
  if (rec.zh?.strategy === STRATEGY && rec.zh.suggest && rec.zh.tried?.[0] === variants[0].query && (rec.zh.suggest.length || rec.zh.tried.length >= variants.length)) {
    // cached
  } else {
    const tried = [];
    let found = null, result = [];
    for (const v of variants) {
      const url = `https://book.douban.com/j/subject_suggest?q=${encodeURIComponent(v.query)}`;
      const r = await get(url);
      checkBlock(r, url, 'douban');
      let arr = null;
      try { arr = JSON.parse(r.text); } catch { /* handled below */ }
      if (r.status !== 200 || !Array.isArray(arr)) {
        if (r.status === 200) throw new Blocked(`non-JSON answer from suggest endpoint for "${v.query}"`);
        console.log(`  ! suggest HTTP ${r.status}${r.error ? ' ' + r.error : ''} (retried next run)`); return;
      }
      tried.push(v.query);
      result = arr.filter((c) => c && c.id && (!c.type || c.type === 'b')).map((c) => ({ id: String(c.id), title: c.title ?? null, author_name: c.author_name ?? null, year: c.year ?? null, url: c.url ?? null }));
      if (result.length) { found = v; break; }
    }
    rec.zh = { strategy: STRATEGY, query: (found || variants[variants.length - 1]).query, variant: found ? found.variant : null, querySource: variants[0].source, tried, suggest: result, fetchedAt: new Date().toISOString() };
    save();
  }
  for (const c of rec.zh.suggest.slice(0, TOP_N)) await fetchSubject(c.id);
}

async function olStage(book, rec) {
  const variants = olQueryVariants(book);
  if (!variants) { rec.en = { skipped: 'enRec is null or no English title' }; return; }
  const sig = JSON.stringify(variants[0].params);
  if (rec.en?.strategy === STRATEGY && rec.en.sig === sig && rec.en.candidates) return;
  const tried = [];
  let cands = [], found = null;
  for (const v of variants) {
    const params = new URLSearchParams({ ...v.params, limit: '5', fields: 'key,title,author_name,first_publish_year,edition_count' });
    const url = `https://openlibrary.org/search.json?${params}`;
    const r = await get(url);
    checkBlock(r, url, 'ol');
    let j = null; try { j = JSON.parse(r.text); } catch { /* handled below */ }
    if (r.status !== 200 || !j) { console.log(`  ! OL HTTP ${r.status}${r.error ? ' ' + r.error : ''} (retried next run)`); return; }
    tried.push(v.params);
    cands = (j.docs || []).slice(0, 5).map((d) => ({ key: d.key, title: d.title ?? null, author: d.author_name ?? null, firstPublished: d.first_publish_year ?? null, editions: d.edition_count ?? null }));
    if (cands.length) { found = v; break; }
  }
  rec.en = { strategy: STRATEGY, sig, variant: found ? found.variant : null, tried, fetchedAt: new Date().toISOString(), candidates: cands };
}

async function main() {
  const args = process.argv.slice(2);
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  let books = loadBooks();
  if (arg('--only')) books = books.filter((b) => b.id === arg('--only'));
  if (arg('--limit')) books = books.slice(0, +arg('--limit'));
  fs.mkdirSync(BOOK_DIR, { recursive: true }); fs.mkdirSync(SUBJ_DIR, { recursive: true });
  const recs = new Map();
  const load = (b) => { if (!recs.has(b.id)) recs.set(b.id, readJson(path.join(BOOK_DIR, `${b.id}.json`), { id: b.id })); return recs.get(b.id); };
  const save = (b) => writeJson(path.join(BOOK_DIR, `${b.id}.json`), load(b));

  console.log(`${books.length} books. Douban stage...`);
  let blocked = null;
  try {
    let i = 0;
    for (const b of books) {
      i++;
      console.log(`[${i}/${books.length}] ${b.id}`);
      await doubanStage(b, load(b), () => save(b));
      save(b);
    }
  } catch (e) {
    if (!(e instanceof Blocked)) throw e;
    blocked = e.message;
    console.log(`\nSTOPPED Douban stage: ${blocked}`);
  }
  console.log('Open Library stage...');
  try {
    let i = 0;
    for (const b of books) {
      i++;
      const rec = load(b);
      console.log(`[OL ${i}/${books.length}] ${b.id}`);
      await olStage(b, rec);
      save(b);
    }
  } catch (e) {
    if (!(e instanceof Blocked)) throw e;
    console.log(`\nSTOPPED Open Library stage: ${e.message}`);
  }
  console.log(blocked ? `Finished; Douban stopped early: ${blocked}` : 'Done.');
  process.exitCode = blocked ? 2 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
