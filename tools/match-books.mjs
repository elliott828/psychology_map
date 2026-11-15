// Stage 2: ask DeepSeek which cached candidates are the same work, then select editions by rule
// and write data/book-links.json.
// Usage: node tools/match-books.mjs [--force] [--only <workId>] [--limit N]
// Key: env DEEPSEEK_API_KEY or tools/.env. Without a key: prints one line and exits 0.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CACHE_DIR, OUT_FILE, loadBooks, readJson, writeJson, buildEntry } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MODEL = 'deepseek-chat';
const ENDPOINT = 'https://api.deepseek.com/chat/completions';

function getKey() {
  if (process.env.DEEPSEEK_API_KEY?.trim()) return process.env.DEEPSEEK_API_KEY.trim();
  try {
    const m = fs.readFileSync(path.join(HERE, '.env'), 'utf8').match(/^\s*DEEPSEEK_API_KEY\s*=\s*(.*)$/m);
    const v = m && m[1].trim().replace(/^["']|["']$/g, '');
    if (v) return v;
  } catch { /* no .env */ }
  return null;
}

const SYSTEM = `You are a careful bibliographic matcher. You receive one book (original title/author, a recommended English edition, and the Chinese search string) plus candidate records: Douban entries (Chinese editions) and Open Library work entries. Decide:
1. "zh": the Douban candidate ids that are Chinese editions of the SAME work (different publishers, translators and reprints of the same work all count; account for translated author names and title variants). Exclude abridged selections, anthologies that merely include the work, other works by the same author, study guides, and unrelated books.
2. "en": the single Open Library work key (e.g. "/works/OL123W") that is this work, or null.
Reply with JSON only: {"zh": ["id", ...], "en": "key or null", "note": "one short sentence of reasoning"}. Use only ids/keys that appear in the candidates.`;

let SECRET = '';
const scrub = (msg) => (SECRET ? String(msg).split(SECRET).join('[key]') : String(msg)).replace(/Bearer\s+\S+/gi, 'Bearer [key]');
let CALLS = 0;
async function ask(key, payload) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 2000 * 3 ** (attempt - 1)));
    try {
      CALLS++;
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: MODEL, temperature: 0, response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: JSON.stringify(payload) }],
        }),
      });
      if (res.status === 401 || res.status === 403) throw Object.assign(new Error(`DeepSeek rejected the key (HTTP ${res.status})`), { fatal: true });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      return JSON.parse(j.choices[0].message.content);
    } catch (e) {
      if (e.fatal) throw e;
      lastErr = new Error(scrub(e.message));
    }
  }
  throw new Error(`DeepSeek request failed after 3 tries: ${scrub(lastErr?.message)}`);
}

export function parseAnswer(ans, subjects, olCands) {
  const ids = new Set(subjects.map((s) => s.doubanId));
  const keys = new Set(olCands.map((c) => c.key));
  const zh = Array.isArray(ans?.zh) ? ans.zh.map(String).filter((i) => ids.has(i)) : [];
  const en = typeof ans?.en === 'string' && keys.has(ans.en) ? ans.en : null;
  return { zh, en, note: typeof ans?.note === 'string' ? ans.note.slice(0, 300) : '' };
}

