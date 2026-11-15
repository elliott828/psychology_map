/* Shared helpers. Language-aware name helpers live here; all interface text comes from the dictionary (00-i18n.js). */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* text width estimate for label collision: CJK full width, Latin by character class */
const NARROW = 'iljtfI.,;:\'’!|()[]-– ', WIDE = 'mwMW@%';
function tw(s, z = 12) {
  let w = 0;
  for (const c of String(s)) {
    const k = c.charCodeAt(0);
    if (k > 255) w += z;
    else if (c === ' ') w += z * .3;
    else if (NARROW.includes(c)) w += z * .33;
    else if (WIDE.includes(c)) w += z * .9;
    else if (c >= 'A' && c <= 'Z') w += z * .68;
    else w += z * .57;
  }
  return w;
}
/* cut a string to a pixel width, adding an ellipsis */
function trunc(s, maxW, z) {
  s = String(s || ''); if (tw(s, z) <= maxW) return s;
  let o = ''; for (const c of s) { if (tw(o + c + '…', z) > maxW) break; o += c; }
  return o + '…';
}
/* wrap into at most `lines` lines of `maxW` pixels (break at spaces for Latin, anywhere for CJK); last line gets an ellipsis */
function wrapText(s, maxW, lines, z) {
  s = String(s || '').trim(); const out = []; let cur = '';
  const toks = s.match(/[Ā-￿]|[^\sĀ-￿]+\s*|\s+/g) || [];
  for (const tk of toks) {
    if (tw(cur + tk, z) <= maxW || !cur) { cur += tk; continue; }
    out.push(cur.trim()); cur = tk.trimStart();
  }
  if (cur.trim()) out.push(cur.trim());
  if (out.length > lines) { const keep = out.slice(0, lines); keep[lines - 1] = trunc(out.slice(lines - 1).join(/[Ā-￿]/.test(s) ? '' : ' '), maxW, z); return keep; }
  return out.map((l, i) => (tw(l, z) > maxW ? trunc(l, maxW, z) : l));
}

/* relation kinds: the class drives line styles; names come from the dictionary */
const REL_KIND = { develops: 'inherit', branches: 'inherit', merges: 'inherit', bridges: 'borrow', applies: 'borrow', feeds: 'borrow', reacts: 'oppose', critiques: 'oppose' };
const REL_ORDER = ['develops', 'branches', 'merges', 'bridges', 'reacts', 'critiques', 'applies', 'feeds'];
const relName = (k) => ui('rel.' + k);
const relHelp = (k) => ui('relhelp.' + k);
const typeName = (k) => ui('type.' + k);
const EVID_ORDER = ['strong', 'moderate', 'mixed', 'limited', 'historical', 'conceptual'];
const evidName = (k) => (EVID_ORDER.includes(k) ? ui('evid.' + k) : k);
const evidHelp = (k) => (EVID_ORDER.includes(k) ? ui('evidhelp.' + k) : '');
const ACT_ORDER = ['theory', 'research', 'clinical', 'method', 'applied'];
const actName = (k) => (ACT_ORDER.includes(k) ? ui('act.' + k) : '');
const LEVEL_ORDER = ['bio', 'individual', 'relational', 'sociocultural'];
const levelName = (k) => (LEVEL_ORDER.includes(k) ? ui('level.' + k) : '');
const levelNote = (k) => (LEVEL_ORDER.includes(k) ? ui('levelnote.' + k) : '');
const DEPTH_ORDER = ['easy', 'medium', 'hard'];
const depthName = (k) => (DEPTH_ORDER.includes(k) ? ui('depth.' + k) : '');
const ROLE_ORDER = ['overview', 'biography', 'theory', 'extension', 'practice', 'history', 'adjacent', 'critique', 'translation', 'reference'];
const roleName = (k) => (ROLE_ORDER.includes(k) ? ui('role.' + k) : (k || ui('role.default')));
const VERDICT_CLASS = { '不成立': 'v-no', '基本不成立': 'v-mostly', '有误导': 'v-mis' };
const VERDICT_SLUG = { '不成立': 'no', '基本不成立': 'mostly', '有误导': 'mis' };
const NAV_KEYS = ['map', 'structure', 'people', 'questions', 'reading'];
const dot = (c) => `<i class="chip" style="--c:${c}"></i>`;
const confTag = (n) => (n && n.confidence && n.confidence !== 'high' ? `<span class="tbc" title="${esc(ui('tbc.title'))}">${esc(ui('tbc'))}</span>` : '');
const MQ_MOBILE = typeof matchMedia === 'function' ? matchMedia('(max-width:760px)') : null;
const MQ_RM = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion:reduce)') : null;
const mobile = () => !!(MQ_MOBILE && MQ_MOBILE.matches);
const reduced = () => !!(MQ_RM && MQ_RM.matches);

