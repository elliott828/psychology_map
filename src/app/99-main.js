/* Boot, language, view switching, sub bar (breadcrumbs, view switch, labels, filters), keyboard, ResizeObserver. */

function viewId() {
  if (R.view === 'map') { if (R.sub === 'thread') return 'vThread'; if (R.sub === 'ridge') return mobile() ? 'vCards' : 'vRidge'; return 'vGlass'; }
  return { structure: 'vStructure', people: 'vPeople', questions: 'vQuestions', reading: 'vReading' }[R.view] || 'vGlass';
}
const VIEW_IDS = ['vGlass', 'vRidge', 'vCards', 'vThread', 'vStructure', 'vPeople', 'vQuestions', 'vReading'];

function showView() {
  const v = viewId(); VIEW_IDS.forEach((id) => $(id).classList.toggle('on', id === v));
  document.body.dataset.v = R.view; document.body.dataset.sub = R.sub; document.body.dataset.view = v;
}
function renderView(anim) {
  const v = viewId();
  switch (v) {
    case 'vGlass': sizeGlass(); invalidateGlass(); break;
    case 'vRidge': drawRidge(anim); break;
    case 'vCards': renderCards(); break;
    case 'vThread': renderThreadView(); break;
    case 'vStructure': renderStructure(); break;
    case 'vPeople': renderPeople(); break;
    case 'vQuestions': renderQuestions(); break;
    case 'vReading': renderReading(); break;
  }
}

/* ---- language ---- */
const LANG_KEY = 'psymap.lang';
function setLang(l) { if (l !== 'en' && l !== 'zh') return; LANG = l; try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* storage may be unavailable */ } }
/* no saved or linked language: mainland China time zones get Chinese, everywhere else English.
   (static hosting cannot see the visitor's IP; the device time zone needs no network request) */
const CN_TZ = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Chungking', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Kashgar', 'PRC'];
function regionLang(tz) { try { return CN_TZ.includes(tz || Intl.DateTimeFormat().resolvedOptions().timeZone) ? 'zh' : 'en'; } catch (e) { return 'en'; } }
function initLang() {
  let l = null; try { l = parseHash(location.hash).lang; } catch (e) { /* no location */ }
  if (!l) { try { l = localStorage.getItem(LANG_KEY); } catch (e) { /* storage may be unavailable */ } }
  LANG = l === 'zh' || l === 'en' ? l : regionLang();
}
/* interface text that lives in the static page (and in places that are not re-rendered by views) */
function applyStatic() {
  const I = IDX;
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = ui(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', ui(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', ui(el.dataset.i18nPh)); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  if (I) {
    $('hud').textContent = ui('hud', { schools: I.counts.school, sources: I.counts.root, relations: I.counts.edges, theories: I.of.theory.length, people: I.of.person.length });
    $('how').innerHTML = `<p><b>${esc(ui('how.b1'))}</b>${esc(ui('how.t1'))}</p><p>${esc(ui('how.t2'))}</p><p><b>${esc(ui('how.b3'))}</b>${esc(ui('how.t3'))}</p><p>${esc(ui('how.t4'))}</p>`;
    renderGlassSide();
  }
  const tv = $('textver'); if (tv) tv.setAttribute('href', LANG + '/');
  $('glegend').innerHTML = `${SIZE_SVG}<span>${esc(ui('legend.size'))}</span>`;
}

