/* Thread detail: one thread enlarged. Ridge on top, one column per school below on the same time axis,
   theories listed under each school, relations drawn as lines (inside the thread) or tags (to other threads).
   Every school carries a label with its key person underneath. */

const tswitch = (I, cur) => `<div class="tsw" role="group" aria-label="${esc(ui('aria.switchThread'))}">${I.threads.map((t) => `<button data-thread="${t.id}" style="--c:${t.color}"${t.id === cur ? ' aria-current="true"' : ''}>${dot(t.color)}<span>${esc(nm(t))}</span></button>`).join('')}</div>`;

function crossTags(I, s, tid, max) {
  const list = (I.liftedOf.get(s.id) || []).filter((e) => { const o = e.from === s.id ? e.to : e.from; return I.threadOf(o) !== tid || I.get(o).type === 'root'; });
  const tag = (e) => { const out = e.from === s.id, o = I.get(out ? e.to : e.from), ot = I.tById.get(I.threadOf(o.id)); return `<button class="xtag" data-jump="${esc(o.id)}" title="${esc(L(e.note))}">${out ? '→' : '←'} ${esc(relName(e.type))} · ${esc(o.type === 'root' ? ui('type.root') : ot ? nm(ot) : '')} · ${esc(nmShort(o))}</button>`; };
  const shown = list.slice(0, max);
  return shown.map(tag).join('') + (list.length > max ? `<button class="xtag more" data-open="${esc(s.id)}">${esc(ui('thread.moreRels', { n: list.length - max }))}</button>` : '');
}

const theoryList = (I, th) => `<ul class="ct">${th.map((x) => { const ps = peopleNames(I, x.id); return `<li><button data-open="${esc(x.id)}"><i class="td"></i><span class="ty mono">${esc(x.year)}</span>${esc(nm(x))}</button>${ps ? `<small>${esc(ps)}</small>` : ''}</li>`; }).join('')}</ul>`;

function threadColumn(I, s, t) {
  const th = I.theoriesOf.get(s.id) || [];
  return `<div class="col${passFilter(s) ? '' : ' dim'}" data-s="${esc(s.id)}" style="--c:${t.color}"><button class="ch" data-open="${esc(s.id)}"><span class="cy mono">${esc(s.year)}</span><b>${esc(nm(s))}</b>${isEm(s) ? `<span class="badge">${esc(ui('badge.ongoing'))}</span>` : ''}${confTag(s)}</button>
    ${th.length ? theoryList(I, th) : `<p class="nt">${esc(ui('thread.noTheories'))}</p>`}
    <div class="cx">${crossTags(I, s, t.id, 3)}</div></div>`;
}

function rootsColumn(I, t) {
  const rs = I.of.root.filter((r) => (r.threads || []).includes(t.id));
  return `<div class="troots"><h4>${esc(ui('thread.rootsHead'))}</h4>${rs.length ? rs.map((r) => { const to = r.to && I.get(r.to); return `<button class="rt" data-open="${esc(r.id)}" data-root="${esc(r.id)}"><i class="rd"></i><b>${esc(nmShort(r))}</b><small>${esc(I.when(r))}${to ? ' → ' + esc(nmShort(to)) : ''}</small></button>`; }).join('') : `<p class="nt">${esc(ui('thread.noRoots'))}</p>`}</div>`;
}

