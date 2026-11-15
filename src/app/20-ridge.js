/* Ridge view: nine threads as mountain ridges over a shared time axis, sources on the left. */
let ridgePos = {}, ridgeGeo = {};
/* the label a map node carries, following the school | person | work switch */
function ridgeLabel(n) { return n.type === 'school' ? IDX.mapLabel(n, U.labelMode) : nmShort(n); }

function drawRidge(anim) {
  const I = IDX, svg = $('ridge'), box = $('vRidge');
  const Wd = box.clientWidth, Hd = Math.max(box.clientHeight, 580);
  if (Wd < 50 || mobile()) return;
  const Y0 = I.Y0, Y1 = I.Y1, threads = I.threads, roots = I.of.root;
  svg.style.height = Hd + 'px';
  const gut = Wd < 1100 ? 188 : 224, srcW = Wd < 1100 ? 112 : 170, right = 30, top = 92, bottom = 24, pitch = (Hd - top - bottom) / threads.length, amp = pitch * 1.45 / I.gmax, x0 = gut + srcW + 24;
  const x = (y) => x0 + (y - Y0) / (Y1 - Y0) * (Wd - x0 - right), rx = (y) => gut + 10 + rootU(y) * (srcW - 10), base = (i) => top + pitch * (i + 1) - 8;
  ridgeGeo = { x, x0, right, top, Wd, Hd }; ridgePos = {};
  let s = `<defs><filter id="glow" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#7df0e2" stroke-opacity=".09"/></pattern>
   <linearGradient id="srcg" x1="0" x2="1"><stop offset="0" stop-color="#7df0e2" stop-opacity="0"/><stop offset="1" stop-color="#7df0e2" stop-opacity=".07"/></linearGradient>
   <clipPath id="reveal"><rect id="revealRect" x="0" y="0" width="${Wd}" height="${Hd}"/></clipPath>
   <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#eaf0f8"/></marker>
   ${threads.map((t) => `<linearGradient id="g-${t.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.color}" stop-opacity=".62"/><stop offset="1" stop-color="${t.color}" stop-opacity=".02"/></linearGradient>`).join('')}</defs>`;
  s += `<rect x="${gut}" y="${top - 8}" width="${srcW + 12}" height="${Hd - top - bottom + 14}" fill="url(#srcg)"/><text class="zone-t" x="${gut + 10}" y="${top - 52}">${esc(ui('ridge.sources'))}</text>
   <rect x="${x(FRONT)}" y="${top - 8}" width="${Math.max(0, Wd - right - x(FRONT))}" height="${Hd - top - bottom + 14}" fill="url(#hatch)"/><text class="zone-t" x="${Wd - right}" y="${top - 52}" text-anchor="end">${esc(ui('ridge.ongoing'))}</text><g class="axis">`;
  [-400, 1600, 1800].forEach((y) => { const l = yearLabel(y); s += `<line x1="${rx(y)}" y1="${top - 8}" x2="${rx(y)}" y2="${Hd - bottom + 6}" stroke-dasharray="1 5"/><text x="${rx(y)}" y="${top - 22}" text-anchor="middle">${l}</text>`; });
  for (let y = 1860; y <= Y1; y += 20) s += `<line x1="${x(y)}" y1="${top - 8}" x2="${x(y)}" y2="${Hd - bottom + 6}"/><text x="${x(y)}" y="${top - 22}" text-anchor="middle">${y}</text>`;
  s += `<line x1="${x(BIRTH)}" y1="${top - 8}" x2="${x(BIRTH)}" y2="${Hd - bottom + 6}" stroke-dasharray="2 4" style="stroke:var(--accent);opacity:.7"/><text x="${x(BIRTH) + 6}" y="${Hd - bottom + 8}" style="fill:var(--accent)">${esc(ui('ridge.lab1879'))}</text></g>`;
  const placed = []; let labels = '', marks = ''; const rowsOf = [];
  threads.forEach((t, i) => {
    const b = base(i); let d = ''; for (let y = Y0; y <= Y1; y += .5) d += `${d ? 'L' : 'M'}${x(y).toFixed(1)} ${(b - I.val(t.id, y) * amp).toFixed(1)}`;
    const area = `${d}L${x(Y1)} ${b}L${x(Y0)} ${b}Z`;
    s += `<g class="row" data-t="${t.id}"><g clip-path="url(#reveal)"><path d="${area}" fill="var(--bg)" opacity=".9"/><path d="${area}" fill="url(#g-${t.id})"/><path d="${d}" fill="none" stroke="${t.color}" stroke-width="1.9" stroke-linejoin="round" filter="url(#glow)"/></g>
      <line x1="${gut - 14}" y1="${b}" x2="${Wd - right}" y2="${b}" stroke="${t.color}" stroke-opacity=".3"/>
      <g class="tlabel" data-t="${t.id}" tabindex="0" role="link" aria-label="${esc(ui('aria.openThread', { name: nm(t) }))}. ${esc(L(t.question))}"><rect x="8" y="${b - 46}" width="${gut - 24}" height="54" fill="transparent"/><rect x="18" y="${b - 40}" width="9" height="9" rx="2" fill="${t.color}" style="filter:drop-shadow(0 0 6px ${t.color})"/><text class="tname" x="34" y="${b - 31}">${esc(nm(t))}</text>${wrapText(L(t.question), gut - 34, 2).map((ln, k) => `<text class="tq" x="18" y="${b - 15 + k * 13}">${esc(ln)}</text>`).join('')}</g></g>`;
    rowsOf.push([t, b]);
  });
  const hit = (id, px, py, inner, cls, label) => `<g class="sch ${cls}" data-id="${id}" tabindex="0" role="button" aria-label="${esc(label)}"><circle r="12" cx="${px}" cy="${py}" fill="transparent"/>${inner}</g>`;
  const tryLabel = (n, px, py, cls) => { const txt = ridgeLabel(n), r = popR(n), w = tw(txt) + 8, rc = [px - w / 2, py - r - 19, px + w / 2, py - r - 3]; if (rc[0] < gut + srcW || rc[2] > Wd - 4 || placed.some((p) => rc[0] < p[2] && rc[2] > p[0] && rc[1] < p[3] && rc[3] > p[1])) return false; placed.push(rc); labels += `<text class="lab ${cls}" data-id="${n.id}" x="${px}" y="${py - r - 6}" text-anchor="middle">${esc(txt)}</text>`; return true; };
  rowsOf.forEach(([t, b]) => {
    const list = [...I.byThread[t.id]].sort((a, c) => (c.influence || 0) - (a.influence || 0) || a.year - c.year);
    list.forEach((n) => {
      const px = x(n.year), py = b - I.val(t.id, n.year) * amp; ridgePos[n.id] = { x: px, y: py };
      const r = popR(n);
      marks += hit(n.id, px, py, isEm(n) ? `<circle class="pulse" r="${r}" cx="${px}" cy="${py}"/><circle class="d" r="${r}" cx="${px}" cy="${py}"/>` : `<circle class="d" r="${r}" cx="${px}" cy="${py}"/>`, isEm(n) ? 'em' : '', `${nm(n)}, ${n.year}${isEm(n) ? ui('aria.ongoing') : ''}`);
    });
  });
  // labels: the 7 highest-influence schools of each thread first, then the ongoing ones, then every other school by influence as long as it fits
  const top7 = new Set(); rowsOf.forEach(([t]) => [...I.byThread[t.id]].sort((a, c) => (c.influence || 0) - (a.influence || 0) || a.year - c.year).slice(0, 7).forEach((n) => top7.add(n.id)));
  rowsOf.forEach(([t]) => [...I.byThread[t.id]].sort((a, c) => (c.influence || 0) - (a.influence || 0) || a.year - c.year).filter((n) => top7.has(n.id)).forEach((n) => tryLabel(n, ridgePos[n.id].x, ridgePos[n.id].y, isEm(n) ? 'em' : '')));
  rowsOf.forEach(([t]) => I.byThread[t.id].filter((n) => isEm(n) && !top7.has(n.id)).forEach((n) => tryLabel(n, ridgePos[n.id].x, ridgePos[n.id].y, 'em')));
  I.of.school.filter((n) => !top7.has(n.id) && !isEm(n) && ridgePos[n.id]).sort((a, c) => (c.influence || 0) - (a.influence || 0) || (c.popularity || 0) - (a.popularity || 0) || a.year - c.year).forEach((n) => tryLabel(n, ridgePos[n.id].x, ridgePos[n.id].y, ''));
  roots.forEach((r) => { const ti = I.tById.get(r.thread); if (!ti) return; const px = rx(r.year), py = base(ti.idx); ridgePos[r.id] = { x: px, y: py }; marks += hit(r.id, px, py, `<rect class="d" x="-3.6" y="-3.6" width="7.2" height="7.2" transform="translate(${px} ${py}) rotate(45)"/>`, 'root', ui('aria.source', { name: nm(r) })); });
  svg.setAttribute('viewBox', `0 0 ${Wd} ${Hd}`);
  svg.innerHTML = s + `<g id="marks">${marks}</g><g id="labels">${labels}</g><g id="edges"></g><g class="cross" id="cross" style="display:none"><line y1="${top - 8}" y2="${Hd - bottom}"/><text y="${top - 62}" text-anchor="middle"></text></g>`;
  svg.querySelectorAll('.sch').forEach((g) => {
    const id = g.dataset.id;
    g.addEventListener('mouseenter', (e) => { U.hover = id; focusRidge(); showTip(id, e); }); g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', () => { U.hover = null; focusRidge(); hideTip(); });
    g.addEventListener('focus', () => { U.hover = id; focusRidge(); }); g.addEventListener('blur', () => { U.hover = null; focusRidge(); });
    g.addEventListener('click', (e) => { e.stopPropagation(); openNode(id); });
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNode(id); } });
  });
  svg.querySelectorAll('.tlabel').forEach((g) => {
    const id = g.dataset.t, on = () => { U.hoverThread = id; focusRidge(); }, off = () => { U.hoverThread = null; focusRidge(); };
    g.addEventListener('mouseenter', on); g.addEventListener('mouseleave', off); g.addEventListener('focus', on); g.addEventListener('blur', off);
    g.addEventListener('click', (e) => { e.stopPropagation(); go({ view: 'map', sub: 'thread', thread: id }); });
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go({ view: 'map', sub: 'thread', thread: id }); } });
  });
  focusRidge(); applyFilterDim();
  if (anim && !reduced()) revealRidge(Wd);
}

