// Synthesizes every narration line (Windows OneCore voice), returns per-scene timing, and writes one WAV per scene.
// Cached per line by text+voice+rate, so editing one line only re-synthesizes that line.
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
// ffmpeg/ffprobe: set FFMPEG_DIR (folder with ffmpeg.exe and ffprobe.exe), otherwise they must be on PATH
export const FF = process.env.FFMPEG_DIR ? process.env.FFMPEG_DIR.replace(/[\/]?$/, '/') : '';
export const VOICE = process.env.VOICE || 'Huihui', RATE = +(process.env.RATE || 1.1);
export const LEAD = 0.5, TAIL = 0.7, GAP = 0.32;
const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8' }); if (r.status !== 0) throw new Error(cmd + ' ' + (r.stderr || '').slice(-600)); return (r.stdout || '') + (r.stderr || ''); };
export const dur = (f) => parseFloat(run(FF + 'ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]));

export function synth(scenes) {
  const dir = path.join(here, 'tts'); fs.mkdirSync(dir, { recursive: true });
  const out = [];
  scenes.forEach((s, si) => {
    const parts = [], timing = []; let t = LEAD;
    s.lines.forEach((ln, i) => {
      const text = ln.say || ln.sub, key = `${VOICE}|${RATE}|${text}`;
      const base = path.join(dir, `${String(si + 1).padStart(2, '0')}_${s.id}_${i}`), raw = base + '.raw.wav', wav = base + '.wav';
      if (!fs.existsSync(wav) || !fs.existsSync(base + '.key') || fs.readFileSync(base + '.key', 'utf8') !== key) {
        fs.writeFileSync(base + '.txt', text, 'utf8');
        run('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(here, 'tts_onecore.ps1'), '-Voice', VOICE, '-TextFile', base + '.txt', '-Out', raw, '-Rate', String(RATE)]);
        // trim leading/trailing silence, normalise format
        run(FF + 'ffmpeg', ['-y', '-v', 'error', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
        fs.writeFileSync(base + '.key', key);
      }
      const d = dur(wav), pause = GAP + (ln.p || 0);
      timing.push({ start: t, end: t + d, text: ln.sub });
      parts.push({ wav, d, pause }); t += d + pause;
    });
    const total = t - GAP + TAIL;
    // scene WAV: lead silence, each line followed by its pause, padded/trimmed to exactly `total`
    const inputs = [], filt = [];
    parts.forEach((p, i) => { inputs.push('-i', p.wav); filt.push(`[${i}:a]apad=pad_dur=${p.pause.toFixed(3)}[a${i}]`); });
    const cat = parts.map((_, i) => `[a${i}]`).join('') + `concat=n=${parts.length}:v=0:a=1[c];[c]adelay=${Math.round(LEAD * 1000)}:all=1,apad,atrim=0:${total.toFixed(3)}[o]`;
    const sceneWav = path.join(dir, `scene${String(si + 1).padStart(2, '0')}.wav`);
    run(FF + 'ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', filt.join(';') + ';' + cat, '-map', '[o]', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', sceneWav]);
    out.push({ id: s.id, total, timing, wav: sceneWav });
  });
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { scenes } = await import('./script.mjs');
  const r = synth(scenes);
  r.forEach((s) => console.log(s.id.padEnd(10), s.total.toFixed(1) + 's', s.timing.length + ' lines'));
  console.log('total', r.reduce((a, s) => a + s.total, 0).toFixed(1) + 's');
}