let threadSeq = 0;
function renderThreadView() {
  const I = IDX, box = $('vThread'), t = I.tById.get(R.thread) || I.threads[0]; if (!t) return;
  const keep = box.dataset.cur === t.id ? box.scrollTop : 0; box.dataset.cur = t.id;
  const head = `${tswitch(I, t.id)}<div class="thd"><div class="thl">${titleIcon('map')}<div><h2>${dot(t.color)}${esc(nm(t))}</h2><p>${esc(L(t.question))} · ${esc(ui('thread.nSchools', { n: I.byThread[t.id].length }))}</p></div></div><div class="hint">${esc(ui('thread.hint'))}${mobile() ? '' : esc(ui('thread.hint2'))}</div></div>`;
  if (mobile()) { box.innerHTML = head + threadMobile(I, t); wireThread(box); box.scrollTop = keep; return; }
  const Wd = box.clientWidth; if (Wd < 50) return;
  const gut = Wd < 1100 ? 156 : 196, x0 = gut + 24, xr = Wd - 30, schools = I.byThread[t.id];
  const x = (y) => x0 + (y - I.Y0) / (I.Y1 - I.Y0) * (xr - x0);
  // ridge with every school labelled (name, key person below): label tracks above the curve, thin leaders down to the dots
  const lab = schools.map((s) => { const l1 = nmShort(s), kp = I.keyPersonOf(s), l2 = kp ? personShort(kp) : '', w = Math.max(tw(l1), tw(l2)) + 16; return { s, w, l1, l2, l: clamp(x(s.year) - w / 2, gut + 4, Wd - 16 - w) }; });
  const tr = []; lab.forEach((o) => { let k = 0; while (tr[k] != null && o.l < tr[k] + 6) k++; o.k = k; tr[k] = o.l + o.w; });
  const tracks = Math.max(1, tr.length), rh = 112, topM = 16 + tracks * 32, base = topM + rh, amp = (rh - 6) / t.max, H = base + 30;
  let d = ''; for (let y = I.Y0; y <= I.Y1; y += .5) d += `${d ? 'L' : 'M'}${x(y).toFixed(1)} ${(base - I.val(t.id, y) * amp).toFixed(1)}`;
  let sv = `<defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.color}" stop-opacity=".6"/><stop offset="1" stop-color="${t.color}" stop-opacity=".02"/></linearGradient><filter id="tglow" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  sv += `<g class="axis">`; for (let y = Math.ceil(I.Y0 / 20) * 20; y <= I.Y1; y += 20) sv += `<line x1="${x(y)}" y1="${topM - 6}" x2="${x(y)}" y2="${base + 6}"/><text x="${x(y)}" y="${base + 22}" text-anchor="middle">${y}</text>`;
  sv += `</g><path d="${d}L${x(I.Y1)} ${base}L${x(I.Y0)} ${base}Z" fill="url(#tg)"/><path d="${d}" fill="none" stroke="${t.color}" stroke-width="2" filter="url(#tglow)"/><line x1="${gut}" y1="${base}" x2="${xr + 10}" y2="${base}" stroke="${t.color}" stroke-opacity=".4"/>`;
  lab.forEach(({ s, w, l, k, l1, l2 }) => {
    const px = x(s.year), py = base - I.val(t.id, s.year) * amp, ly = 16 + k * 32;
    sv += `<g class="tdot${passFilter(s) ? '' : ' dim'}" data-open="${esc(s.id)}" data-s="${esc(s.id)}" tabindex="0" role="button" aria-label="${esc(nm(s))}, ${s.year}"><line class="lead" x1="${px}" y1="${ly + (l2 ? 18 : 5)}" x2="${px}" y2="${py}"/><circle cx="${px}" cy="${py}" r="9" fill="transparent"/><circle class="d${isEm(s) ? ' em' : ''}" cx="${px}" cy="${py}" r="3.6"/><text class="lab" x="${l + w / 2}" y="${ly}" text-anchor="middle">${esc(l1)}</text>${l2 ? `<text class="lab lab2" x="${l + w / 2}" y="${ly + 13}" text-anchor="middle">${esc(l2)}</text>` : ''}</g>`;
  });
  // columns, packed into bands so they stay near their year on the shared axis
  const cw = Wd < 1100 ? 140 : 160, gap = 10, minL = gut + 8, maxR = Wd - 12, bands = [];
  schools.forEach((s) => {
    const want = clamp(x(s.year) - cw / 2, minL, maxR - cw); let best = null;
    bands.forEach((b, i) => { const l = Math.max(want, b.right + gap); if (l + cw <= maxR) { const cost = (l - want) + i * 26; if (!best || cost < best.cost) best = { i, l, cost }; } });
    if (!best) { bands.push({ right: -1e9, items: [] }); best = { i: bands.length - 1, l: want }; }
    const b = bands[best.i]; b.items.push({ s, left: best.l }); b.right = best.l + cw;
  });
  const bandHtml = bands.map((b) => { let prev = 0; return `<div class="band">${b.items.map(({ s, left }) => { const m = left - prev; prev = left + cw; return `<div class="cw" style="margin-left:${m.toFixed(1)}px;width:${cw}px">${threadColumn(I, s, t)}</div>`; }).join('')}</div>`; }).join('');
  box.innerHTML = head + `<div class="tplot" style="width:${Wd}px"><svg class="tridge" width="${Wd}" height="${H}" viewBox="0 0 ${Wd} ${H}" role="img" aria-label="${esc(ui('thread.ridgeAria', { name: nm(t) }))}">${sv}</svg><svg class="tlinks" aria-hidden="true"></svg><div class="tgut" style="width:${gut}px">${rootsColumn(I, t)}</div><div class="tbands" style="padding-top:30px">${bandHtml}</div></div>`;
  const plot = box.querySelector('.tplot'); plot.style.minHeight = Math.max(plot.scrollHeight, 0) + 'px';
  drawThreadLinks(box, t, x, base, Wd);
  wireThread(box); box.scrollTop = keep;
}

function drawThreadLinks(box, t, x, base, Wd) {
  const I = IDX, plot = box.querySelector('.tplot'), svg = box.querySelector('.tlinks'); if (!plot || !svg) return;
  const pr = plot.getBoundingClientRect(), H = plot.scrollHeight; svg.setAttribute('width', Wd); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${Wd} ${H}`);
  const rect = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - pr.left, r: r.right - pr.left, t: r.top - pr.top, b: r.bottom - pr.top, cx: (r.left + r.right) / 2 - pr.left, cy: (r.top + r.bottom) / 2 - pr.top }; };
  const cols = {}; box.querySelectorAll('.col').forEach((c) => { cols[c.dataset.s] = { box: rect(c), head: rect(c.querySelector('.ch')) }; });
  const bandOf = {}; box.querySelectorAll('.band').forEach((b, i) => b.querySelectorAll('.col').forEach((c) => { bandOf[c.dataset.s] = i; }));
  let h = `<defs><marker id="tarr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#eaf0f8"/></marker></defs>`;
  // leaders from the year on the axis to the column
  I.byThread[t.id].forEach((s) => { const c = cols[s.id]; if (!c) return; const sx = x(s.year), y1 = c.box.t - 6, cx = clamp(sx, c.box.l + 12, c.box.r - 12); const m = (base + 24 + y1) / 2; h += `<path class="lead2" data-s="${esc(s.id)}" d="M${sx} ${base + 26}C${sx} ${m},${cx} ${m},${cx} ${y1}L${cx} ${c.box.t}" stroke="${t.color}"/>`; });
  // relations inside the thread
  I.liftedEdges.filter((e) => I.threadOf(e.from) === t.id && I.threadOf(e.to) === t.id && cols[e.from] && cols[e.to]).forEach((e) => {
    const A = cols[e.from], B = cols[e.to], ba = bandOf[e.from], bb = bandOf[e.to]; let d, mx, my;
    if (ba === bb) { const x1 = A.head.cx, x2 = B.head.cx, y = A.box.t - 4, up = Math.min(60, Math.abs(x2 - x1) * .25 + 14); d = `M${x1} ${y}C${x1} ${y - up},${x2} ${y - up},${x2} ${y - 2}`; mx = (x1 + x2) / 2; my = y - up * .75 - 2; }
    else if (ba < bb) { const x1 = A.box.cx, y1 = A.box.b, x2 = B.box.cx, y2 = B.box.t - 2, m = (y1 + y2) / 2; d = `M${x1} ${y1}C${x1} ${m},${x2} ${m},${x2} ${y2}`; mx = (x1 + x2) / 2; my = m - 3; }
    else { const x1 = A.box.cx, y1 = A.box.t, x2 = B.box.cx, y2 = B.box.b + 2, m = (y1 + y2) / 2; d = `M${x1} ${y1}C${x1} ${m},${x2} ${m},${x2} ${y2}`; mx = (x1 + x2) / 2; my = m - 3; }
    h += `<g class="tl ${REL_KIND[e.type]}" data-a="${esc(e.from)}" data-b="${esc(e.to)}"><title>${esc(nm(I.get(e.from)))} → ${esc(relName(e.type))} → ${esc(nm(I.get(e.to)))}: ${esc(L(e.note))}</title><path d="${d}" marker-end="url(#tarr)"/><text x="${mx}" y="${my}" text-anchor="middle">${esc(relName(e.type))}</text></g>`;
  });
  // sources that flow directly into a school of this thread
  box.querySelectorAll('.rt').forEach((b) => { const r = I.get(b.dataset.root), to = r && r.to; if (!to || I.threadOf(to) !== t.id) return; const s = I.get(to); if (!s || s.type !== 'school') return; const a = rect(b), c = cols[to]; if (!c) return; const px = x(s.year), py = base - I.val(t.id, s.year) * ((112 - 6) / t.max);
    h += `<path class="rflow" d="M${a.r} ${a.cy}C${a.r + 80} ${a.cy},${px - 80} ${py},${px - 4} ${py}"/>`; });
  svg.innerHTML = h;
}

