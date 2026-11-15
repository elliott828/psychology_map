/* Reading path (pure, no DOM): what to read before and after a theory or school.
   Direction conventions in the data: develops/branches/merges/bridges/feeds/reacts run earlier -> later
   (for reacts: the opposed one -> the reacting one); critiques run critic -> criticised. */

const DEPTH_RANK = { easy: 0, medium: 1, hard: 2 };
const doubanRating = (I, w) => { const l = I.links && I.links[w.id]; return l && l.zh && typeof l.zh.rating === 'number' ? l.zh.rating : -1; };
/* easiest first, then higher Douban rating, then earlier year */
const bookOrder = (I) => (a, b) => (DEPTH_RANK[a.depth] ?? 1) - (DEPTH_RANK[b.depth] ?? 1) || doubanRating(I, b) - doubanRating(I, a) || (a.year || 0) - (b.year || 0) || (a.id < b.id ? -1 : 1);
const ratingOrder = (I) => (a, b) => doubanRating(I, b) - doubanRating(I, a) || (a.year || 0) - (b.year || 0) || (a.id < b.id ? -1 : 1);

/* the books that speak of a node: `own` (cite the theory, or the school) and `fallback` (the theory's school) */
function bookPool(I, n) {
  if (!n) return { own: [], fallback: [] };
  if (n.type === 'theory') return { own: (I.worksOfTheory.get(n.id) || []).slice(), fallback: (I.worksOf.get(n.school) || []).slice() };
  if (n.type === 'school') return { own: I.schoolWorks(n.id), fallback: [] };
  return { own: [], fallback: [] };
}
function pickBook(I, n, used) {
  const pool = bookPool(I, n), cand = pool.own.length ? pool.own : pool.fallback;
  if (!cand.length) return null;
  let free = cand.filter((w) => !used.has(w.id));
  if (!free.length && pool.own.length) free = pool.fallback.filter((w) => !used.has(w.id));
  return free.length ? free.slice().sort(bookOrder(I))[0] : null;
}

/* classify an edge relative to a node: where is the other end, up or down, and what to call it */
function classifyEdge(e, selfs) {
  const toSelf = selfs.has(e.to), fromSelf = selfs.has(e.from);
  if (toSelf === fromSelf) return null;
  if (toSelf) return e.type === 'critiques' ? { other: e.from, dir: 'down', kind: 'critic' } : { other: e.from, dir: 'up', kind: e.type === 'reacts' ? 'opposes' : e.type };
  return e.type === 'critiques' ? { other: e.to, dir: 'up', kind: 'critiques' } : { other: e.to, dir: 'down', kind: e.type };
}

function readingPath(I, id) {
  const n = I.get(id); if (!n || (n.type !== 'theory' && n.type !== 'school')) return null;
  const sid = n.type === 'school' ? n.id : n.school, school = I.get(sid);
  // own ladder first, so that up/down books can avoid repeating it
  const pool = bookPool(I, n), ladder = []; const used = new Set();
  DEPTH_ORDER.forEach((d) => {
    let w = pool.own.filter((x) => x.depth === d).sort(ratingOrder(I))[0], via = false;
    if (!w) { w = pool.fallback.filter((x) => x.depth === d).sort(ratingOrder(I))[0]; via = !!w; }
    if (w) { ladder.push({ depth: d, id: w.id, viaSchool: via }); used.add(w.id); }
  });
  const collect = (edges, selfs) => edges.map((e) => { const c = classifyEdge(e, selfs); return c && c.other !== n.id && !mine.has(c.other) && I.get(c.other) ? Object.assign(c, { edge: e }) : null; }).filter(Boolean);
  const mine = new Set([sid].concat((I.theoriesOf.get(sid) || []).map((x) => x.id)));
  const touching = []; mine.forEach((m) => (I.edgesOf.get(m) || []).forEach((e) => { if (!touching.includes(e)) touching.push(e); }));
  const direct = n.type === 'theory' ? collect(I.edgesOf.get(n.id) || [], new Set([n.id])) : collect(touching, mine);
  const viaSchool = n.type === 'theory' ? collect(I.schoolEdges.filter((e) => e.from === sid || e.to === sid), new Set([sid])) : [];
  let ups = direct.filter((c) => c.dir === 'up');
  if (!ups.length) ups = viaSchool.filter((c) => c.dir === 'up');
  const downs = direct.concat(viaSchool).filter((c) => c.dir === 'down');
  const seen = (list) => { const m = new Set(); return list.filter((c) => (m.has(c.other) ? false : (m.add(c.other), true))); };
  const refYear = n.year != null ? n.year : (school && school.year) || 0;
  const finish = (list) => {
    const items = seen(list).map((c) => { const o = I.get(c.other); return { id: o.id, rel: c.kind, year: o.year != null ? o.year : 0, bookless: !bookPool(I, o).own.length && !bookPool(I, o).fallback.length }; });
    // keep three: those that have a book first, then those closest in time
    const keep = items.sort((a, b) => (a.bookless - b.bookless) || (Math.abs(a.year - refYear) - Math.abs(b.year - refYear))).slice(0, 3).sort((a, b) => a.year - b.year || (a.id < b.id ? -1 : 1));
    return keep.map((it) => { const b = pickBook(I, I.get(it.id), used); if (b) used.add(b.id); return { id: it.id, rel: it.rel, year: it.year, book: b ? b.id : null }; });
  };
  const up = finish(ups), down = finish(downs);
  return { id: n.id, type: n.type, school: sid, up, down, ladder };
}

/* every theory and school can be asked for a path; used by the reading page's picker */
const pathTargets = (I) => I.of.school.concat(I.of.theory);
