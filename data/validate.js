// Validates data/psychologymap-data.js against docs/V2_FRAMEWORK.md.
// Usage: node data/validate.js   (exit code 1 if any violation)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataPath = process.env.PSYMAP_DATA || path.join(__dirname, 'psychologymap-data.js');
const mdPath = path.join(__dirname, '..', 'docs', 'V2_FRAMEWORK.md');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(dataPath, 'utf8'), sandbox, { filename: dataPath });
const D = sandbox.window.PSYMAP;

const errors = [];
const err = (m) => errors.push(m);

const THREADS = ['bio', 'behavior', 'cognition', 'difference', 'development', 'social', 'humanistic', 'depth', 'clinical'];
const EDGE_TYPES = ['develops', 'branches', 'reacts', 'merges', 'bridges', 'critiques', 'applies'];
const EVIDENCE = ['strong', 'moderate', 'mixed', 'limited', 'historical', 'conceptual'];
const CONF = ['high', 'medium', 'low'];
const NODE_TYPES = ['school', 'theory', 'person', 'concept', 'work', 'application'];
const DOMAINS = ['教育', '组织', '健康', '司法', '设计', '政策', '自助'];
const LEVELS = ['bio', 'individual', 'relational', 'sociocultural'];
const ACTIVITIES = ['theory', 'research', 'clinical', 'method', 'applied'];
const OLD_STREAM_IDS = ['analytical', 'post-jung', 'archetypal', 'east-asian-jung', 'synchronicity', 'classical-analysis', 'ego-psychology', 'object-relations', 'attachment', 'relational-analysis', 'classical-conditioning', 'operant', 'social-learning', 'behavior-analysis', 'information-processing', 'schema-ct', 'rebt', 'dual-process', 'memory-construction', 'act', 'dbt', 'mbct', 'compassion', 'person-centered', 'self-actualization', 'logotherapy', 'existential', 'affective-neuro', 'memory-plasticity', 'stress-biology', 'neuropsychology', 'behavioral-biology', 'piaget', 'sociocultural', 'lifespan', 'ecological', 'infant-science', 'traits', 'social-cognitive-personality', 'field-theory', 'social-identity', 'dissonance', 'influence', 'cultural', 'classification', 'evidence-practice', 'common-factors', 'rdoc-framework', 'hitop', 'psychometrics', 'computational', 'trauma-recovery', 'trauma-cbt', 'emdr', 'body-trauma', 'biopsychosocial', 'stress-coping', 'mbsr', 'learned-helplessness', 'flow', 'self-determination', 'family-systems', 'structural-family', 'organizational', 'learning-science'];
// old entries that the framework (3.5) turns into application nodes instead of theory nodes
const OLD_AS_APPLICATION = { organizational: 'app-industrial-organizational', 'learning-science': 'app-education-learning' };

if (!D) { console.error('window.PSYMAP missing'); process.exit(1); }

// ---------- ids ----------
const nodeById = new Map();
for (const n of D.nodes) {
  if (!n.id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.id)) err(`bad id format: ${n.id}`);
  if (nodeById.has(n.id)) err(`duplicate node id: ${n.id}`);
  nodeById.set(n.id, n);
  if (!NODE_TYPES.includes(n.type)) err(`${n.id}: bad type ${n.type}`);
  if (!n.title || !n.title.zh || !n.title.en) err(`${n.id}: title zh/en missing`);
  if (!n.summary || !n.summary.zh) err(`${n.id}: summary missing`);
  if (!CONF.includes(n.confidence)) err(`${n.id}: bad confidence`);
}
const rootIds = new Set();
for (const r of D.roots) {
  if (rootIds.has(r.id)) err(`duplicate root id: ${r.id}`);
  rootIds.add(r.id);
  if (nodeById.has(r.id)) err(`root id collides with node id: ${r.id}`);
}
const threadIds = new Set(D.threads.map((t) => t.id));
if (D.threads.length !== 9 || !THREADS.every((t) => threadIds.has(t))) err('threads must be exactly the nine');
for (const t of D.threads) if (!(t.order >= 1) || !t.title.zh || !t.title.en || !t.question.zh || !t.color) err(`thread ${t.id} incomplete`);

