// Helper for the English translation overlay (data/en/*.json).
//   node data/en-tool.mjs dump <group> [--part i/n]   print the Chinese source for one group as JSON
//   node data/en-tool.mjs check [group]               verify coverage of data/en/*.json
//   node data/en-tool.mjs check --fix                 also strip helper keys and fill person roles
// Overlay format: { "<id>": { "<fieldPath>": "English text" } }. Any number of files; the build reads them all.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const enDir = path.join(here, 'en');
const window = {};
new Function('window', fs.readFileSync(path.join(here, 'psychologymap-data.js'), 'utf8'))(window);
const D = window.PSYMAP;
const zh = o => (o && typeof o === 'object' ? o.zh : o) || '';
const byType = t => D.nodes.filter(n => n.type === t);
const fields = (n, names) => Object.fromEntries(names.filter(k => zh(n[k])).map(k => [k, zh(n[k])]));

const GROUPS = {
  schools: () => byType('school').map(n => {
    const f = fields(n, ['summary', 'landmark', 'evidenceNote']);
    if ((n.title.en || '').length > 18) f['title.enShort'] = `SHORTEN to at most 18 characters: ${n.title.en}`;
    return [n.id, { _en: n.title.en, ...f }];
  }),
  theories: () => byType('theory').map(n => [n.id, { _en: n.title.en, ...fields(n, ['summary', 'landmark', 'evidenceNote']) }]),
  persons: () => byType('person').map(n => [n.id, { _en: n.name ? n.name.en : n.title.en, ...fields(n, ['summary']) }]),
  concepts: () => byType('concept').map(n => [n.id, { _en: n.title.en, ...fields(n, ['summary', 'plain', 'example', 'misuse']) }]),
  works: () => byType('work').map(n => {
    const f = fields(n, ['summary']);
    if (n.enRec && n.enRec.note) f['enRec.note'] = n.enRec.note;
    return [n.id, { _en: n.title.en, ...f }];
  }),
  applications: () => byType('application').map(n => [n.id, { _en: n.title.en, ...fields(n, ['summary', 'landmark']) }]),
  roots: () => D.roots.map(n => [n.id, { _en: n.title.en, ...fields(n, ['when', 'summary', 'legacy']) }]),
  threads: () => D.threads.map(n => [n.id, { _en: n.title.en, ...fields(n, ['question']) }]),
  edges: () => D.edges.map(e => [`${e.from}->${e.to}:${e.type}`, { note: zh(e.note) }]),
  questions: () => D.questions.map(q => [q.id, { title: zh(q.title), ...Object.fromEntries(q.lenses.map((l, i) => [`lenses.${i}.take`, zh(l.take)])) }]),
  debates: () => D.debates.map(d => [d.id, { title: zh(d.title), summary: zh(d.summary), ...Object.fromEntries(d.sides.map((s, i) => [`sides.${i}.position`, zh(s.position)])) }]),
  myths: () => D.myths.map(m => [m.id, { claim: zh(m.claim), verdict: zh(m.verdict), correction: zh(m.correction) }]),
};

const [cmd, ...rest] = process.argv.slice(2);
const flag = name => rest.includes(name);
const arg = rest.find(a => !a.startsWith('--'));

if (cmd === 'dump') {
  if (!GROUPS[arg]) { console.error('groups: ' + Object.keys(GROUPS).join(', ')); process.exit(1); }
  let entries = GROUPS[arg]();
  const p = rest[rest.indexOf('--part') + 1];
  if (flag('--part') && /^\d+\/\d+$/.test(p)) {
    const [i, n] = p.split('/').map(Number), size = Math.ceil(entries.length / n);
    entries = entries.slice((i - 1) * size, i * size);
  }
  console.log(JSON.stringify(Object.fromEntries(entries), null, 1));
} else if (cmd === 'check') {
  const have = {};
  const files = fs.existsSync(enDir) ? fs.readdirSync(enDir).filter(f => f.endsWith('.json')) : [];
  let bad = 0;
  for (const f of files) {
    let obj;
    try { obj = JSON.parse(fs.readFileSync(path.join(enDir, f), 'utf8')); } catch (e) { console.log(`INVALID JSON ${f}: ${e.message}`); bad++; continue; }
    let changed = false;
    for (const [id, o] of Object.entries(obj)) {
      for (const k of Object.keys(o)) if (k.startsWith('_')) { if (flag('--fix')) { delete o[k]; changed = true; } }
      have[id] = Object.assign(have[id] || {}, o);
    }
    if (changed) fs.writeFileSync(path.join(enDir, f), JSON.stringify(obj, null, 1), 'utf8');
  }
  if (flag('--fix')) {
    const roles = {};
    for (const n of byType('person')) if (have[n.id] && have[n.id].summary && zh(n.role) && zh(n.role) === zh(n.summary)) roles[n.id] = { role: have[n.id].summary };
    if (Object.keys(roles).length) { fs.mkdirSync(enDir, { recursive: true }); fs.writeFileSync(path.join(enDir, 'persons.roles.json'), JSON.stringify(roles, null, 1), 'utf8'); }
  }
  const cjk = /[㐀-鿿]/;
  for (const g of Object.keys(GROUPS)) {
    if (arg && arg !== g) continue;
    const need = GROUPS[g](); const seen = new Set(); let missing = 0, empty = 0, chinese = 0, long = 0; const examples = [];
    for (const [id, o] of need) {
      if (seen.has(id)) { console.log(`DUPLICATE KEY in ${g}: ${id}`); bad++; } seen.add(id);
      for (const k of Object.keys(o)) {
        if (k.startsWith('_')) continue;
        const v = have[id] && have[id][k];
        if (v === undefined) { missing++; if (examples.length < 5) examples.push(`${id} / ${k}`); }
        else if (typeof v !== 'string' || !v.trim()) empty++;
        else if (cjk.test(v)) { chinese++; if (examples.length < 5) examples.push(`${id} / ${k} still contains Chinese`); }
        else if (k === 'title.enShort' && v.length > 18) { long++; if (examples.length < 5) examples.push(`${id} enShort is ${v.length} chars: ${v}`); }
      }
    }
    const total = need.reduce((a, [, o]) => a + Object.keys(o).filter(k => !k.startsWith('_')).length, 0);
    const ok = !missing && !empty && !chinese && !long;
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'TODO'} ${g}: ${total} fields, missing ${missing}, empty ${empty}, contains Chinese ${chinese}, enShort too long ${long}${examples.length ? '\n      e.g. ' + examples.join('\n           ') : ''}`);
  }
  process.exit(bad ? 1 : 0);
} else {
  console.log('usage: node data/en-tool.mjs dump <group> [--part i/n] | check [group] [--fix]');
}
