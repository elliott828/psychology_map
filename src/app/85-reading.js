/* Reading: the reading-path finder, "start here", and every book grouped by thread. */

const workThread = (I, w) => I.threadOf(w.id);
function startHere(I, tid) {
  const l = I.of.work.filter((w) => workThread(I, w) === tid && w.depth === 'easy').sort((a, b) => a.year - b.year);
  return l[0] || null;
}
const ratingBadge = (I, w) => { const r = doubanRating(I, w); return r >= 0 ? `<span class="badge soft">★ ${r.toFixed(1)}</span>` : ''; };
const workCard = (I, w) => { const alt = nmAlt(w); return `<button class="book" data-open="${esc(w.id)}" style="--c:${I.colorOf(w.id)}"><span class="bt"><b>${esc(nm(w))}</b>${alt ? `<small>${esc(alt)}</small>` : ''}${confTag(w)}</span><span class="bm">${esc(w.author)} · ${esc(w.year)}</span><span class="bs">${esc(L(w.summary))}</span><span class="btags"><span class="badge">${esc(depthName(w.depth))}</span><span class="badge soft">${esc(roleName(w.role))}</span>${ratingBadge(I, w)}</span></button>`; };

/* ---- reading path rendering (pure) ---- */
function bookCard(I, w) {
  const alt = nmAlt(w);
  const cov = coverImg(I, w, 'sm');
  return `<div class="pbook${cov ? ' hc' : ''}">${cov}<div class="pbody"><button class="pbt" data-go="${esc(w.id)}"><b>${esc(nm(w))}</b>${alt ? `<small>${esc(alt)}</small>` : ''}</button><div class="pbm">${esc(w.author || '')}${w.author ? ' · ' : ''}${esc(w.year)}${w.depth ? ` · <span class="badge soft">${esc(depthName(w.depth))}</span>` : ''}</div>${editionsHtml(I, w, false)}</div></div>`;
}
function pathItem(I, it, dir) {
  const o = I.get(it.id), b = it.book && I.get(it.book);
  return `<div class="pitem"><div class="prel"><button class="lnk" data-go="${esc(o.id)}">${dot(I.colorOf(o.id))}${esc(nmShort(o))}</button><span class="rtag">${esc(ui('path.' + dir + '.' + it.rel))}</span></div>${b ? bookCard(I, b) : `<p class="note pnb">${esc(ui('path.noBook'))}</p>`}</div>`;
}
/* the path of one theory or school as HTML: read first | this | read next */
function pathHtml(I, id, opt) {
  const p = readingPath(I, id); if (!p) return '';
  const n = I.get(id), compact = !!(opt && opt.compact);
  const ups = p.up.map((it) => pathItem(I, it, 'up')).join('') || `<p class="note">${esc(ui('path.noUp'))}</p>`;
  const downs = p.down.map((it) => pathItem(I, it, 'down')).join('') || `<p class="note">${esc(ui('path.noDown'))}</p>`;
  const mine = p.ladder.map((l) => { const b = I.get(l.id); return `<div class="pitem"><div class="prel"><span class="rtag">${esc(depthName(l.depth))}${l.viaSchool ? ' · ' + esc(ui('path.viaSchool')) : ''}</span></div>${bookCard(I, b)}</div>`; }).join('') || `<p class="note">${esc(ui('path.noBooks'))}</p>`;
  return `<div class="rpath${compact ? ' compact' : ''}"><section class="pcol up"><h4>${esc(ui('path.before'))}</h4>${ups}</section><div class="parr" aria-hidden="true">→</div><section class="pcol me"><h4>${esc(ui(n.type === 'school' ? 'path.thisSchool' : 'path.thisTheory'))}</h4>${mine}</section><div class="parr" aria-hidden="true">→</div><section class="pcol dn"><h4>${esc(ui('path.after'))}</h4>${downs}</section></div>`;
}

