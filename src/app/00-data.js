/* Data adapter: builds every index once. The rest of the page reads data only through this. Pure (no DOM). */

// Display palette for the dark ground (approved in the prototype). Thread ids are fixed by the framework;
// an unknown thread falls back to the colour in the data file.
const PALETTE = { bio: '#3987e5', behavior: '#d95926', cognition: '#199e70', difference: '#c98500', development: '#d55181', social: '#0ca30c', humanistic: '#9085e9', depth: '#e66767', clinical: '#12a4b8' };
const NEUTRAL = '#8fa3bd';
const BIRTH = 1879, FRONT = 2010, WEIGHT = [0, .45, .7, 1, 1.5, 2.2];
const ROOT_ANCHORS = [[-600, 0], [200, .2], [1600, .42], [1750, .68], [1862, 1]];

const POP_R = [2.4, 3.0, 3.6, 4.4, 5.2];
/* dot radius encodes public familiarity (popularity 1..5) */
const popR = (n) => POP_R[Math.max(1, Math.min(5, Math.round((n && n.popularity) || 3))) - 1];
const isEm = (n) => !!n && n.status === 'emerging';
const rootU = (y) => { for (let i = 1; i < ROOT_ANCHORS.length; i++) if (y <= ROOT_ANCHORS[i][0]) { const a = ROOT_ANCHORS[i - 1], b = ROOT_ANCHORS[i]; return a[1] + (Math.max(a[0], y) - a[0]) / (b[0] - a[0]) * (b[1] - a[1]); } return 1; };

