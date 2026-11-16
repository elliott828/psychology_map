/* Hourglass entry (canvas). Sources in the upper bulb, the 1879 neck, nine threads fanning out below. */
let cvs = null, gctx = null, gw = 0, gh = 0, glassHits = [], glassNameHits = [], gT = 0, gLast = 0, gParts = [];
let FONT = 'sans-serif'; const MONO = 'ui-monospace,Consolas,monospace';
const stepOf = () => Math.PI * 2 / IDX.threads.length;
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/* B3: far fewer, fainter, smaller, slower particles than the prototype; they should be noticed only when looked for */
function initParticles() {
  const n = IDX.threads.length, N = mobile() ? 90 : 160;
  gParts = Array.from({ length: N }, () => ({ k: Math.floor(Math.random() * n), a0: Math.random() * Math.PI * 2, f: Math.sqrt(Math.random()), s: Math.random(), v: (.05 + Math.random() * .05) * .6, j: (Math.random() - .5) * .5, z: .6 + Math.random() * .5 }));
}

function sizeGlass() {
  const box = $('vGlass'), d = Math.min(2, devicePixelRatio || 1);
  gw = box.clientWidth; gh = Math.max(box.clientHeight, mobile() ? 520 : 580);
  cvs.style.height = gh + 'px'; cvs.width = Math.round(gw * d); cvs.height = Math.round(gh * d); gctx.setTransform(d, 0, 0, d, 0, 0);
  const Z = U.zoom; Object.assign(Z, zoomClamp(Z.k, Z.x, Z.y)); if (Z.t) Z.t = zoomClamp(Z.t.k, Z.t.x, Z.t.y);
}

function glassGeom() {
  const m = mobile(), tilt = .3, Z = U.zoom, k = Z.k;
  // base layout (phone: the intro is a slim bar, so the glass can use most of the height)
  const top0 = m ? 58 : 56, cx0 = gw > 900 ? gw * .58 : gw / 2, Rm0 = Math.min(gw * (m ? .44 : .32), 400, (gh - top0 - (m ? 150 : 86)) * .46), bot0 = gh - (m ? 112 : 66) - Rm0 * tilt;
  // zoom is applied to the geometry, not the canvas, so dots, lines and text keep their size while the glass grows
  const top = top0 * k + Z.y, cx = cx0 * k + Z.x, Rm = Rm0 * k, bot = bot0 * k + Z.y, neck = top + (bot - top) * .37, Rn = Rm * .085, Rt = Rm * .76;
  const Y0 = IDX.Y0, Y1 = IDX.Y1;
  const yOf = (y) => (y >= BIRTH ? neck + (y - BIRTH) / (Y1 - BIRTH) * (bot - neck) : neck - (BIRTH - y) / (BIRTH - Y0) * (neck - top) * .07), yRoot = (y) => top + rootU(y) * (neck - top) * .76;
  const R = (y) => (y >= neck ? Rn + (Rm - Rn) * Math.pow(Math.sin(Math.min(1, (y - neck) / (bot - neck)) * Math.PI / 2), .85) : Rn + (Rt - Rn) * Math.pow(Math.sin(Math.min(1, (neck - y) / (neck - top)) * Math.PI / 2), 1.15));
  const P = (th, y, r) => ({ x: cx + r * Math.sin(th), y: y + r * Math.cos(th) * tilt, z: Math.cos(th) });
  return { top, tilt, cx, Rm, bot, neck, Rn, Rt, yOf, yRoot, R, P };
}