/* search over theories and schools for the finder; matches Chinese and English names */
function pathCandidates(I, query, max) {
  const q = fold(query).trim(); if (!q) return [];
  const out = [];
  pathTargets(I).forEach((n) => {
    const keys = [n.title && n.title.zh, n.title && n.title.en, n.title && n.title.enShort, n.id].filter(Boolean).map(fold);
    let sc = -1; keys.forEach((k) => { const i = k.indexOf(q); if (i < 0) return; const s = (k === q ? 0 : i === 0 ? 1 : 2); if (sc < 0 || s < sc) sc = s; });
    if (sc >= 0) out.push({ n, sc });
  });
  return out.sort((a, b) => a.sc - b.sc || (a.n.type === 'school' ? 0 : 1) - (b.n.type === 'school' ? 0 : 1) || (b.n.influence || 0) - (a.n.influence || 0)).slice(0, max || 8).map((x) => x.n);
}
const pathResultsHtml = (I, list) => (list.length ? list.map((n) => `<button role="option" data-pick="${esc(n.id)}">${dot(I.colorOf(n.id))}<span>${esc(nm(n))}${nmAlt(n) ? `<small>${esc(nmAlt(n))}</small>` : ''}</span><em>${esc(typeName(n.type))}</em></button>`).join('') : `<div class="nores">${esc(ui('reading.noMatch'))}</div>`);

function pathPanel(I, id) {
  const n = I.get(id);
  if (!n || (n.type !== 'theory' && n.type !== 'school')) return `<section class="pathbox"><p class="note">${esc(ui('reading.pathBad'))}</p><button class="btn" data-pathclear>${esc(ui('reading.pathClose'))}</button></section>`;
  const s = n.type === 'theory' ? I.get(n.school) : null;
  return `<section class="pathbox"><div class="phd"><div><span class="dtype">${esc(typeName(n.type))}${s ? ' · ' + esc(nm(s)) : ''}</span><h3>${dot(I.colorOf(n.id))}${esc(nm(n))}${nmAlt(n) ? ` <small>${esc(nmAlt(n))}</small>` : ''}</h3></div><div class="pha"><button class="btn" data-open="${esc(n.id)}">${esc(ui('reading.pathDetail'))}</button><button class="btn" data-pathclear>${esc(ui('reading.pathClose'))}</button></div></div>${pathHtml(I, id, {})}</section>`;
}

