/* Detail drawer, compare bar and tooltip.
   The render* functions are pure: (node, index) -> HTML string. They can be run in Node without a DOM. */

const lnk = (I, id, extra) => { const n = I.get(id); if (!n) return `<span class="dead">${esc(id)}</span>`; return `<button class="lnk" data-go="${esc(id)}">${dot(I.colorOf(id))}${esc(nm(n))}${extra || ''}</button>`; };
const gauge = (v, label) => `<span class="gauge" role="img" aria-label="${esc(label)}: ${v} / 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= v ? 'f' : ''}"></i>`).join('')}</span><span class="mono gv">${v}/5</span>`;
const sec = (h, body, n) => (body ? `<h3>${h}${n != null ? ` · ${n}` : ''}</h3>${body}` : '');
const listSep = () => ui('list.sep');
const clip = (s, zh, en) => { s = String(s || ''); const k = LANG === 'en' ? en : zh; return s.length > k ? s.slice(0, k) + '…' : s; };
const verdictSlug = (m) => VERDICT_SLUG[typeof m.verdict === 'string' ? m.verdict : (m.verdict && m.verdict.zh)] || null;
const verdictText = (m) => { const v = m.verdict; if (v && typeof v === 'object' && v[LANG]) return v[LANG]; const slug = verdictSlug(m); if (slug && LANG === 'en') return ui('verdict.' + slug); return L(v); };

/* ---- external links: only book.douban.com and openlibrary.org, only as user-clickable anchors ---- */
const SAFE_URL = /^https:\/\/(book\.douban\.com|openlibrary\.org)\//;
const safeUrl = (u) => (typeof u === 'string' && SAFE_URL.test(u) ? u : '');
const extLink = (u, label) => { const h = safeUrl(u); return h ? `<a class="ext" href="${esc(h)}" target="_blank" rel="noopener">${esc(label)} ↗</a>` : ''; };
/* cover thumbnails: only relative covers/<file> paths are ever emitted as an <img src>; the UI language picks the order */
const SAFE_COVER = /^covers\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp)$/;
const safeCover = (u) => (typeof u === 'string' && SAFE_COVER.test(u) && !u.includes('..') ? u : '');
const coverOf = (I, w) => { const c = I.covers && I.covers[w.id]; if (!c) return ''; return (LANG === 'zh' ? safeCover(c.zh) || safeCover(c.en) : safeCover(c.en) || safeCover(c.zh)); };
const coverImg = (I, w, cls) => { const u = coverOf(I, w); return u ? `<img class="cov ${cls}" src="${esc(u)}" alt="" loading="lazy" decoding="async">` : ''; };
const fmtVotes = (v) => (typeof v === 'number' ? v.toLocaleString('en-US') : '');
const langName = (code) => { const k = 'lang.' + code; const s = ui(k); return s === k ? String(code || '').toUpperCase() : s; };
const ratingText = (z) => (typeof z.rating === 'number' ? `<span class="rate">★ ${z.rating.toFixed(1)}</span>${typeof z.votes === 'number' ? ` <span class="votes">${esc(ui('ed.votes', { n: fmtVotes(z.votes) }))}</span>` : ''}` : '');
const pubText = (z) => [z.publisher, z.year].filter(Boolean).map(esc).join(' ');

/* the Chinese and English editions of a book. `full` adds translator, original and alternates inline. */
function editionsHtml(I, w, full) {
  const l = I.links && I.links[w.id], z = l && l.zh, e = l && l.en, rec = w.enRec, out = [];
  // Chinese edition
  if (z) {
    let h = `<div class="ed zh"><span class="el">${esc(ui('ed.zh'))}${z.script === 'hant' ? ` <span class="badge soft">${esc(ui('ed.hant'))}</span>` : ''}</span><div class="eb">`;
    if (full && z.title) h += `<div class="et">${esc(z.title)}${z.translator ? ` <small>${esc(ui('ed.translator', { name: z.translator }))}</small>` : ''}</div>`;
    h += `<div class="em">${[ratingText(z), pubText(z), extLink(z.url, ui('ed.douban'))].filter(Boolean).join(' · ')}</div>`;
    const alts = Array.isArray(z.alt) ? z.alt.filter((a) => a && (a.title || a.url)) : [];
    if (alts.length) h += `<details class="alt"><summary>${esc(ui('ed.alt', { n: alts.length }))}</summary>${alts.map((a) => `<div class="em">${[esc(a.title || ''), [a.publisher, a.year].filter(Boolean).map(esc).join(' '), ratingText(a), extLink(a.url, ui('ed.douban'))].filter(Boolean).join(' · ')}</div>`).join('')}</details>`;
    out.push(h + '</div></div>');
  } else if (w.lang !== 'zh' && w.zhQuery === null && rec !== undefined && !rec) out.push(`<div class="ed zh none"><span class="el">${esc(ui('ed.zh'))}</span><div class="eb">${esc(ui('ed.noZh'))}</div></div>`);
  else if (w.lang !== 'zh' && w.zhQuery !== null && l && l.zh === null) out.push(`<div class="ed zh none"><span class="el">${esc(ui('ed.zh'))}</span><div class="eb">${esc(ui('ed.noZhMatch'))}</div></div>`);
  // English edition
  const ol = e && e.openLibrary ? extLink(e.openLibrary, ui('ed.openLibrary')) : '';
  if (rec) {
    out.push(`<div class="ed en"><span class="el">${esc(ui('ed.en'))}</span><div class="eb"><div class="et">${esc(rec.title || '')}${rec.author ? ` <small>${esc(rec.author)}</small>` : ''}</div><div class="em">${[rec.edition, rec.year].filter(Boolean).map(esc).join(', ')}${ol ? (rec.edition || rec.year ? ' · ' : '') + ol : ''}</div>${L(rec.note) ? `<div class="en2">${esc(L(rec.note))}</div>` : ''}</div></div>`);
  } else if (rec === null) out.push(`<div class="ed en none"><span class="el">${esc(ui('ed.en'))}</span><div class="eb">${esc(ui('ed.noEn'))}</div></div>`);
  else if (e && (e.title || ol)) out.push(`<div class="ed en"><span class="el">${esc(ui('ed.en'))}</span><div class="eb"><div class="et">${esc(e.title || '')}${e.author ? ` <small>${esc(e.author)}</small>` : ''}</div><div class="em">${ol}</div></div></div>`);
  if (full && w.original && (w.original.title || w.original.author)) out.push(`<div class="ed orig"><span class="el">${esc(ui('ed.original'))}</span><div class="eb"><div class="et">${esc(w.original.title || '')}${w.original.author ? ` <small>${esc(w.original.author)}</small>` : ''}</div><div class="em">${[w.lang ? langName(w.lang) : '', w.original.year].filter(Boolean).map(esc).join(' · ')}</div></div></div>`);
  return out.length ? `<div class="eds">${out.join('')}</div>` : '';
}

function scoreBlock(n, opt) {
  const em = isEm(n); let h = '<div class="scores">';
  if (n.influence != null && !em) h += `<div class="srow"><span class="sl">${esc(ui('score.influence'))}</span>${gauge(n.influence, ui('score.influence'))}</div>`;
  else if (em) h += `<div class="srow"><span class="sl">${esc(ui('score.influence'))}</span><span class="sn">${esc(ui('score.emerging'))}</span></div>`;
  if (n.evidence) h += `<div class="srow"><span class="sl">${esc(ui('score.evidence'))}</span><span class="badge">${esc(evidName(n.evidence))}</span><p class="sn">${esc(L(n.evidenceNote) || evidHelp(n.evidence))}</p></div>`;
  if (n.popularity != null) h += `<div class="srow"><span class="sl">${esc(ui('score.popularity'))}</span>${gauge(n.popularity, ui('score.popularity'))}<span class="sn">${esc(ui('score.popularityNote'))}</span></div>`;
  return h + '</div>';
}
const landmarkBlock = (n, I) => (n.landmark ? `<div class="lm" style="--c:${I.colorOf(n.id)}"><em>${esc(I.when(n))}</em>${esc(L(n.landmark))}</div>` : '');
const claimBlock = (n) => (n.summary ? `<p class="claim">${esc(L(n.summary))}</p>` : '');

function relGroups(I, ids, list) {
  if (!list.length) return '';
  const own = ids instanceof Set ? ids : new Set([ids]), mainId = ids instanceof Set ? [...ids][0] : ids;
  const by = {}; list.forEach((e) => { (by[e.type] = by[e.type] || []).push(e); });
  return REL_ORDER.filter((k) => by[k]).concat(Object.keys(by).filter((k) => !REL_ORDER.includes(k))).map((k) => {
    const lab = REL_ORDER.includes(k) ? relName(k) : k;
    return `<div class="rg"><h4>${esc(lab)}<small>${esc(REL_ORDER.includes(k) ? relHelp(k) : '')}</small></h4>${by[k].map((e) => {
      const out = own.has(e.from), me = out ? e.from : e.to, oid = out ? e.to : e.from, o = I.get(oid); if (!o) return '';
      const via = me !== mainId && I.get(me) ? ` <small class="via">(${esc(nm(I.get(me)))})</small>` : '';
      const extra = o.type === 'school' || o.type === 'theory' ? ` <span class="mono yr">${esc(o.year)}</span>` : o.type === 'root' ? ` <span class="mono yr">${esc(ui('type.root'))}</span>` : '';
      return `<button class="rel" data-go="${esc(oid)}"><u>${out ? '→' : '←'} ${esc(lab)}</u><b>${dot(I.colorOf(oid))}${esc(nm(o))}${extra}</b><span>${esc(L(e.note))}${via}</span></button>`;
    }).join('')}</div>`;
  }).join('');
}

function ladder(I, works) {
  if (!works.length) return '';
  return DEPTH_ORDER.map((d) => { const l = works.filter((w) => w.depth === d); if (!l.length) return ''; return `<div class="rg"><h4>${esc(depthName(d))}<small>${esc(ui('depth.hint.' + d))}</small></h4>${l.map((w) => `<button class="rel" data-go="${esc(w.id)}"><u>${esc(roleName(w.role))}</u><b>${esc(nm(w))} <span class="mono yr">${esc(w.year)}</span></b><span>${esc(w.author)}${w.summary ? ' · ' + esc(L(w.summary)) : ''}</span></button>`).join('')}</div>`; }).join('');
}

function refsBlock(I, id) {
  const r = I.refs(id), out = [];
  r.questions.forEach((q) => out.push(`<button class="rel" data-go="${esc(q.id)}"><u>${esc(ui('refs.question'))}</u><b>${esc(L(q.title))}</b><span>${esc(ui('refs.lenses', { n: q.lenses.length }))}</span></button>`));
  r.debates.forEach((q) => out.push(`<button class="rel" data-go="${esc(q.id)}"><u>${esc(ui('refs.debate'))}</u><b>${esc(L(q.title))} <span class="mono yr">${esc(q.year)}</span></b><span>${esc(clip(L(q.summary), 60, 110))}</span></button>`));
  r.myths.forEach((q) => out.push(`<button class="rel" data-go="${esc(q.id)}"><u>${esc(ui('refs.myth'))}</u><b>${esc(L(q.claim))}</b><span class="vtag ${VERDICT_CLASS[typeof q.verdict === 'string' ? q.verdict : (q.verdict && q.verdict.zh)] || ''}">${esc(verdictText(q))}</span></button>`));
  return out.join('');
}

function conceptCards(I, list) {
  return list.map((c, i) => `<details class="cc"${i === 0 ? ' open' : ''}><summary>${esc(nm(c))}${nmAlt(c) ? ` <small>${esc(nmAlt(c))}</small>` : ''}${confTag(c)}</summary><dl><dt>${esc(ui('concept.plain'))}</dt><dd>${esc(L(c.plain))}</dd><dt>${esc(ui('concept.example'))}</dt><dd>${esc(L(c.example))}</dd><dt>${esc(ui('concept.misuse'))}</dt><dd>${esc(L(c.misuse))}</dd></dl></details>`).join('');
}

const peopleNames = (I, id) => (I.peopleOfTheory.get(id) || []).map((p) => nm(p)).join(listSep());
const theoryRows = (I, list) => list.map((t) => { const ps = peopleNames(I, t.id); return `<button class="rel" data-go="${esc(t.id)}"><u class="mono">${esc(t.year)}</u><b>${esc(nm(t))}${confTag(t)}</b><span>${ps ? esc(ui('theory.byPeople', { names: ps })) : esc(L(t.landmark))}</span></button>`; }).join('');
const personChips = (I, list) => list.map((p) => `<button class="lnk" data-go="${esc(p.id)}">${dot(I.colorOf(p.id))}${esc(nm(p))} <span class="mono yr">${esc(lifeSpan(p))}</span></button>`).join('');
const workRows = (I, list) => list.map((w) => `<button class="rel" data-go="${esc(w.id)}"><u>${esc(depthName(w.depth))}</u><b>${esc(nm(w))} <span class="mono yr">${esc(w.year)}</span></b><span>${esc(w.author)} · ${esc(roleName(w.role))}</span></button>`).join('');

function titleBlock(n) {
  const alt = nmAlt(n);
  return `<h2 id="dtitle" tabindex="-1">${esc(nm(n))}${confTag(n)}</h2>${alt ? `<div class="en">${esc(alt)}</div>` : ''}`;
}

function drawerShell(n, I, opt, meta, inner) {
  const canCmp = n.type === 'school';
  return `<div class="dtop">${opt && opt.back ? `<button class="btn" data-back>← ${esc(ui('btn.back'))}</button>` : ''}<span class="dtype">${esc(typeName(n.type))}</span><button class="x" data-close aria-label="${esc(ui('aria.closeDetail'))}">×</button></div>
  <div class="meta">${meta}</div>${titleBlock(n)}${inner}
  <div class="dfoot">${canCmp ? `<button class="btn" data-cmp>${esc(ui('btn.compare'))}</button>` : ''}<button class="btn" data-copy>${esc(ui('btn.copy'))}</button><span class="note" id="copied"></span></div>`;
}

const threadMeta = (I, n) => { const ts = I.threadsOfNode(n).map((id) => I.tById.get(id)).filter(Boolean); return ts.map((t, i) => `<span class="tm">${dot(t.color)}${esc(nm(t))}${i ? `<small>${esc(ui('meta.secondary'))}</small>` : ''}</span>`).join(''); };

/* the reading path section (theories and schools) */
const pathSection = (I, n) => { const h = pathHtml(I, n.id, { compact: true }); return h ? sec(ui('sec.path'), h + `<button class="btn wide" data-path="${esc(n.id)}">${esc(ui('path.openFull'))}</button>`) : ''; };

function renderSchool(n, I, opt) {
  const th = I.theoriesOf.get(n.id) || [], ps = I.personsOf.get(n.id) || [], cs = I.conceptsOf.get(n.id) || [], ws = I.worksOf.get(n.id) || [];
  const direct = I.relOf(n.id), viaTheory = []; th.forEach((t) => I.relOf(t.id).forEach((e) => { if (!viaTheory.includes(e)) viaTheory.push(e); }));
  const meta = threadMeta(I, n) + (isEm(n) ? `<span class="badge">${esc(ui('badge.ongoing'))}</span>` : '') + `<span class="tm sm">${esc(levelName(n.level))} · ${esc(actName(n.activity))}</span>`;
  const kp = I.keyPersonOf(n), kw = I.keyWorkOf(n);
  const key = (kp || kw) ? `<div class="keyrow">${kp ? `<span class="kl">${esc(ui('key.person'))}</span>${lnk(I, kp.id)}` : ''}${kw ? `<span class="kl">${esc(ui('key.work'))}</span>${lnk(I, kw.id)}` : ''}</div>` : '';
  const inner = landmarkBlock(n, I) + claimBlock(n) + key + sec(ui('sec.scores'), scoreBlock(n)) + sec(ui('sec.theories'), theoryRows(I, th), th.length) + sec(ui('sec.people'), `<div class="chips">${personChips(I, ps)}</div>`, ps.length) + sec(ui('sec.concepts'), conceptCards(I, cs), cs.length)
    + sec(ui('sec.relations'), relGroups(I, n.id, direct) || `<p class="note">${esc(ui('note.noDirect'))}</p>`, direct.length)
    + (viaTheory.length ? sec(ui('sec.theoryRelations'), `<p class="note">${esc(ui('note.theoryRels'))}</p>` + relGroups(I, new Set([n.id].concat(th.map((t) => t.id))), viaTheory), viaTheory.length) : '')
    + pathSection(I, n) + sec(ui('sec.ladder'), ladder(I, ws), ws.length) + sec(ui('sec.refs'), refsBlock(I, n.id));
  return drawerShell(n, I, opt, meta, inner);
}

function renderTheory(n, I, opt) {
  const school = I.get(n.school), ps = I.peopleOfTheory.get(n.id) || [], ws = I.worksOfTheory.get(n.id) || [], cs = (I.conceptsOf.get(n.school) || []), rel = I.relOf(n.id);
  const meta = (school ? `<span class="tm">${dot(I.colorOf(n.id))}${esc(nm(school))}</span>` : '') + `<span class="tm sm">${esc(n.year)}</span>`;
  const inner = landmarkBlock(n, I) + claimBlock(n) + sec(ui('sec.proposers'), `<div class="chips">${personChips(I, ps)}</div>`, ps.length) + sec(ui('sec.scores'), scoreBlock(n))
    + (school ? sec(ui('sec.school'), `<div class="chips">${lnk(I, school.id)}</div>`) : '')
    + (cs.length ? sec(ui('sec.relatedConcepts'), `<p class="note">${esc(ui('note.sameSchoolConcepts'))}</p>${conceptCards(I, cs.slice(0, 4))}`, Math.min(4, cs.length)) : '')
    + pathSection(I, n) + sec(ui('sec.books'), workRows(I, ws), ws.length) + sec(ui('sec.theoryRelations'), relGroups(I, n.id, rel), rel.length) + sec(ui('sec.refs'), refsBlock(I, n.id));
  return drawerShell(n, I, opt, meta, inner);
}

function renderPerson(n, I, opt) {
  const schools = (n.schools || []).filter((s) => I.get(s)), th = I.theoriesOfPerson.get(n.id) || [], ws = I.worksOfPerson.get(n.id) || [];
  const meta = `<span class="tm sm">${esc(lifeSpan(n))}</span>`;
  const inner = (n.role ? `<p class="claim">${esc(L(n.role))}</p>` : '') + sec(ui('sec.schoolsOf'), `<div class="chips">${schools.map((s) => lnk(I, s)).join('')}</div>`, schools.length)
    + sec(ui('sec.theoriesOf'), theoryRows(I, th), th.length) + sec(ui('sec.booksOf'), workRows(I, ws), ws.length) + sec(ui('sec.refs'), refsBlock(I, n.id));
  return drawerShell(n, I, opt, meta, inner);
}

function renderConcept(n, I, opt) {
  const school = I.get(n.school);
  const meta = (school ? `<span class="tm">${dot(I.colorOf(n.id))}${esc(nm(school))}</span>` : '');
  const inner = `<dl class="plain"><dt>${esc(ui('concept.plain'))}</dt><dd>${esc(L(n.plain))}</dd><dt>${esc(ui('concept.example'))}</dt><dd>${esc(L(n.example))}</dd><dt>${esc(ui('concept.misuse'))}</dt><dd>${esc(L(n.misuse))}</dd></dl>`
    + (school ? sec(ui('sec.school'), `<div class="chips">${lnk(I, school.id)}</div>`) : '') + sec(ui('sec.refs'), refsBlock(I, n.id)) + (I.relOf(n.id).length ? sec(ui('sec.relations'), relGroups(I, n.id, I.relOf(n.id))) : '');
  return drawerShell(n, I, opt, meta, inner);
}

function renderWork(n, I, opt) {
  const schools = (n.schools || []).filter((s) => I.get(s)), th = (n.theories || []).filter((s) => I.get(s));
  const meta = `<span class="tm sm">${esc(n.year)} · ${esc(roleName(n.role))} · ${esc(depthName(n.depth))}</span>`;
  const cov = coverImg(I, n, 'lg'), claim = `<p class="claim">${esc(n.author || '')}${n.summary ? '<br>' + esc(L(n.summary)) : ''}</p>`;
  const inner = (cov ? `<div class="wtop hc">${cov}<div>${claim}</div></div>` : claim)
    + `<div class="scores"><div class="srow"><span class="sl">${esc(ui('work.kind'))}</span><span class="badge">${esc(roleName(n.role))}</span></div><div class="srow"><span class="sl">${esc(ui('work.difficulty'))}</span><span class="badge">${esc(depthName(n.depth))}</span><span class="sn">${esc(n.depth ? ui('depth.note.' + n.depth) : '')}</span></div></div>`
    + sec(ui('sec.editions'), editionsHtml(I, n, true))
    + sec(ui('sec.schoolsOfWork'), `<div class="chips">${schools.map((s) => lnk(I, s)).join('')}</div>`, schools.length) + sec(ui('sec.theoriesOfWork'), `<div class="chips">${th.map((s) => lnk(I, s)).join('')}</div>`, th.length)
    + sec(ui('sec.author'), (() => { const p = I.of.person.filter((x) => (I.worksOfPerson.get(x.id) || []).includes(n)); return p.length ? `<div class="chips">${personChips(I, p)}</div>` : ''; })());
  return drawerShell(n, I, opt, meta, inner);
}

function renderRoot(n, I, opt) {
  const ts = (n.threads || []).map((id) => I.tById.get(id)).filter(Boolean), to = n.to && I.get(n.to), ppl = (n.people || []).filter((p) => I.get(p));
  const meta = `<span class="badge">${esc(ui('type.root'))}</span>` + `<span class="tm sm">${esc(I.when(n))}</span>`;
  const inner = `<p class="claim">${esc(L(n.summary))}</p>` + sec(ui('sec.flowsInto'), `<div class="chips">${ts.map((t, i) => `<span class="tm">${dot(t.color)}${esc(nm(t))}${i ? '' : `<small>${esc(ui('meta.primary'))}</small>`}</span>`).join('')}</div>`, ts.length)
    + sec(ui('sec.flowsToSchool'), to ? `<div class="chips">${lnk(I, to.id)}</div>` : '') + sec(ui('sec.legacy'), n.legacy ? `<p class="claim">${esc(L(n.legacy))}</p>` : '')
    + sec(ui('sec.relatedPeople'), `<div class="chips">${ppl.map((p) => lnk(I, p)).join('')}</div>`, ppl.length) + sec(ui('sec.refs'), refsBlock(I, n.id));
  return drawerShell(n, I, opt, meta, inner);
}

function renderApplication(n, I, opt) {
  const src = I.applicationSources(n.id), edges = I.relOf(n.id).filter((e) => e.type === 'applies' && e.to === n.id);
  const meta = `<span class="badge">${esc(L(n.domain) || ui('type.application'))}</span><span class="tm sm">${esc(n.year)}</span>`;
  const inner = landmarkBlock(n, I) + claimBlock(n)
    + sec(ui('sec.appliedHere'), edges.map((e) => { const o = I.get(e.from); return o ? `<button class="rel" data-go="${esc(o.id)}"><u>${esc(typeName(o.type))}</u><b>${dot(I.colorOf(o.id))}${esc(nm(o))}</b><span>${esc(L(e.note))}</span></button>` : ''; }).join(''), src.length);
  return drawerShell(n, I, opt, meta, inner);
}

function renderNodeDrawer(n, I, opt) {
  opt = opt || {};
  if (!n) return `<div class="dtop"><button class="x" data-close aria-label="${esc(ui('aria.closeDetail'))}">×</button></div><p class="note">${esc(ui('note.notFound'))}</p>`;
  switch (n.type) {
    case 'school': return renderSchool(n, I, opt);
    case 'theory': return renderTheory(n, I, opt);
    case 'person': return renderPerson(n, I, opt);
    case 'concept': return renderConcept(n, I, opt);
    case 'work': return renderWork(n, I, opt);
    case 'root': return renderRoot(n, I, opt);
    case 'application': return renderApplication(n, I, opt);
    default: return `<div class="dtop"><button class="x" data-close aria-label="${esc(ui('aria.closeDetail'))}">×</button></div><h2>${esc(nm(n))}</h2>`;
  }
}

/* ---- compare ---- */
function directRelations(I, a, b) {
  const out = []; (I.edgesOf.get(a) || []).forEach((e) => { if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) out.push(e); });
  if (!out.length) (I.liftedOf.get(a) || []).forEach((e) => { if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) out.push(e); });
  return out;
}
function renderCompareBar(ids, I) {
  if (!ids || !ids.length) return '';
  const a = I.get(ids[0]);
  if (ids.length === 1 || !I.get(ids[1])) return `<div class="cmpin pick"><span>${esc(ui('cmp.picked'))} <b>${esc(a ? nm(a) : ids[0])}</b>. ${esc(ui('cmp.pickSecond'))}</span><button class="btn" data-cmpclose>${esc(ui('btn.cancel'))}</button></div>`;
  const b = I.get(ids[1]);
  const col = (n) => `<div class="cc2" style="--c:${I.colorOf(n.id)}"><button class="lnk big" data-go="${esc(n.id)}">${dot(I.colorOf(n.id))}${esc(nm(n))}${confTag(n)}</button><div class="en">${esc(nmAlt(n))}${nmAlt(n) ? ' · ' : ''}${esc(I.when(n))}${isEm(n) ? ' · ' + esc(ui('badge.ongoing')) : ''}</div><p>${esc(L(n.summary))}</p>${scoreBlock(n)}</div>`;
  const rels = directRelations(I, a.id, b.id);
  const relHtml = rels.length ? rels.map((e) => { const f = I.get(e.from), tt = I.get(e.to); return `<div class="crel"><b>${esc(nm(f))} → ${esc(REL_ORDER.includes(e.type) ? relName(e.type) : e.type)} → ${esc(nm(tt))}</b><span>${esc(L(e.note))}</span></div>`; }).join('') : `<div class="crel"><span>${esc(ui('cmp.noRelation'))}</span></div>`;
  return `<div class="cmpin"><div class="cmphead"><b>${esc(ui('cmp.title'))}</b><button class="btn" data-cmpclose>${esc(ui('btn.closeCompare'))}</button></div><div class="cmpgrid">${col(a)}<div class="cmid"><h4>${esc(ui('cmp.between'))}</h4>${relHtml}</div>${col(b)}</div></div>`;
}

/* ---- tooltip ---- */
function tipHtml(id, I) {
  const n = I.get(id); if (!n) return '';
  const k = I.relOf(id).length, th = n.type === 'root' ? (n.threads || []).map((x) => I.tById.get(x)).filter(Boolean).map((x) => nm(x)).join(listSep()) : nm(I.tById.get(I.threadOf(id)));
  let key = '';
  if (n.type === 'school') { const kp = I.keyPersonOf(n), kw = I.keyWorkOf(n); key = `${kp ? `<br><span class="tk"><b>${esc(ui('key.person'))}</b> ${esc(nm(kp))}</span>` : ''}${kw ? `<br><span class="tk"><b>${esc(ui('key.work'))}</b> ${esc(nm(kw))}</span>` : ''}`; }
  const alt = nmAlt(n);
  return `<b>${esc(nm(n))}${confTag(n)}</b>${alt && n.type !== 'school' ? `<span class="talt">${esc(alt)}</span>` : ''}<span><em>${esc(I.when(n))}</em>${esc(I.desc(n))}</span>${key}<br><span>${dot(I.colorOf(id))} ${n.type === 'root' ? esc(ui('tip.source')) : ''}${esc(th)}${isEm(n) ? ' · ' + esc(ui('badge.ongoing')) : ''}${k ? ' · ' + esc(ui('tip.rels', { n: k })) : ''}</span>`;
}
function showTip(id, e) { $('tip').innerHTML = tipHtml(id, IDX); $('tip').style.display = 'block'; moveTip(e); }
function moveTip(e) { const t = $('tip'), w = t.offsetWidth, h = t.offsetHeight; let x = e.clientX + 14, y = e.clientY + 14; if (x + w > innerWidth - 8) x = e.clientX - w - 14; if (y + h > innerHeight - 8) y = e.clientY - h - 14; t.style.left = Math.max(4, x) + 'px'; t.style.top = Math.max(4, y) + 'px'; }
function hideTip() { $('tip').style.display = 'none'; }

/* ---- wiring (DOM) ---- */
let lastKeyboard = false;
function renderDrawer() {
  const p = $('panel'), pin = $('pin');
  if (!R.n) { p.classList.remove('open'); document.body.classList.remove('panel-open'); pin.innerHTML = ''; return; }
  const n = IDX.get(R.n);
  pin.innerHTML = renderNodeDrawer(n, IDX, { back: U.stack.length > 0 });
  pin.scrollTop = 0; p.classList.add('open'); document.body.classList.add('panel-open');
  if (lastKeyboard) { const el = $('dtitle'); if (el) el.focus({ preventScroll: true }); }
}
function renderCmp() {
  const c = $('cmp'); if (!R.c.length) { c.classList.remove('open'); c.innerHTML = ''; document.body.classList.remove('cmp-open'); return; }
  c.innerHTML = renderCompareBar(R.c, IDX); c.classList.add('open'); document.body.classList.add('cmp-open');
}
function wirePanel() {
  // a cover that fails to load disappears and gives its space back (error events do not bubble: capture)
  document.addEventListener('error', (e) => { const t = e.target; if (t && t.tagName === 'IMG' && t.classList.contains('cov')) { const h = t.closest('.hc'); t.remove(); if (h) h.classList.remove('hc'); } }, true);
  document.addEventListener('keydown', () => { lastKeyboard = true; }, true);
  document.addEventListener('pointerdown', () => { lastKeyboard = false; }, true);
  $('pin').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.go) { openNode(b.dataset.go, true); return; }
    if (b.dataset.path) { go({ view: 'reading', sub: 'glass', thread: null, q: null, n: null, path: b.dataset.path }); return; }
    if ('close' in b.dataset) { closeNode(); return; }
    if ('back' in b.dataset) { backNode(); return; }
    if ('cmp' in b.dataset) { go({ c: [R.n] }); return; }
    if ('copy' in b.dataset) { const el = $('copied'), done = (m) => { if (el) el.textContent = m; }; try { navigator.clipboard.writeText(location.href).then(() => done(ui('copied')), () => done(ui('copyFail'))); } catch (err) { done(ui('copyFail')); } }
  });
  $('cmp').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.go) { openNode(b.dataset.go); return; }
    if ('cmpclose' in b.dataset) go({ c: [] });
  });
}
