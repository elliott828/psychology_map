/* Structure: what today's psychology is made of. 4 explanation levels x 5 kinds of activity; every school sits in one cell. */

function structureCells(I) {
  const cells = {}; LEVEL_ORDER.forEach((l) => ACT_ORDER.forEach((a) => { cells[l + '|' + a] = []; }));
  I.of.school.forEach((s) => { const k = (s.level || '') + '|' + (s.activity || ''); if (cells[k]) cells[k].push(s); });
  Object.values(cells).forEach((l) => l.sort((a, b) => (isEm(a) - isEm(b)) || (b.influence || 0) - (a.influence || 0) || a.year - b.year));
  return cells;
}
const stag = (I, s) => `<button class="stag${isEm(s) ? ' em' : ''}${passFilter(s) ? '' : ' dim'}" data-open="${esc(s.id)}" data-t="${esc(s.thread)}" style="--c:${I.colorOf(s.id)}" title="${esc(nm(s))} · ${esc(s.year)}${isEm(s) ? ' · ' + esc(ui('badge.ongoing')) : ''}"><i></i>${esc(nmShort(s))}</button>`;

function renderStructure() {
  const I = IDX, box = $('vStructure'), cells = structureCells(I), n = I.of.school.length;
  const intro = `<div class="vhead"><h2>${titleIcon('structure')}<span>${esc(ui('structure.title'))}</span></h2><p>${esc(ui('structure.lead', { n }))}</p><div class="tkey">${I.threads.map((t) => `<span>${dot(t.color)}${esc(nm(t))}</span>`).join('')}</div></div>`;
  if (mobile()) {
    box.innerHTML = intro + LEVEL_ORDER.map((l, i) => `<details class="lvl"${i === 0 ? ' open' : ''}><summary><b>${esc(levelName(l))}</b><small>${esc(levelNote(l))} · ${ACT_ORDER.reduce((a, k) => a + cells[l + '|' + k].length, 0)}</small></summary>${ACT_ORDER.map((a) => { const list = cells[l + '|' + a]; return list.length ? `<h4>${esc(actName(a))}<span class="cnt">${list.length}</span></h4><div class="tags">${list.map((s) => stag(I, s)).join('')}</div>` : ''; }).join('')}</details>`).join('');
  } else {
    box.innerHTML = intro + `<div class="smx" role="table" aria-label="${esc(ui('structure.aria'))}"><div class="smh" role="row"><span></span>${ACT_ORDER.map((a) => `<b role="columnheader">${esc(actName(a))}</b>`).join('')}</div>${LEVEL_ORDER.map((l) => `<div class="smr" role="row"><div class="slab" role="rowheader"><b>${esc(levelName(l))}</b><small>${esc(levelNote(l))}</small></div>${ACT_ORDER.map((a) => { const list = cells[l + '|' + a]; return `<div class="sc${list.length ? '' : ' empty'}" role="cell" aria-label="${esc(ui('structure.cellAria', { level: levelName(l), act: actName(a), n: list.length }))}"><span class="cnt">${list.length}</span><div class="tags">${list.map((s) => stag(I, s)).join('')}</div></div>`; }).join('')}</div>`).join('')}</div>`;
  }
  if (!box._wired) {
    box._wired = true;
    box.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) openNode(b.dataset.open); });
    const hl = (e, on) => { const b = e.target.closest && e.target.closest('.stag'); if (!b) return; if (on) box.dataset.hl = b.dataset.t; else delete box.dataset.hl; box.querySelectorAll('.stag').forEach((x) => x.classList.toggle('same', on && x.dataset.t === b.dataset.t)); };
    box.addEventListener('mouseover', (e) => hl(e, true)); box.addEventListener('mouseout', (e) => hl(e, false)); box.addEventListener('focusin', (e) => hl(e, true)); box.addEventListener('focusout', (e) => hl(e, false));
  }
}