/* ---- navigation chrome ---- */
function renderNav(force) {
  const btn = (k, cls, sz) => `<button data-nav="${k}" class="${cls}"${R.view === k ? ' aria-current="page"' : ''}><span class="ni" aria-hidden="true">${icon(k, sz)}</span><span>${esc(ui('nav.' + k))}</span></button>`;
  if (!force && $('topNav').childElementCount) { document.querySelectorAll('[data-nav]').forEach((b) => { if (b.dataset.nav === R.view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }); return; }
  $('topNav').innerHTML = NAV_KEYS.map((k) => btn(k, 'nb', 18)).join('');
  $('tabbar').innerHTML = NAV_KEYS.map((k) => btn(k, 'tb', 22)).join('');
}

function crumbs() {
  const I = IDX, c = [];
  const mapHref = serializeRoute({ view: 'map', sub: R.sub === 'glass' ? 'glass' : 'ridge', thread: null, q: null, n: null, c: R.c, lang: R.lang });
  if (R.view === 'map') {
    c.push({ l: ui('crumb.overview'), h: R.sub === 'glass' && !R.n ? null : mapHref });
    const th = R.sub === 'thread' ? I.tById.get(R.thread) : null, nt = R.n && I.get(R.n) ? I.tById.get(I.threadOf(R.n)) : null;
    if (th) c.push({ l: nm(th), h: R.n ? serializeRoute({ view: 'map', sub: 'thread', thread: th.id, n: null, c: R.c, lang: R.lang }) : null });
    else if (nt && R.sub !== 'glass') c.push({ l: nm(nt), h: serializeRoute({ view: 'map', sub: 'thread', thread: nt.id, n: null, c: R.c, lang: R.lang }) });
  } else {
    const q = R.q && I.get(R.q), pn = R.path && I.get(R.path);
    c.push({ l: ui('nav.' + R.view), h: R.q || R.n || R.path || R.full ? serializeRoute({ view: R.view, n: null, q: null, c: R.c, lang: R.lang }) : null });
    if (q) c.push({ l: L(q.title) || L(q.claim) || R.q, h: R.n ? serializeRoute({ view: R.view, q: R.q, n: null, c: R.c, lang: R.lang }) : null });
    else if (R.q === 'debates' || R.q === 'myths') c.push({ l: ui(R.q === 'debates' ? 'q.tabDebates' : 'q.tabMyths'), h: null });
    if (pn) c.push({ l: ui('crumb.path', { name: nm(pn) }), h: R.n ? serializeRoute({ view: 'reading', path: R.path, n: null, c: R.c, lang: R.lang }) : null });
    if (R.view === 'people' && R.full) c.push({ l: ui('people.rangeFull'), h: R.n ? serializeRoute({ view: 'people', full: true, n: null, c: R.c, lang: R.lang }) : null });
  }
  const n = R.n && I.get(R.n); if (n) c.push({ l: nm(n) || R.n, h: null });
  return c;
}

function renderSub() {
  const cs = crumbs(), ae = document.activeElement, fk = ae && ae.closest && ae.closest('#sub') ? ['data-sv', 'data-pop', 'data-fclear', 'data-lm'].map((a) => (ae.hasAttribute(a) ? a + '=' + ae.getAttribute(a) : '')).find(Boolean) : '';
  let h = `<nav class="crumbs" aria-label="${esc(ui('aria.crumbs'))}">${cs.map((x, i) => (x.h ? `<a href="${esc(x.h)}">${esc(x.l)}</a>` : `<span${i === cs.length - 1 ? ' aria-current="location"' : ''}>${esc(x.l)}</span>`)).join('<i aria-hidden="true">›</i>')}</nav>`;
  if (R.view === 'map') {
    h += `<div class="seg" role="group" aria-label="${esc(ui('aria.views'))}"><button data-sv="glass" aria-pressed="${R.sub === 'glass'}">${esc(ui('view.glass'))}</button><button data-sv="ridge" aria-pressed="${R.sub === 'ridge'}">${esc(ui('view.ridge'))}</button></div>`;
    if (R.sub !== 'thread') h += `<button class="link" id="howBtn" aria-expanded="${$('how').classList.contains('open')}">${esc(ui('how.btn'))}</button>`;
    if (R.sub !== 'thread' && !mobile()) h += `<div class="lblsw" role="group" aria-label="${esc(ui('labels.aria'))}"><span class="fl">${esc(ui('labels.title'))}</span><div class="seg">${['school', 'person', 'work'].map((m) => `<button data-lm="${m}" aria-pressed="${U.labelMode === m}">${esc(ui('labels.' + m))}</button>`).join('')}</div></div>`;
  }
  const filterable = (R.view === 'map' && (R.sub === 'ridge' || R.sub === 'thread')) || R.view === 'structure';
  if (filterable) {
    const f = U.filters;
    h += `<div class="filters" role="group" aria-label="${esc(ui('filters.aria'))}"><span class="fl">${esc(ui('filters.title'))}</span><button class="fbtn" data-pop="evidence" aria-haspopup="true">${esc(ui('filters.evidence'))}${f.evidence.size ? `<b>${f.evidence.size}</b>` : ''} ▾</button><button class="fbtn" data-pop="activity" aria-haspopup="true">${esc(ui('filters.activity'))}${f.activity.size ? `<b>${f.activity.size}</b>` : ''} ▾</button>${filtersOn() ? `<button class="link" data-fclear>${esc(ui('filters.clear'))}</button>` : ''}</div>`;
  }
  if (R.view === 'map' && R.sub === 'ridge' && !mobile()) h += `<button class="fbtn legbtn" data-pop="legend" aria-haspopup="true">${esc(ui('legend.title'))} ▾</button>`;
  $('sub').innerHTML = h;
  if (fk) { const [a, v] = fk.split('='); const el = $('sub').querySelector(`[${a}="${v}"]`) || $('sub').querySelector(`[${a}]`); if (el) el.focus({ preventScroll: true }); }
}

/* ---- legend (a popover on the ridges: nothing dropped, bar stays one row) ---- */
const SIZE_SVG = '<svg viewBox="0 0 40 12" width="40" height="12" aria-hidden="true"><circle cx="5" cy="6" r="2.4"/><circle cx="15" cy="6" r="3.0"/><circle cx="26" cy="6" r="3.6"/><circle cx="36" cy="6" r="5.2"/></svg>';
function legendHtml() {
  return `<div class="pt">${esc(ui('legend.title'))}</div><div class="lgpop"><div class="lgrow lg-size">${SIZE_SVG}<span>${esc(ui('legend.size'))}</span></div><div class="lgrow"><b class="r"></b><span>${esc(ui('legend.source'))}</span></div><div class="lgrow"><b></b><span>${esc(ui('badge.ongoing'))}</span></div><div class="lgrow"><i></i><span>${esc(ui('legend.inherit'))}</span></div><div class="lgrow"><i class="b"></i><span>${esc(ui('legend.borrow'))}</span></div><div class="lgrow"><i class="c"></i><span>${esc(ui('legend.oppose'))}</span></div></div>`;
}

/* ---- filter popovers ---- */
function openPop(kind, btn) {
  const pop = $('pop'), same = pop.dataset.kind === kind && pop.classList.contains('open'); closePop(); if (same) return;
  if (kind === 'legend') { pop.innerHTML = legendHtml(); const r0 = btn.getBoundingClientRect(); pop.style.left = Math.min(r0.left, innerWidth - 300) + 'px'; pop.style.top = r0.bottom + 6 + 'px'; pop.dataset.kind = kind; pop.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); return; }
  const opts = kind === 'evidence' ? EVID_ORDER.map((k) => [k, evidName(k), evidHelp(k)]) : ACT_ORDER.map((k) => [k, actName(k), '']);
  pop.innerHTML = `<div class="pt">${esc(ui(kind === 'evidence' ? 'filters.evidenceTitle' : 'filters.activityTitle'))}</div>` + opts.map(([k, l, d]) => `<label><input type="checkbox" value="${k}"${U.filters[kind].has(k) ? ' checked' : ''}><span>${esc(l)}${d ? `<small>${esc(d)}</small>` : ''}</span></label>`).join('') + `<div class="pn2">${esc(ui('filters.note'))}</div>`;
  const r = btn.getBoundingClientRect(); pop.style.left = Math.min(r.left, innerWidth - 300) + 'px'; pop.style.top = r.bottom + 6 + 'px'; pop.dataset.kind = kind; pop.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
  const first = pop.querySelector('input'); if (first && lastKeyboard) first.focus();
}
function closePop() { const pop = $('pop'); pop.classList.remove('open'); pop.dataset.kind = ''; }
function applyFilters() {
  const v = viewId();
  if (v === 'vRidge') applyFilterDim(); else if (v === 'vThread') renderThreadView(); else if (v === 'vStructure') renderStructure(); else if (v === 'vGlass') invalidateGlass();
  renderSub();
}
function applyLabelMode() {
  const v = viewId();
  if (v === 'vRidge') drawRidge(false); else if (v === 'vGlass') invalidateGlass();
  renderSub();
}