function drawParticles(G, front, TC) {
  const { top, neck, bot, R, P } = G, g = gctx, STEP = stepOf(); g.globalCompositeOperation = 'lighter';
  for (const p of gParts) {
    let y, r, a, col, al = 1;
    if (p.s < .3) { const u = p.s / .3; y = top + u * (neck - top); r = R(y) * p.f * .94; a = p.a0 + U.rot; col = [125, 240, 226]; al = Math.min(1, u * 8); }
    else {
      const u = (p.s - .3) / .7, ty = U.rot + p.k * STEP + p.j * (1 - u * .5), w = Math.min(1, u * 2.4); let da = ty - (p.a0 + U.rot); da = Math.atan2(Math.sin(da), Math.cos(da)); a = p.a0 + U.rot + da * w;
      y = neck + Math.pow(u, 1.25) * (bot + 34 - neck); const fr = p.f + (1 - p.f) * Math.min(1, u * 1.7); r = R(Math.min(y, bot)) * fr * .97; const c = TC[p.k], m = Math.min(1, u * 5);
      col = [125 + (c[0] - 125) * m, 240 + (c[1] - 240) * m, 226 + (c[2] - 226) * m]; al = p.s > .9 ? (1 - p.s) * 10 : 1;
    }
    const q = P(a, y, r); if ((q.z >= 0) !== front) continue;
    g.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${(.22 + .5 * (q.z + 1) / 2) * al * .4})`; g.fillRect(q.x, q.y, p.z, p.z);
  }
  g.globalCompositeOperation = 'source-over';
}

function drawGlass() {
  if (!cvs || R.view !== 'map' || R.sub !== 'glass' || gw < 50) return;
  const I = IDX, c = gctx, G = glassGeom(), { top, tilt, cx, Rm, bot, neck, Rn, Rt, yOf, yRoot, R: Rr, P } = G, threads = I.threads, STEP = stepOf(), BIRTHY = BIRTH;
  const TC = threads.map((t) => rgb(t.color)), RM = reduced(); c.clearRect(0, 0, gw, gh);
  const ink = '234,240,248', arcMax = STEP * .86, hov = focusNodeId(), selThread = U.hoverThread || U.glassThread;
  // phone: only the thread turned to the front (within about half a step) is labelled; labels fade in and out as it turns
  const mob = mobile(), FW = STEP * .6, fadeOf = (th) => { if (!mob) return 1; const s = Math.max(0, 1 - Math.abs(Math.atan2(Math.sin(th), Math.cos(th))) / FW); return s * s * (3 - 2 * s); };
  const ring = (y, front, a, w = 1, dash) => { c.beginPath(); c.ellipse(cx, y, Rr(Math.min(y, bot)) * (y > bot ? 1 + (y - bot) / Rm * .5 : 1), Rr(Math.min(y, bot)) * tilt * (y > bot ? 1 + (y - bot) / Rm * .5 : 1), 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.strokeStyle = `rgba(${ink},${a})`; c.lineWidth = w; c.setLineDash(dash || []); c.stroke(); c.setLineDash([]); };
  const glowRing = (y, col, blur) => { c.save(); c.shadowColor = col; c.shadowBlur = blur; c.beginPath(); c.ellipse(cx, y, Rr(y), Rr(y) * tilt, 0, 0, Math.PI); c.strokeStyle = col; c.lineWidth = 1.4; c.stroke(); c.restore(); };
  { const fy = bot + Rm * tilt + 26, gr = c.createRadialGradient(cx, fy, 0, cx, fy, Rm * 1.25); gr.addColorStop(0, 'rgba(106,168,255,.22)'); gr.addColorStop(1, 'rgba(106,168,255,0)'); c.save(); c.translate(0, fy); c.scale(1, .22); c.translate(0, -fy); c.fillStyle = gr; c.beginPath(); c.arc(cx, fy, Rm * 1.25, 0, 7); c.fill(); c.restore(); }
  const years = [1900, 1920, 1940, 1960, 1980, 2000, 2020].filter((y) => y <= I.Y1);
  years.forEach((y) => ring(yOf(y), false, .07)); ring(top, false, .14); [-400, 1600, 1800].forEach((y) => ring(yRoot(y), false, .06, 1, [2, 5]));
  c.beginPath(); for (let y = top; y <= bot; y += 3) c.lineTo(cx - Rr(y), y); for (let y = bot; y >= top; y -= 3) c.lineTo(cx + Rr(y), y); c.closePath();
  const gf = c.createLinearGradient(cx - Rm, 0, cx + Rm, 0); gf.addColorStop(0, 'rgba(125,240,226,.09)'); gf.addColorStop(.18, 'rgba(125,240,226,.015)'); gf.addColorStop(.82, 'rgba(106,168,255,.015)'); gf.addColorStop(1, 'rgba(106,168,255,.1)'); c.fillStyle = gf; c.fill();
  c.save(); c.shadowColor = 'rgba(125,240,226,.6)'; c.shadowBlur = 14; c.strokeStyle = `rgba(${ink},.32)`; c.lineWidth = 1.1; c.stroke(); c.restore();
  // neck core: steady glow (no pulsing)
  { const gr = c.createRadialGradient(cx, neck, 0, cx, neck, Rn * 9); gr.addColorStop(0, 'rgba(210,255,250,.5)'); gr.addColorStop(.25, 'rgba(125,240,226,.22)'); gr.addColorStop(1, 'rgba(125,240,226,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = gr; c.beginPath(); c.arc(cx, neck, Rn * 9, 0, 7); c.fill(); c.globalCompositeOperation = 'source-over'; }
  if (!RM) drawParticles(G, false, TC);
  glassHits = []; glassNameHits = []; const labels = [];
  // sources on the upper bulb
  const rootsBy = {}; I.of.root.forEach((r) => { (rootsBy[r.thread] = rootsBy[r.thread] || []).push(r); });
  I.of.root.forEach((r) => {
    const ti = I.tById.get(r.thread); if (!ti) return; const k = ti.idx, same = rootsBy[r.thread], th = U.rot + k * STEP + (same.indexOf(r) - (same.length - 1) / 2) * .2, y0 = yRoot(r.year), z = Math.cos(th), col = ti.color;
    c.beginPath(); for (let y = y0; y <= neck; y += 3) { const p = P(th, y, Rr(y)); y === y0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y); } c.strokeStyle = col; c.globalAlpha = z > 0 ? .5 : .12; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1;
    if (z > -.15) { const p = P(th, y0, Rr(y0)), a = .3 + .7 * (z + 1) / 2; c.save(); c.translate(p.x, p.y); c.rotate(Math.PI / 4); c.fillStyle = '#05070c'; c.fillRect(-3.4, -3.4, 6.8, 6.8); c.strokeStyle = r.id === hov ? '#7df0e2' : `rgba(${ink},${a})`; c.lineWidth = 1.4; c.strokeRect(-3.4, -3.4, 6.8, 6.8); c.restore(); glassHits.push({ id: r.id, x: p.x, y: p.y }); const f = fadeOf(U.rot + k * STEP); if (z > .2 && f > .04) labels.push({ n: r, p, z, inf: 3.5, f }); }
  });
  // threads, back to front
  const order = threads.map((t, k) => ({ t, k, th: U.rot + k * STEP })).sort((a, b) => Math.cos(a.th) - Math.cos(b.th)), names = [];
  order.forEach(({ t, th }) => {
    const z = Math.cos(th), a = .14 + .86 * Math.pow((z + 1) / 2, 1.6), f = fadeOf(th), sel = selThread === t.id || (mob && f > .6), bp = [], rp = [];
    for (let yr = BIRTHY; yr <= I.Y1; yr += 1) { const y = yOf(yr), r = Rr(y), d = Math.min(arcMax, I.val(t.id, yr) / I.gmax * Rm * .5 / r); bp.push(P(th, y, r)); rp.push(P(th + d, y, r)); }
    c.beginPath(); bp.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); for (let i = rp.length - 1; i >= 0; i--) c.lineTo(rp[i].x, rp[i].y); c.closePath();
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = a * .34; c.fillStyle = t.color; c.fill(); c.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = a; if (z > 0) { c.shadowColor = t.color; c.shadowBlur = sel ? 22 : 12; } c.beginPath(); rp.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.strokeStyle = t.color; c.lineWidth = sel ? 2.8 : 1.8; c.stroke(); c.restore();
    c.beginPath(); bp.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.globalAlpha = a * .4; c.strokeStyle = t.color; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1;
    I.byThread[t.id].forEach((n) => {
      const y = yOf(n.year), r = Rr(y), d = n.year < BIRTHY ? 0 : Math.min(arcMax, I.val(t.id, n.year) / I.gmax * Rm * .5 / r), p = P(th + d, y, r); if (z < -.1) return;
      if (isEm(n) && !RM) { const ph = (gT * .6 + n.year * .37) % 1; c.beginPath(); c.arc(p.x, p.y, 3 + ph * 9, 0, 7); c.strokeStyle = `rgba(125,240,226,${(1 - ph) * .7 * a})`; c.lineWidth = 1; c.stroke(); }
      const dim = !passFilter(n); c.beginPath(); c.arc(p.x, p.y, popR(n), 0, 7); c.fillStyle = '#05070c'; c.globalAlpha = a * (dim ? .4 : 1); c.fill(); c.strokeStyle = n.id === hov || isEm(n) ? '#7df0e2' : `rgb(${ink})`; c.lineWidth = 1.4; c.stroke(); c.globalAlpha = 1; glassHits.push({ id: n.id, x: p.x, y: p.y });
      if (z > .25 && f > .04) labels.push({ n, p, z, f, inf: (n.tier === 1 || isEm(n) ? 10 : 0) + (isEm(n) ? 2.5 : n.influence || 1) });
    });
    names.push({ t, e: P(th, bot, Rr(bot)), z, a });
  });
  if (!RM) drawParticles(G, true, TC);
  years.forEach((y) => { ring(yOf(y), true, .16); c.font = '12px ' + MONO; c.textAlign = 'right'; c.fillStyle = `rgba(${ink},.5)`; c.fillText(y, cx - Rr(yOf(y)) - 10, yOf(y) + 4); });
  [-400, 1600, 1800].forEach((y) => { ring(yRoot(y), true, .14, 1, [2, 5]); c.font = '12px ' + MONO; c.textAlign = 'right'; c.fillStyle = `rgba(${ink},.45)`; c.fillText(yearLabel(y), cx - Rr(yRoot(y)) - 10, yRoot(y) + 4); });
  glowRing(top, 'rgba(125,240,226,.8)', 16); glowRing(neck, 'rgba(210,255,250,.95)', 18); glowRing(bot, 'rgba(106,168,255,.9)', 18);
  [12, 24, 36].forEach((d, i) => { ring(bot + d, true, .22 - i * .06, 1, [3, 6]); ring(bot + d, false, .08 - i * .02, 1, [3, 6]); });
  [-1, 1].forEach((sg) => { c.beginPath(); for (let y = top + 6; y <= bot - 6; y += 4) { const x = cx + sg * Rr(y) * .82; y === top + 6 ? c.moveTo(x, y) : c.lineTo(x, y); } const lg = c.createLinearGradient(0, top, 0, bot); lg.addColorStop(0, 'rgba(255,255,255,.16)'); lg.addColorStop(.37, 'rgba(255,255,255,0)'); lg.addColorStop(.7, 'rgba(255,255,255,.1)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = lg; c.lineWidth = 2; c.stroke(); });
  // callouts
  const put = []; c.textAlign = 'left'; c.strokeStyle = 'rgba(125,240,226,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + Rn + 6, neck); c.lineTo(cx + Rn + 54, neck); c.stroke();
  c.fillStyle = '#7df0e2'; c.font = '12px ' + MONO; c.fillText('1879', cx + Rn + 60, neck - 3); c.fillStyle = `rgba(${ink},.85)`; c.font = '12px ' + FONT; const lab79 = ui('glass.lab1879'); c.fillText(lab79, cx + Rn + 60, neck + 13); put.push([cx + Rn + 50, neck - 18, cx + Rn + 66 + tw(lab79), neck + 20]);
  if (!mobile()) put.push([0, gh - 210, 380, gh]);
  { const zb = $('gzoom'); if (zb && zb.offsetWidth) { const a = zb.getBoundingClientRect(), o = cvs.getBoundingClientRect(); put.push([a.left - o.left - 4, a.top - o.top - 4, a.right - o.left + 4, a.bottom - o.top + 4]); } } // labels keep clear of the zoom buttons
  c.textAlign = 'center'; c.fillStyle = 'rgba(125,240,226,.8)'; c.font = '12px ' + MONO; c.fillText(ui('glass.top'), cx, top - 16); c.fillText(ui('glass.bottom'), cx, bot + Rm * tilt + 42);
  // labels, collision-avoiding, most important first
  // zooming in spreads the dots apart, so more labels fit; the text itself grows only a little
  const fs = Math.round((12 + Math.min(2, (U.zoom.k - 1) * 1.2)) * 2) / 2, hh = fs * .67; c.font = fs + 'px ' + FONT;
  labels.sort((a, b) => (b.f > .5) - (a.f > .5) || (b.z > .75) - (a.z > .75) || b.inf - a.inf || b.z - a.z).forEach(({ n, p, z, inf, f }) => {
    if (p.y < -10 || p.y > gh + 10) return;
    const txt = trunc(ridgeLabel(n), 150, fs), w = tw(txt, fs) + 6, left = p.x < cx, rc = [left ? p.x - 8 - w : p.x + 8, p.y - hh, left ? p.x - 8 : p.x + 8 + w, p.y + hh];
    if (rc[0] < 4 || rc[2] > gw - 4 || put.some((q) => rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1])) return;
    put.push(rc); c.globalAlpha = f; c.textAlign = left ? 'right' : 'left'; c.lineWidth = 4; c.strokeStyle = `rgba(5,7,12,${.5 + z * .4})`; c.strokeText(txt, left ? p.x - 8 : p.x + 8, p.y + fs / 3);
    c.fillStyle = n.type === 'root' ? `rgba(190,255,248,${.3 + .6 * z})` : `rgba(${ink},${(.35 + .65 * z) * (inf >= 10 || n.type === 'root' ? 1 : .8)})`; c.fillText(txt, left ? p.x - 8 : p.x + 8, p.y + fs / 3); c.globalAlpha = 1;
  });
  const np = []; c.font = '600 13px ' + FONT; c.textAlign = 'center';
  names.sort((p, q) => q.z - p.z).forEach(({ t, e, z, a }) => {
    if (z < -.2) return; c.save(); c.shadowColor = t.color; c.shadowBlur = 10; c.fillStyle = t.color; c.globalAlpha = a; c.fillRect(e.x - 4, e.y + 6, 8, 8); c.restore();
    const nmT = nm(t), w = tw(nmT, 13) + 10, rc = [e.x - w / 2, e.y + 12, e.x + w / 2, e.y + 32];
    if (rc[0] < 2 || rc[2] > gw - 2 || np.some((q) => rc[0] < q[2] && rc[2] > q[0] && rc[1] < q[3] && rc[3] > q[1])) return;
    np.push(rc); glassNameHits.push({ t: t.id, rc }); c.fillStyle = `rgba(${ink},${Math.max(.35, a)})`; c.fillText(nmT, e.x, e.y + 27);
  });
}

/* background dust */
let bgCtx = null, stars = [];
function drawBg() {
  const bg = $('bgfx'), d = Math.min(2, devicePixelRatio || 1);
  if (bg.width !== Math.round(innerWidth * d) || bg.height !== Math.round(innerHeight * d)) { bg.width = Math.round(innerWidth * d); bg.height = Math.round(innerHeight * d); }
  bgCtx.setTransform(d, 0, 0, d, 0, 0); bgCtx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) { const x = ((s.x + gT * s.v) % 1) * innerWidth, a = .18 + .3 * (.5 + .5 * Math.sin(gT * 1.3 + s.p)); bgCtx.fillStyle = `rgba(190,220,255,${a})`; bgCtx.fillRect(x, s.y * innerHeight, s.s, s.s); }
}

function glassFrame(dt) {
  gT += dt;
  if (R.view === 'map' && R.sub === 'glass') {
    if (U.rotTarget != null) { let d = U.rotTarget - U.rot; d = Math.atan2(Math.sin(d), Math.cos(d)); if (Math.abs(d) < .004) { U.rot = U.rotTarget; U.rotTarget = null; } else U.rot += d * Math.min(1, dt * 7 + .02); }
    else if (U.auto && !reduced()) U.rot += dt * .11;
    const Z = U.zoom; if (Z.t) { const e = Math.min(1, dt * 9 + .02); Z.k += (Z.t.k - Z.k) * e; Z.x += (Z.t.x - Z.x) * e; Z.y += (Z.t.y - Z.y) * e; if (Math.abs(Z.t.k - Z.k) < .003 && Math.abs(Z.t.x - Z.x) < .5 && Math.abs(Z.t.y - Z.y) < .5) { Object.assign(Z, Z.t); Z.t = null; } }
    if (!reduced()) for (const p of gParts) { p.s += p.v * dt * (p.s > .24 && p.s < .36 ? 1.9 : 1); if (p.s > 1) { p.s = 0; p.a0 = Math.random() * Math.PI * 2; p.f = Math.sqrt(Math.random()); p.k = Math.floor(Math.random() * IDX.threads.length); } }
    drawGlass();
  }
  if (!reduced()) drawBg();
}
function glassLoop(ts) { const dt = Math.min(.05, (ts - gLast) / 1000 || 0); gLast = ts; if (!reduced() || U.rotTarget != null || U.zoom.t) glassFrame(dt); requestAnimationFrame(glassLoop); }
let invalidating = false;
function invalidateGlass() { if (invalidating) return; invalidating = true; requestAnimationFrame(() => { invalidating = false; glassFrame(0); }); }

const glassHitAt = (x, y) => { let best = null, bd = mobile() ? 22 : 13; for (let i = glassHits.length - 1; i >= 0; i--) { const h = glassHits[i], d = Math.hypot(h.x - x, h.y - y); if (d < bd) { bd = d; best = h; } } return best; };
/* zoom keeps the glass covering the canvas: 1x to 4x, no panning past the edges */
const ZMAX = 4;
function zoomClamp(k, x, y) { k = Math.max(1, Math.min(ZMAX, k)); return { k, x: Math.min(0, Math.max(gw - gw * k, x)), y: Math.min(0, Math.max(gh - gh * k, y)) }; }
function zoomAt(k, sx, sy, anim) {
  const Z = U.zoom, b = Z.t || Z, wx = (sx - b.x) / b.k, wy = (sy - b.y) / b.k, t = zoomClamp(k, sx - wx * Math.max(1, Math.min(ZMAX, k)), sy - wy * Math.max(1, Math.min(ZMAX, k)));
  if (anim && !reduced()) Z.t = t; else { Object.assign(Z, t); Z.t = null; }
  syncZoomUi(); invalidateGlass();
}
function syncZoomUi() {
  const box = typeof document !== 'undefined' && $('gzoom'); if (!box) return; const k = (U.zoom.t || U.zoom).k;
  box.querySelector('[data-z="out"]').disabled = k <= 1.001; box.querySelector('[data-z="in"]').disabled = k >= ZMAX - .001; box.querySelector('[data-z="reset"]').hidden = k <= 1.001;
}
const glassNameAt = (x, y) =>glassNameHits.find((n) => x >= n.rc[0] && x <= n.rc[2] && y >= n.rc[1] - 10 && y <= n.rc[3] + 4);

function initGlass() {
  cvs = $('glass'); gctx = cvs.getContext('2d'); FONT = getComputedStyle(document.body).fontFamily; bgCtx = $('bgfx').getContext('2d');
  stars = Array.from({ length: 130 }, () => ({ x: Math.random(), y: Math.random(), s: .5 + Math.random() * 1.3, p: Math.random() * 6.28, v: .004 + Math.random() * .012 }));
  initParticles();
  // one pointer: drag sideways to rotate (and up/down to pan once zoomed in); two pointers: pinch to zoom and pan;
  // double-tap or wheel also zooms. Taps on a dot or a thread name still open it.
  const Z = U.zoom, pts = new Map(), loc = (e) => { const r = cvs.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  let drag = null, pinch = null, lastTap = null;
  const two = () => { const [a, b] = [...pts.values()]; return { d: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), m: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } }; };
  cvs.addEventListener('pointerdown', (e) => {
    pts.set(e.pointerId, loc(e)); try { cvs.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    U.auto = false; U.rotTarget = null; Z.t = null; hideTip();
    if (pts.size === 2) { const g = two(); pinch = { ...g, k: Z.k, x: Z.x, y: Z.y }; drag = null; cvs.classList.remove('drag'); return; }
    if (pts.size === 1 && !pinch) { drag = { x: e.clientX, y: e.clientY, rot: U.rot, zy: Z.y, moved: false }; cvs.classList.add('drag'); }
  });
  cvs.addEventListener('pointermove', (e) => {
    const { x, y } = loc(e); if (pts.has(e.pointerId)) pts.set(e.pointerId, { x, y });
    if (pinch) { if (pts.size >= 2) { const g = two(), k = pinch.k * g.d / pinch.d, wx = (pinch.m.x - pinch.x) / pinch.k, wy = (pinch.m.y - pinch.y) / pinch.k; Object.assign(Z, zoomClamp(k, g.m.x - wx * k, g.m.y - wy * k)); syncZoomUi(); if (reduced()) invalidateGlass(); } return; }
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 4) drag.moved = true;
      U.rot = drag.rot + dx * .008; if (Z.k > 1.01) Z.y = zoomClamp(Z.k, Z.x, drag.zy + dy).y;
      hideTip(); if (reduced()) invalidateGlass(); return;
    }
    if (e.pointerType === 'touch') return;
    const h = glassHitAt(x, y); U.hover = h ? h.id : null; if (h) { showTip(h.id, e); cvs.style.cursor = 'pointer'; } else { hideTip(); cvs.style.cursor = glassNameAt(x, y) ? 'pointer' : ''; }
    if (reduced()) invalidateGlass();
  });
  const up = (e, cancel) => {
    pts.delete(e.pointerId);
    if (pinch) { if (!pts.size) pinch = null; return; } // the second finger lifting after a pinch is not a tap
    cvs.classList.remove('drag');
    if (drag && !drag.moved && !cancel) {
      const { x, y } = loc(e), h = glassHitAt(x, y), nmHit = glassNameAt(x, y);
      if (h) openNode(h.id); else if (nmHit) go({ view: 'map', sub: 'thread', thread: nmHit.t });
      else if (lastTap && e.timeStamp - lastTap.t < 330 && Math.hypot(x - lastTap.x, y - lastTap.y) < 36) { lastTap = null; zoomAt(Z.k > 1.3 ? 1 : 2.4, x, y, true); }
      else { lastTap = { t: e.timeStamp, x, y }; if (R.n) closeNode(); }
    }
    drag = null;
  };
  cvs.addEventListener('pointerup', (e) => up(e, false));
  cvs.addEventListener('pointercancel', (e) => up(e, true));
  cvs.addEventListener('pointerleave', (e) => { if (e.pointerType === 'touch') return; hideTip(); U.hover = null; if (reduced()) invalidateGlass(); });
  cvs.addEventListener('wheel', (e) => { e.preventDefault(); const { x, y } = loc(e); U.auto = false; zoomAt(Z.k * Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)), x, y, false); }, { passive: false });
  $('gzoom').addEventListener('click', (e) => { const b = e.target.closest('[data-z]'); if (!b) return; U.auto = false; const f = b.dataset.z === 'in' ? 1.6 : 1 / 1.6; zoomAt(b.dataset.z === 'reset' ? 1 : Z.k * f, gw / 2, gh / 2, true); });
  syncZoomUi();
  renderGlassSide();
  $('enter').addEventListener('click', () => go({ view: 'map', sub: 'ridge', thread: null }));
  requestAnimationFrame(glassLoop);
  MQ_RM && MQ_RM.addEventListener && MQ_RM.addEventListener('change', () => invalidateGlass());
}
function renderGlassSide() {
  $('glassSide').innerHTML = IDX.threads.map((th, k) => `<button data-k="${k}"${U.glassThread === th.id ? ' class="on"' : ''} style="--c:${th.color}" aria-label="${esc(ui('aria.gotoThread', { name: nm(th) }))}"><i></i><span>${esc(nm(th))}</span></button>`).join('');
  $('glassSide').querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => { const k = +b.dataset.k; U.glassThread = IDX.threads[k].id; U.rotTarget = -k * stepOf(); U.auto = false; $('glassSide').querySelectorAll('button').forEach((o) => o.classList.toggle('on', o === b)); if (reduced()) invalidateGlass(); });
    b.addEventListener('dblclick', () => go({ view: 'map', sub: 'thread', thread: IDX.threads[+b.dataset.k].id }));
  });
}