const ofType = (t) => D.nodes.filter((n) => n.type === t);
const schools = ofType('school'), theories = ofType('theory'), persons = ofType('person'), concepts = ofType('concept'), works = ofType('work'), apps = ofType('application');
const schoolById = new Map(schools.map((s) => [s.id, s]));
const need = (id, type, ctx) => {
  const n = nodeById.get(id);
  if (!n) { err(`${ctx}: unresolved id ${id}`); return null; }
  if (type && n.type !== type) err(`${ctx}: ${id} is ${n.type}, expected ${type}`);
  return n;
};
const threadOfNode = (n) => {
  if (!n) return null;
  if (n.type === 'school') return n.thread;
  if (n.type === 'theory' || n.type === 'concept') return schoolById.get(n.school) && schoolById.get(n.school).thread;
  if (n.type === 'work') return schoolById.get(n.schools[0]) && schoolById.get(n.schools[0]).thread;
  if (n.type === 'person') return schoolById.get(n.schools[0]) && schoolById.get(n.schools[0]).thread;
  return null;
};

// ---------- schools ----------
const established = schools.filter((s) => s.status !== 'emerging');
const emerging = schools.filter((s) => s.status === 'emerging');
for (const s of schools) {
  const c = `school ${s.id}`;
  if (!THREADS.includes(s.thread)) err(`${c}: bad thread`);
  for (const a of s.alsoThreads || []) if (!THREADS.includes(a)) err(`${c}: bad alsoThread ${a}`);
  if (!LEVELS.includes(s.level)) err(`${c}: bad level`);
  if (!ACTIVITIES.includes(s.activity)) err(`${c}: bad activity`);
  if (![1, 2].includes(s.tier)) err(`${c}: tier must be 1 or 2`);
  if (typeof s.year !== 'number') err(`${c}: year`);
  if (!s.landmark || !s.landmark.zh) err(`${c}: landmark`);
  if (!EVIDENCE.includes(s.evidence)) err(`${c}: bad evidence`);
  if (!s.evidenceNote || !s.evidenceNote.zh) err(`${c}: evidenceNote`);
  if (!(Number.isInteger(s.popularity) && s.popularity >= 1 && s.popularity <= 5)) err(`${c}: popularity`);
  if (!['established', 'emerging'].includes(s.status)) err(`${c}: status`);
  if (s.status === 'emerging') {
    if ('influence' in s) err(`${c}: emerging school must not have influence`);
    if (s.tier !== 2) err(`${c}: emerging school must be tier 2`);
    if (s.year < 2010) err(`${c}: emerging but year < 2010`);
  } else {
    if (!(Number.isInteger(s.influence) && s.influence >= 1 && s.influence <= 5)) err(`${c}: influence`);
    if (s.year >= 2010) err(`${c}: year >= 2010 must be emerging`);
  }
}
for (const t of THREADS) {
  const n = established.filter((s) => s.thread === t && s.tier === 1).length;
  if (n > 7) err(`thread ${t}: ${n} tier-1 schools (max 7)`);
}
const fives = established.filter((s) => s.influence === 5).length;
const fourPlus = established.filter((s) => s.influence >= 4).length;
if (fives > established.length * 0.15) err(`influence 5: ${fives}/${established.length} exceeds 15%`);
if (fourPlus > established.length * 0.4) err(`influence 4-5: ${fourPlus}/${established.length} exceeds 40%`);

// ---------- other nodes ----------
for (const t of theories) {
  const c = `theory ${t.id}`;
  need(t.school, 'school', c);
  if (typeof t.year !== 'number') err(`${c}: year`);
  if (!t.landmark || !t.landmark.zh) err(`${c}: landmark`);
  for (const p of t.people || []) need(p, 'person', c);
  if (!(Number.isInteger(t.influence) && t.influence >= 1 && t.influence <= 5)) err(`${c}: influence`);
  if (!EVIDENCE.includes(t.evidence)) err(`${c}: evidence`);
  if (!t.evidenceNote || !t.evidenceNote.zh) err(`${c}: evidenceNote`);
  if (!(Number.isInteger(t.popularity) && t.popularity >= 1 && t.popularity <= 5)) err(`${c}: popularity`);
}
for (const p of persons) {
  const c = `person ${p.id}`;
  if (!p.name || !p.name.zh || !p.name.en) err(`${c}: name`);
  if (typeof p.born !== 'number' && !(p.born === null && p.confidence === 'low')) err(`${c}: born missing (null allowed only with low confidence)`);
  if (!Array.isArray(p.schools) || !p.schools.length) err(`${c}: schools empty`);
  for (const s of p.schools || []) need(s, 'school', c);
  if (!p.role || !p.role.zh) err(`${c}: role`);
}
for (const k of concepts) {
  const c = `concept ${k.id}`;
  need(k.school, 'school', c);
  for (const f of ['plain', 'example', 'misuse']) if (!k[f] || !k[f].zh) err(`${c}: ${f}`);
}
for (const w of works) {
  const c = `work ${w.id}`;
  if (!w.author) err(`${c}: author`);
  if (typeof w.year !== 'number' && !(w.year === null && w.confidence === 'low')) err(`${c}: year (null only with low confidence)`);
  for (const s of w.schools || []) need(s, 'school', c);
  for (const t of w.theories || []) need(t, 'theory', c);
  if (!w.role || !['easy', 'medium', 'hard'].includes(w.depth)) err(`${c}: role/depth`);
}
for (const a of apps) {
  if (!DOMAINS.includes(a.domain)) err(`application ${a.id}: bad domain`);
  if (typeof a.year !== 'number' || !a.landmark || !a.landmark.zh) err(`application ${a.id}: year/landmark`);
}