/* ---- routing ---- */
const pageTitle = () => { const n = R.n && IDX.get(R.n); return (n ? nm(n) + ' · ' : '') + ui('brand.title'); };
let prevMobile = null, booted = false;
function onRoute() {
  const prev = booted ? R : null; booted = true; let next = parseHash(location.hash);
  if (next.sub === 'thread' && !IDX.tById.has(next.thread)) { next.sub = 'ridge'; next.thread = null; }
  if (next.q && next.view === 'questions' && !IDX.get(next.q) && !['debates', 'myths'].includes(next.q)) next.q = null;
  if (next.path && !(IDX.get(next.path) && (IDX.get(next.path).type === 'theory' || IDX.get(next.path).type === 'school'))) next.path = null;
  R = next;
  const langChanged = !!R.lang && R.lang !== LANG;
  if (langChanged) { setLang(R.lang); applyStatic(); renderNav(true); $('results').innerHTML = ''; $('results').classList.remove('open'); }
  const viewChanged = !prev || routeKey(prev) !== routeKey(R) || prevMobile !== mobile();
  prevMobile = mobile();
  if (viewChanged || langChanged) { U.hover = null; U.hoverThread = null; hideTip(); showView(); renderView(!langChanged); if (viewChanged) $('stage').scrollTop = 0; }
  renderSub(); renderNav();
  if (!prev || prev.n !== R.n || viewChanged || langChanged) {
    renderDrawer();
    const n = R.n && IDX.get(R.n);
    if (n && R.view === 'map' && R.sub === 'glass') { const t = IDX.tById.get(IDX.threadOf(n.id)); if (t) { U.rotTarget = -t.idx * stepOf(); U.auto = false; } }
    if (R.view === 'map' && R.sub === 'ridge') focusRidge();
    if (R.view === 'map' && R.sub === 'thread' && n) { const col = $('vThread').querySelector(`.col[data-s="${CSS.escape(IDX.schoolOf(n.id) || '')}"]`); if (col) col.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); }
    invalidateGlass();
  }
  if (!prev || prev.c.join() !== R.c.join() || langChanged) renderCmp();
  document.title = pageTitle();
}

