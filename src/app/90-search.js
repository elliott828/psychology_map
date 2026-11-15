/* Search across all node types and the life questions: Chinese and English names (whatever the interface language), id, person names. */

const SEARCH_ORDER = ['school', 'theory', 'person', 'concept', 'work', 'root', 'application', 'question'];
const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function buildSearch(I) {
  const out = [];
  I.byId.forEach((n) => {
    if (!SEARCH_ORDER.includes(n.type)) return;
    const strong = [n.title && n.title.zh, n.title && n.title.en, n.title && n.title.enShort, n.id, n.name && n.name.zh, n.name && n.name.en].concat(n.type === 'work' ? [n.enRec && n.enRec.title, n.original && n.original.title] : []).filter(Boolean).map(fold);
    const weak = [];
    if (n.type === 'work') [n.author, n.original && n.original.author, n.enRec && n.enRec.author].filter(Boolean).forEach((a) => weak.push(fold(a)));
    if (n.type === 'theory') (I.peopleOfTheory.get(n.id) || []).forEach((p) => { weak.push(fold(nm(p, 'zh')), fold(nm(p, 'en'))); });
    if (n.type === 'question') (n.lenses || []).forEach((l) => { const o = I.get(l.node); if (o) weak.push(fold(nm(o, 'zh')), fold(nm(o, 'en'))); });
    out.push({ id: n.id, type: n.type, node: n, strong, weak });
  });
  return out;
}

function runSearch(entries, query, per) {
  const q = fold(query).trim(); if (!q) return [];
  const by = {};
  entries.forEach((e) => {
    let sc = -1;
    e.strong.forEach((k, i) => { const p = k.indexOf(q); if (p < 0) return; const s = (k === q ? 0 : p === 0 ? 1 : 2) + (i > 1 ? .5 : 0); if (sc < 0 || s < sc) sc = s; });
    if (sc < 0) e.weak.forEach((k) => { if (k.includes(q) && (sc < 0 || sc > 3)) sc = 3; });
    if (sc >= 0) (by[e.type] = by[e.type] || []).push({ e, sc });
  });
  return SEARCH_ORDER.filter((t) => by[t]).map((t) => ({ type: t, items: by[t].sort((a, b) => a.sc - b.sc || (b.e.node.influence || 0) - (a.e.node.influence || 0)).slice(0, per || 5).map((x) => x.e.node), total: by[t].length }));
}

const resultHint = (I, n) => (n.type === 'root' ? ui('type.root') : n.type === 'question' ? ui('refs.lenses', { n: n.lenses.length }) : n.type === 'person' ? lifeSpan(n) : n.type === 'work' ? n.author : [n.year, nm(I.tById.get(I.threadOf(n.id)))].filter(Boolean).join(' · '));

function searchResultsHtml(I, groups) {
  if (!groups.length) return `<div class="nores">${esc(ui('search.none'))}</div>`;
  return groups.map((g) => `<div class="rgp" role="group" aria-label="${esc(typeName(g.type))}"><h5>${esc(typeName(g.type))}${g.total > g.items.length ? `<small>${esc(ui('search.top', { total: g.total, n: g.items.length }))}</small>` : ''}</h5>${g.items.map((n) => `<button role="option" data-id="${esc(n.id)}">${dot(I.colorOf(n.id))}<span>${esc(nm(n))}${nmAlt(n) ? `<small>${esc(nmAlt(n))}</small>` : ''}</span><em>${esc(resultHint(I, n))}</em></button>`).join('')}</div>`).join('');
}

let searchEntries = null, searchAct = -1;
function wireSearch() {
  const q = $('q'), box = $('results');
  const items = () => [...box.querySelectorAll('button[data-id]')];
  const close = () => { box.classList.remove('open'); q.setAttribute('aria-expanded', 'false'); searchAct = -1; };
  const setAct = (i) => { const l = items(); if (!l.length) return; searchAct = (i + l.length) % l.length; l.forEach((b, k) => { b.classList.toggle('act', k === searchAct); b.setAttribute('aria-selected', k === searchAct); }); l[searchAct].scrollIntoView({ block: 'nearest' }); };
  const choose = (id) => { close(); q.blur(); openNode(id); };
  q.addEventListener('input', () => {
    if (!searchEntries) searchEntries = buildSearch(IDX);
    const v = q.value.trim(); if (!v) { close(); return; }
    box.innerHTML = searchResultsHtml(IDX, runSearch(searchEntries, v, 5)); box.classList.add('open'); q.setAttribute('aria-expanded', 'true'); searchAct = -1;
    if (items().length) setAct(0);
  });
  q.addEventListener('focus', () => { if (q.value.trim() && box.innerHTML) { box.classList.add('open'); q.setAttribute('aria-expanded', 'true'); } });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setAct(searchAct + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(searchAct - 1); }
    else if (e.key === 'Enter') { const l = items(); if (l.length) { e.preventDefault(); choose(l[Math.max(0, searchAct)].dataset.id); } }
    else if (e.key === 'Escape') { close(); q.blur(); e.stopPropagation(); }
  });
  box.addEventListener('mousedown', (e) => e.preventDefault());
  box.addEventListener('click', (e) => { const b = e.target.closest('button[data-id]'); if (b) choose(b.dataset.id); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); q.focus(); } });
  return close;
}