// Works whose enRec could not be matched to an Open Library work, or whose matched work disagrees with `original`.
export function writeEnrecCheck(books, out) {
  const unmatched = [], disagree = [];
  for (const b of books) {
    if (b.enRec === null || b.enRec === undefined) continue;
    const rec = readJson(path.join(CACHE_DIR, 'books', `${b.id}.json`));
    if (!rec || rec.en?.skipped) continue;
    const e = out[b.id];
    const en = e?.en;
    if (!en) {
      const cands = rec.en?.candidates ?? [];
      unmatched.push({ id: b.id, enRec: b.enRec, searched: rec.en?.tried ?? null, candidates: cands, reason: !cands.length ? 'no Open Library candidates' : e ? 'model matched none of the candidates' : 'not matched' });
      continue;
    }
    const issues = [];
    const oy = b.original?.year;
    if (oy && en.firstPublished && Math.abs(oy - en.firstPublished) >= 3) issues.push(`first published ${en.firstPublished} on Open Library vs original.year ${oy}`);
    const sn = (b.original?.author || b.enRec?.author || '').split(/,| and | & /)[0].trim().split(/\s+/).pop()?.toLowerCase();
    if (sn && /^[a-z'.-]+$/.test(sn) && !String(en.author || '').toLowerCase().includes(sn)) issues.push(`author "${en.author}" does not contain "${sn}" (original author "${b.original?.author}")`);
    if (issues.length) disagree.push({ id: b.id, enRec: b.enRec, original: b.original, openLibrary: en, issues });
  }
  writeJson(path.join(CACHE_DIR, 'enrec-check.json'), { generated: new Date().toISOString().slice(0, 10), unmatched, disagree });
  console.log(`enrec-check.json: ${unmatched.length} unmatched, ${disagree.length} disagreeing`);
}

// --reselect: re-choose the Chinese edition from each entry's saved `sameWork` ids and the cached
// Douban pages, after a change to selectEdition. No DeepSeek calls, no network.
function reselect() {
  const out = readJson(OUT_FILE, {});
  let changed = 0;
  for (const [id, e] of Object.entries(out)) {
    if (!Array.isArray(e.sameWork)) continue;
    const subjects = e.sameWork.map((d) => readJson(path.join(CACHE_DIR, 'douban', `${d}.json`))).filter((s) => s && !s.missing).map(({ raw, fetchedAt, ...s }) => s);
    const fresh = buildEntry({ subjects, zhIds: e.sameWork, olCands: [], olKey: null, model: e.matchedBy, note: e.matchNote, date: e.fetchedAt });
    if ((fresh.zh?.doubanId ?? null) !== (e.zh?.doubanId ?? null)) { changed++; console.log(`${id}: ${e.zh?.doubanId ?? '-'} -> ${fresh.zh?.doubanId ?? '-'}`); }
    e.zh = fresh.zh;
  }
  writeJson(OUT_FILE, out);
  console.log(`Reselected. ${changed} edition(s) changed. Output: data/book-links.json`);
}

async function main() {
  if (process.argv.includes('--reselect')) return reselect();
  const key = getKey();
  SECRET = key || '';
  if (!key) {
    console.log('No DeepSeek key found (set DEEPSEEK_API_KEY or put it in tools/.env); skipping the match stage. See tools/README.md.');
    return;
  }
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  let books = loadBooks();
  if (arg('--only')) books = books.filter((b) => b.id === arg('--only'));
  if (arg('--limit')) books = books.slice(0, +arg('--limit'));
  const out = readJson(OUT_FILE, {});
  const fullRun = !arg('--only') && !arg('--limit');
  let asked = 0, kept = 0, none = 0;
  for (const b of books) {
    const rec = readJson(path.join(CACHE_DIR, 'books', `${b.id}.json`));
    if (!rec) continue;
    if (out[b.id] && !force) { kept++; continue; }
    const subjects = (rec.zh?.suggest || []).slice(0, 5).map((c) => readJson(path.join(CACHE_DIR, 'douban', `${c.id}.json`))).filter((s) => s && !s.missing)
      .map(({ raw, fetchedAt, ...s }) => s);
    const olCands = rec.en?.candidates || [];
    if (!subjects.length && !olCands.length) { none++; continue; }
    // Public bibliographic data only.
    const payload = {
      book: { original: b.original ?? null, enRec: b.enRec ?? null, zhQuery: b.zhQuery ?? rec.zh?.query ?? null, title: b.title, author: b.author, year: b.year },
      douban: subjects.map((s) => ({ id: s.doubanId, title: s.title, subtitle: s.subtitle, author: s.author, translator: s.translator, publisher: s.publisher, year: s.year, isbn: s.isbn })),
      openLibrary: olCands,
    };
    let ans;
    try { ans = await ask(key, payload); } catch (e) {
      console.log(`${b.id}: ${scrub(e.message)}`);
      if (e.fatal) break;
      continue;
    }
    const { zh, en, note } = parseAnswer(ans, subjects, olCands);
    out[b.id] = buildEntry({ subjects, zhIds: zh, olCands, olKey: en, model: MODEL, note });
    asked++;
    writeJson(OUT_FILE, out);
    console.log(`${b.id}: zh ${out[b.id].zh ? out[b.id].zh.doubanId : '-'}, en ${out[b.id].en ? 'yes' : '-'}`);
  }
  if (fullRun) writeEnrecCheck(loadBooks(), out);
  console.log(`DeepSeek calls this run: ${CALLS}`);
  console.log(`Done. asked ${asked}, kept ${kept}, no candidates ${none}. Output: data/book-links.json`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