function revealRidge(Wd) {
  const svg = $('ridge'), rc = svg.querySelector('#revealRect'); if (!rc) return;
  svg.classList.add('revealing'); rc.setAttribute('width', 0);
  const t0 = performance.now(), dur = 1500, done = () => { rc.setAttribute('width', Wd); svg.classList.remove('revealing'); };
  const step = (t) => { if (!rc.isConnected) return; const k = Math.min(1, (t - t0) / dur); rc.setAttribute('width', Wd * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else done(); };
  requestAnimationFrame(step);
  setTimeout(() => { if (rc.isConnected) done(); }, dur + 500);   // safety net for hidden tabs where rAF is paused
}

/* the node the ridge currently emphasises: hovered, else the open drawer's school */
const focusNodeId = () => U.hover || (R.n ? IDX.schoolOf(R.n) : null);

function focusRidge() {
  const I = IDX, svg = $('ridge'), eg = svg.querySelector('#edges'); if (!eg) return;
  const id = focusNodeId(), th = U.hoverThread;
  let list = [], relN = new Set(), relT = new Set();
  if (id && ridgePos[id]) {
    list = I.liftedOf.get(id) || []; relN.add(id); list.forEach((e) => { relN.add(e.from); relN.add(e.to); });
    relN.forEach((n) => I.threadsOfNode(I.get(n)).forEach((t) => relT.add(t)));
  } else if (th) {
    relT.add(th); list = I.liftedEdges.filter((e) => (I.threadOf(e.from) === th) !== (I.threadOf(e.to) === th) && (I.threadOf(e.from) === th || I.threadOf(e.to) === th));
    list.forEach((e) => { relN.add(e.from); relN.add(e.to); }); I.byThread[th].forEach((n) => relN.add(n.id)); I.of.root.filter((r) => (r.threads || []).includes(th)).forEach((r) => relN.add(r.id));
    relN.forEach((n) => { const o = I.get(n); if (o) I.threadsOfNode(o).forEach((t) => relT.add(t)); });
  }
  svg.classList.toggle('focus', relN.size > 0);
  svg.querySelectorAll('.row').forEach((g) => g.classList.toggle('rel', relT.has(g.dataset.t)));
  svg.querySelectorAll('.sch').forEach((g) => { g.classList.toggle('rel', relN.has(g.dataset.id)); g.classList.toggle('on', g.dataset.id === id); });
  svg.querySelectorAll('#labels .lab').forEach((g) => g.classList.toggle('rel', relN.has(g.dataset.id)));
  let h = ''; const shown = new Set([...svg.querySelectorAll('#labels .lab')].map((l) => l.dataset.id));
  list.forEach((e) => {
    const a = ridgePos[e.from], b = ridgePos[e.to]; if (!a || !b) return;
    const dx = (b.x - a.x) * .5, d = `M${a.x} ${a.y}C${a.x + dx} ${a.y},${b.x - dx} ${b.y},${b.x} ${b.y}`;
    h += `<path class="edge ${REL_KIND[e.type]}${e.lifted ? ' lifted' : ''}" marker-end="url(#arr)" d="${d}"/>${reduced() ? '' : `<path class="flow" d="${d}"/>`}`;
    if (id) h += `<text class="etag" x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 5}" text-anchor="middle">${esc(relName(e.type))}</text>`;
  });
  if (id) relN.forEach((n) => { if (shown.has(n) || !ridgePos[n]) return; const p = ridgePos[n]; h += `<text class="lab rel" x="${p.x}" y="${p.y - popR(I.get(n)) - 6}" text-anchor="middle">${esc(ridgeLabel(I.get(n)))}</text>`; });
  eg.innerHTML = h;
}

/* faded, not removed: nodes that do not match the filters */
function applyFilterDim() {
  const svg = $('ridge'); if (!svg) return;
  svg.querySelectorAll('.sch,#labels .lab').forEach((g) => g.classList.toggle('dim', !passFilter(IDX.get(g.dataset.id))));
}

function wireRidgeGlobal() {
  const svg = $('ridge');
  svg.addEventListener('mousemove', (e) => {
    const c = svg.querySelector('#cross'); if (!c || !ridgeGeo.x) return; const r = svg.getBoundingClientRect(), px = e.clientX - r.left;
    if (px < ridgeGeo.x0 || px > ridgeGeo.Wd - ridgeGeo.right) { c.style.display = 'none'; return; }
    const yr = Math.round(IDX.Y0 + (px - ridgeGeo.x0) / (ridgeGeo.Wd - ridgeGeo.x0 - ridgeGeo.right) * (IDX.Y1 - IDX.Y0));
    c.style.display = ''; const l = c.querySelector('line'); l.setAttribute('x1', px); l.setAttribute('x2', px); const t = c.querySelector('text'); t.setAttribute('x', px); t.textContent = yr;
  });
  svg.addEventListener('mouseleave', () => { const c = svg.querySelector('#cross'); if (c) c.style.display = 'none'; });
  svg.addEventListener('click', () => { if (R.n) closeNode(); });
}