/* ---- boot ---- */
function boot() {
  IDX = buildIndex(window.PSYMAP);
  initLang(); applyStatic();
  initGlass(); wireRidgeGlobal(); wirePanel(); wireDrawerDrag(); const closeSearch = wireSearch();
  applyStatic();

  // chrome clicks
  document.addEventListener('click', (e) => {
    const lg = e.target.closest('[data-lang]'); if (lg) { if (lg.dataset.lang !== LANG) go({ lang: lg.dataset.lang }, { replace: true }); return; }
    const nav = e.target.closest('[data-nav]'); if (nav) { go({ view: nav.dataset.nav, sub: 'glass', thread: null, q: null, n: null, path: null, full: false }); return; }
    const sv = e.target.closest('[data-sv]'); if (sv) { go({ view: 'map', sub: sv.dataset.sv, thread: null }); return; }
    const lm = e.target.closest('[data-lm]'); if (lm) { U.labelMode = lm.dataset.lm; applyLabelMode(); return; }
    const pb = e.target.closest('[data-pop]'); if (pb) { e.stopPropagation(); openPop(pb.dataset.pop, pb); return; }
    if (e.target.closest('[data-fclear]')) { U.filters.evidence.clear(); U.filters.activity.clear(); applyFilters(); return; }
    if (e.target.closest('#howBtn')) { e.stopPropagation(); const o = $('how').classList.toggle('open'); $('howBtn').setAttribute('aria-expanded', o); return; }
    if (!e.target.closest('#how')) $('how').classList.remove('open');
    if (!e.target.closest('#pop')) closePop();
  });
  $('pop').addEventListener('change', (e) => { const i = e.target; if (!i.matches('input')) return; const kind = $('pop').dataset.kind, s = U.filters[kind]; if (i.checked) s.add(i.value); else s.delete(i.value); applyFilters(); });
  document.addEventListener('keydown', (e) => {
    const t = e.target, inField = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
    if (e.key === 'Escape') {
      if ($('pop').classList.contains('open')) { closePop(); return; }
      if ($('how').classList.contains('open')) { $('how').classList.remove('open'); return; }
      closeSearch();
      if (R.c.length) { go({ c: [] }); return; }
      if (R.n) { closeNode(); }
      return;
    }
    if (!inField && !e.altKey && !e.ctrlKey && !e.metaKey && R.view === 'map' && R.sub === 'thread') { if (e.key === 'ArrowLeft') { e.preventDefault(); stepThread(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); stepThread(1); } }
  });
  window.addEventListener('hashchange', onRoute);

  // layout follows container size, no timers
  let lw = 0, lh = 0, raf = 0;
  const ro = new ResizeObserver(() => {
    if (raf) return; raf = requestAnimationFrame(() => {
      raf = 0; const s = $('stage'), w = s.clientWidth, h = Math.round(s.getBoundingClientRect().height); if (w === lw && h === lh) return; lw = w; lh = h;
      if (prevMobile !== mobile()) { prevMobile = mobile(); initParticles(); showView(); renderView(false); renderSub(); return; }
      const v = viewId();
      if (v === 'vGlass') { sizeGlass(); invalidateGlass(); } else if (v === 'vRidge') drawRidge(false); else if (v === 'vThread') renderThreadView(); else if (v === 'vPeople') renderPeople();
    });
  });
  ro.observe($('stage'));
  MQ_MOBILE && MQ_MOBILE.addEventListener && MQ_MOBILE.addEventListener('change', () => { initParticles(); onRoute(); });

  prevMobile = mobile(); renderNav(true); onRoute();
  if (!location.hash) history.replaceState(null, '', serializeRoute(R));
}

/* test/debug surface (pure parts work without a DOM) */
window.__PM = {
  parseHash, serializeRoute, buildIndex, renderNodeDrawer, renderCompareBar, buildSearch, runSearch, searchResultsHtml, tipHtml, go, openNode,
  readingPath, pathHtml, pathCandidates, editionsHtml, personEnd, isPreModern, ridgeLabel, trunc, wrapText, tw,
  regionLang,
  nm, nmAlt, nmShort, personShort, L, ui, DICT, setLang, getLang: () => LANG, popR, safeUrl, safeCover, coverOf,
  get R() { return R; }, get IDX() { return IDX; }, U,
};
if (typeof document !== 'undefined' && document.getElementById('stage')) {
  try { boot(); } catch (err) { console.error(err); const s = document.getElementById('stage'); if (s) s.insertAdjacentHTML('afterbegin', `<div class="view on" style="padding:24px"><h2>Page failed to start / 页面启动出错</h2><pre style="white-space:pre-wrap;color:#e66767">${esc(err && err.stack || err)}</pre></div>`); }
}
