// Static, crawlable pages for search engines: one page per entry and language, list pages, and sitemap.xml.
// The interactive map stays the main experience; every static page links back into it at the same entry.
// Content comes from the app itself (index, names, translations, reading paths), so pages always match the map.
//   zh/ and en/  -> generated (wiped and rewritten on every build)
//   sitemap.xml  -> all pages with zh/en alternates
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';

export const SITE = (process.env.PSYMAP_SITE || 'https://elliott828.github.io/psychology_map/').replace(/\/?$/, '/');
const LANGS = ['zh', 'en'], HREFLANG = { zh: 'zh-CN', en: 'en' };
const KIND = { school: 'school', theory: 'theory', person: 'person', concept: 'concept', work: 'book', application: 'application', root: 'source', question: 'question', debate: 'debate', myth: 'myth' };
const SAFE_ID = /^[A-Za-z0-9._-]+$/;

const S = {
  zh: {
    brand: '心理学地图', brandFull: '心理学地图 Psychologymap', openMap: '在交互地图中查看', home: '首页', switchTo: 'English', textIndex: '文字版目录',
    thread: '脉络', year: '年份', keyPerson: '关键人物', people: '代表人物', theories: '核心理论', concepts: '关键概念', books: '相关书籍', relations: '与其他学派的关系', readingPath: '阅读路径',
    landmark: '标志性事件', evidenceNote: '证据怎么说', scores: '评分', born: '生卒', role: '身份', schools: '所属学派', theoriesOf: '提出或发展的理论', worksOf: '著作',
    plain: '通俗地说', example: '例子', misuse: '常见误用', school: '所属学派', author: '作者', depth: '难度', bookRole: '类型', zhEd: '中文版', enEd: '英文版',
    rating: (r, v) => `豆瓣 ${r} 分（${v} 人评价）`, douban: '豆瓣页面', openLibrary: 'Open Library', when: '时间', legacy: '今天的影子', leadsTo: '后来影响到', threads: '相关脉络',
    lenses: '几条脉络各自的解释', furtherReading: '延伸阅读：每种解释先读哪本', sides: '双方观点', verdict: '结论', correction: '实际情况', related: '相关条目', domain: '领域', relatedMyths: '相关的流行误读', relatedQuestions: '相关的生活问题',
    allPeople: '全部人物', allBooks: '全部书籍', allTheories: '全部理论', allConcepts: '全部概念', allQuestions: '问题、争论与误读', sources: '思想源头', debates: '学术争论', myths: '流行误读', questions: '生活问题',
    hubLead: '心理学不是某一位大师的学说，而是一百多年里许多条线索同时生长出来的领域。这里按九条脉络整理了学派、人物、理论、概念和书，并给每个学派和理论配了一条阅读路径。',
    footer: '中立的心理学思想地图：不从任何一个学派出发。', viaSchool: '（学派通用）', noBook: '暂无合适的书',
    t: {
      school: (n) => `${n}：核心观点、代表人物与入门书单`, theory: (n, s) => `${n}${s ? `（${s}）` : ''}：理论内容、证据与延伸阅读`, person: (n) => `${n}：生平、理论与著作`,
      concept: (n) => `${n}是什么意思？通俗解释与常见误用`, work: (n, a) => `《${n}》${a ? a + '：' : '：'}中文版、英文版与所属学派`, application: (n) => `${n}：心理学的应用`,
      root: (n) => `${n}：心理学的思想源头`, question: (n) => `${n}：心理学的几种解释`, debate: (n) => `${n}：心理学史上的争论`, myth: (n) => `流行误读：${n}`,
      thread: (n) => `${n}：这条心理学脉络的学派与发展`, hub: () => '心理学地图：心理学流派、人物、理论与书单全图',
      people: (c) => `心理学人物一览（${c} 位）`, books: (c) => `心理学书单：${c} 本书，按学派与难度`, theories: (c) => `心理学理论一览（${c} 个）`, concepts: (c) => `心理学概念词典（${c} 个）`, questions: () => '生活问题、学术争论与流行误读',
    },
  },
  en: {
    brand: 'Psychologymap', brandFull: 'Psychologymap', openMap: 'Open in the interactive map', home: 'Home', switchTo: '中文', textIndex: 'Text index',
    thread: 'Thread', year: 'Year', keyPerson: 'Key figure', people: 'Key people', theories: 'Core theories', concepts: 'Key concepts', books: 'Books', relations: 'Relations to other schools', readingPath: 'Reading path',
    landmark: 'Landmark', evidenceNote: 'What the evidence says', scores: 'Scores', born: 'Lived', role: 'Role', schools: 'Schools', theoriesOf: 'Theories', worksOf: 'Books',
    plain: 'In plain words', example: 'Example', misuse: 'Common misuse', school: 'School', author: 'Author', depth: 'Difficulty', bookRole: 'Kind', zhEd: 'Chinese edition', enEd: 'English edition',
    rating: (r, v) => `Douban ${r} (${v} ratings)`, douban: 'Douban page', openLibrary: 'Open Library', when: 'When', legacy: 'What remains today', leadsTo: 'Later influenced', threads: 'Threads',
    lenses: 'How different threads explain it', furtherReading: 'Further reading: where to start for each explanation', sides: 'The two sides', verdict: 'Verdict', correction: 'What is actually true', related: 'Related entries', domain: 'Domain', relatedMyths: 'Related myths', relatedQuestions: 'Related everyday questions',
    allPeople: 'All people', allBooks: 'All books', allTheories: 'All theories', allConcepts: 'All concepts', allQuestions: 'Questions, debates and myths', sources: 'Sources', debates: 'Debates', myths: 'Myths', questions: 'Everyday questions',
    hubLead: 'Psychology is not one master\'s doctrine but a field that grew along many lines at once over more than a century. This map arranges its schools, people, theories, concepts and books into nine threads, with a reading path for every school and theory.',
    footer: 'A neutral map of psychological ideas: it does not start from any one school.', viaSchool: ' (for the whole school)', noBook: 'No suitable book yet',
    t: {
      school: (n) => `${n}: Key Ideas, People and Reading List`, theory: (n, s) => `${n}${s ? ` (${s})` : ''}: What It Says, Evidence and Further Reading`, person: (n) => `${n}: Life, Theories and Books`,
      concept: (n) => `What Is ${n}? Plain Explanation and Common Misuse`, work: (n, a) => `${n}${a ? ' by ' + a : ''}: Editions and Where It Fits`, application: (n) => `${n}: An Application of Psychology`,
      root: (n) => `${n}: A Source of Psychology`, question: (n) => `${n}: How Psychology Explains It`, debate: (n) => `${n}: A Debate in Psychology`, myth: (n) => `Myth: ${n}`,
      thread: (n) => `${n}: Schools and History of This Line of Psychology`, hub: () => 'Psychologymap: A Map of Psychology\'s Schools, People, Theories and Books',
      people: (c) => `People in Psychology (${c})`, books: (c) => `Psychology Reading List: ${c} Books by School and Difficulty`, theories: (c) => `Psychological Theories (${c})`, concepts: (c) => `Glossary of Psychological Concepts (${c})`, questions: () => 'Everyday Questions, Debates and Myths in Psychology',
    },
  },
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, max) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length <= max ? s : s.slice(0, max - 1).replace(/[，,。.;；：:、\s]+$/, '') + '…'; };
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