/* five entry icons (24x24, stroke = currentColor, 1.6, round caps) */
const ICON_PATHS = {
  map: '<path d="M3 9c3 0 3-4 6-4s3 4 6 4 3-2 6-2"/><path d="M3 14c2 0 3-3 5-3s3 3 6 3 4-4 7-4"/><path d="M3 19c4 0 4-3 7-3s3 3 5 3 3-1 6-1"/>',
  structure: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5" fill="currentColor" fill-opacity=".35"/>',
  people: '<path d="M3 7h11M7 12h13M5 17h9"/><circle cx="9" cy="7" r="1.6" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="11" cy="17" r="1.6" fill="currentColor" stroke="none"/>',
  questions: '<path d="M3 12h4"/><path d="M11 12l9-6M11 12h10M11 12l9 6"/><circle cx="9" cy="12" r="2"/>',
  reading: '<path d="M12 7c-2-1.5-5-2-8-2v13c3 0 6 .5 8 2 2-1.5 5-2 8-2V5c-3 0-6 .5-8 2z"/><path d="M12 7v13"/>',
};
const icon = (k, size) => `<svg class="ic" viewBox="0 0 24 24" width="${size || 24}" height="${size || 24}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[k] || ''}</svg>`;
/* page-title icon: 30px glyph in a 44px gradient-bordered box */
const titleIcon = (k) => `<span class="ticon" aria-hidden="true">${icon(k, 30)}</span>`;

/* ---- display names (language aware) ---- */
const lastToken = (s) => { const toks = String(s || '').trim().split(/\s+/).filter((x) => x && !/^(jr|sr|ii|iii|jr\.|sr\.)$/i.test(x)); return toks.length ? toks[toks.length - 1] : ''; };
function nm(n, lang) {
  if (!n) return ''; lang = lang || LANG; const alt = lang === 'en' ? 'zh' : 'en';
  switch (n.type) {
    case 'person': return (n.name && n.name[lang]) || (n.title && n.title[lang]) || (n.name && n.name[alt]) || (n.title && n.title[alt]) || n.id;
    case 'work': {
      if (lang === 'en') return (n.enRec && n.enRec.title) || (n.original && n.original.title && n.lang !== 'zh' && n.original.title) || (n.title && n.title.en) || (n.title && n.title.zh) || (n.original && n.original.title) || n.id;
      return (n.title && n.title.zh) || (n.title && n.title.en) || n.id;
    }
    case 'myth': return L(n.claim, lang) || n.id;
    default: return (n.title && (n.title[lang] || n.title[alt])) || n.id;
  }
}
/* the other language's name, when it differs */
function nmAlt(n) { const a = nm(n, LANG === 'en' ? 'zh' : 'en'); return a && a !== nm(n) ? a : ''; }
/* name for map labels: schools use enShort in English */
function nmShort(n) { if (!n) return ''; if (LANG === 'en' && n.title && n.type !== 'person' && n.type !== 'work') return n.title.enShort || n.title.en || n.title.zh || n.id; return nm(n); }
/* a person's short name: surname in English, the usual short form in Chinese */
function personShort(p) {
  if (!p) return '';
  if (LANG === 'en') return lastToken(nm(p, 'en')) || nm(p);
  const z = nm(p, 'zh'); const i = Math.max(z.lastIndexOf('·'), z.lastIndexOf('・')); return i >= 0 ? z.slice(i + 1) : z;
}