// ---------- roots ----------
for (const r of D.roots) {
  const c = `root ${r.id}`;
  if (typeof r.year !== 'number' || !r.when || !r.when.zh || !r.summary || !r.summary.zh || !r.title.en) err(`${c}: incomplete`);
  if (!Array.isArray(r.threads) || !r.threads.length) err(`${c}: threads empty`);
  for (const t of r.threads || []) if (!threadIds.has(t)) err(`${c}: unresolved thread ${t}`);
  if (r.to !== undefined) need(r.to, 'school', c);
}
for (const r of D.roots) if (r.year > 1860) err(`root ${r.id}: year > 1860`);

// ---------- edges ----------
const edgeKey = new Set();
for (const e of D.edges) {
  const c = `edge ${e.from}->${e.to}`;
  need(e.from, null, c); need(e.to, null, c);
  if (!EDGE_TYPES.includes(e.type)) err(`${c}: bad type ${e.type}`);
  if (!e.note || !e.note.zh || !e.note.zh.trim()) err(`${c}: empty note`);
  else if ([...e.note.zh].length > 40) err(`${c}: note longer than 40 chars (${[...e.note.zh].length})`);
  if (!CONF.includes(e.confidence)) err(`${c}: confidence`);
  if (e.type === 'applies') { const t = nodeById.get(e.to); if (t && t.type !== 'application') err(`${c}: applies must target an application`); }
  if (e.from === e.to) err(`${c}: self edge`);
  const k = `${e.from}>${e.to}`;
  if (edgeKey.has(k)) err(`duplicate edge ${k}`);
  edgeKey.add(k);
}

// ---------- questions / debates / myths ----------
for (const q of D.questions) {
  const th = new Set();
  for (const l of q.lenses) { th.add(threadOfNode(need(l.node, null, `question ${q.id}`))); if (!l.take || !l.take.zh) err(`question ${q.id}: empty take`); }
  if (th.size < 3) err(`question ${q.id}: only ${th.size} distinct threads`);
}
for (const d of D.debates) {
  if (d.sides.length < 2) err(`debate ${d.id}: needs two sides`);
  for (const s of d.sides) { need(s.node, null, `debate ${d.id}`); if (!s.position || !s.position.zh) err(`debate ${d.id}: empty position`); }
  if (!d.summary || !d.summary.zh || typeof d.year !== 'number') err(`debate ${d.id}: summary/year`);
}
for (const m of D.myths) {
  if (!m.claim.zh || !m.verdict || !m.correction.zh) err(`myth ${m.id}: incomplete`);
  for (const r of m.related) need(r, null, `myth ${m.id}`);
}

// ---------- framework cross-checks ----------
const md = fs.readFileSync(mdPath, 'utf8');
const section = (from, to) => md.slice(md.indexOf(from), md.indexOf(to));
const sk = section('### 2.4', '### 2.5') + '\n' + section('### 2.7', '### 2.8');
let skeletonCount = 0, recentCount = 0;
for (const line of sk.split('\n')) {
  const m = line.match(/^- ([a-z0-9-]+)｜([^｜]+)｜(\d{4})｜/);
  if (!m) continue;
  const s = schoolById.get(m[1]);
  if (!s) { err(`skeleton school missing: ${m[1]}`); continue; }
  if (s.year !== Number(m[3])) err(`skeleton year mismatch for ${m[1]}: data ${s.year}, framework ${m[3]}`);
  if (Number(m[3]) >= 2010 && s.status !== 'emerging') err(`${m[1]}: should be emerging`);
  if (Number(m[3]) < 2010 && s.status === 'emerging') err(`${m[1]}: should not be emerging`);
  if (Number(m[3]) >= 2010) recentCount++; else skeletonCount++;
}
const recentListed = section('### 2.7', '### 2.8').split('\n').filter((l) => /^- [a-z0-9-]+｜/.test(l)).length;
const skeletonListed = section('### 2.4', '### 2.5').split('\n').filter((l) => /^- [a-z0-9-]+｜/.test(l)).length;
if (schools.length < skeletonListed + recentListed) err(`schools ${schools.length} < ${skeletonListed + recentListed}`);