function loadApp(built) {
  const win = { PSYMAP: built.data };
  const ctx = vm.createContext({ window: win, console, Map, Set, Math, Date });
  vm.runInContext(`(function(){\n'use strict';\n${built.app}\n})();`, ctx, { filename: 'app.js' });
  return win.__PM;
}

export function buildStatic(built, root, { write = true } = {}) {
  const favicon = fs.readFileSync(path.join(root, 'src', 'logo.svg'), 'utf8').replace(/>\s+</g, '><').trim().replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(/xmlns="http:\/\/www.w3.org\/2000\/svg" (.*)xmlns="http:\/\/www.w3.org\/2000\/svg"/, 'xmlns="http://www.w3.org/2000/svg" $1');
  const PM = loadApp(built), I = PM.buildIndex(built.data), files = new Map(), pages = [];
  const { nm, L, ui } = PM;
  const kindOf = (n) => KIND[n.type];
  const pathOf = (lang, n) => (n && kindOf(n) && SAFE_ID.test(n.id) ? `${lang}/${kindOf(n)}/${n.id}/` : null);
  const yearLabel = (y) => (y == null ? '' : y < 0 ? ui('year.bce', { y: -y }) : String(y));
  const stars = (v) => (v ? '●'.repeat(v) + '○'.repeat(Math.max(0, 5 - v)) : '');

  function page({ lang, rel, depth, title, desc, h1, sub, body, crumbs, ld, appRoute, other, ogType = 'article' }) {
    const s = S[lang], pre = '../'.repeat(depth), url = SITE + rel, alt = other || rel.replace(/^(zh|en)\//, (m, l) => (l === 'zh' ? 'en/' : 'zh/'));
    const appHref = pre + (appRoute ? PM.serializeRoute(Object.assign({ lang }, appRoute)) : '#/map?lang=' + lang);
    const bc = crumbs.map((c, i) => (c.href != null && i < crumbs.length - 1 ? `<a href="${pre}${c.href}">${esc(c.label)}</a>` : `<span>${esc(c.label)}</span>`)).join('<i>›</i>');
    const ldList = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: SITE + (c.href != null ? c.href : rel) })) }].concat(ld ? [Object.assign({ '@context': 'https://schema.org', url, inLanguage: HREFLANG[lang] }, ld)] : []);
    const fullTitle = `${title} | ${s.brandFull}`;
    const html = `<!doctype html>
<html lang="${HREFLANG[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${HREFLANG[lang]}" href="${url}">
<link rel="alternate" hreflang="${HREFLANG[lang === 'zh' ? 'en' : 'zh']}" href="${SITE + alt}">
<link rel="alternate" hreflang="x-default" href="${SITE + (lang === 'en' ? rel : alt)}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(s.brandFull)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}assets/og.png">
<meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${pre}assets/favicon.svg">
<link rel="stylesheet" href="${pre}assets/static.css">
${ldList.map(jsonLd).join('\n')}
</head>
<body>
<header class="top"><a class="brand" href="${pre}${lang}/">${esc(s.brandFull)}</a><nav><a href="${pre}${alt}" hreflang="${HREFLANG[lang === 'zh' ? 'en' : 'zh']}" lang="${HREFLANG[lang === 'zh' ? 'en' : 'zh']}">${esc(s.switchTo)}</a><a class="cta" href="${appHref}">${esc(s.openMap)} →</a></nav></header>
<main>
<nav class="crumbs" aria-label="breadcrumb">${bc}</nav>
<h1>${esc(h1)}</h1>${sub ? `\n<p class="sub">${sub}</p>` : ''}
${body}
<p class="open"><a class="cta" href="${appHref}">${esc(s.openMap)} →</a></p>
</main>
<footer><p>${esc(s.footer)}</p><p><a href="${pre}${lang}/">${esc(s.home)}</a> · <a href="${pre}${lang}/people/">${esc(s.allPeople)}</a> · <a href="${pre}${lang}/theories/">${esc(s.allTheories)}</a> · <a href="${pre}${lang}/concepts/">${esc(s.allConcepts)}</a> · <a href="${pre}${lang}/books/">${esc(s.allBooks)}</a> · <a href="${pre}${lang}/questions/">${esc(s.allQuestions)}</a> · <a href="${pre}">${esc(s.openMap)}</a></p></footer>
</body>
</html>
`;
    files.set(rel + 'index.html', html); pages.push({ lang, rel, alt });
  }

  for (const lang of LANGS) {
    PM.setLang(lang);
    const s = S[lang], hub = `${lang}/`;
    const a = (n, pre, label) => { const p = pathOf(lang, n); return p ? `<a href="${pre}${p}">${esc(label || nm(n))}</a>` : esc(label || nm(n)); };
    const threadPath = (t) => `${lang}/thread/${t.id}/`;
    const tName = (t) => L(t.title);
    const sec = (h, inner) => (inner ? `<section><h2>${esc(h)}</h2>${inner}</section>` : '');
    const ul = (items) => (items.length ? `<ul>${items.join('')}</ul>` : '');
    const linkList = (list, pre, extra) => ul((list || []).filter(Boolean).map((n) => `<li>${a(n, pre)}${extra ? extra(n) : ''}</li>`));
    const yr = (n) => (n.year != null ? ` <span class="y">${esc(yearLabel(n.year))}</span>` : '');
    const sum = (n) => (L(n.summary) ? `<span class="d">${esc(L(n.summary))}</span>` : '');
    const crumbBase = () => [{ label: s.brand, href: hub }];
    const threadCrumb = (n) => { const t = I.tById.get(I.threadOf(n.id)); return t ? [{ label: tName(t), href: threadPath(t) }] : []; };
    const kv = (pairs) => { const r = pairs.filter(([, v]) => v); return r.length ? `<dl class="kv">${r.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>` : ''; };
    const relations = (n, pre) => ul((I.edgesOf.get(n.id) || []).map((e) => { const out = e.from === n.id, o = I.get(out ? e.to : e.from); if (!o) return ''; return `<li><span class="rel">${out ? '→' : '←'} ${esc(ui('rel.' + e.type))}</span> ${a(o, pre)}${L(e.note) ? `<span class="d">${esc(L(e.note))}</span>` : ''}</li>`; }).filter(Boolean));
    const bookLi = (w, pre, label) => `<li>${label ? `<span class="rel">${esc(label)}</span> ` : ''}${a(w, pre, '《' + nm(w) + '》')}${w.author ? ` <span class="y">${esc(w.author)}${w.year ? ', ' + w.year : ''}</span>` : ''}</li>`;
    function readingPath(n, pre) {
      const rp = PM.readingPath(I, n.id); if (!rp) return '';
      const side = (list) => ul(list.map((it) => { const o = I.get(it.id), w = it.book && I.get(it.book); return `<li>${a(o, pre)} <span class="rel">${esc(ui('rel.' + (it.rel === 'opposes' || it.rel === 'critic' ? 'reacts' : it.rel)) )}</span>${w ? ` → ${a(w, pre, '《' + nm(w) + '》')}` : ''}</li>`; }));
      const ladder = ul(rp.ladder.map((st) => { const w = I.get(st.id); return w ? `<li><span class="rel">${esc(ui('depth.' + st.depth))}</span> ${a(w, pre, '《' + nm(w) + '》')}${w.author ? ` <span class="y">${esc(w.author)}</span>` : ''}${st.viaSchool ? esc(s.viaSchool) : ''}</li>` : ''; }));
      return sec(s.readingPath, `<div class="path"><div><h3>${esc(ui('path.before'))}</h3>${side(rp.up) || `<p class="muted">—</p>`}</div><div><h3>${esc(ui(n.type === 'school' ? 'path.thisSchool' : 'path.thisTheory'))}</h3>${ladder || `<p class="muted">${esc(s.noBook)}</p>`}</div><div><h3>${esc(ui('path.after'))}</h3>${side(rp.down) || `<p class="muted">—</p>`}</div></div>`);
    }
    const scores = (n) => { const r = []; if (n.influence) r.push(`${esc(ui('score.influence'))} ${stars(n.influence)}`); if (n.evidence) r.push(`${esc(ui('score.evidence'))}：${esc(ui('evid.' + n.evidence))}`.replace('：', lang === 'en' ? ': ' : '：')); if (n.popularity) r.push(`${esc(ui('score.popularity'))} ${stars(n.popularity)}`); return r.length ? `<p class="scores">${r.join('<span class="sep">·</span>')}</p>` : ''; };
    const mythsAbout = (ids) => I.myths.filter((m) => (m.related || []).some((x) => ids.has(x)));
    const questionsAbout = (ids) => I.questions.filter((q) => (q.lenses || []).some((l) => ids.has(l.node)));
    const typeLabel = (n) => ui('type.' + n.type);
    const mythList = (list, pre) => ul(list.map((m) => `<li>${a(m, pre, '“' + L(m.claim).replace(/[。.]$/, '') + '”')} <span class="y">${esc(L(m.verdict))}</span></li>`));

    /* ---------- entry pages ---------- */
    for (const n of I.byId.values()) {
      const rel = pathOf(lang, n); if (!rel) continue;
      const pre = '../../../', name = nm(n), alt = nmAlt(n, lang);
      let title, h1 = name, body = '', desc = L(n.summary), ld = null, route = { view: 'map', sub: 'ridge', n: n.id }, crumbs = crumbBase().concat(threadCrumb(n));
      const subParts = [typeLabel(n)];
      if (n.type === 'school') {
        const t = I.tById.get(n.thread), ids = new Set([n.id].concat((I.theoriesOf.get(n.id) || []).map((x) => x.id)));
        title = s.t.school(name); subParts.push(yearLabel(n.year));
        const kp = I.keyPersonOf ? I.keyPersonOf(n) : null;
        body = `<p class="lead">${esc(L(n.summary))}</p>` + scores(n) + kv([[s.thread, t ? `<a href="${pre}${threadPath(t)}">${esc(tName(t))}</a>` : ''], [s.landmark, esc(L(n.landmark))], [s.evidenceNote, esc(L(n.evidenceNote))], [s.keyPerson, kp ? a(kp, pre) : '']])
          + sec(s.theories, linkList(I.theoriesOf.get(n.id), pre, (x) => yr(x) + sum(x))) + sec(s.people, linkList(I.personsOf.get(n.id), pre, (p) => ` <span class="y">${esc(lifeOf(p))}</span>`))
          + sec(s.concepts, linkList(I.conceptsOf.get(n.id), pre, sum)) + sec(s.relations, relations(n, pre)) + readingPath(n, pre)
          + sec(s.books, ul((I.worksOf.get(n.id) || []).map((w) => bookLi(w, pre, ui('depth.' + (w.depth || 'medium'))))))
          + sec(s.relatedQuestions, linkList(questionsAbout(ids), pre)) + sec(s.relatedMyths, mythList(mythsAbout(ids), pre));
        ld = { '@type': 'DefinedTerm', name, alternateName: alt || undefined, description: L(n.summary), inDefinedTermSet: SITE + hub };
      } else if (n.type === 'theory') {
        const sc = I.get(n.school), ids = new Set([n.id, n.school]);
        title = s.t.theory(name, sc ? nm(sc) : ''); subParts.push(yearLabel(n.year)); crumbs.push(...(sc ? [{ label: nm(sc), href: pathOf(lang, sc) }] : []));
        body = `<p class="lead">${esc(L(n.summary))}</p>` + scores(n) + kv([[s.school, sc ? a(sc, pre) : ''], [s.landmark, esc(L(n.landmark))], [s.evidenceNote, esc(L(n.evidenceNote))]])
          + sec(s.people, linkList(I.peopleOfTheory.get(n.id), pre, (p) => ` <span class="y">${esc(lifeOf(p))}</span>`)) + sec(s.relations, relations(n, pre)) + readingPath(n, pre)
          + sec(s.books, ul((I.worksOfTheory.get(n.id) || []).map((w) => bookLi(w, pre)))) + sec(s.relatedQuestions, linkList(questionsAbout(ids), pre)) + sec(s.relatedMyths, mythList(mythsAbout(new Set([n.id])), pre));
        ld = { '@type': 'DefinedTerm', name, alternateName: alt || undefined, description: L(n.summary), inDefinedTermSet: SITE + hub };
      } else if (n.type === 'person') {
        title = s.t.person(name); route = { view: 'people', n: n.id }; desc = L(n.role) || L(n.summary); subParts.push(lifeOf(n));
        const scs = (n.schools || []).map((id) => I.get(id)).filter(Boolean);
        body = `<p class="lead">${esc(L(n.role) || L(n.summary))}</p>` + kv([[s.born, esc(lifeOf(n))], [s.schools, scs.map((x) => a(x, pre)).join('、')]])
          + sec(s.theoriesOf, linkList(I.theoriesOfPerson.get(n.id), pre, (x) => yr(x) + sum(x))) + sec(s.worksOf, ul((I.worksOfPerson.get(n.id) || []).map((w) => bookLi(w, pre))));
        ld = { '@type': 'Person', name, alternateName: alt || undefined, description: desc, birthDate: n.born != null && n.born > 0 ? String(n.born) : undefined, deathDate: n.died != null && n.died > 0 ? String(n.died) : undefined };
      } else if (n.type === 'concept') {
        const sc = I.get(n.school); title = s.t.concept(name); crumbs.push(...(sc ? [{ label: nm(sc), href: pathOf(lang, sc) }] : []));
        body = `<p class="lead">${esc(L(n.summary))}</p>` + kv([[s.school, sc ? a(sc, pre) : ''], [s.plain, esc(L(n.plain))], [s.example, esc(L(n.example))], [s.misuse, esc(L(n.misuse))]]) + sec(s.relatedMyths, mythList(mythsAbout(new Set([n.id])), pre));
        ld = { '@type': 'DefinedTerm', name, alternateName: alt || undefined, description: L(n.summary), inDefinedTermSet: SITE + hub };
      } else if (n.type === 'work') {
        title = s.t.work(name, n.author); h1 = lang === 'zh' ? `《${name}》` : name; route = { view: 'reading', n: n.id }; subParts.push([n.author, n.year].filter(Boolean).join(', '));
        const scs = (n.schools || []).map((id) => I.get(id)).filter(Boolean), ths = (n.theories || []).map((id) => I.get(id)).filter(Boolean), cv = I.covers[n.id], cover = cv && (cv[lang] || cv.zh || cv.en);
        body = (cover ? `<img class="cover" src="${pre}${esc(cover)}" alt="${esc(lang === 'zh' ? '《' + name + '》封面' : name + ' cover')}" loading="lazy" width="160">` : '') + `<p class="lead">${esc(L(n.summary))}</p>`
          + kv([[s.author, esc(n.author)], [s.year, esc(n.year)], [s.depth, n.depth ? esc(ui('depth.' + n.depth)) : ''], [s.bookRole, n.role ? esc(ui('role.' + n.role)) : ''], [s.schools, scs.map((x) => a(x, pre)).join(lang === 'zh' ? '、' : ', ')], [s.theories, ths.map((x) => a(x, pre)).join(lang === 'zh' ? '、' : ', ')]])
          + editions(n);
        ld = { '@type': 'Book', name, alternateName: alt || undefined, description: L(n.summary), author: n.author ? { '@type': 'Person', name: n.author } : undefined, datePublished: n.year ? String(n.year) : undefined, image: cover ? SITE + cover : undefined };
      } else if (n.type === 'application') {
        title = s.t.application(name); subParts.push(yearLabel(n.year));
        body = `<p class="lead">${esc(L(n.summary))}</p>` + kv([[s.domain, esc(typeof n.domain === 'string' ? n.domain : L(n.domain))], [s.landmark, esc(L(n.landmark))]]) + sec(s.relations, relations(n, pre));
      } else if (n.type === 'root') {
        title = s.t.root(name); crumbs = crumbBase().concat([{ label: s.sources, href: hub + '#sources' }]); subParts.push(L(n.when) || yearLabel(n.year));
        const to = n.to && I.get(n.to);
        body = `<p class="lead">${esc(L(n.summary))}</p>` + kv([[s.when, esc(L(n.when) || yearLabel(n.year))], [s.legacy, esc(L(n.legacy))], [s.leadsTo, to ? a(to, pre) : ''], [s.threads, (n.threads || []).map((id) => I.tById.get(id)).filter(Boolean).map((t) => `<a href="${pre}${threadPath(t)}">${esc(tName(t))}</a>`).join(lang === 'zh' ? '、' : ', ')]])
          + sec(s.people, linkList((n.people || []).map((id) => I.get(id)), pre));
      } else if (n.type === 'question') {
        title = s.t.question(L(n.title)); h1 = L(n.title); route = { view: 'questions', q: n.id }; crumbs = crumbBase().concat([{ label: s.questions, href: `${lang}/questions/` }]);
        const lenses = (n.lenses || []).map((l) => ({ node: I.get(l.node), take: L(l.take) })).filter((l) => l.node);
        desc = lenses.map((l) => l.take).join(' ');
        body = sec(s.lenses, ul(lenses.map((l) => { const t = I.tById.get(I.threadOf(l.node.id)); return `<li>${a(l.node, pre)}${t ? ` <span class="y">${esc(tName(t))}</span>` : ''}<span class="d">${esc(l.take)}</span></li>`; })));
        const firstBooks = lenses.map((l) => { const rp = PM.readingPath(I, l.node.id), st = rp && rp.ladder[0], w = st && I.get(st.id); return w ? { l, w, depth: st.depth } : null; }).filter(Boolean);
        body += sec(s.furtherReading, ul(firstBooks.map(({ l, w, depth }) => `<li>${a(w, pre, lang === 'zh' ? '《' + nm(w) + '》' : nm(w))} <span class="y">${esc([w.author, ui('depth.' + depth)].filter(Boolean).join(' · '))}</span><span class="d">${esc(nm(l.node))}</span></li>`)));
        ld = { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: L(n.title), acceptedAnswer: { '@type': 'Answer', text: lenses.map((l) => `${nm(l.node)}: ${l.take}`).join('\n') } }] };
      } else if (n.type === 'debate') {
        title = s.t.debate(L(n.title)); h1 = L(n.title); route = { view: 'questions', q: 'debates' }; crumbs = crumbBase().concat([{ label: s.debates, href: `${lang}/questions/` }]); subParts.push(yearLabel(n.year));
        body = `<p class="lead">${esc(L(n.summary))}</p>` + sec(s.sides, ul((n.sides || []).map((sd) => ({ node: I.get(sd.node), pos: L(sd.position) })).filter((x) => x.node).map((x) => `<li>${a(x.node, pre)}<span class="d">${esc(x.pos)}</span></li>`)));
      } else if (n.type === 'myth') {
        const claim = L(n.claim).replace(/[。.]$/, ''); title = s.t.myth(claim); h1 = '“' + claim + '”'; route = { view: 'questions', q: 'myths' }; crumbs = crumbBase().concat([{ label: s.myths, href: `${lang}/questions/` }]);
        desc = clip(`${L(n.verdict)}。${L(n.correction)}`.replace('。', lang === 'en' ? '. ' : '。'), 160);
        body = `<p class="verdict">${esc(s.verdict)}：${esc(L(n.verdict))}</p><p class="lead">${esc(L(n.correction))}</p>` + sec(s.related, linkList((n.related || []).map((id) => I.get(id)), pre));
        ld = { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: claim + (lang === 'zh' ? '？' : '?'), acceptedAnswer: { '@type': 'Answer', text: `${L(n.verdict)}. ${L(n.correction)}` } }] };
      }
      crumbs.push({ label: h1.replace(/^“|”$/g, '') });
      const sub = subParts.filter(Boolean).map(esc).join('<span class="sep">·</span>') + (alt ? `<span class="sep">·</span><span lang="${HREFLANG[lang === 'zh' ? 'en' : 'zh']}">${esc(alt)}</span>` : '');
      page({ lang, rel, depth: 3, title, desc: clip(desc || L(n.summary) || name, lang === 'zh' ? 110 : 160), h1, sub, body, crumbs, ld, appRoute: route });
    }

    /* ---------- thread pages ---------- */
    for (const t of I.threads) {
      const pre = '../../../', list = I.byThread[t.id] || [];
      const body = `<p class="lead">${esc(L(t.question))}</p>` + sec(lang === 'zh' ? '学派（按时间）' : 'Schools (by date)', ul(list.map((n) => `<li>${a(n, pre)}${yr(n)}${sum(n)}</li>`)));
      page({ lang, rel: threadPath(t), depth: 3, title: s.t.thread(tName(t)), desc: clip(`${L(t.question)}。${list.slice(0, 8).map((n) => nm(n)).join(lang === 'zh' ? '、' : ', ')}`, lang === 'zh' ? 110 : 160), h1: tName(t), sub: esc(s.thread), body, crumbs: crumbBase().concat([{ label: tName(t) }]), appRoute: { view: 'map', sub: 'thread', thread: t.id } });
    }

    /* ---------- list pages ---------- */
    const pre2 = '../../';
    const bySchool = (items, extra, label) => I.of.school.map((sc) => { const l = items(sc); return l && l.length ? `<section><h2>${a(sc, pre2)}</h2>${ul(l.map((x) => `<li>${a(x, pre2, label ? label(x) : undefined)}${extra(x)}</li>`))}</section>` : ''; }).join('');
    const people = I.of.person.slice().sort((p, q) => (p.born ?? 9999) - (q.born ?? 9999));
    page({ lang, rel: `${lang}/people/`, depth: 2, title: s.t.people(people.length), desc: clip(people.slice(0, 20).map((p) => nm(p)).join(lang === 'zh' ? '、' : ', '), lang === 'zh' ? 110 : 160), h1: s.allPeople, body: ul(people.map((p) => `<li>${a(p, pre2)} <span class="y">${esc(lifeOf(p))}</span><span class="d">${esc(L(p.role) || L(p.summary))}</span></li>`)), crumbs: crumbBase().concat([{ label: s.allPeople }]), appRoute: { view: 'people' }, ogType: 'website' });
    page({ lang, rel: `${lang}/theories/`, depth: 2, title: s.t.theories(I.of.theory.length), desc: clip(I.of.theory.slice(0, 20).map((x) => nm(x)).join(lang === 'zh' ? '、' : ', '), lang === 'zh' ? 110 : 160), h1: s.allTheories, body: bySchool((sc) => I.theoriesOf.get(sc.id), (x) => yr(x)), crumbs: crumbBase().concat([{ label: s.allTheories }]), appRoute: { view: 'structure' }, ogType: 'website' });
    page({ lang, rel: `${lang}/concepts/`, depth: 2, title: s.t.concepts(I.of.concept.length), desc: clip(I.of.concept.slice(0, 20).map((x) => nm(x)).join(lang === 'zh' ? '、' : ', '), lang === 'zh' ? 110 : 160), h1: s.allConcepts, body: bySchool((sc) => I.conceptsOf.get(sc.id), sum), crumbs: crumbBase().concat([{ label: s.allConcepts }]), ogType: 'website' });
    page({ lang, rel: `${lang}/books/`, depth: 2, title: s.t.books(I.of.work.length), desc: clip(I.of.work.slice(0, 14).map((x) => (lang === 'zh' ? '《' + nm(x) + '》' : nm(x))).join(lang === 'zh' ? '' : ', '), lang === 'zh' ? 110 : 160), h1: s.allBooks, body: bySchool((sc) => I.worksOf.get(sc.id), (w) => ` <span class="y">${esc([w.author, w.year].filter(Boolean).join(', '))} · ${esc(ui('depth.' + (w.depth || 'medium')))}</span>`, (w) => (lang === 'zh' ? '《' + nm(w) + '》' : nm(w))), crumbs: crumbBase().concat([{ label: s.allBooks }]), appRoute: { view: 'reading' }, ogType: 'website' });
    page({ lang, rel: `${lang}/questions/`, depth: 2, title: s.t.questions(), desc: clip(I.questions.map((q) => L(q.title)).concat(I.myths.map((m) => L(m.claim))).join(lang === 'zh' ? '、' : ', '), lang === 'zh' ? 110 : 160), h1: s.allQuestions,
      body: sec(s.questions, linkList(I.questions, pre2)) + sec(s.debates, linkList(I.debates, pre2, yr)) + sec(s.myths, mythList(I.myths, pre2)),
      crumbs: crumbBase().concat([{ label: s.allQuestions }]), appRoute: { view: 'questions' }, ogType: 'website' });

    /* ---------- language hub ---------- */
    const pre1 = '../';
    const hubBody = `<p class="lead">${esc(s.hubLead)}</p>`
      + `<p class="jump"><a href="${pre1}${lang}/people/">${esc(s.allPeople)}</a> · <a href="${pre1}${lang}/theories/">${esc(s.allTheories)}</a> · <a href="${pre1}${lang}/concepts/">${esc(s.allConcepts)}</a> · <a href="${pre1}${lang}/books/">${esc(s.allBooks)}</a> · <a href="${pre1}${lang}/questions/">${esc(s.allQuestions)}</a></p>`
      + I.threads.map((t) => `<section><h2><a href="${pre1}${threadPath(t)}">${esc(tName(t))}</a></h2><p class="muted">${esc(L(t.question))}</p>${ul((I.byThread[t.id] || []).map((n) => `<li>${a(n, pre1)}${yr(n)}</li>`))}</section>`).join('')
      + `<section id="sources"><h2>${esc(s.sources)}</h2>${ul(I.of.root.map((r) => `<li>${a(r, pre1)} <span class="y">${esc(L(r.when) || yearLabel(r.year))}</span></li>`))}</section>`;
    page({ lang, rel: hub, depth: 1, title: s.t.hub(), desc: clip(s.hubLead, lang === 'zh' ? 110 : 160), h1: s.t.hub().split(/[：:]/)[0], sub: esc(s.t.hub().split(/[：:]\s*/)[1] || ''), body: hubBody, crumbs: [{ label: s.brand }], ld: { '@type': 'WebSite', name: s.brandFull, description: s.hubLead }, ogType: 'website' });
  }

  function lifeOf(p) { const b = p.born, d = p.died; if (b == null && d == null) return ''; const f = (y) => (y == null ? '' : y < 0 ? ui('year.bce', { y: -y }) : String(y)); return d == null ? (b != null ? f(b) + '–' : '') : `${f(b)}–${f(d)}`; }
  function nmAlt(n, lang) { const o = nm(n, lang === 'zh' ? 'en' : 'zh'); return o && o !== nm(n, lang) ? o : ''; }
  function editions(w) {
    const lang = PM.getLang(), s = S[lang], l = I.links[w.id] || {}, z = l.zh, e = l.en, rec = w.enRec, out = [];
    const ext = (url, label) => (url && /^https:\/\/(book\.douban\.com|openlibrary\.org)\//.test(url) ? `<a href="${esc(url)}" rel="noopener" target="_blank">${esc(label)} ↗</a>` : '');
    if (z) out.push(`<li><span class="rel">${esc(s.zhEd)}</span> 《${esc(z.title)}》 <span class="y">${esc([z.author, z.translator && (lang === 'zh' ? z.translator + ' 译' : 'tr. ' + z.translator), z.publisher, z.year].filter(Boolean).join(' · '))}</span>${z.rating ? ` <span class="y">${esc(s.rating(z.rating, z.votes))}</span>` : ''} ${ext(z.url, s.douban)}</li>`);
    if (e || rec) out.push(`<li><span class="rel">${esc(s.enEd)}</span> <i>${esc((rec && rec.title) || (e && e.title) || '')}</i> <span class="y">${esc([(rec && rec.author) || (e && e.author), rec && rec.edition, (rec && rec.year) || (e && e.firstPublished)].filter(Boolean).join(' · '))}</span> ${ext(e && e.openLibrary, s.openLibrary)}</li>`);
    return out.length ? `<section><h2>${esc(lang === 'zh' ? '版本' : 'Editions')}</h2><ul>${out.join('')}</ul></section>` : '';
  }

  /* ---------- sitemap ---------- */
  const lastmod = (built.data.meta && built.data.meta.generated) || new Date().toISOString().slice(0, 10);
  const urls = [{ rel: '', alt: null }].concat(pages);
  files.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((p) => `<url><loc>${SITE}${p.rel}</loc><lastmod>${lastmod}</lastmod>${p.alt != null ? `<xhtml:link rel="alternate" hreflang="${HREFLANG[p.lang]}" href="${SITE}${p.rel}"/><xhtml:link rel="alternate" hreflang="${HREFLANG[p.lang === 'zh' ? 'en' : 'zh']}" href="${SITE}${p.alt}"/>` : ''}</url>`).join('\n')}\n</urlset>\n`);
  files.set('.nojekyll', '');
  files.set('assets/static.css', STATIC_CSS);
  files.set('assets/favicon.svg', favicon);

  if (write) {
    for (const l of LANGS) fs.rmSync(path.join(root, l), { recursive: true, force: true });
    for (const [rel, content] of files) { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); }
  }
  return { files, pages };
}

const STATIC_CSS = `:root{--bg:#070b14;--panel:#0d1424;--ink:#eaf0f8;--ink2:#b9c6d8;--mute:#7f8ea5;--line:rgba(255,255,255,.1);--accent:#7df0e2}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.top{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:16px;justify-content:space-between;padding:10px 20px;background:rgba(7,11,20,.92);border-bottom:1px solid var(--line);backdrop-filter:blur(8px)}
.brand{color:var(--ink);font-weight:700}.top nav{display:flex;gap:14px;align-items:center;font-size:14px}
.cta{display:inline-block;padding:6px 14px;border:1px solid var(--accent);border-radius:999px;color:var(--accent);font-weight:600}.cta:hover{background:rgba(125,240,226,.12);text-decoration:none}
main{max-width:860px;margin:0 auto;padding:22px 20px 40px}
.crumbs{font-size:14px;color:var(--mute)}.crumbs i{margin:0 8px;font-style:normal}
h1{margin:12px 0 4px;font-size:32px;line-height:1.3}h2{margin:30px 0 8px;font-size:20px;border-bottom:1px solid var(--line);padding-bottom:6px}h3{margin:0 0 6px;font-size:15px;color:var(--ink2)}
.sub{margin:0 0 14px;color:var(--mute);font-size:14px}.sep{margin:0 8px;opacity:.6}
.lead{font-size:17px;color:var(--ink)}.muted{color:var(--mute)}.scores{color:var(--ink2);font-size:14px}.verdict{font-weight:700;color:#f0b37d}
ul{padding-left:20px;margin:6px 0}li{margin:6px 0}.y{color:var(--mute);font-size:14px}.d{display:block;color:var(--ink2);font-size:14.5px}.rel{color:var(--mute);font-size:13px;margin-right:4px}
.kv{display:grid;grid-template-columns:max-content 1fr;gap:6px 16px;margin:14px 0}.kv dt{color:var(--mute);font-size:14px}.kv dd{margin:0}
.path{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.path>div{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 14px}.path ul{padding-left:16px}
.cover{float:right;margin:4px 0 12px 18px;border-radius:4px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.jump{font-size:15px}.open{margin-top:34px}
footer{max-width:860px;margin:0 auto;padding:20px;border-top:1px solid var(--line);color:var(--mute);font-size:14px}
@media (max-width:700px){.path{grid-template-columns:1fr}.kv{grid-template-columns:1fr}.kv dt{margin-top:6px}.top{padding:10px 14px}.top .cta{display:none}h1{font-size:26px}.cover{width:110px}}
`;