function normName(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,'’]/g, ' ').replace(/\s+/g, ' ').trim(); }

function buildIndex(D) {
  const I = { D, problems: [] };
  const prob = (m) => I.problems.push(m);
  const arr = (x) => (Array.isArray(x) ? x : []);

  /* threads */
  I.threads = arr(D.threads).slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((t, i) => Object.assign({}, t, { idx: i, dataColor: t.color, color: PALETTE[t.id] || t.color || NEUTRAL }));
  I.tById = new Map(I.threads.map((t) => [t.id, t]));

  /* nodes (roots are cloned in as type 'root') */
  I.byId = new Map();
  const put = (n) => { if (I.byId.has(n.id)) prob('duplicate id: ' + n.id); else I.byId.set(n.id, n); };
  I.of = { school: [], theory: [], person: [], concept: [], work: [], application: [], root: [] };
  arr(D.nodes).forEach((n) => { put(n); (I.of[n.type] || (I.of[n.type] = [])).push(n); });
  arr(D.roots).forEach((r) => { const c = Object.assign({ type: 'root', thread: (r.threads || [])[0] }, r); put(c); I.of.root.push(c); });
  I.of.root.sort((a, b) => a.year - b.year);
  I.of.school.sort((a, b) => a.year - b.year || (a.id < b.id ? -1 : 1));
  I.byThread = {}; I.threads.forEach((t) => { I.byThread[t.id] = I.of.school.filter((s) => s.thread === t.id); });
  I.of.school.forEach((s) => { if (!I.tById.has(s.thread)) prob('school ' + s.id + ': thread does not exist: ' + s.thread); });
  I.questions = arr(D.questions); I.debates = arr(D.debates).slice().sort((a, b) => a.year - b.year); I.myths = arr(D.myths);
  I.questions.forEach((q) => I.byId.set(q.id, Object.assign({ type: 'question' }, q)));
  I.debates.forEach((q) => I.byId.set(q.id, Object.assign({ type: 'debate' }, q)));
  I.myths.forEach((q) => I.byId.set(q.id, Object.assign({ type: 'myth' }, q)));

  /* years / range */
  const years = I.of.school.map((s) => s.year).filter((y) => typeof y === 'number');
  I.Y0 = Math.min(1856, (years.length ? Math.min(...years) : 1856) - 3);
  I.Y1 = Math.max(2026, years.length ? Math.max(...years) + 2 : 2026);

  /* lookups */
  I.get = (id) => I.byId.get(id);
  I.schoolOf = (id) => { const n = I.byId.get(id); if (!n) return null; switch (n.type) { case 'school': case 'root': return n.id; case 'theory': case 'concept': return n.school && I.byId.has(n.school) ? n.school : null; case 'person': case 'work': return arr(n.schools).find((s) => I.byId.has(s)) || null; default: return null; } };
  I.threadOf = (id) => { const n = I.byId.get(id); if (!n) return null; if (n.type === 'root') return n.thread || null; const s = I.schoolOf(id); const sn = s && I.byId.get(s); return sn ? sn.thread : null; };
  I.colorOf = (id) => { const t = I.tById.get(I.threadOf(id)); return t ? t.color : NEUTRAL; };
  I.threadsOfNode = (n) => (n.type === 'root' ? arr(n.threads) : n.type === 'school' ? [n.thread].concat(arr(n.alsoThreads)) : [I.threadOf(n.id)].filter(Boolean));

  /* structural relations */
  const mk = () => new Map(); const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); const a = m.get(k); if (!a.includes(v)) a.push(v); };
  I.theoriesOf = mk(); I.personsOf = mk(); I.conceptsOf = mk(); I.worksOf = mk(); I.theoriesOfPerson = mk(); I.worksOfTheory = mk(); I.worksOfPerson = mk(); I.peopleOfTheory = mk();
  I.of.theory.forEach((t) => { if (!I.byId.has(t.school)) prob('theory ' + t.id + ': school does not exist: ' + t.school); else push(I.theoriesOf, t.school, t); arr(t.people).forEach((p) => { if (!I.byId.has(p)) prob('theory ' + t.id + ': person does not exist: ' + p); else { push(I.theoriesOfPerson, p, t); push(I.peopleOfTheory, t.id, I.byId.get(p)); } }); });
  I.of.person.forEach((p) => { if (!arr(p.schools).length) prob('person ' + p.id + ' has no school'); arr(p.schools).forEach((s) => { if (!I.byId.has(s)) prob('person ' + p.id + ': school does not exist: ' + s); else push(I.personsOf, s, p); }); });
  I.of.concept.forEach((c) => { if (!I.byId.has(c.school)) prob('concept ' + c.id + ': school does not exist: ' + c.school); else push(I.conceptsOf, c.school, c); });
  I.of.work.forEach((w) => { arr(w.schools).forEach((s) => { if (!I.byId.has(s)) prob('work ' + w.id + ': school does not exist: ' + s); else push(I.worksOf, s, w); }); arr(w.theories).forEach((t) => { if (!I.byId.has(t)) prob('work ' + w.id + ': theory does not exist: ' + t); else push(I.worksOfTheory, t, w); }); if (!arr(w.schools).length) prob('work ' + w.id + ' has no school'); });
  const DR = { easy: 0, medium: 1, hard: 2 };
  I.worksOf.forEach((l) => l.sort((a, b) => (DR[a.depth] ?? 1) - (DR[b.depth] ?? 1) || a.year - b.year));
  I.theoriesOf.forEach((l) => l.sort((a, b) => a.year - b.year));
  I.personsOf.forEach((l) => l.sort((a, b) => (a.born ?? 9999) - (b.born ?? 9999)));
  // author -> person (by surname + initial); works carry an author string only
  const bySur = new Map();
  I.of.person.forEach((p) => { const toks = normName(p.name && p.name.en).split(' ').filter((x) => x && !/^(jr|sr|ii|iii)$/.test(x)); if (toks.length < 2) return; const sur = toks[toks.length - 1]; if (!bySur.has(sur)) bySur.set(sur, []); bySur.get(sur).push({ p, ini: toks[0][0] }); });
  I.of.work.forEach((w) => String(w.author || '').split(/\s*(?:&|\band\b|;|\/|,)\s*/).forEach((a) => { const toks = normName(a).split(' ').filter(Boolean); if (toks.length < 2) return; const hit = (bySur.get(toks[toks.length - 1]) || []).filter((x) => x.ini === toks[0][0]); if (hit.length === 1) push(I.worksOfPerson, hit[0].p.id, w); }));

  /* book links overlay (data/book-links.json merged at build time); absent = no links */
  I.links = D.bookLinks && typeof D.bookLinks === 'object' ? D.bookLinks : {};
  /* cover thumbnails (data/covers.json -> D.bookCovers[id] = { zh?, en? }, relative covers/ paths); absent = none */
  I.covers = D.bookCovers && typeof D.bookCovers === 'object' ? D.bookCovers : {};
  /* representative person / work of a school; fall back when the data does not name them */
  I.of.school.forEach((s) => {
    if (s.keyPerson != null && !(I.byId.get(s.keyPerson) && I.byId.get(s.keyPerson).type === 'person')) prob('school ' + s.id + ': keyPerson is not a person: ' + s.keyPerson);
    if (s.keyWork != null && !(I.byId.get(s.keyWork) && I.byId.get(s.keyWork).type === 'work')) prob('school ' + s.id + ': keyWork is not a work: ' + s.keyWork);
  });
  I.keyPersonOf = (s) => { if (!s) return null; const p = s.keyPerson && I.byId.get(s.keyPerson); if (p && p.type === 'person') return p; return (I.personsOf.get(s.id) || [])[0] || null; };
  I.keyWorkOf = (s) => { if (!s) return null; const w = s.keyWork && I.byId.get(s.keyWork); if (w && w.type === 'work') return w; return (I.worksOf.get(s.id) || []).slice().sort((a, b) => (a.year || 0) - (b.year || 0))[0] || null; };
  /* the label a school gets on the maps, by label mode (school | person | work) */
  I.mapLabel = (s, mode) => {
    if (mode === 'person') { const p = I.keyPersonOf(s); if (p) return personShort(p); }
    else if (mode === 'work') { const w = I.keyWorkOf(s); if (w) return trunc(nm(w), 128); }
    return nmShort(s);
  };
  I.schoolWorks = (sid) => { const out = []; (I.worksOf.get(sid) || []).forEach((w) => { if (!out.includes(w)) out.push(w); }); (I.theoriesOf.get(sid) || []).forEach((th) => (I.worksOfTheory.get(th.id) || []).forEach((w) => { if (!out.includes(w)) out.push(w); })); return out; };

  /* edges */
  const raw = arr(D.edges).map((e) => Object.assign({}, e));
  I.of.root.forEach((r) => { if (r.to) raw.push({ from: r.id, to: r.to, type: 'feeds', note: { zh: tl('zh', 'edge.feeds', { name: r.title.zh }), en: tl('en', 'edge.feeds', { name: r.title.en || r.title.zh }) }, confidence: 'high', derived: true }); });
  I.edges = raw.filter((e) => { const ok = I.byId.has(e.from) && I.byId.has(e.to); if (!ok) prob('relation endpoint does not exist: ' + e.from + ' -> ' + e.to); return ok; });
  I.edgesOf = mk();
  I.edges.forEach((e) => { push(I.edgesOf, e.from, e); push(I.edgesOf, e.to, e); });
  const lvl = (id) => { const t = I.byId.get(id).type; return t === 'school' || t === 'root'; };
  I.schoolEdges = I.edges.filter((e) => lvl(e.from) && lvl(e.to));
  I.theoryEdges = I.edges.filter((e) => !(lvl(e.from) && lvl(e.to)));
  // edges lifted to school level (a theory-level edge stands for its schools) for the maps
  I.liftedEdges = []; I.liftedOf = mk(); const seen = new Set();
  I.schoolEdges.concat(I.theoryEdges).forEach((e) => { const a = I.schoolOf(e.from), b = I.schoolOf(e.to); if (!a || !b || a === b) return; const k = a + '|' + b + '|' + e.type; if (seen.has(k)) return; seen.add(k); const le = { from: a, to: b, type: e.type, note: e.note, via: e, lifted: e.from !== a || e.to !== b }; I.liftedEdges.push(le); push(I.liftedOf, a, le); push(I.liftedOf, b, le); });
  I.relOf = (id) => I.edgesOf.get(id) || [];
  I.applicationSources = (appId) => (I.edgesOf.get(appId) || []).filter((e) => e.type === 'applies' && e.to === appId).map((e) => I.byId.get(e.from));

  /* questions, debates, myths -> nodes */
  I.refsOf = new Map();
  const addRef = (kind, item, id) => { const n = I.byId.get(id); if (!n) return; const ids = [id]; if ((n.type === 'theory' || n.type === 'concept') && I.byId.has(n.school)) ids.push(n.school); ids.forEach((k) => { if (!I.refsOf.has(k)) I.refsOf.set(k, { questions: [], debates: [], myths: [] }); const l = I.refsOf.get(k)[kind]; if (!l.includes(item)) l.push(item); }); };
  I.questions.forEach((q) => arr(q.lenses).forEach((l) => { if (!I.byId.has(l.node)) prob('question ' + q.id + ': node does not exist: ' + l.node); else addRef('questions', q, l.node); }));
  I.debates.forEach((q) => arr(q.sides).forEach((l) => { if (!I.byId.has(l.node)) prob('debate ' + q.id + ': node does not exist: ' + l.node); else addRef('debates', q, l.node); }));
  I.myths.forEach((q) => arr(q.related).forEach((id) => { if (!I.byId.has(id)) prob('myth ' + q.id + ': node does not exist: ' + id); else addRef('myths', q, id); }));
  I.refs = (id) => I.refsOf.get(id) || { questions: [], debates: [], myths: [] };

  /* height model: every established school counts around its year with a Gaussian kernel; emerging ones weigh 1 */
  I.series = {}; I.gmax = 0.0001; const NY = I.Y1 - I.Y0 + 1;
  I.threads.forEach((t) => { const a = new Array(NY).fill(0); let mx = 0; for (let k = 0; k < NY; k++) { const y = I.Y0 + k; let h = 0; for (const s of I.byThread[t.id]) { const d = y - s.year; if (Math.abs(d) < 40) h += (isEm(s) ? 1 : (WEIGHT[s.influence] || 1)) * Math.exp(-(d * d) / 72); } a[k] = h; if (h > mx) mx = h; if (h > I.gmax) I.gmax = h; } I.series[t.id] = a; t.max = mx || 1; });
  I.val = (tid, y) => { const a = I.series[tid]; if (!a) return 0; const f = Math.max(0, Math.min(a.length - 1.001, y - I.Y0)), i = Math.floor(f); return a[i] + (a[i + 1] - a[i]) * (f - i); };

  /* display helpers */
  I.when = (n) => (n.type === 'root' ? (n.when && n.when[LANG]) || yearLabel(n.year) : n.type === 'person' ? lifeSpan(n) : n.year != null ? String(n.year) : '');
  I.desc = (n) => (n.type === 'root' ? L(n.summary) : n.type === 'person' ? L(n.role) || L(n.summary) : n.type === 'work' ? [n.author, L(n.summary)].filter(Boolean).join(' · ') : n.type === 'concept' ? L(n.summary) : L(n.landmark) || L(n.summary)) || '';
  I.counts = { school: I.of.school.length, root: I.of.root.length, edges: I.edges.length };
  return I;
}

function yearLabel(y) { return y == null ? '' : y < 0 ? ui('year.bce', { y: -y }) : String(y); }
function lifeSpan(p) { if (p.born == null && p.died == null) return ui('life.unknown'); return (p.born == null ? '?' : p.born) + '–' + (p.died == null ? (p.born != null && p.born >= 1915 ? '' : '?') : p.died); }