function renderReading() {
  const I = IDX, box = $('vReading'), keep = box.scrollTop;
  const roles = [...new Set(I.of.work.map((w) => w.role).filter(Boolean))].sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b));
  const ok = (w) => (!U.readDepth.size || U.readDepth.has(w.depth)) && (!U.readRole.size || U.readRole.has(w.role));
  const starts = I.threads.map((t) => ({ t, w: startHere(I, t.id) })).filter((x) => x.w);
  const groups = I.threads.map((t) => ({ t, list: I.of.work.filter((w) => workThread(I, w) === t.id && ok(w)).sort((a, b) => DEPTH_ORDER.indexOf(a.depth) - DEPTH_ORDER.indexOf(b.depth) || a.year - b.year) }));
  const orphan = I.of.work.filter((w) => !workThread(I, w) && ok(w));
  const total = groups.reduce((a, g) => a + g.list.length, 0) + orphan.length;
  const pq = ($('pathq') && $('pathq').value) || '';
  box.innerHTML = `<div class="vhead"><h2>${titleIcon('reading')}<span>${esc(ui('nav.reading'))}</span></h2><p>${esc(ui('reading.lead', { n: I.of.work.length }))}</p></div>
  <section class="pfind"><h3>${esc(ui('reading.pathTitle'))}</h3><p class="note">${esc(ui('reading.pathLead'))}</p><div class="pfin"><input id="pathq" type="search" value="${esc(pq)}" placeholder="${esc(ui('reading.pathPlaceholder'))}" autocomplete="off" aria-label="${esc(ui('reading.pathAria'))}"><div id="pathres" class="pres" role="listbox" aria-label="${esc(ui('reading.pathAria'))}"></div></div></section>
  ${R.path ? pathPanel(I, R.path) : ''}
  <section class="start"><h3>${esc(ui('reading.start'))}</h3><div class="startgrid">${starts.map(({ t, w }) => `<button class="sbk" data-open="${esc(w.id)}" style="--c:${t.color}"><span class="sk">${dot(t.color)}${esc(nm(t))}</span><b>${esc(nm(w))}</b><small>${esc(w.author)} · ${esc(w.year)}</small></button>`).join('')}</div></section>
  <div class="ctl"><span class="cl">${esc(ui('reading.difficulty'))}</span><div class="chipsrow" role="group" aria-label="${esc(ui('reading.filterDepth'))}">${DEPTH_ORDER.map((d) => `<button class="fchip" data-rdepth="${d}" aria-pressed="${U.readDepth.has(d)}">${esc(depthName(d))}</button>`).join('')}</div>
  <span class="cl">${esc(ui('reading.kind'))}</span><div class="chipsrow" role="group" aria-label="${esc(ui('reading.filterRole'))}">${roles.map((r) => `<button class="fchip" data-rrole="${esc(r)}" aria-pressed="${U.readRole.has(r)}">${esc(roleName(r))}</button>`).join('')}</div>${U.readDepth.size + U.readRole.size ? `<button class="link" data-rclear>${esc(ui('reading.clear'))}</button>` : ''}<span class="cl cnt2">${esc(ui('reading.total', { n: total }))}</span></div>
  ${groups.filter((g) => g.list.length).map((g) => `<section class="rg2" style="--c:${g.t.color}"><h3>${dot(g.t.color)}${esc(nm(g.t))}<span class="cnt">${g.list.length}</span></h3><div class="books">${g.list.map((w) => workCard(I, w)).join('')}</div></section>`).join('')}
  ${orphan.length ? `<section class="rg2"><h3>${esc(ui('reading.orphan'))}<span class="cnt">${orphan.length}</span></h3><div class="books">${orphan.map((w) => workCard(I, w)).join('')}</div></section>` : ''}
  ${total ? '' : `<p class="note">${esc(ui('reading.none'))}</p>`}`;
  if (pq) { $('pathres').innerHTML = pathResultsHtml(I, pathCandidates(I, pq, 8)); $('pathres').classList.add('open'); }
  if (!box._wired) {
    box._wired = true;
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const tg = (set, v) => { if (set.has(v)) set.delete(v); else set.add(v); renderReading(); };
      if (b.dataset.pick) { const qi = $('pathq'); if (qi) qi.value = ''; go({ view: 'reading', path: b.dataset.pick }); return; }
      if ('pathclear' in b.dataset) { go({ view: 'reading', path: null }); return; }
      if (b.dataset.go) { openNode(b.dataset.go); return; }
      if (b.dataset.open) openNode(b.dataset.open);
      else if (b.dataset.rdepth) tg(U.readDepth, b.dataset.rdepth);
      else if (b.dataset.rrole) tg(U.readRole, b.dataset.rrole);
      else if ('rclear' in b.dataset) { U.readDepth.clear(); U.readRole.clear(); renderReading(); }
    });
    box.addEventListener('input', (e) => {
      if (!e.target || e.target.id !== 'pathq') return;
      const res = $('pathres'), v = e.target.value.trim();
      if (!v) { res.innerHTML = ''; res.classList.remove('open'); return; }
      res.innerHTML = pathResultsHtml(IDX, pathCandidates(IDX, v, 8)); res.classList.add('open');
    });
    box.addEventListener('keydown', (e) => { if (e.target && e.target.id === 'pathq' && e.key === 'Enter') { const first = $('pathres').querySelector('[data-pick]'); if (first) { e.preventDefault(); e.target.value = ''; go({ view: 'reading', path: first.dataset.pick }); } } });
  }
  box.scrollTop = keep;
}