const requiredEdges = [];
for (const line of (section('### 2.5', '### 2.6') + '\n' + section('### 2.8', '## 3.')).split('\n')) {
  const m = line.match(/^- (\S+) → (\S+)｜(\w+)｜/);
  if (m) requiredEdges.push([m[1].replace('应用·公共政策', 'app-public-policy'), m[2].replace('应用·公共政策', 'app-public-policy'), m[3]]);
}
for (const [a, b, t] of requiredEdges) {
  const e = D.edges.find((x) => x.from === a && x.to === b);
  if (!e) err(`required edge missing: ${a} -> ${b}`);
  else if (e.type !== t) err(`required edge ${a} -> ${b}: type ${e.type}, framework says ${t}`);
}
const requiredRoots = [];
for (const line of section('### 2.6', '### 2.7').split('\n')) {
  const m = line.match(/^- ([a-z0-9-]+)｜[^｜]+｜(-?\d+)｜[^｜]*｜[^｜]*｜([^｜]*)｜([^｜]*)/);
  if (m) requiredRoots.push({ id: m[1], year: Number(m[2]), threads: m[3].split(','), to: m[4].trim() });
}
for (const rr of requiredRoots) {
  const r = D.roots.find((x) => x.id === rr.id);
  if (!r) { err(`required root missing: ${rr.id}`); continue; }
  if (r.year !== rr.year) err(`root ${rr.id}: year ${r.year} vs ${rr.year}`);
  if (JSON.stringify(r.threads) !== JSON.stringify(rr.threads)) err(`root ${rr.id}: threads differ`);
  if ((r.to || '') !== rr.to) err(`root ${rr.id}: to differs`);
}

// ---------- migration ----------
const migrated = new Set(theories.map((t) => t.migratedFrom).filter(Boolean));
for (const id of OLD_STREAM_IDS) {
  if (OLD_AS_APPLICATION[id]) { if (!nodeById.has(OLD_AS_APPLICATION[id])) err(`old ${id}: application node missing`); continue; }
  if (!migrated.has(id)) err(`old pmStreams entry not migrated: ${id}`);
}

// ---------- quantity targets ----------
const counts = {
  schools: schools.length, emerging: emerging.length, established: established.length,
  roots: D.roots.length, edges: D.edges.length, theories: theories.length, persons: persons.length,
  concepts: concepts.length, works: works.length, applications: apps.length,
  questions: D.questions.length, debates: D.debates.length, myths: D.myths.length,
};
if (schools.length < 122) err(`schools ${schools.length} < 122`);
if (emerging.length !== 23) err(`emerging schools ${emerging.length}, expected 23`);
if (D.roots.length !== 20) err(`roots ${D.roots.length} != 20`);
if (D.edges.length < 160) err(`edges ${D.edges.length} < 160`);
if (theories.length < 110) err(`theories ${theories.length} < 110`);
if (persons.length < 120) err(`persons ${persons.length} < 120`);
if (concepts.length < 60) err(`concepts ${concepts.length} < 60`);
if (D.questions.length !== 12) err(`questions ${D.questions.length} != 12`);
if (D.debates.length !== 10) err(`debates ${D.debates.length} != 10`);
if (D.myths.length !== 10) err(`myths ${D.myths.length} != 10`);
const worksPerThread = {};
for (const t of THREADS) {
  worksPerThread[t] = works.filter((w) => threadOfNode(w) === t).length;
  if (worksPerThread[t] < 12) err(`thread ${t}: only ${worksPerThread[t]} works (need >= 12)`);
}


