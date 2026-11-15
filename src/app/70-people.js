/* People: who proposed these ideas. One thin life-line per person, nine swimlanes, theory years marked on the line.
   By default the time before modern psychology is collapsed: the axis starts in 1870, people born earlier are drawn from the left edge
   with their birth year, and people who died before 1879 are listed in a narrow column. The expanded view compresses the ancient part
   with the same scale as the sources on the hourglass. */

const MODERN = 1879, CLIP_Y = 1870;
const personInfluence = (I, p) => (I.theoriesOfPerson.get(p.id) || []).reduce((a, t) => a + (t.influence || 0), 0);
const personLane = (I, p) => I.threadOf(p.id) || '_';

/* where a life ends: known death, today for the living, otherwise an estimate from the birth year and theory years */
function personEnd(I, p, ymax) {
  const th = I.theoriesOfPerson.get(p.id) || [], live = p.died == null && p.born != null && p.born >= 1915;
  if (p.died != null) return { end: p.died, live: false, unknownEnd: false };
  if (live) return { end: ymax, live: true, unknownEnd: false };
  return { end: Math.min(ymax, Math.max((p.born != null ? p.born : 0) + 70, ...th.map((q) => q.year + 1))), live: false, unknownEnd: true };
}
/* before the modern era: known to have died before 1879 (or, with an unknown death, estimated to have) */
const isPreModern = (I, p, ymax) => (p.died != null ? p.died < MODERN : p.born != null && personEnd(I, p, ymax).end < MODERN);

function peopleGroups(I) {
  const g = {}; I.threads.forEach((t) => { g[t.id] = []; }); g._ = [];
  I.of.person.forEach((p) => { (g[personLane(I, p)] || g._).push(p); });
  return g;
}

function peopleControls(I, full) {
  return `<div class="vhead"><h2>${titleIcon('people')}<span>${esc(ui('people.title'))}</span></h2><p>${esc(ui('people.lead'))}</p></div>
  <div class="ctl"><span class="cl">${esc(ui('people.sort'))}</span><div class="seg" role="group" aria-label="${esc(ui('people.sort'))}"><button data-psort="year" aria-pressed="${U.peopleSort === 'year'}">${esc(ui('people.sortYear'))}</button><button data-psort="infl" aria-pressed="${U.peopleSort === 'infl'}">${esc(ui('people.sortInfl'))}</button></div>
  <span class="cl">${esc(ui('people.range'))}</span><div class="seg" role="group" aria-label="${esc(ui('people.range'))}"><button data-pfull="0" aria-pressed="${!full}">${esc(ui('people.rangeModern'))}</button><button data-pfull="1" aria-pressed="${full}">${esc(ui('people.rangeFull'))}</button></div>
  <span class="cl">${esc(ui('people.thread'))}</span><div class="chipsrow" role="group" aria-label="${esc(ui('people.filterAria'))}"><button class="fchip" data-pthread="" aria-pressed="${!U.peopleThread}">${esc(ui('people.all'))}</button>${I.threads.map((t) => `<button class="fchip" data-pthread="${t.id}" aria-pressed="${U.peopleThread === t.id}">${dot(t.color)}${esc(nm(t))}</button>`).join('')}</div></div>
  ${U.peopleSort === 'infl' ? `<p class="note ctl2">${esc(ui('people.inflNote'))}</p>` : ''}${full ? '' : `<p class="ctl3">${esc(ui('people.clipNote', { y: CLIP_Y }))}</p>`}`;
}