function threadHover(box, sid, on) {
  const svg = box.querySelector('.tlinks'); if (!svg) return;
  const rel = new Set([sid]); svg.querySelectorAll('.tl').forEach((g) => { const hit = on && (g.dataset.a === sid || g.dataset.b === sid); g.classList.toggle('hl', hit); if (hit) { rel.add(g.dataset.a); rel.add(g.dataset.b); } });
  svg.classList.toggle('focus', !!on); svg.querySelectorAll('.lead2').forEach((p) => p.classList.toggle('hl', on && p.dataset.s === sid));
  box.querySelectorAll('.col').forEach((c) => c.classList.toggle('rel', on && rel.has(c.dataset.s)));
  box.classList.toggle('tfocus', !!on);
}

function wireThread(box) {
  if (box._wired) return; box._wired = true;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-thread],[data-open],[data-jump],[data-more]'); if (!b) return;
    if (b.dataset.thread) { go({ view: 'map', sub: 'thread', thread: b.dataset.thread }); return; }
    if (b.dataset.open) { openNode(b.dataset.open); return; }
    if (b.dataset.jump) { const o = b.dataset.jump, ot = IDX.threadOf(o); if (R.c.length === 1 && IDX.get(o).type === 'school') { openNode(o); return; } go({ view: 'map', sub: 'thread', thread: ot || R.thread, n: o }); }
  });
  box.addEventListener('keydown', (e) => { const g = e.target.closest && e.target.closest('.tdot'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openNode(g.dataset.open); } });
  const over = (e, on) => { const c = e.target.closest && e.target.closest('.col,.tdot'); if (c && c.dataset.s) threadHover(box, c.dataset.s, on); };
  box.addEventListener('mouseover', (e) => over(e, true)); box.addEventListener('mouseout', (e) => over(e, false));
  box.addEventListener('focusin', (e) => over(e, true)); box.addEventListener('focusout', (e) => over(e, false));
}

