// Shared helpers for the book-lookup pipeline (pure functions + paths).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA_FILE = path.join(ROOT, 'data', 'psychologymap-data.js');
export const CACHE_DIR = path.join(ROOT, 'data', 'cache');
export const OUT_FILE = path.join(ROOT, 'data', 'book-links.json');
export const UA = 'psymap-book-lookup/0.1';

export function loadBooks(file = DATA_FILE) {
  const src = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: file });
  const P = sandbox.window.PSYMAP;
  return P.nodes.filter((n) => n.type === 'work');
}

export function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
export function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  for (let i = 0; i < 5; i++) {
    try { fs.renameSync(tmp, file); return; } catch (e) { if (i === 4) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); try { fs.unlinkSync(tmp); } catch { /* ignore */ } } }
  }
}

// Title before a subtitle separator (colon, full-width colon, dash).
export function mainTitle(t) {
  return String(t || '').split(/\s*[:：]\s*|\s+[-–—]+\s+|——/)[0].trim();
}

// Douban suggest matches on title only. Returns ordered query variants
// [{ query, variant }] ('main' = title before subtitle, 'full' = whole title), or null when zhQuery is null.
export function zhQueryVariants(book) {
  if (book.zhQuery === null) return null;
  let full = '';
  const zq = typeof book.zhQuery === 'string' ? book.zhQuery.trim() : '';
  const tz = (book.title?.zh || '').trim();
  if (zq && tz && zq.startsWith(tz)) full = tz;          // "title author" -> title
  else if (zq) full = zq.split(/\s+/)[0];                  // first token is the title
  else full = tz;
  const source = zq ? 'zhQuery' : 'title.zh';
  const out = [];
  const add = (query, variant) => { if (query && !out.some((o) => o.query === query)) out.push({ query, variant, source }); };
  add(mainTitle(full), 'main');
  add(full, 'full');
  if (tz && !zq) add(tz, 'full');
  return out.length ? out : null;
}

export function surname(author) {
  const first = String(author || '').split(/,| and | & /)[0].trim().replace(/\s+(Jr|Sr|II|III)\.?$/i, '').trim();
  const parts = first.split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

// Open Library variants: [{ params: {title, author} | {q}, variant, label }] or null (enRec null).
export function olQueryVariants(book) {
  if (book.enRec === null) return null;
  const r = book.enRec;
  const title = r?.title || (book.lang === 'en' && book.original?.title) || book.title?.en;
  const author = r?.author || book.original?.author || book.author || '';
  if (!title) return null;
  const mt = mainTitle(title), sn = surname(author);
  const v = [{ variant: 'title+surname', params: sn ? { title: mt, author: sn } : { title: mt } }];
  if (sn) v.push({ variant: 'q', params: { q: `${mt} ${sn}` } });
  return v;
}

// Edition selection rule (spec 5.1): among editions judged the same work,
// votes >= 30 -> highest rating; none qualify -> most votes; ties -> newer year.
// Script of a Douban edition, judged from title/subtitle/publisher: 'ja' (contains kana: a Japanese
// original listed on Douban), 'hant' (traditional-only characters: Taiwan/HK edition) or 'hans'.
const KANA = /[぀-ヿ]/;
const HANT = /[與為們這個國學會說時對從實現開關動種體點機發經過還進樣長問間題傳歷戲爾認識療癒夢靈罰藝術書華遊衛讀語論達話應該變頭親愛樂歲層壓斃隻別圖寫濟權歡無記憶兒戰隱強專業師導風飛馬鳥魚當萬與壞讓習慣報處獨戀復據聖醫傷譯聯總誌鬥雙飲聲類驗嚴屬斷歸環雜難離響顧觀計許證試詩誰課調輕運選遞邊鄉錯錢鐵門陽隊階際雖雲電靜須願顯飯館驚鬆麼黃齊齡龍]/;
export function scriptOf(e) {
  const s = [e.title, e.subtitle, e.publisher].filter(Boolean).join(' ');
  if (KANA.test(s)) return 'ja';
  return HANT.test(s) ? 'hant' : 'hans';
}

// Edition choice: Japanese originals are dropped; simplified editions beat traditional ones;
// within a script, editions with >=100 ratings rank by rating, then 30-99 ratings by rating, then the rest by votes.
// Ties: newer year, then more votes. Up to two alternates (remaining simplified first, then traditional).
export function selectEdition(editions) {
  const list = editions.filter(Boolean).filter((e) => scriptOf(e) !== 'ja');
  if (!list.length) return { best: null, alt: [] };
  const v = (e) => e.votes ?? 0, r = (e) => e.rating ?? -1, y = (e) => e.year ?? 0;
  const byRating = (a, b) => r(b) - r(a) || y(b) - y(a) || v(b) - v(a);
  const byVotes = (a, b) => v(b) - v(a) || y(b) - y(a) || r(b) - r(a);
  const rank = (xs) => [
    ...xs.filter((e) => v(e) >= 100).sort(byRating),
    ...xs.filter((e) => v(e) >= 30 && v(e) < 100).sort(byRating),
    ...xs.filter((e) => v(e) < 30).sort(byVotes),
  ];
  const sorted = [...rank(list.filter((e) => scriptOf(e) === 'hans')), ...rank(list.filter((e) => scriptOf(e) === 'hant'))];
  return { best: sorted[0], alt: sorted.slice(1, 3) };
}

const today = () => new Date().toISOString().slice(0, 10);

// Build one book-links.json entry. subjects: array of parsed Douban subjects;
// zhIds: ids the model judged same work; olCands: Open Library candidates; olKey chosen key.
export function buildEntry({ subjects, zhIds, olCands, olKey, model, note, date }) {
  const chosen = (zhIds || []).map((id) => subjects.find((s) => s.doubanId === String(id))).filter(Boolean);
  const { best, alt } = selectEdition(chosen);
  const zh = best && {
    title: best.title ?? null, author: best.author ?? null, translator: best.translator ?? null,
    publisher: best.publisher ?? null, year: best.year ?? null, doubanId: best.doubanId,
    url: `https://book.douban.com/subject/${best.doubanId}/`, rating: best.rating ?? null, votes: best.votes ?? null,
    alt: alt.map((e) => ({ title: e.title ?? null, publisher: e.publisher ?? null, year: e.year ?? null,
      url: `https://book.douban.com/subject/${e.doubanId}/`, rating: e.rating ?? null, votes: e.votes ?? null,
      ...(scriptOf(e) === 'hant' ? { script: 'hant' } : {}) })),
    ...(scriptOf(best) === 'hant' ? { script: 'hant' } : {}),
  };
  const oc = olKey ? (olCands || []).find((c) => c.key === olKey) : null;
  const en = oc && {
    title: oc.title ?? null, author: (Array.isArray(oc.author) ? oc.author.join(', ') : oc.author) ?? null,
    openLibrary: `https://openlibrary.org${oc.key.startsWith('/') ? '' : '/works/'}${oc.key}`,
    firstPublished: oc.firstPublished ?? null,
  };
  // sameWork: every Douban id the model judged to be this work, so the edition can be re-chosen without asking again.
  return { zh: zh || null, en: en || null, matchedBy: model, matchNote: note || '', fetchedAt: date || today(), sameWork: chosen.map((s) => s.doubanId) };
}
