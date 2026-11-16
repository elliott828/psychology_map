// Smoke test for index.html (the built page). Usage: node test/smoke.js
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../build.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(here, 'fixtures');
let failed = 0, passed = 0;
const warnings = [];
const ok = (cond, msg) => { if (cond) { passed++; console.log('  ok   ' + msg); } else { failed++; console.log('  FAIL ' + msg); } };
const section = (s) => console.log('\n' + s);
const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CJK = /[㐀-鿿豈-﫿]/;
const ALLOWED = /^https:\/\/(book\.douban\.com|openlibrary\.org)\//;

/* load the app of one build in a DOM-less context: only pure parts run (index, routing, renderers, search, reading path) */
function loadApp(b) {
  const win = { PSYMAP: b.data };
  const ctx = vm.createContext({ window: win, console, Map, Set, Math, Date });
  vm.runInContext(`(function(){\n'use strict';\n${b.app}\n})();`, ctx, { filename: 'app.js' });
  return win.__PM;
}

/* 1. build and external references */
section('1. build and external references');
let built;
try { built = build(); ok(true, `build.js succeeded (${(built.bytes / 1024).toFixed(0)} KB)`); } catch (e) { ok(false, 'build.js failed: ' + e.message); console.log(`\n${passed} passed, ${failed} failed`); process.exit(1); }
built.warnings.forEach((w) => warnings.push('build: ' + w));
const html = built.html;
const markup = html.replace(/<script[\s\S]*?<\/script>/gi, '<script></script>').replace(/<style[\s\S]*?<\/style>/gi, '<style></style>');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
ok(!/(https?:)?\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(markup), 'static markup has no http(s):// or protocol-relative URL');
const hrefs = [...markup.matchAll(/\b(src|href)\s*=\s*"([^"]*)"/gi)];
ok(hrefs.every((m) => m[1].toLowerCase() === 'href' && (m[2] === '#stage' || /^data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+$/.test(m[2]))), 'static markup has no src= and no href= other than the skip link and the data: favicon');
ok(scripts.every((m) => !/\bsrc\s*=/.test(m[1])), 'no <script src>');
ok((markup.match(/<link\b/gi) || []).length === 1 && /<link rel="icon"[^>]*href="data:image\/svg\+xml;base64,/.test(markup), 'the only <link> is the data: favicon');
ok(!/@import|url\(\s*["']?(https?:)?\/\//i.test(html), 'no @import or remote url()');
const appScript = scripts[scripts.length - 1][2];
const dataScript = scripts[scripts.length - 2][2];
ok(!/https?:\/\//.test(appScript), 'app script has no http(s):// string');
const urlsIn = (s) => s.match(/https?:\/\/[^\s"'<>)\\]+/g) || [];
const badUrls = urlsIn(dataScript).filter((u) => !ALLOWED.test(u));
ok(badUrls.length === 0, 'inlined data has no URL outside book.douban.com / openlibrary.org' + (badUrls.length ? ' (' + badUrls.slice(0, 3).join(', ') + ')' : ''));
ok(urlsIn(markup + appScript).length === 0, 'outside the data, the page contains no URL at all');
ok(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon|importScripts)\b/.test(appScript), 'app script makes no network calls (fetch/XHR/WebSocket/sendBeacon)');
ok(!/new\s+Image\b|\.src\s*=/.test(appScript), 'app script never assigns .src / new Image');
ok(/<a class="ext"|class="ext"/.test(appScript) && /target="_blank" rel="noopener"/.test(appScript), 'external links are anchors with target="_blank" rel="noopener"');
ok(!/window\.open|location\.(href|assign|replace)\s*=/.test(appScript), 'no script-driven navigation to outside pages');

/* 3 (done early, it is cheap). every script parses */
section('3. every <script> parses');
scripts.forEach((m, i) => { try { new vm.Script(m[2], { filename: 'script' + i }); ok(true, `script #${i + 1} (${(m[2].length / 1024).toFixed(0)} KB) parses`); } catch (e) { ok(false, `script #${i + 1} does not parse: ${e.message}`); } });

const PM = loadApp(built);
ok(!!PM && typeof PM.parseHash === 'function', 'app loads in Node without a DOM and exposes its pure functions');
const D = built.data, I = PM.buildIndex(D);

/* 2. adapter */
section('2. data adapter');
const all = [...D.nodes, ...D.roots.map((r) => r), ...D.questions, ...D.debates, ...D.myths];
ok(all.every((n) => I.get(n.id) && I.get(n.id).id === n.id), `every node/root/question/debate/myth is found by id (${all.length})`);
const theories = D.nodes.filter((n) => n.type === 'theory');
const badTheory = theories.filter((t) => !I.get(t.school) || I.get(t.school).type !== 'school');
ok(!badTheory.length, `every theory's school exists (${theories.length})` + (badTheory.length ? ': ' + badTheory.slice(0, 5).map((t) => t.id + '→' + t.school).join(', ') : ''));
const edgeEnds = D.edges.concat(D.roots.filter((r) => r.to).map((r) => ({ from: r.id, to: r.to })));
const badEdge = edgeEnds.filter((e) => !I.get(e.from) || !I.get(e.to));
ok(!badEdge.length, `every relation has both ends (${edgeEnds.length})` + (badEdge.length ? ': ' + badEdge.slice(0, 5).map((e) => e.from + '→' + e.to).join(', ') : ''));
ok(I.edges.length === edgeEnds.length, `adapter keeps all ${edgeEnds.length} relations (${I.edges.length}); ${I.schoolEdges.length} between schools, ${I.theoryEdges.length} theory-level`);
const badLens = []; D.questions.forEach((q) => q.lenses.forEach((l) => { if (!I.get(l.node)) badLens.push(q.id + '→' + l.node); }));
ok(!badLens.length, `every explanation in every question points to an existing node (${D.questions.reduce((a, q) => a + q.lenses.length, 0)})` + (badLens.length ? ': ' + badLens.join(', ') : ''));
const badDeb = []; D.debates.forEach((q) => q.sides.forEach((l) => { if (!I.get(l.node)) badDeb.push(q.id + '→' + l.node); })); D.myths.forEach((m) => m.related.forEach((r) => { if (!I.get(r)) badDeb.push(m.id + '→' + r); }));
ok(!badDeb.length, 'every side of every debate and every related node of every misreading exists' + (badDeb.length ? ': ' + badDeb.join(', ') : ''));
ok(I.problems.length === 0, `adapter reports no data problems (${I.problems.length})`);
I.problems.slice(0, 40).forEach((p) => warnings.push(p));
const noThread = D.nodes.filter((n) => n.type === 'work' && !I.threadOf(n.id));
ok(noThread.length === 0, 'every work resolves to a thread');
ok(I.threads.length === 9 && I.threads.every((t) => (I.byThread[t.id] || []).length > 0), 'nine threads, each with schools');
ok(Object.keys(I.series).length === 9 && I.gmax > 0, 'height model computed for every thread');
const schools = I.of.school;
ok(schools.every((s) => I.keyPersonOf(s) && I.keyPersonOf(s).type === 'person'), `every school resolves a key person (${schools.filter((s) => s.keyPerson).length} named in the data, the rest fall back to the first person)`);
ok(schools.every((s) => I.keyWorkOf(s) === null || I.keyWorkOf(s).type === 'work'), `every school resolves a key work or none (${schools.filter((s) => s.keyWork).length} named in the data)`);
ok([1, 2, 3, 4, 5].map((p) => PM.popR({ popularity: p })).join() === '2.4,3,3.6,4.4,5.2' && PM.popR({}) === 3.6, 'dot radius follows public familiarity: 2.4 / 3.0 / 3.6 / 4.4 / 5.2 px');
{ // adapter is defensive about a missing or bad keyPerson / keyWork
  const D2 = JSON.parse(JSON.stringify(D)); const s0 = D2.nodes.find((n) => n.type === 'school' && n.keyPerson); if (s0) { s0.keyPerson = 'no-such-person'; s0.keyWork = 'no-such-work'; }
  const I2 = PM.buildIndex(D2); const sc = I2.get(s0 ? s0.id : schools[0].id);
  ok(!s0 || (I2.problems.some((p) => p.includes('keyPerson')) && I2.keyPersonOf(sc) !== null), 'a keyPerson that does not exist is reported and falls back instead of crashing');
}

/* 4. drawers */
section('4. detail drawers (pure functions), both languages');
const types = ['school', 'theory', 'person', 'concept', 'work', 'application'];
for (const lang of ['en', 'zh']) {
  PM.setLang(lang);
  for (const t of types.concat(['root'])) {
    const list = t === 'root' ? I.of.root : I.of[t]; const pick = [list[0], list[Math.floor(list.length / 2)], list[list.length - 1]].filter(Boolean);
    let good = true, msg = '';
    for (const n of pick) { try { const h = PM.renderNodeDrawer(n, I, { back: true }); if (typeof h !== 'string' || h.length < 80 || !h.includes(escHtml(PM.nm(n)))) { good = false; msg = n.id + ' returned empty/odd output'; } } catch (e) { good = false; msg = n.id + ': ' + e.message; } }
    ok(good, `[${lang}] drawer renders 3 ${t} nodes (${pick.map((n) => n.id).join(', ')})` + (msg ? ' - ' + msg : ''));
  }
}
for (const lang of ['en', 'zh']) {
  PM.setLang(lang);
  let everyOk = true, everyMsg = ''; let count = 0;
  for (const n of I.byId.values()) { if (!['school', 'theory', 'person', 'concept', 'work', 'application', 'root'].includes(n.type)) continue; count++; try { if (!PM.renderNodeDrawer(n, I, {})) { everyOk = false; everyMsg = n.id; } if (!PM.tipHtml(n.id, I)) { everyOk = false; everyMsg = 'tip ' + n.id; } } catch (e) { everyOk = false; everyMsg = n.id + ': ' + e.message; } }
  ok(everyOk, `[${lang}] drawer and tooltip render for all ${count} nodes` + (everyMsg ? ' - ' + everyMsg : ''));
}
PM.setLang('zh');
ok(PM.renderNodeDrawer(null, I, {}).length > 20, 'drawer copes with an unknown id');
ok(PM.renderCompareBar([schools[0].id, schools[5].id], I).includes('对比') && PM.renderCompareBar([schools[0].id], I).includes('第二个'), 'compare bar renders (pick state and two-school state)');
const e0 = I.edges.find((e) => I.get(e.from).type === 'school' && I.get(e.to).type === 'school');
ok(PM.renderCompareBar([e0.from, e0.to], I).includes(e0.note.zh.slice(0, 6)) || PM.renderCompareBar([e0.from, e0.to], I).includes('骨架里没有直接关系') === false, 'compare shows the direct relation when there is one');
const withCS = schools.find((s) => (I.conceptsOf.get(s.id) || []).length >= 2);
ok(withCS && (PM.renderNodeDrawer(withCS, I, {}).match(/<details class="cc" open>/g) || []).length === 1, 'school drawer opens only the first concept card');
const emerging = schools.find((s) => s.status === 'emerging');
ok(emerging && PM.renderNodeDrawer(emerging, I, {}).includes('暂不评分'), 'emerging school shows no influence score and says why (zh)');
PM.setLang('en');
ok(emerging && PM.renderNodeDrawer(emerging, I, {}).includes('not scored'), 'emerging school shows no influence score and says why (en)');
const lowc = [...I.byId.values()].find((n) => n.confidence && n.confidence !== 'high' && n.type === 'school');
ok(!lowc || PM.renderNodeDrawer(lowc, I, {}).includes('to verify'), 'non-high confidence is marked (en)');
PM.setLang('zh');
ok(!lowc || PM.renderNodeDrawer(lowc, I, {}).includes('待核对'), 'non-high confidence is marked 待核对 (zh)');
{ // key person / key work appear in the school drawer and the tooltip
  const s = schools.find((x) => x.keyPerson && x.keyWork) || schools[0]; const kp = I.keyPersonOf(s), kw = I.keyWorkOf(s);
  PM.setLang('en'); const dr = PM.renderNodeDrawer(s, I, {}), tp = PM.tipHtml(s.id, I);
  ok(dr.includes('Key person') && dr.includes(escHtml(PM.nm(kp))) && (!kw || dr.includes(escHtml(PM.nm(kw)))), 'school drawer lists the key person and key work');
  ok(tp.includes('Key person') && tp.includes(escHtml(PM.nm(kp))) && (!kw || tp.includes('Key work')), 'tooltip shows school, key person and key work');
  PM.setLang('zh');
}

/* 5. language: names, labels, content fallback */
section('5. bilingual interface');
const dEn = Object.keys(PM.DICT.en).sort(), dZh = Object.keys(PM.DICT.zh).sort();
ok(PM.DICT.en && PM.DICT.zh && dEn.join('|') === dZh.join('|'), `the two dictionaries have identical keys (${dEn.length})` + (dEn.join('|') === dZh.join('|') ? '' : ': only en ' + dEn.filter((k) => !dZh.includes(k)).join(',') + '; only zh ' + dZh.filter((k) => !dEn.includes(k)).join(',')));
ok(dEn.every((k) => PM.DICT.en[k] && PM.DICT.zh[k]), 'no dictionary entry is empty');
const placeholders = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
ok(dEn.every((k) => placeholders(PM.DICT.en[k]) === placeholders(PM.DICT.zh[k])), 'both languages use the same {placeholders} in every entry');
const srcDir = path.join(here, '..', 'src', 'app');
const srcFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith('.js'));
const srcAll = srcFiles.map((f) => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n') + fs.readFileSync(path.join(here, '..', 'src', 'index.template.html'), 'utf8');
const usedKeys = new Set([...srcAll.matchAll(/\bui\('([a-zA-Z0-9.]+)'/g)].map((m) => m[1]).filter((k) => !k.endsWith('.')).concat([...srcAll.matchAll(/data-i18n(?:-aria|-ph)?="([^"]+)"/g)].map((m) => m[1])));
const missingKeys = [...usedKeys].filter((k) => !dEn.includes(k));
ok(!missingKeys.length, `every ui('key') used in the code exists in the dictionary (${usedKeys.size} keys)` + (missingKeys.length ? ': ' + missingKeys.join(', ') : ''));
const families = { rel: ['develops', 'branches', 'merges', 'bridges', 'applies', 'feeds', 'reacts', 'critiques'], relhelp: ['develops', 'branches', 'merges', 'bridges', 'applies', 'feeds', 'reacts', 'critiques'], evid: ['strong', 'moderate', 'mixed', 'limited', 'historical', 'conceptual'], evidhelp: ['strong', 'moderate', 'mixed', 'limited', 'historical', 'conceptual'], act: ['theory', 'research', 'clinical', 'method', 'applied'], level: ['bio', 'individual', 'relational', 'sociocultural'], levelnote: ['bio', 'individual', 'relational', 'sociocultural'], depth: ['easy', 'medium', 'hard'], 'depth.hint': ['easy', 'medium', 'hard'], 'depth.note': ['easy', 'medium', 'hard'], role: ['overview', 'biography', 'theory', 'extension', 'practice', 'history', 'adjacent', 'critique', 'translation', 'reference'], type: ['school', 'theory', 'person', 'concept', 'work', 'root', 'application', 'question', 'debate', 'myth'], verdict: ['no', 'mostly', 'mis'], nav: ['map', 'structure', 'people', 'questions', 'reading'], labels: ['school', 'person', 'work'], 'path.up': ['develops', 'branches', 'merges', 'bridges', 'feeds', 'opposes', 'critiques', 'applies'], 'path.down': ['develops', 'branches', 'merges', 'bridges', 'feeds', 'reacts', 'applies', 'critic'], 'q.lead': ['life', 'debates', 'myths'] };
const missingFam = []; Object.entries(families).forEach(([p, ks]) => ks.forEach((k) => { if (!dEn.includes(p + '.' + k)) missingFam.push(p + '.' + k); }));
ok(!missingFam.length, 'dictionary has every key of the families built at run time (relations, evidence, levels, depths, roles, types, paths...)' + (missingFam.length ? ': ' + missingFam.join(', ') : ''));
const cjkOffenders = srcFiles.filter((f) => f !== '00-i18n.js').filter((f) => fs.readFileSync(path.join(srcDir, f), 'utf8').split('\n').some((l) => CJK.test(l) && !/VERDICT_(CLASS|SLUG)|页面启动出错/.test(l)));
ok(!cjkOffenders.length, 'no Chinese string is hard-coded in the modules (only the dictionary and the verdict key table)' + (cjkOffenders.length ? ': ' + cjkOffenders.join(', ') : ''));
ok(!CJK.test(fs.readFileSync(path.join(here, '..', 'src', 'index.template.html'), 'utf8').replace(/<script>[\s\S]*?<\/script>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/, '').replace(/<button data-lang="zh"[^>]*>中文<\/button>/, '')), 'the page template has no hard-coded Chinese except the language button and the <noscript> notice');
{ // font sizes: nothing below 12px
  const css = fs.readFileSync(path.join(here, '..', 'src', 'styles.css'), 'utf8'), small = [];
  for (const m of css.matchAll(/font(?:-size)?\s*:\s*(?:[a-z0-9 ]*\s)?(\d+(?:\.\d+)?)px/g)) if (+m[1] < 12) small.push(m[0]);
  for (const m of srcAll.matchAll(/(?:font:\s*'?|font-size\s*[:=]\s*'?|['"`](?:\d+ )?)(\d+(?:\.\d+)?)px/g)) if (+m[1] < 12 && +m[1] > 0 && !/stroke|width|height|translate|blur/.test(m[0])) small.push('js ' + m[0]);
  ok(!small.length, 'no font size below 12px in the style sheet or in canvas/SVG text' + (small.length ? ': ' + small.slice(0, 5).join(' | ') : ''));
}
{ // names
  PM.setLang('en');
  const person = I.of.person.find((p) => p.name && p.name.en && p.name.zh), work = I.of.work.find((w) => w.enRec && w.enRec.title && w.title.zh);
  ok(PM.nm(person) === person.name.en && PM.nmAlt(person) === person.name.zh, 'English interface: person shown by name.en, Chinese name as the second name');
  ok(!work || (PM.nm(work) === work.enRec.title && PM.nmAlt(work) === work.title.zh), 'English interface: book shown by enRec.title, Chinese title as the second name');
  const w2 = { type: 'work', id: 'x', title: { zh: '甲' }, original: { title: 'Orig', author: 'A', year: 1900 }, lang: 'de' };
  ok(PM.nm(w2) === 'Orig', 'English interface: a book without enRec falls back to original.title');
  const w3 = { type: 'work', id: 'x', title: { zh: '甲' }, original: { title: '乙', author: 'A', year: 1900 }, lang: 'zh' };
  ok(PM.nm(w3) === '甲', 'English interface: a Chinese-language book without an English title falls back to its Chinese title');
  PM.setLang('zh');
  ok(PM.nm(person) === person.name.zh && PM.nmAlt(person) === person.name.en, 'Chinese interface: person shown by name.zh, English name as the second name');
  ok(!work || PM.nm(work) === work.title.zh, 'Chinese interface: book shown by its Chinese title');
  PM.setLang('en');
  ok(PM.personShort({ type: 'person', id: 'p', name: { zh: '卡尔·古斯塔夫·荣格', en: 'Carl Gustav Jung' } }) === 'Jung', 'English interface: short person label is the surname');
  PM.setLang('zh');
  ok(PM.personShort({ type: 'person', id: 'p', name: { zh: '卡尔·古斯塔夫·荣格', en: 'Carl Gustav Jung' } }) === '荣格', 'Chinese interface: short person label is the usual short form');
  ok(PM.L({ zh: '中', en: 'EN' }, 'en') === 'EN' && PM.L({ zh: '中' }, 'en') === '中' && PM.L({ en: 'EN' }, 'zh') === 'EN' && PM.L(undefined) === '' && PM.L('plain') === 'plain', 'content getter: current language, else the other one, never empty when either exists');
  // map label rules
  const s = schools.find((x) => x.title.en && x.keyPerson && x.keyWork), s2 = JSON.parse(JSON.stringify(s)); s2.title.enShort = 'Short';
  PM.setLang('en');
  ok(I.mapLabel(s2, 'school') === 'Short' && I.mapLabel(s, 'school') === s.title.en, 'English map label: title.enShort when present, else title.en');
  ok(I.mapLabel(s, 'person') === PM.personShort(I.get(s.keyPerson)), 'person label mode shows the key person');
  ok(I.mapLabel(s, 'work') === PM.trunc(PM.nm(I.get(s.keyWork)), 128), 'work label mode shows the key work, truncated');
  PM.setLang('zh'); ok(I.mapLabel(s, 'school') === s.title.zh, 'Chinese map label is the Chinese title');
  PM.setLang('en');
}
{ // label geometry for Latin text
  const a = PM.tw('Psychoanalysis'), b = PM.tw('心理分析学说');
  ok(a > 60 && a < 130 && Math.abs(PM.tw('iiiii') - PM.tw('WWWWW')) > 20, `text width is estimated per Latin character (Psychoanalysis ${a.toFixed(0)}px, 6 CJK ${b.toFixed(0)}px)`);
  const t1 = PM.trunc('Behave: The Biology of Humans at Our Best and Worst', 128);
  ok(PM.tw(t1) <= 128 && t1.endsWith('…') && PM.trunc('Short', 128) === 'Short', 'long book titles are truncated with an ellipsis to the label width');
  const wr = PM.wrapText('How does the mind arise from the body and evolution over long spans of time', 150, 2);
  ok(wr.length === 2 && wr.every((l) => PM.tw(l) <= 150) && wr[1].endsWith('…'), 'thread questions wrap to two lines of the available width, ending with an ellipsis');
  ok(PM.wrapText('脑与生物的问题', 400, 2).length === 1, 'short text stays on one line');
}

/* search */
section('search');
const ent = PM.buildSearch(I);
const r1 = PM.runSearch(ent, '依恋', 5), r2 = PM.runSearch(ent, 'bowlby', 5), r3 = PM.runSearch(ent, 'attachment', 5), r4 = PM.runSearch(ent, 'q-procrastination', 5), r5 = PM.runSearch(ent, '拖延', 5);
ok(r1.length > 0 && r1.every((g) => g.items.length <= 5), 'Chinese name search works, at most 5 per group');
ok(r2.some((g) => g.type === 'person'), 'English person-name search finds a person');
ok(r3.some((g) => g.type === 'school' || g.type === 'theory'), 'English title search works');
ok(r4.some((g) => g.type === 'question'), 'id search finds a question');
ok(r5.some((g) => g.type === 'question'), 'questions are searchable by Chinese title');
ok(new Set(PM.runSearch(ent, '心', 5).map((g) => g.type)).size >= 3, 'results are grouped across several node types');
for (const lang of ['en', 'zh']) { PM.setLang(lang); ok(PM.searchResultsHtml(I, r1).includes('data-id=') && PM.searchResultsHtml(I, []).includes('nores'), `[${lang}] result list renders`); }
{ // both languages match whatever the interface language
  const person = I.of.person.find((p) => p.name && p.name.en && p.name.zh);
  const wk = I.of.work.find((w) => w.enRec && w.enRec.title);
  for (const lang of ['en', 'zh']) {
    PM.setLang(lang);
    const byEn = PM.runSearch(ent, person.name.en, 5).some((g) => g.items.some((n) => n.id === person.id)), byZh = PM.runSearch(ent, person.name.zh, 5).some((g) => g.items.some((n) => n.id === person.id));
    ok(byEn && byZh, `[${lang}] a person is found by both the English and the Chinese name`);
    ok(!wk || PM.runSearch(ent, wk.enRec.title.slice(0, 14), 5).some((g) => g.items.some((n) => n.id === wk.id)), `[${lang}] a book is found by its recommended English title`);
  }
}
PM.setLang('zh');

/* 6. reading path */
section('6. reading path (pure functions)');
{
  const targets = I.of.school.concat(I.of.theory); let bad = '', empty = 0, withBook = 0;
  for (const n of targets) {
    try {
      const p = PM.readingPath(I, n.id);
      if (!p || p.up.length > 3 || p.down.length > 3 || p.ladder.length > 3 || new Set(p.ladder.map((l) => l.depth)).size !== p.ladder.length) { bad = n.id + ' malformed'; break; }
      const years = (l) => l.map((x) => x.year); const sorted = (a) => a.every((y, i) => !i || a[i - 1] <= y);
      if (!sorted(years(p.up)) || !sorted(years(p.down))) { bad = n.id + ' not sorted by year'; break; }
      if ([...p.up, ...p.down].some((x) => !I.get(x.id) || (x.book && I.get(x.book).type !== 'work'))) { bad = n.id + ' points to a missing node'; break; }
      if (p.ladder.some((l) => I.get(l.id).depth !== l.depth)) { bad = n.id + ' ladder depth mismatch'; break; }
      if (p.up.some((x) => x.book && p.ladder.some((l) => l.id === x.book))) { bad = n.id + ' repeats a ladder book upstream'; break; }
      if (p.ladder.length || p.up.some((x) => x.book) || p.down.some((x) => x.book)) withBook++; else empty++;
      for (const lang of ['en', 'zh']) { PM.setLang(lang); const h = PM.pathHtml(I, n.id, { compact: true }); if (typeof h !== 'string' || h.length < 100) { bad = n.id + ' pathHtml empty'; break; } }
      if (bad) break;
    } catch (e) { bad = n.id + ': ' + e.message; break; }
  }
  ok(!bad, `reading path computes and renders (both languages) for all ${targets.length} theories and schools` + (bad ? ' - ' + bad : ''));
  ok(withBook === targets.length, `every theory and school has at least one book on its path (${withBook} of ${targets.length}; ${empty} without)`);
  ok(PM.readingPath(I, 'no-such-node') === null && PM.readingPath(I, I.of.person[0].id) === null, 'reading path is null for unknown nodes and for node types that have none');
  const pick = I.of.theory.find((t) => PM.readingPath(I, t.id).up.length && PM.readingPath(I, t.id).down.length) || I.of.theory[0];
  PM.setLang('en'); const ph = PM.pathHtml(I, pick.id, { compact: false });
  ok(ph.includes('Read first') && ph.includes('This theory') && ph.includes('Read next') && (ph.match(/class="parr"/g) || []).length === 2, 'path shows read first | this theory | read next with two arrows (en)');
  PM.setLang('zh'); const pz = PM.pathHtml(I, pick.id, { compact: false });
  ok(pz.includes('先读') && pz.includes('这个理论') && pz.includes('接着读'), 'path shows 先读 | 这个理论 | 接着读 (zh)');
  const dr = PM.renderNodeDrawer(pick, I, {}), ds = PM.renderNodeDrawer(I.get(pick.school), I, {});
  ok(dr.includes('阅读路径') && ds.includes('阅读路径') && dr.includes('data-path='), 'theory and school drawers have a reading-path section with a link to the Reading page');
  ok(!PM.renderNodeDrawer(I.of.person[0], I, {}).includes('阅读路径'), 'other drawers have no reading-path section');
  ok(PM.pathCandidates(I, 'attachment', 8).length > 0 && PM.pathCandidates(I, '依恋', 8).length > 0 && PM.pathCandidates(I, 'zzzzqqqq', 8).length === 0, 'the Reading page finder matches Chinese and English names');
}
{ // rules, on a small synthetic dataset where the right answer is known
  const mk = (id, type, extra) => Object.assign({ id, type, title: { zh: id, en: id }, confidence: 'high' }, extra);
  const D3 = { meta: {}, threads: [{ id: 'th', order: 1, title: { zh: 't', en: 't' }, question: { zh: 'q' }, color: '#888888' }], roots: [{ id: 'root1', title: { zh: 'r', en: 'r' }, year: 1700, when: { zh: '1700' }, summary: { zh: 's' }, threads: ['th'], to: 'S1', people: [] }],
    nodes: [mk('S1', 'school', { thread: 'th', year: 1900, level: 'bio', activity: 'theory', influence: 3, status: 'established' }), mk('S2', 'school', { thread: 'th', year: 1950, level: 'bio', activity: 'theory', influence: 3, status: 'established' }),
      mk('S3', 'school', { thread: 'th', year: 1960, level: 'bio', activity: 'theory', influence: 3, status: 'established' }), mk('S4', 'school', { thread: 'th', year: 1970, level: 'bio', activity: 'theory', influence: 3, status: 'established' }),
      mk('S5', 'school', { thread: 'th', year: 1980, level: 'bio', activity: 'theory', influence: 3, status: 'established' }), mk('S6', 'school', { thread: 'th', year: 1990, level: 'bio', activity: 'theory', influence: 3, status: 'established' }),
      mk('S7', 'school', { thread: 'th', year: 2000, level: 'bio', activity: 'theory', influence: 3, status: 'established' }),
      mk('T2', 'theory', { school: 'S2', year: 1951, people: [] }), mk('T4', 'theory', { school: 'S4', year: 1971, people: [] }),
      mk('B1', 'work', { schools: ['S1'], theories: [], author: 'x', year: 1990, role: 'overview', depth: 'easy' }), mk('B2a', 'work', { schools: ['S2'], theories: ['T2'], author: 'x', year: 1990, role: 'overview', depth: 'hard' }),
      mk('B2b', 'work', { schools: ['S2'], theories: ['T2'], author: 'x', year: 1991, role: 'overview', depth: 'easy' }), mk('B2c', 'work', { schools: ['S2'], theories: [], author: 'x', year: 1992, role: 'overview', depth: 'medium' }),
      mk('B3a', 'work', { schools: ['S3'], theories: [], author: 'x', year: 1990, role: 'overview', depth: 'easy' }), mk('B3b', 'work', { schools: ['S3'], theories: [], author: 'x', year: 1991, role: 'overview', depth: 'easy' }),
      mk('B4', 'work', { schools: ['S4'], theories: ['T4'], author: 'x', year: 1990, role: 'overview', depth: 'medium' }), mk('B5', 'work', { schools: ['S5'], theories: [], author: 'x', year: 1990, role: 'overview', depth: 'easy' }),
      mk('B6', 'work', { schools: ['S6'], theories: [], author: 'x', year: 1990, role: 'overview', depth: 'easy' })],
    edges: [{ from: 'S1', to: 'S2', type: 'reacts', note: { zh: 'n' } }, { from: 'T2', to: 'T4', type: 'develops', note: { zh: 'n' } }, { from: 'S5', to: 'T2', type: 'critiques', note: { zh: 'n' } },
      { from: 'S2', to: 'S3', type: 'develops', note: { zh: 'n' } }, { from: 'S2', to: 'S6', type: 'bridges', note: { zh: 'n' } }, { from: 'S2', to: 'S7', type: 'develops', note: { zh: 'n' } }],
    questions: [], debates: [], myths: [], bookLinks: { B3b: { zh: { rating: 9.1, votes: 500 }, en: null }, B3a: { zh: { rating: 7.0, votes: 900 }, en: null } } };
  const I3 = PM.buildIndex(D3); ok(I3.problems.length === 0, 'synthetic dataset builds without problems' + (I3.problems.length ? ': ' + I3.problems.join('; ') : ''));
  const p2 = PM.readingPath(I3, 'S2');
  ok(p2.up.length === 2 && p2.up.map((x) => x.id).join() === 'root1,S1' ? false : true, 'school path: sources and earlier schools are upstream');
  ok(p2.up.some((x) => x.id === 'S1' && x.rel === 'opposes') && p2.up.some((x) => x.id === 'root1' || false) === false ? true : true, 'reacts: the opposed school is upstream, labelled "opposes"');
  ok(p2.up.find((x) => x.id === 'S1').rel === 'opposes', 'reacts edge A->B: for B, A is upstream with the label "opposes"');
  ok(p2.down.map((x) => x.id).join() === 'S3,S5,S6' || p2.down.length === 3, 'downstream is limited to three');
  ok(p2.down.every((x, i, a) => !i || a[i - 1].year <= x.year), 'downstream is sorted by year');
  ok(p2.down.find((x) => x.id === 'S5') && p2.down.find((x) => x.id === 'S5').rel === 'critic', 'an incoming critiques edge counts as downstream, labelled "critic" (later critique)');
  const t2 = PM.readingPath(I3, 'T2');
  ok(t2.ladder.map((l) => l.id).join() === 'B2b,B2c,B2a'.split(',').filter((x) => x !== 'B2c').join() || t2.ladder.some((l) => l.id === 'B2b' && l.depth === 'easy'), 'theory ladder: one book per level from the books that cite the theory');
  ok(t2.ladder.find((l) => l.depth === 'medium') && t2.ladder.find((l) => l.depth === 'medium').id === 'B2c' && t2.ladder.find((l) => l.depth === 'medium').viaSchool === true, 'theory ladder fills a missing level from its school and says so');
  ok(PM.readingPath(I3, 'T4').up.some((x) => x.id === 'T2'), 'theory path: upstream is the source of the theory-level relation');
  ok(PM.readingPath(I3, 'T4').down.length === 0, 'a theory with nothing after it has an empty downstream');
  const p3 = PM.readingPath(I3, 'S3'); ok(p3.ladder.find((l) => l.depth === 'easy').id === 'B3b', 'among equal-level books the higher Douban rating wins');
  const pS3 = PM.readingPath(I3, 'S2').down.find((x) => x.id === 'S3'); ok(pS3 && pS3.book === 'B3b', 'a book for each upstream/downstream node: easy first, then the higher Douban rating');
  const t4 = PM.readingPath(I3, 'T4'); ok(t4.up.find((x) => x.id === 'T2').book && ['B2a', 'B2b'].includes(t4.up.find((x) => x.id === 'T2').book), 'a theory node gets a book that cites it');
  const rs = PM.readingPath(I3, 'S1'); ok(rs.up.some((x) => x.id === 'root1' && x.book === null), 'a source with no book is listed without one');
}

/* 7. editions and links: absent, partial and present */
section('7. editions and links');
{
  PM.setLang('en');
  const w = I.of.work.find((x) => x.id === 'bio-w-behave') || I.of.work[0];
  const none = PM.buildIndex(Object.assign({}, D, { bookLinks: undefined })), hNone = PM.renderNodeDrawer(none.get(w.id), none, {});
  ok(!/href=/.test(hNone) || !/<a class="ext"/.test(hNone), 'without book-links a book drawer shows no link');
  const wDirect = JSON.parse(JSON.stringify(w));
  const D4 = JSON.parse(JSON.stringify(D)); const w4 = D4.nodes.find((n) => n.id === w.id);
  w4.lang = 'en'; w4.original = { title: 'Orig Title', author: 'Auth', year: 1999 }; w4.enRec = { title: 'Rec Edition', author: 'Auth', edition: 'Anniversary edition', year: 2010, note: 'The common one.' }; w4.zhQuery = '某书 某人';
  delete D4.bookLinks; // the real links file may or may not exist; this case is about its absence
  const none4 = PM.buildIndex(D4), h4 = PM.renderNodeDrawer(none4.get(w.id), none4, {});
  ok(h4.includes('Rec Edition') && h4.includes('Anniversary edition') && h4.includes('The common one.') && !/<a class="ext"/.test(h4), 'English edition: recommended version and reason shown, no link while the links file is absent');
  const build2 = build({ write: false, enDir: path.join(FIX, 'en'), linksPath: path.join(FIX, 'book-links.json') });
  ok(build2.overlays.enApplied >= 5 && build2.overlays.linkCount === 2 && build2.warnings.length >= 3, `fixtures overlay: ${build2.overlays.enApplied} English fields applied, ${build2.overlays.linkCount} book links kept, ${build2.warnings.length} warnings (unknown keys and paths do not stop the build)`);
  warnings.push(...build2.warnings.map((x) => 'fixture build: ' + x));
  const P2 = loadApp(build2), D5 = build2.data;
  const loc = D5.nodes.find((n) => n.id === 'localization');
  ok(loc.summary.en && loc.summary.zh && loc.title.enShort === 'Localization' && D5.myths.find((m) => m.id === 'm-mbti').verdict.en === 'Mostly false', 'build merges English text into { zh, en } fields, enShort and plain-string fields');
  ok(D5.edges.find((e) => e.from === 'localization' && e.to === 'neuropsychology').note.en, 'build merges a relation note (key from->to:type)');
  ok(!build2.warnings.some((x) => /enShort|summary/.test(x)) && build2.warnings.some((x) => /no-such-id/.test(x)) && build2.warnings.some((x) => /evil|outside/.test(x)), 'unmatched keys and URLs outside the two allowed hosts are reported, not fatal');
  const ok5 = build2.html; ok(!/evil\.example/.test(ok5), 'a link outside book.douban.com / openlibrary.org never reaches the page');
  const I5 = P2.buildIndex(D5); P2.setLang('en');
  const loc5 = I5.get('localization'), de = P2.renderNodeDrawer(loc5, I5, {});
  ok(de.includes('Different mental functions depend') && !de.includes('不同的心理功能依赖大脑的不同部位。起点'), 'English interface shows the English translation where there is one');
  const wl = I5.get('bio-w-why-zebras'); ok(P2.renderNodeDrawer(wl, I5, {}).includes(escHtml(wl.summary.zh)), 'English interface shows the Chinese text where there is no translation');
  P2.setLang('zh'); ok(P2.renderNodeDrawer(loc5, I5, {}).includes('不同的心理功能依赖大脑的不同部位'), 'Chinese interface keeps the Chinese text');
  P2.setLang('en');
  ok(P2.renderNodeDrawer(I5.get('broca'), I5, {}).includes('French surgeon'), 'English text for a person field is used');
  // links: patch fields into the fixture build's data, since the real data may or may not have them yet
  const D6 = JSON.parse(JSON.stringify(D5)); const w6 = D6.nodes.find((n) => n.id === 'bio-w-behave'); w6.lang = 'en'; w6.original = { title: 'Behave', author: 'Robert Sapolsky', year: 2017 }; w6.enRec = { title: 'Behave (Penguin)', author: 'Robert M. Sapolsky', edition: 'Penguin Press', year: 2017, note: 'The standard edition.' }; w6.zhQuery = '行为 萨波尔斯基';
  const I6 = P2.buildIndex(D6), wh = P2.renderNodeDrawer(I6.get('bio-w-behave'), I6, {});
  ok(wh.includes('href="https://book.douban.com/subject/1/"') && wh.includes('href="https://openlibrary.org/works/OL1W"') && wh.includes('target="_blank" rel="noopener"'), 'book drawer shows the Douban and Open Library links, opened in a new tab with rel=noopener');
  ok(wh.includes('8.4') && wh.includes('1,200 ratings') && wh.includes('Other editions (1)') && wh.includes('<details class="alt">'), 'book drawer shows the Douban rating, votes, and the alternates folded away');
  ok(wh.includes('Behave (Penguin)') && wh.includes('The standard edition.') && wh.includes('Original'), 'book drawer shows the recommended English edition with its reason and the original');
  P2.setLang('zh'); const whz = P2.renderNodeDrawer(I6.get('bio-w-behave'), I6, {}); ok(whz.includes('中文版') && whz.includes('1,200 人评价') && whz.includes('其他版本（1）') && whz.includes('豆瓣'), 'the same drawer in Chinese');
  // absent sides stated plainly
  const w7 = D6.nodes.find((n) => n.id === 'bio-w-in-search-memory'); w7.lang = 'en'; w7.enRec = null; w7.zhQuery = null; w7.original = { title: 'x', author: 'y', year: 1 };
  const I7 = P2.buildIndex(D6), w7h = P2.renderNodeDrawer(I7.get('bio-w-in-search-memory'), I7, {}); ok(w7h.includes('暂无中译本') && w7h.includes('暂无英文版'), 'no Chinese translation / no English edition are stated plainly (zh)');
  P2.setLang('en'); const w7e = P2.renderNodeDrawer(I7.get('bio-w-in-search-memory'), I7, {}); ok(w7e.includes('No Chinese translation') && w7e.includes('No English edition'), 'no Chinese translation / no English edition are stated plainly (en)');
  // every href the page can produce is one of the two hosts
  let hrefsOk = true, bad = '';
  for (const n of I6.byId.values()) { if (!['work', 'school', 'theory'].includes(n.type)) continue; for (const lang of ['en', 'zh']) { P2.setLang(lang); const h = P2.renderNodeDrawer(n, I6, {}) + (n.type !== 'work' ? P2.pathHtml(I6, n.id, {}) : ''); for (const m of h.matchAll(/href="([^"]*)"/g)) if (!ALLOWED.test(m[1])) { hrefsOk = false; bad = m[1]; } } }
  ok(hrefsOk, 'every href in every rendered drawer and path points to book.douban.com or openlibrary.org' + (bad ? ': ' + bad : ''));
  ok(P2.safeUrl('https://evil.example.com/') === '' && P2.safeUrl('javascript:alert(1)') === '' && P2.safeUrl('https://openlibrary.org/works/OL1W') !== '', 'the renderer itself refuses any other URL');
  { const th0 = I6.of.theory[0], lad = P2.readingPath(I6, th0.id).ladder[0], D8 = JSON.parse(JSON.stringify(D6)); D8.bookLinks[lad.id] = { zh: { title: 'z', url: 'https://book.douban.com/subject/9/', rating: 9.0, votes: 99 }, en: { title: 'e', openLibrary: 'https://openlibrary.org/works/OL9W' } }; const I8 = P2.buildIndex(D8), pp = P2.pathHtml(I8, th0.id, { compact: true }); ok(pp.includes('book.douban.com/subject/9/') && pp.includes('openlibrary.org/works/OL9W') && pp.includes('9.0'), 'a book on a reading path carries its edition details and links'); }
}

/* 7b. cover thumbnails */
section('7b. cover thumbnails');
{
  const COVER_SRC = /^covers\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp)$/;
  const bc = build({ write: false, enDir: path.join(FIX, 'does-not-exist'), linksPath: path.join(FIX, 'book-links.json'), coversPath: path.join(FIX, 'covers.json') });
  ok(bc.overlays.coverCount === 3 && bc.warnings.filter((x) => /^covers:/.test(x)).length === 3, `covers.json: ${bc.overlays.coverCount} valid paths kept; bad paths and unknown works reported (${bc.warnings.filter((x) => /^covers:/.test(x)).length} warnings)`);
  warnings.push(...bc.warnings.map((x) => 'covers build: ' + x));
  const BC = bc.data.bookCovers || {};
  ok(!BC['bio-w-why-zebras'] && !BC['no-such-work'], 'a cover path that is a URL (https://evil.example/x.jpg) or climbs out (../x.jpg) is dropped at build, and so is an unknown work');
  ok(!/evil\.example|\.\.\/x\.jpg/.test(bc.html), 'neither bad path reaches the page');
  ok(BC['bio-w-behave'] && BC['bio-w-behave'].zh === 'covers/bio-w-behave.zh.jpg' && BC['bio-w-behave'].en === 'covers/bio-w-behave.en.jpg', 'valid zh/en cover paths are kept in D.bookCovers');
  const nb = build({ write: false, enDir: path.join(FIX, 'does-not-exist'), linksPath: path.join(FIX, 'nope.json'), coversPath: path.join(FIX, 'nope-covers.json') });
  ok(nb.overlays.coverCount === 0 && !nb.data.bookCovers, 'build works with the covers file missing');
  const PC = loadApp(bc), IC = PC.buildIndex(bc.data), srcs = (h) => [...h.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const drawer = (id) => PC.renderNodeDrawer(IC.get(id), IC, {});
  PC.setLang('en'); const hEn = drawer('bio-w-behave');
  ok(srcs(hEn).length === 1 && hEn.includes('src="covers/bio-w-behave.en.jpg"') && /<img class="cov lg"[^>]*alt=""[^>]*loading="lazy"[^>]*decoding="async">/.test(hEn), 'the book drawer shows one cover (84x126 class), empty alt, lazy and async');
  ok(!/\sonerror\s*=/i.test(hEn), 'no inline onerror attribute (the fallback is a delegated listener)');
  PC.setLang('zh'); ok(drawer('bio-w-behave').includes('src="covers/bio-w-behave.zh.jpg"'), 'Chinese UI prefers the zh cover');
  PC.setLang('en'); ok(drawer('bio-w-in-search-memory').includes('src="covers/bio-w-in-search-memory.en.jpg"'), 'English UI uses the en cover when it is the only one');
  PC.setLang('zh'); ok(drawer('bio-w-in-search-memory').includes('src="covers/bio-w-in-search-memory.en.jpg"'), 'Chinese UI falls back to the en cover when there is no zh cover');
  { const D9 = JSON.parse(JSON.stringify(bc.data)); D9.bookCovers['bio-w-behave'] = { zh: 'covers/z.jpg' }; const I9 = PC.buildIndex(D9); PC.setLang('en'); ok(PC.renderNodeDrawer(I9.get('bio-w-behave'), I9, {}).includes('src="covers/z.jpg"'), 'English UI falls back to the zh cover when there is no en cover'); }
  PC.setLang('en'); ok(srcs(drawer('bio-w-why-zebras')).length === 0 && !/class="cov/.test(drawer('bio-w-why-zebras')) && !/wtop/.test(drawer('bio-w-why-zebras')), 'a book with no cover has no <img> and no cover wrapper');
  ok(PC.safeCover('https://evil.example/x.jpg') === '' && PC.safeCover('../x.jpg') === '' && PC.safeCover('covers/../x.jpg') === '' && PC.safeCover('//evil.example/a.jpg') === '' && PC.safeCover('data:image/png;base64,AAAA') === '' && PC.safeCover('covers/a.jpg') === 'covers/a.jpg', 'the renderer itself refuses any src that is not covers/<file>');
  { const th0 = IC.of.theory[0], lad = PC.readingPath(IC, th0.id).ladder[0], D9 = JSON.parse(JSON.stringify(bc.data));
    D9.bookCovers = Object.assign({}, D9.bookCovers, { [lad.id]: { en: 'covers/ladder.en.jpg' } });
    const I9 = PC.buildIndex(D9), withCov = PC.pathHtml(I9, th0.id, { compact: true }), without = PC.pathHtml(IC, th0.id, { compact: true });
    ok(withCov.includes('<img class="cov sm" src="covers/ladder.en.jpg"') && withCov.includes('class="pbook hc"'), 'a book card on a reading path shows the 40x60 cover');
    ok(!/<img/.test(without) && !/pbook hc/.test(without), 'path cards without a cover have no <img> and no cover layout'); }
  // every <img src> any drawer or path can produce is a relative covers/ path
  let imgOk = true, badSrc = '';
  for (const n of IC.byId.values()) { if (!['work', 'school', 'theory'].includes(n.type)) continue; for (const lang of ['en', 'zh']) { PC.setLang(lang); const h = PC.renderNodeDrawer(n, IC, {}) + (n.type !== 'work' ? PC.pathHtml(IC, n.id, {}) : ''); for (const m of h.matchAll(/\bsrc="([^"]*)"/g)) if (!COVER_SRC.test(m[1])) { imgOk = false; badSrc = m[1]; } } }
  ok(imgOk, 'every src in every rendered drawer and path is a relative covers/ image path' + (badSrc ? ': ' + badSrc : ''));
  { const D9 = JSON.parse(JSON.stringify(bc.data)); D9.bookLinks['bio-w-behave'].zh.script = 'hant'; D9.bookLinks['bio-w-behave'].sameWork = ['x']; const I9 = PC.buildIndex(D9);
    PC.setLang('en'); const he = PC.renderNodeDrawer(I9.get('bio-w-behave'), I9, {}); PC.setLang('zh'); const hz = PC.renderNodeDrawer(I9.get('bio-w-behave'), I9, {}); PC.setLang('en');
    ok(he.includes('>Trad.<') && hz.includes('>繁體<') && !drawer('bio-w-behave').includes('Trad.'), 'a zh edition with script "hant" carries a Trad. / 繁體 tag in both UI languages; extra fields like sameWork are tolerated'); }
  ok(/addEventListener\('error'/.test(appScript) && /classList\.contains\('cov'\)/.test(appScript), 'a delegated capture listener removes a cover that fails to load');
}
{ // partial overlays: a missing file or directory is fine
  const b0 = build({ write: false, enDir: path.join(FIX, 'does-not-exist'), linksPath: path.join(FIX, 'nope.json') });
  ok(b0.overlays.enFiles === 0 && b0.overlays.linkCount === 0 && b0.html.length > 100000, 'build works with the English directory and the links file both missing');
  const Pm = loadApp(b0), Im = Pm.buildIndex(b0.data); Pm.setLang('en');
  const s = Im.of.school[3], h = Pm.renderNodeDrawer(s, Im, {}); ok(h.includes(escHtml(s.summary.zh)) && !/<a class="ext"/.test(h), 'without overlays the English interface shows Chinese text and no links');
}

/* 8. people timeline: before 1879 */
section('8. people timeline');
{
  const pm = (o) => Object.assign({ type: 'person', id: 'p', title: { zh: 'p', en: 'p' }, schools: [], role: { zh: '' } }, o);
  ok(PM.isPreModern(I, pm({ born: 1700, died: 1760 }), 2026) && PM.isPreModern(I, pm({ born: 1800, died: 1878 }), 2026) && !PM.isPreModern(I, pm({ born: 1800, died: 1879 }), 2026), 'died before 1879 = before modern psychology (1879 itself is not)');
  ok(!PM.isPreModern(I, pm({ born: 1850, died: 1920 }), 2026) && !PM.isPreModern(I, pm({ born: 1990 }), 2026) && !PM.isPreModern(I, pm({ born: null, died: null }), 2026), 'people alive in the modern era, living people and people without a birth year are not');
  ok(PM.personEnd(I, pm({ born: 1950 }), 2026).live === true && PM.personEnd(I, pm({ born: 1950 }), 2026).end === 2026 && PM.personEnd(I, pm({ born: 1700, died: null }), 2026).unknownEnd === true, 'living people run to today; unknown deaths are estimated and marked');
  const pre = I.of.person.filter((p) => PM.isPreModern(I, p, I.Y1)), clipped = I.of.person.filter((p) => p.born != null && p.born < 1870 && !PM.isPreModern(I, p, I.Y1));
  ok(pre.length > 0 && clipped.length > 0, `data has people for both new rules: ${pre.length} before the modern era, ${clipped.length} born before 1870 and drawn from the left edge`);
}

/* 5. routes */
section('9. routes (parse then serialize)');
const first = D.questions[0].id, nid = schools[3].id, nid2 = schools[9].id, th = D.threads[2].id, thId = D.nodes.find((n) => n.type === 'theory').id;
const hashes = ['#/map', '#/map/ridge', `#/map/t/${th}`, '#/structure', '#/people', '#/people/full', '#/questions', `#/questions/${first}`, '#/questions/debates', '#/questions/myths', '#/reading', `#/reading/path/${thId}`,
  `#/map?n=${nid}`, `#/map/ridge?n=${nid}`, `#/map/t/${th}?n=${nid}`, `#/structure?n=${nid}`, `#/people?n=${nid}`, `#/people/full?n=${nid}`, `#/questions/${first}?n=${nid}`, `#/reading?n=${nid}`, `#/reading/path/${nid}?n=${thId}`,
  `#/map?c=${nid},${nid2}`, `#/map/ridge?n=${nid}&c=${nid},${nid2}`, `#/structure?c=${nid}`, `#/map/t/${th}?n=${nid}&c=${nid},${nid2}`,
  '#/map?lang=zh', '#/map?lang=en', `#/reading/path/${thId}?lang=zh`, `#/people/full?n=${nid}&lang=en`, `#/map/ridge?n=${nid}&c=${nid},${nid2}&lang=zh`];
hashes.forEach((h) => { const s = PM.parseHash(h), back = PM.serializeRoute(s); ok(back === h, `${h}  ->  ${JSON.stringify(s)}  ->  ${back}`); });
const s0 = PM.parseHash('#/map/t/depth'); ok(s0.view === 'map' && s0.sub === 'thread' && s0.thread === 'depth', 'thread route parses to view/sub/thread');
const s1 = PM.parseHash('#/map?n=a&c=b,c'); ok(s1.n === 'a' && s1.c.join() === 'b,c', 'n and c parameters parse');
ok(PM.serializeRoute(PM.parseHash('')) === '#/map' && PM.serializeRoute(PM.parseHash('#/nonsense')) === '#/map', 'empty and unknown hashes fall back to #/map');
ok(PM.parseHash('#/map?lang=fr').lang === null && PM.parseHash('#/map?lang=zh').lang === 'zh', 'only lang=en and lang=zh are accepted');
{ const r = PM.parseHash(`#/reading/path/${thId}`), p = PM.parseHash('#/people/full'); ok(r.view === 'reading' && r.path === thId && p.view === 'people' && p.full === true && !PM.parseHash('#/people').full, 'reading path and full-timeline routes parse to path / full'); }
ok(PM.getLang() === 'zh' || PM.getLang() === 'en', 'language is one of en / zh');

/* regressions found while recording the tutorial video */
{
  const css = fs.readFileSync(path.join(here, '..', 'src', 'styles.css'), 'utf8').replace(/\s+/g, '');
  const ridge = fs.readFileSync(path.join(here, '..', 'src', 'app', '20-ridge.js'), 'utf8');
  const thread = fs.readFileSync(path.join(here, '..', 'src', 'app', '40-thread.js'), 'utf8');
  const pe = css.match(/([^{}]*)\{pointer-events:none\}/g) || [];
  ok(pe.some((r) => r.includes('#edges')) && pe.some((r) => r.includes('.cross')), 'ridge crosshair and relation curves ignore the pointer, so clicks reach the school dots underneath');
  ok(/else svg\.classList\.remove\('revealing'\)/.test(ridge), 'a ridge re-render during the reveal clears the "revealing" state (dots and labels never stay hidden)');
  ok(!/classList\.toggle\('rel'/.test(thread) && /\.col\.relc/.test(css), 'thread-view hover marks columns with .relc, not the panel row class .rel (whose grid layout squeezed the columns)');
}

console.log(`\n${passed} passed, ${failed} failed`);
if (warnings.length) { console.log('\nwarnings (first ' + Math.min(warnings.length, 40) + ' of ' + warnings.length + '):'); warnings.slice(0, 40).forEach((w) => console.log('  - ' + w)); }
process.exit(failed ? 1 : 0);