/* phone: a vertical list of schools; each opens to show its theories */
function threadMobile(I, t) {
  const rs = I.of.root.filter((r) => (r.threads || []).includes(t.id));
  const cross = (s) => crossTags(I, s, t.id, 2);
  return `<details class="mroots"><summary>${esc(ui('thread.mRoots', { n: rs.length }))}</summary>${rs.map((r) => `<button class="stop" data-open="${esc(r.id)}"><em>${esc(yearLabel(r.year))}</em><b>${esc(nmShort(r))}</b><span>${esc(L(r.summary))}</span></button>`).join('')}</details>`
    + `<div class="mlist" style="--c:${t.color}">${I.byThread[t.id].map((s) => { const th = I.theoriesOf.get(s.id) || [], kp = I.keyPersonOf(s);
      return `<details class="ms${passFilter(s) ? '' : ' dim'}"><summary><em class="mono">${esc(s.year)}</em><b>${esc(nm(s))}</b>${isEm(s) ? `<span class="badge">${esc(ui('badge.ongoing'))}</span>` : ''}${confTag(s)}${kp ? `<small class="mkp">${esc(nm(kp))}</small>` : ''}<small>${esc(L(s.landmark))}</small></summary>
        <div class="mbody"><button class="btn" data-open="${esc(s.id)}">${esc(ui('thread.viewSchool'))}</button>${th.length ? theoryList(I, th) : `<p class="nt">${esc(ui('thread.noTheories'))}</p>`}<div class="cx">${cross(s)}</div></div></details>`; }).join('')}</div>`;
}

function stepThread(dir) {
  const I = IDX, i = I.threads.findIndex((x) => x.id === R.thread), n = I.threads.length; if (i < 0) return;
  go({ view: 'map', sub: 'thread', thread: I.threads[(i + dir + n) % n].id });
}
