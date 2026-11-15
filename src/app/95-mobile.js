/* Phone layout (<= 760px): ridge cards, bottom tab bar, pull-down bottom drawer. */

function cardStop(I, n) {
  const x = (I.liftedOf.get(n.id) || []).find((e) => { const o = e.from === n.id ? e.to : e.from; return I.threadOf(o) !== I.threadOf(n.id); });
  let tag = '';
  if (x) { const out = x.from === n.id, o = I.get(out ? x.to : x.from), ot = I.tById.get(I.threadOf(o.id)); tag = `<button class="xtag" data-jump="${esc(o.id)}">${out ? '→' : '←'} ${esc(relName(x.type))} · ${esc(o.type === 'root' ? ui('type.root') : ot ? nm(ot) : '')} · ${esc(nmShort(o))}</button>`; }
  const when = n.type === 'root' ? yearLabel(n.year) : n.year, kp = n.type === 'school' ? I.keyPersonOf(n) : null;
  return `<div class="stop"><button class="sb" data-open="${esc(n.id)}"><em>${esc(when)}</em><b>${esc(nmShort(n))}${isEm(n) ? ` <span class="badge">${esc(ui('badge.ongoing'))}</span>` : ''}${confTag(n)}</b>${kp ? `<span class="mkp">${esc(nm(kp))}</span>` : ''}<span>${esc(I.desc(n))}</span></button>${tag}</div>`;
}

function renderCards() {
  const I = IDX, box = $('vCards'), keep = box.scrollTop;
  const open = (id) => (U.openCards.has(id) ? ' open' : ''), exp = (id) => (U.openCards.has(id) ? 'true' : 'false');
  box.innerHTML = `<div class="card src${open('_src')}" style="--c:#7df0e2"><button class="ch2" data-card="_src" aria-expanded="${exp('_src')}"><i class="chip"></i><b>${esc(ui('cards.sources'))}</b><em>${esc(ui('cards.sourcesMeta', { n: I.of.root.length }))}</em><small>${esc(ui('cards.sourcesNote'))}</small></button><div class="stops">${I.of.root.map((r) => cardStop(I, r)).join('')}</div></div>`
    + I.threads.map((t) => {
      let d = ''; for (let y = I.Y0; y <= I.Y1; y += 2) d += `${d ? 'L' : 'M'}${((y - I.Y0) / (I.Y1 - I.Y0) * 300).toFixed(1)} ${(34 - I.val(t.id, y) / I.gmax * 31).toFixed(1)}`;
      const list = I.byThread[t.id];
      return `<div class="card${open(t.id)}" style="--c:${t.color}"><button class="ch2" data-card="${t.id}" aria-expanded="${exp(t.id)}"><i class="chip"></i><b>${esc(nm(t))}</b><em>${esc(ui('cards.count', { n: list.length }))}${list.length ? ' · ' + list[0].year + esc(ui('cards.toNow')) : ''}</em><small>${esc(L(t.question))}</small><svg viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true"><path d="${d}L300 34L0 34Z" fill="${t.color}" fill-opacity=".25"/><path d="${d}" fill="none" stroke="${t.color}" stroke-width="1.7" vector-effect="non-scaling-stroke"/></svg></button>
        <div class="stops"><button class="btn wide" data-tthread="${t.id}">${esc(ui('cards.viewAll'))} →</button>${list.filter((s) => s.tier === 1 || isEm(s)).map((s) => cardStop(I, s)).join('')}</div></div>`;
    }).join('');
  if (!box._wired) {
    box._wired = true;
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.card) { const c = b.parentNode, o = c.classList.toggle('open'); b.setAttribute('aria-expanded', o); if (o) U.openCards.add(b.dataset.card); else U.openCards.delete(b.dataset.card); }
      else if (b.dataset.tthread) go({ view: 'map', sub: 'thread', thread: b.dataset.tthread });
      else if (b.dataset.open) openNode(b.dataset.open);
      else if (b.dataset.jump) { const o = b.dataset.jump, ot = I.threadOf(o); if (R.c.length === 1 && I.get(o).type === 'school') openNode(o); else go({ view: 'map', sub: 'thread', thread: ot || R.thread, n: o }); }
    });
  }
  box.scrollTop = keep;
}

/* pull the bottom drawer down to close it */
function wireDrawerDrag() {
  const panel = $('panel'), grip = document.createElement('div'); grip.className = 'grip'; grip.setAttribute('aria-hidden', 'true'); panel.insertBefore(grip, $('pin'));
  let drag = null;
  panel.addEventListener('pointerdown', (e) => { if (!mobile() || !e.target.closest('.grip,.dtop') || e.target.closest('button')) return; drag = { y: e.clientY, dy: 0 }; panel.classList.add('dragging'); panel.setPointerCapture(e.pointerId); });
  panel.addEventListener('pointermove', (e) => { if (!drag) return; drag.dy = Math.max(0, e.clientY - drag.y); panel.style.transform = `translateY(${drag.dy}px)`; });
  const end = () => { if (!drag) return; const close = drag.dy > 90; drag = null; panel.classList.remove('dragging'); panel.style.transform = ''; if (close) closeNode(); };
  panel.addEventListener('pointerup', end); panel.addEventListener('pointercancel', end);
}
