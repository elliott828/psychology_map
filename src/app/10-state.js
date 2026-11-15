/* State and URL-hash routing.
   #/map  #/map/ridge  #/map/t/<threadId>  #/structure  #/people  #/people/full  #/questions  #/questions/<id>  #/reading  #/reading/path/<nodeId>
   ?n=<nodeId> opens a detail drawer, ?c=<idA>,<idB> opens compare (one id = waiting for the second), ?lang=en|zh sets the interface language. */

function parseHash(hash) {
  let h = String(hash || '').replace(/^#/, '');
  const qi = h.indexOf('?');
  const path = qi >= 0 ? h.slice(0, qi) : h, qs = qi >= 0 ? h.slice(qi + 1) : '';
  const dec = (s) => { try { return decodeURIComponent(s); } catch (e) { return s; } };
  const seg = path.split('/').filter(Boolean).map(dec);
  const r = { view: 'map', sub: 'glass', thread: null, q: null, n: null, c: [], path: null, full: false, lang: null };
  const views = ['map', 'structure', 'people', 'questions', 'reading'];
  if (seg[0] && views.includes(seg[0])) r.view = seg[0];
  if (r.view === 'map') {
    if (seg[1] === 'ridge') r.sub = 'ridge';
    else if (seg[1] === 't' && seg[2]) { r.sub = 'thread'; r.thread = seg[2]; }
  } else if (r.view === 'questions' && seg[1]) r.q = seg[1];
  else if (r.view === 'people' && seg[1] === 'full') r.full = true;
  else if (r.view === 'reading' && seg[1] === 'path' && seg[2]) r.path = seg[2];
  qs.split('&').filter(Boolean).forEach((p) => {
    const i = p.indexOf('='); const k = i < 0 ? p : p.slice(0, i), v = dec(i < 0 ? '' : p.slice(i + 1));
    if (k === 'n' && v) r.n = v;
    else if (k === 'c') r.c = v.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 2);
    else if (k === 'lang' && (v === 'en' || v === 'zh')) r.lang = v;
  });
  return r;
}

function serializeRoute(r) {
  const enc = encodeURIComponent;
  let p = '#/' + (r.view || 'map');
  if (r.view === 'map' || !r.view) { if (r.sub === 'ridge') p += '/ridge'; else if (r.sub === 'thread' && r.thread) p += '/t/' + enc(r.thread); }
  else if (r.view === 'questions' && r.q) p += '/' + enc(r.q);
  else if (r.view === 'people' && r.full) p += '/full';
  else if (r.view === 'reading' && r.path) p += '/path/' + enc(r.path);
  const qs = [];
  if (r.n) qs.push('n=' + enc(r.n));
  if (r.c && r.c.length) qs.push('c=' + r.c.map(enc).join(','));
  if (r.lang) qs.push('lang=' + r.lang);
  return p + (qs.length ? '?' + qs.join('&') : '');
}

/* current route + interface state */
let R = { view: 'map', sub: 'glass', thread: null, q: null, n: null, c: [], path: null, full: false, lang: null };
const U = {
  hover: null, hoverThread: null,
  filters: { evidence: new Set(), activity: new Set() },
  stack: [],            // drawer back-stack (node ids)
  peopleSort: 'year', peopleThread: null, labelMode: 'school',
  readDepth: new Set(), readRole: new Set(),
  rot: -.5, auto: true, rotTarget: null,
  openCards: new Set(),
};
let IDX = null;          // set at boot
const routeKey = (r) => [r.view, r.sub, r.thread, r.q, r.path, r.full].join('|');
const passFilter = (n) => !n || n.type === 'root' || ((!U.filters.evidence.size || U.filters.evidence.has(n.evidence)) && (!U.filters.activity.size || U.filters.activity.has(n.activity)));
const filtersOn = () => U.filters.evidence.size + U.filters.activity.size > 0;

/* navigation: all changes go through the hash so reload and sharing restore the same state */
function go(patch, opts) {
  const next = Object.assign({}, R, patch);
  if (next.view !== 'map') { next.sub = 'glass'; next.thread = null; }
  if (next.view !== 'questions') next.q = null;
  if (next.view !== 'reading') next.path = null;
  if (next.view !== 'people') next.full = false;
  const hash = serializeRoute(next);
  if (opts && opts.replace) { history.replaceState(null, '', hash); onRoute(); return; }
  if (location.hash === hash) { onRoute(); return; }
  location.hash = hash;
}
const hrefOf = (patch) => serializeRoute(Object.assign({}, R, patch));

/* open a node's detail drawer; `fromDrawer` keeps a back-stack */
function openNode(id, fromDrawer) {
  const n = IDX && IDX.get(id);
  if (!n) return;
  if (n.type === 'question' || n.type === 'debate' || n.type === 'myth') { go({ view: 'questions', q: id, n: null }); return; }
  if (R.c.length === 1 && n.type === 'school' && R.c[0] !== id) { go({ c: [R.c[0], id] }); return; }   // compare: picking the second school
  if (fromDrawer && R.n && R.n !== id) U.stack.push(R.n); else if (!fromDrawer) U.stack = [];
  go({ n: id });
}
function closeNode() { U.stack = []; go({ n: null }); }
function backNode() { const p = U.stack.pop(); go({ n: p || null }); }