function renderPeople() {
  const I = IDX, box = $('vPeople'), groups = peopleGroups(I), lanes = I.threads.filter((t) => !U.peopleThread || t.id === U.peopleThread), full = !!R.full, ymax = I.Y1;
  const keep = box.scrollTop; const ctl = peopleControls(I, full);
  if (mobile()) {
    box.innerHTML = ctl + lanes.map((t) => {
      const l = groups[t.id].slice().sort((a, b) => (isPreModern(I, a, ymax) - isPreModern(I, b, ymax)) || (a.born ?? 9999) - (b.born ?? 9999));
      return `<section class="plane" style="--c:${t.color}"><h3>${dot(t.color)}${esc(nm(t))}<span class="cnt">${l.length}</span></h3>${l.map((p) => `<button class="prow" data-open="${esc(p.id)}"><b>${esc(nm(p))}</b><em class="mono">${esc(lifeSpan(p))}</em><span>${esc(L(p.role))}${isPreModern(I, p, ymax) ? ` <i class="pretag">${esc(ui('people.preTag'))}</i>` : ''}</span></button>`).join('')}</section>`;
    }).join('');
    wirePeople(box); box.scrollTop = keep; return;
  }
  const W = box.clientWidth; if (W < 50) return;
  const preCol = full ? 0 : 206, headW = 150, unkW = 176, plotL = headW + 14, plotW = Math.max(300, W - plotL - unkW - 34 - preCol);
    // x: year -> pixel. Collapsed: linear from 1870. Expanded: compressed source scale before 1862, linear after.
  const preW = Math.min(190, plotW * .22), L0 = 1862;
  const x = full ? (y) => (y < L0 ? rootU(y) * preW : preW + (y - L0) / (ymax - L0) * (plotW - preW)) : (y) => (Math.max(y, CLIP_Y) - CLIP_Y) / (ymax - CLIP_Y) * plotW;
  const ticks = [];
  if (full) [-400, 1600, 1800].forEach((y) => ticks.push([y, yearLabel(y)]));
  for (let y = 1880; y <= ymax; y += 20) ticks.push([y, String(y)]);
  const tickHtml = ticks.map(([y, l]) => `<i style="left:${x(y).toFixed(1)}px"></i><span style="left:${x(y).toFixed(1)}px">${esc(l)}</span>`).join('');
  const axis = `<div class="paxis"><div class="pa" style="left:${plotL}px;width:${plotW}px">${tickHtml}</div></div>`;
  const lin = full ? { y0: L0, w: plotW - preW, gx: preW } : { y0: CLIP_Y, w: plotW, gx: 0 };
  const pgStyle = `left:${lin.gx.toFixed(1)}px;right:0;background-size:${(20 / (ymax - lin.y0) * lin.w).toFixed(2)}px 100%;background-position:${(x(1880) - lin.gx).toFixed(2)}px 0`;
  const pre = [], sortFn = U.peopleSort === 'infl' ? (a, b) => personInfluence(I, b) - personInfluence(I, a) || a.born - b.born : (a, b) => a.born - b.born;
  const body = lanes.map((t) => {
    const all = groups[t.id], preL = !full ? all.filter((p) => isPreModern(I, p, ymax)) : [], rest = all.filter((p) => !preL.includes(p));
    const known = rest.filter((p) => p.born != null), unk = rest.filter((p) => p.born == null);
    if (preL.length) pre.push({ t, list: preL.slice().sort((a, b) => (a.born ?? -9999) - (b.born ?? -9999)) });
    known.sort(sortFn);
    const rows = []; let items = '';
    known.forEach((p) => {
      const th = I.theoriesOfPerson.get(p.id) || [], { end: endY, unknownEnd } = personEnd(I, p, ymax), clipped = !full && p.born < CLIP_Y;
      const l = x(p.born), lnEnd = x(endY), len = Math.max(6, lnEnd - l), lw = tw(nm(p)) + 8 + (clipped ? tw('◂ ' + p.born) + 8 : 0), span = Math.max(len, lw) + 8; let r = 0; while (rows[r] != null && l < rows[r]) r++; rows[r] = l + span;
      const infl = personInfluence(I, p), thick = infl >= 8 ? 3 : infl >= 4 ? 2 : 1.4;
      const dots = th.filter((q) => full || q.year >= CLIP_Y).map((q) => `<i class="pt" style="left:${(x(q.year) - l).toFixed(1)}px" title="${esc(q.year)} ${esc(nm(q))}"></i>`).join('');
      items += `<button class="pl${unknownEnd ? ' uk' : ''}" data-open="${esc(p.id)}" style="left:${l.toFixed(1)}px;top:${r * 25 + 6}px;width:${Math.max(len, lw).toFixed(1)}px;--w:${thick}px" aria-label="${esc(nm(p))}, ${esc(lifeSpan(p))}${th.length ? ', ' + esc(ui('people.nTheories', { n: th.length })) : ''}" title="${esc(nm(p))} ${esc(lifeSpan(p))}${infl ? ' · ' + esc(ui('people.inflN', { n: infl })) : ''}"><span class="pn">${clipped ? `<em class="pbirth">◂ ${esc(p.born)}</em>` : ''}${esc(nm(p))}</span><span class="pline" style="width:${len.toFixed(1)}px">${dots}</span></button>`;
    });
    const h = Math.max(rows.length, 1) * 25 + 16;
    const zoneLines = full ? [-400, 1600, 1800].map((y) => `<i class="pgt" style="left:${x(y).toFixed(1)}px"></i>`).join('') : '';
    return `<section class="plane" style="--c:${t.color}"><div class="phead"><h3>${dot(t.color)}${esc(nm(t))}</h3><span class="cnt">${esc(ui('people.count', { n: all.length }))}</span></div><div class="pplot" style="height:${h}px;width:${plotW}px"><div class="pg" style="${pgStyle}"></div>${zoneLines}${items}</div><div class="punk"><h4>${esc(ui('people.unknownBirth', { n: unk.length }))}</h4>${unk.map((p) => `<button data-open="${esc(p.id)}">${esc(nm(p))}</button>`).join('')}</div></section>`;
  }).join('');
  const other = groups._.length && !U.peopleThread ? `<section class="plane"><div class="phead"><h3>${esc(ui('people.noLane'))}</h3><span class="cnt">${esc(ui('people.count', { n: groups._.length }))}</span></div><div class="pplot" style="height:10px"></div><div class="punk"><h4>${esc(ui('people.noLaneH'))}</h4>${groups._.map((p) => `<button data-open="${esc(p.id)}">${esc(nm(p))}</button>`).join('')}</div></section>` : '';
  const nPre = pre.reduce((a, g) => a + g.list.length, 0);
  const preHtml = full ? '' : `<aside class="ppre" aria-label="${esc(ui('people.preTitle', { n: nPre }))}"><button class="ppre-h" data-pfull="1" aria-label="${esc(ui('people.expand'))}"><b>${esc(ui('people.preTitle', { n: nPre }))}</b><span class="pexp">${esc(ui('people.expand'))} ▸</span></button>${pre.map((g) => `<div class="ppg" style="--c:${g.t.color}"><h4>${dot(g.t.color)}${esc(nm(g.t))}</h4>${g.list.map((p) => `<button data-open="${esc(p.id)}" title="${esc(lifeSpan(p))}">${esc(nm(p))}</button>`).join('')}</div>`).join('') || `<p class="nt">${esc(ui('people.preNone'))}</p>`}</aside>`;
  box.innerHTML = ctl + `<div class="pwrap">${preHtml}<div class="ptl" style="--hw:${headW}px;--uw:${unkW}px;--pl:${plotL}px">${axis}${body}${other}</div></div>`;
  wirePeople(box); box.scrollTop = keep;
}

function wirePeople(box) {
  if (box._wired) return; box._wired = true;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.open) { openNode(b.dataset.open); return; }
    if (b.dataset.psort) { U.peopleSort = b.dataset.psort; renderPeople(); return; }
    if (b.dataset.pfull != null) { go({ full: b.dataset.pfull === '1' }); return; }
    if ('pthread' in b.dataset) { U.peopleThread = b.dataset.pthread || null; renderPeople(); }
  });
}