// ---------- coverage (build-spec A1) ----------
const conceptsPerThread = {};
for (const t of THREADS) {
  conceptsPerThread[t] = concepts.filter((c) => threadOfNode(c) === t).length;
  if (conceptsPerThread[t] < 8) err(`thread ${t}: only ${conceptsPerThread[t]} concept cards (need >= 8)`);
}
for (const s of schools) {
  const em = s.status === 'emerging';
  if (!theories.some((t) => t.school === s.id)) err(`coverage: school ${s.id} has no theory`);
  if (!persons.some((p) => p.schools.includes(s.id))) err(`coverage: school ${s.id} has no person`);
  if (!works.some((w) => (w.schools || []).includes(s.id))) err(`coverage: school ${s.id} has no book or reference`);
  if (!em && !concepts.some((c) => c.school === s.id)) err(`coverage: established school ${s.id} has no concept card`);
}
for (const w of works) if (!w.schools || !w.schools.length) err(`work ${w.id}: no school`);

// ---------- v2.1 spec 1.2: key person and key work per school ----------
for (const s of schools) {
  const c = `school ${s.id}`;
  const p = need(s.keyPerson, 'person', `${c} keyPerson`);
  if (p && !p.schools.includes(s.id)) err(`${c}: keyPerson ${s.keyPerson} does not belong to this school`);
  const w = need(s.keyWork, 'work', `${c} keyWork`);
  if (w && !(w.schools || []).includes(s.id)) err(`${c}: keyWork ${s.keyWork} is not attached to this school`);
}

// ---------- v2.1 spec 1.3: every theory has a readable book; bibliographic fields on every work ----------
const LANGS = ['en', 'zh', 'de', 'fr', 'ja', 'ru', 'es', 'it', 'nl'];
const cited = new Set();
for (const w of works) for (const t of w.theories || []) cited.add(t);
for (const t of theories) if (!cited.has(t.id)) err(`theory ${t.id}: no book or reference cites it`);
for (const w of works) {
  const c = `work ${w.id}`;
  if (!LANGS.includes(w.lang)) err(`${c}: bad or missing lang`);
  const o = w.original;
  if (!o || !o.title || !o.author || typeof o.year !== 'number') err(`${c}: original {title, author, year} incomplete`);
  if (!('enRec' in w)) err(`${c}: enRec key missing`);
  if (!('zhQuery' in w)) err(`${c}: zhQuery key missing`);
  if (w.enRec === null && w.zhQuery === null) err(`${c}: enRec and zhQuery are both null`);
  if (w.enRec) {
    for (const f of ['title', 'author', 'edition', 'note']) if (!w.enRec[f] || typeof w.enRec[f] !== 'string') err(`${c}: enRec.${f} missing`);
    if (typeof w.enRec.year !== 'number') err(`${c}: enRec.year missing`);
  }
  if (w.zhQuery !== null && w.zhQuery !== undefined && (typeof w.zhQuery !== 'string' || !w.zhQuery.trim())) err(`${c}: zhQuery must be a non-empty string or null`);
  for (const f of ['doubanId', 'doubanUrl', 'url', 'rating']) if (f in w) err(`${c}: ${f} must not be filled by the data side`);
}
for (const n of D.nodes) if (!n.title || !n.title.en || !String(n.title.en).trim()) err(`${n.id}: title.en missing`);
for (const r of D.roots) {
  if (!Array.isArray(r.people)) err(`root ${r.id}: people must be an array (may be empty)`);
  else for (const p of r.people) need(p, 'person', `root ${r.id}`);
  if (!r.legacy || !r.legacy.zh || !r.legacy.zh.trim()) err(`root ${r.id}: legacy.zh missing`);
}
const unverifiedNulls = persons.filter((p) => p.born === null && p.confidence !== 'low');
for (const p of unverifiedNulls) err(`person ${p.id}: born null requires confidence low`);

// ---------- report ----------
console.log('counts:', JSON.stringify(counts));
console.log('works per thread:', JSON.stringify(worksPerThread));
console.log('influence (established): 5 =', fives, `(${(fives / established.length * 100).toFixed(1)}%)`, ', 4-5 =', fourPlus, `(${(fourPlus / established.length * 100).toFixed(1)}%)`);
console.log('concepts per thread:', JSON.stringify(conceptsPerThread));
console.log('tier-1 per thread:', JSON.stringify(Object.fromEntries(THREADS.map((t) => [t, established.filter((s) => s.thread === t && s.tier === 1).length]))));
if (errors.length) {
  console.log(`\nFAIL: ${errors.length} violation(s)`);
  for (const e of errors) console.log(' - ' + e);
  process.exit(1);
}
console.log('\nPASS: no violations');
