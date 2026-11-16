// node video/stills.mjs <video> <t1,t2,...>  -> video/qa/s_<t>.jpg (scaled to 960 wide)
import { spawnSync } from 'node:child_process'; import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
import { FF } from './tts.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const [vid, ts] = process.argv.slice(2); fs.mkdirSync(path.join(here, 'qa'), { recursive: true });
for (const t of ts.split(',')) {
  const out = path.join(here, 'qa', `s_${t}.jpg`);
  const r = spawnSync(FF + 'ffmpeg', ['-y', '-v', 'error', '-ss', t, '-i', vid, '-frames:v', '1', '-vf', 'scale=960:-1', out]);
  if (r.status) console.log('fail', t);
}
