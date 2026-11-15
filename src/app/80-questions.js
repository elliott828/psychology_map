/* Questions: life questions (side-by-side explanations), debates, popular misreadings. */

function questionTab(I, q) { if (q === 'debates' || I.debates.some((d) => d.id === q)) return 'debates'; if (q === 'myths' || I.myths.some((m) => m.id === q)) return 'myths'; return 'life'; }
const lensThread = (I, id) => I.tById.get(I.threadOf(id));
const nodeKind = (n) => typeName(n.type);

function renderLife(I, q) {
  const sel = I.questions.find((x) => x.id === q);
  if (sel) {
    const ts = new Set(sel.lenses.map((l) => I.threadOf(l.node)).filter(Boolean));
    return `<div class="qd"><button class="btn" data-qback>← ${esc(ui('q.backAll'))}</button><h2>${esc(L(sel.title))}</h2><p class="qlead">${esc(ui('q.lead', { n: ts.size }))}</p>
    <div class="lenses">${sel.lenses.map((l) => { const n = I.get(l.node), t = lensThread(I, l.node); if (!n) return ''; const s = I.get(I.schoolOf(l.node));
      return `<article class="lens" style="--c:${t ? t.color : NEUTRAL}"><div class="lh"><span class="lt">${dot(t ? t.color : NEUTRAL)}${esc(t ? nm(t) : '')}</span><span class="lk">${esc(nodeKind(n))}</span></div><button class="lnk big" data-open="${esc(n.id)}">${esc(nm(n))}${confTag(n)}</button>${n.type !== 'school' && s ? `<div class="from">${esc(ui('q.belongsTo', { name: nm(s) }))}</div>` : ''}<p>${esc(L(l.take))}</p><div class="les">${isEm(n) ? `<span class="badge">${esc(ui('badge.ongoing'))}</span>` : ''}${n.evidence ? `<span class="badge">${esc(evidName(n.evidence))}</span>` : (s && s.evidence ? `<span class="badge">${esc(evidName(s.evidence))}</span>` : '')}</div></article>`; }).join('')}</div></div>`;
  }
  return `<div class="qgrid">${I.questions.map((x) => { const ts = [...new Set(x.lenses.map((l) => I.threadOf(l.node)).filter(Boolean))].map((id) => I.tById.get(id)).filter(Boolean);
    return `<button class="qcard" data-q="${esc(x.id)}"><b>${esc(L(x.title))}</b><span class="qn">${esc(ui('q.cardMeta', { a: x.lenses.length, b: ts.length }))}</span><span class="qdots" aria-hidden="true">${ts.map((t) => dot(t.color)).join('')}</span></button>`; }).join('')}</div>`;
}

function renderDebates(I) {
  return `<div class="dlist">${I.debates.map((d) => `<article class="deb" data-id="${esc(d.id)}"><div class="dy mono">${esc(d.year)}</div><div class="db"><h3>${esc(L(d.title))}</h3><p class="ds">${esc(L(d.summary))}</p><div class="sides">${d.sides.map((s) => { const n = I.get(s.node); if (!n) return ''; return `<div class="side" style="--c:${I.colorOf(n.id)}"><button class="lnk" data-open="${esc(n.id)}">${dot(I.colorOf(n.id))}${esc(nm(n))}</button><p>${esc(L(s.position))}</p></div>`; }).join('')}</div></div></article>`).join('')}</div>`;
}

function renderMyths(I) {
  return `<div class="mlist2">${I.myths.map((m) => `<article class="myth" data-id="${esc(m.id)}"><div class="mc"><span class="verdict ${VERDICT_CLASS[typeof m.verdict === 'string' ? m.verdict : (m.verdict && m.verdict.zh)] || ''}">${esc(verdictText(m))}</span><p class="claim2">“${esc(L(m.claim))}”</p></div><p class="corr"><b>${esc(ui('q.correction'))}</b>${esc(L(m.correction))}</p><div class="chips">${(m.related || []).map((id) => (I.get(id) ? `<button class="lnk" data-open="${esc(id)}">${dot(I.colorOf(id))}${esc(nm(I.get(id)))}</button>` : '')).join('')}</div></article>`).join('')}</div>`;
}

function renderQuestions() {
  const I = IDX, box = $('vQuestions'), tab = questionTab(I, R.q), keep = box.scrollTop;
  const tabs = [['life', ui('q.tabLife'), I.questions.length], ['debates', ui('q.tabDebates'), I.debates.length], ['myths', ui('q.tabMyths'), I.myths.length]];
  const lead = ui('q.lead.' + tab);
  box.innerHTML = `<div class="vhead"><h2>${titleIcon('questions')}<span>${esc(ui('nav.questions'))}</span></h2><p>${esc(lead)}</p></div><div class="qtabs" role="tablist" aria-label="${esc(ui('nav.questions'))}">${tabs.map(([k, l, n]) => `<button role="tab" data-qtab="${k}" aria-selected="${k === tab}">${esc(l)}<span class="cnt">${n}</span></button>`).join('')}</div><div class="qbody" role="tabpanel">${tab === 'life' ? renderLife(I, R.q) : tab === 'debates' ? renderDebates(I) : renderMyths(I)}</div>`;
  if (!box._wired) {
    box._wired = true;
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.qtab) { go({ q: b.dataset.qtab === 'life' ? null : b.dataset.qtab }); return; }
      if (b.dataset.q) { go({ q: b.dataset.q }); return; }
      if ('qback' in b.dataset) { go({ q: null }); return; }
      if (b.dataset.open) openNode(b.dataset.open);
    });
  }
  const hit = R.q && box.querySelector(`[data-id="${CSS.escape(R.q)}"]`);
  if (hit) { hit.classList.add('sel'); hit.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); } else box.scrollTop = keep;
}
