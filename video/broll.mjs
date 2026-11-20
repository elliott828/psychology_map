// B-roll and background music, composited onto the rendered voice-over video (no re-recording):
//   node video/broll.mjs            slides -> broll/build/*.png, then video/psychologymap-guide-broll.mp4
//   node video/broll.mjs --slides   only render the slides (for checking)
// Slides cover the page area (1920x960) only, so the burned-in subtitle band stays visible.
// Times are given as draft-cue numbers of the recording (voice/draft.srt) and mapped to video time
// through the scene marks of the last render (marks.json) and the voice plan (voice.mjs).
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { fileURLToPath, pathToFileURL } from 'node:url';
import { launch, sleep } from './cdp.mjs';
import { FF } from './tts.mjs';
import { cues, sceneMaps } from './voice.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const A = (f) => pathToFileURL(path.join(here, 'broll', 'assets', f)).href;
const BUILD = path.join(here, 'broll', 'build'); fs.mkdirSync(BUILD, { recursive: true });
const W = 1920, H = 960;

/* ---------- slide markup (same palette as the site) ---------- */
const CSS = `*{box-sizing:border-box;margin:0}html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:radial-gradient(ellipse at 50% 40%,#0d1726 0%,#070b14 70%);color:#eaf0f8;font-family:"Microsoft YaHei","PingFang SC",sans-serif;position:relative}
.k{position:absolute;left:96px;top:70px;font:600 22px/1 ui-monospace,Consolas,monospace;letter-spacing:.24em;color:#7df0e2;opacity:.85}
.t{position:absolute;left:96px;top:110px;font-size:52px;font-weight:700;letter-spacing:.02em;text-shadow:0 0 30px rgba(125,240,226,.25)}
.row{position:absolute;left:0;right:0;display:flex;justify-content:center;align-items:flex-end}
.ph{border-radius:14px;overflow:hidden;border:1px solid rgba(125,240,226,.28);box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 40px rgba(125,240,226,.08);background:#0b1220}
.ph img{display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.05)}
.cap{margin-top:18px;text-align:center}.cap b{display:block;font-size:30px}.cap span{display:block;margin-top:6px;font-size:21px;color:#9fb0c6}
.cv{box-shadow:0 26px 60px rgba(0,0,0,.6);border-radius:6px;overflow:hidden;background:#111}.cv img{display:block;width:100%;height:100%;object-fit:cover}
.cr{position:absolute;right:28px;bottom:18px;font-size:14px;color:rgba(234,240,248,.45)}
.chip{display:inline-block;padding:6px 16px;border:1px solid rgba(125,240,226,.5);border-radius:999px;color:#7df0e2;font-size:22px}
.yr{font:600 24px ui-monospace,Consolas,monospace;color:#7df0e2}`;
const page = (body) => `<!doctype html><meta charset="utf-8"><style>${CSS}</style><body>${body}</body>`;
const person = (img, name, sub, w = 330, h = 420, pos = 'center 20%') => `<div style="margin:0 46px"><div class="ph" style="width:${w}px;height:${h}px"><img src="${A(img)}" style="object-position:${pos}"></div><div class="cap"><b>${name}</b><span>${sub}</span></div></div>`;
const cover = (img, w = 270, rot = 0) => `<div class="cv" style="width:${w}px;height:${Math.round(w * 1.42)}px;margin:0 26px;transform:rotate(${rot}deg)"><img src="${A(img)}"></div>`;

const SLIDES = {
  people: page(`<div class="k">READING</div><div class="t">我读过的心理学</div>
    <div class="row" style="top:230px">${person('jung.jpg', '卡尔·古斯塔夫·荣格', '分析心理学 · 1875–1961', 360, 470, 'center 25%')}${person('adler.jpg', '阿尔弗雷德·阿德勒', '个体心理学 · 1870–1937', 360, 470, '30% 18%')}</div>
    <div class="cr">阿德勒照片：Deutsche Gesellschaft für Individualpsychologie e.V.，CC BY-SA 3.0 DE</div>`),
  shelf: page(`<div class="k">ON THE SHELF</div><div class="t">往期节目里读过的书</div>
    <div class="row" style="top:260px;align-items:center">${cover('cv_jianxi.jpg', 260, -3)}${cover('cv_ziwo.jpg', 260, 2)}${cover('cv_gongshi.jpg', 260, -2)}${cover('cv_mengseng.jpg', 260, 3)}</div>`),
  science: page(`<div class="k">BIOLOGY OF BEHAVIOR</div><div class="t">基于神经和现代科学的心理学</div>
    <div class="row" style="top:215px;align-items:flex-start">
      <div style="margin:0 60px">${cover('cv_xingwei.png', 330, -2).replace('margin:0 26px', 'margin:0')}<div class="cap"><b>《行为》</b><span>Behave · 2017</span></div></div>
      <div style="margin:0 60px">${cover('cv_mingding.jpg', 330, 2).replace('margin:0 26px', 'margin:0')}<div class="cap"><b>《命定》</b><span>Determined · 2023</span></div></div></div>
    <div style="position:absolute;left:0;right:0;bottom:46px;text-align:center;font-size:24px;color:#9fb0c6">罗伯特·萨波尔斯基 Robert M. Sapolsky 著</div>`),
  timeline: page(`<div class="k">1879 →</div><div class="t">心理学，整体是怎么发展的？</div>
    <div style="position:absolute;left:120px;right:120px;top:560px;height:2px;background:linear-gradient(90deg,rgba(125,240,226,.1),#7df0e2,rgba(106,168,255,.6))"></div>
    <div class="row" style="top:250px;justify-content:space-between;padding:0 120px">${[['wundt.jpg', '冯特', '实验心理学', 1879], ['freud.jpg', '弗洛伊德', '精神分析', 1900], ['adler.jpg', '阿德勒', '个体心理学', 1912], ['jung.jpg', '荣格', '分析心理学', 1913], ['watson.jpg', '华生', '行为主义', 1913], ['rogers.jpg', '罗杰斯', '人本主义', 1951]]
      .map(([f, n, s, y]) => `<div style="text-align:center;width:220px"><div class="ph" style="width:200px;height:250px;margin:0 auto"><img src="${A(f)}" style="object-position:${f === 'adler.jpg' ? '30% 18%' : 'center 22%'}"></div><div style="margin:34px auto 0;width:14px;height:14px;border-radius:50%;background:#7df0e2;box-shadow:0 0 16px #7df0e2"></div><div class="yr" style="margin-top:14px">${y}</div><div class="cap" style="margin-top:6px"><b style="font-size:27px">${n}</b><span>${s}</span></div></div>`).join('')}</div>
    <div class="cr">阿德勒照片：DGIP e.V.，CC BY-SA 3.0 DE；罗杰斯肖像：Didius，CC BY 2.5</div>`),
  book: page(`<div class="k">PREVIOUSLY</div>
    <div style="position:absolute;left:300px;top:110px">${cover('cv_linghun.png', 500, 0).replace('margin:0 26px', 'margin:0')}</div>
    <div style="position:absolute;left:900px;top:250px"><div class="chip">往期节目 · 共六期</div><div style="margin-top:34px;font-size:64px;font-weight:700">《灵魂建筑师》</div><div style="margin-top:18px;font-size:32px;color:#c9d5e4">心理学诞生的黄金时代</div><div style="margin-top:28px;font-size:24px;color:#9fb0c6">史蒂夫·安扬 著</div></div>`),
  freud: page(`<div class="k">1900 →</div><div class="t">从弗洛伊德开始</div>
    <div style="position:absolute;left:170px;top:230px">${person('freud.jpg', '西格蒙德·弗洛伊德', '精神分析 · 1856–1939', 340, 440, 'center 18%')}</div>
    <svg style="position:absolute;left:640px;top:200px" width="1200" height="640">${[['阿德勒', '个体心理学'], ['荣格', '分析心理学'], ['兰克', '出生创伤与意志'], ['赖希', '身体与性格'], ['霍妮', '文化与神经症'], ['克莱因', '客体关系']]
      .map(([n, s], i) => { const y = 40 + i * 108; return `<path d="M0 300 C 220 300, 220 ${y}, 440 ${y}" fill="none" stroke="#7df0e2" stroke-opacity=".55" stroke-width="2"/><circle cx="440" cy="${y}" r="7" fill="#7df0e2"/><text x="470" y="${y + 10}" fill="#eaf0f8" font-size="34" font-weight="700" font-family="Microsoft YaHei">${n}</text><text x="${470 + n.length * 36 + 22}" y="${y + 10}" fill="#9fb0c6" font-size="24" font-family="Microsoft YaHei">${s}</text>`; }).join('')}<circle cx="0" cy="300" r="9" fill="#7df0e2"/></svg>`),
  // picture-in-picture card for the 1879 neck of the hourglass
  wundt: `<!doctype html><meta charset="utf-8"><style>${CSS}body{background:transparent}</style><body><div style="position:absolute;left:0;top:0;width:440px;padding:14px;border-radius:16px;background:rgba(10,15,25,.94);border:1px solid rgba(125,240,226,.45);box-shadow:0 20px 50px rgba(0,0,0,.6)">
    <div class="ph" style="width:412px;height:300px;border-radius:10px"><img src="${A('wundt_lab.jpg')}"></div>
    <div style="margin-top:12px;font-size:24px;font-weight:700"><span class="yr" style="font-size:24px">1879</span> · 莱比锡</div><div style="margin-top:4px;font-size:19px;color:#9fb0c6">冯特建立第一个心理学实验室</div></div></body>`,
};

async function renderSlides() {
  const b = await launch(9335, { width: W, height: H });
  try {
    await b.send('Page.enable'); await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await b.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    for (const [id, html] of Object.entries(SLIDES)) {
      const f = path.join(BUILD, id + '.html'); fs.writeFileSync(f, html, 'utf8');
      await b.send('Page.navigate', { url: pathToFileURL(f).href }); await sleep(900);
      const clip = id === 'wundt' ? { x: 0, y: 0, width: 470, height: 440, scale: 1 } : undefined;
      const { data } = await b.send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) });
      fs.writeFileSync(path.join(BUILD, id + '.png'), Buffer.from(data, 'base64')); console.log('slide', id);
    }
  } finally { b.kill(); }
}

/* ---------- timeline ---------- */
// full-page slides in the opening: [slide, from cue, until cue (exclusive start of the next)]
const FULL = [['people', 1], ['shelf', 4], ['science', 8], ['timeline', 11], ['book', 13], ['freud', 17]], FULL_END = 20; // site comes back at "所以我就自己做了一个网站"
const PIP = [['wundt', 40, 42, 1450, 120]]; // [card, from cue, until cue, x, y] while the 1879 neck is explained
const MUSIC = path.join(here, 'broll', 'assets', 'music.ogg'), MUSIC_LUFS = -26; // bed loudness; ducked further under the voice

function videoTime() {
  const C = cues(), marks = JSON.parse(fs.readFileSync(path.join(here, 'marks.json'), 'utf8')), maps = sceneMaps();
  return (n) => {
    const t = C[n].a, s = maps.find((m) => t >= m.from - .01 && t < m.to - .01), mk = marks.find((m) => m.id === s.id);
    return mk.at + t - s.from + s.gaps.filter((g) => g.at <= t + 1e-6).reduce((a, g) => a + g.d, 0);
  };
}

function compose() {
  const vt = videoTime(), IN = path.join(here, 'psychologymap-guide.mp4'), OUT = path.join(here, 'psychologymap-guide-broll.mp4');
  const dur = +spawnSync(FF + 'ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', IN], { encoding: 'utf8' }).stdout;
  const args = ['-y', '-v', 'error', '-i', IN], f = []; let n = 1, last = '0:v';
  const XF = 0.5;
  // opening slides: each a slow push-in, cross-faded, then faded out over the site
  const starts = FULL.map(([, c]) => (c === 1 ? 0 : vt(c))), end = vt(FULL_END) + 0.3;
  FULL.forEach(([id], i) => {
    const a = starts[i], z = i + 1 < FULL.length ? starts[i + 1] + XF : end, d = z - a, frames = Math.ceil(d * 30);
    args.push('-loop', '1', '-framerate', '30', '-t', d.toFixed(3), '-i', path.join(BUILD, id + '.png'));
    f.push(`[${n}:v]scale=3840:1920,zoompan=z='1+0.045*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=30,format=yuva420p,fade=t=in:st=0:d=${i ? XF : 0.6}:alpha=1,fade=t=out:st=${(d - XF).toFixed(3)}:d=${XF}:alpha=1,setpts=PTS+${a.toFixed(3)}/TB[s${n}]`);
    f.push(`[${last}][s${n}]overlay=0:0:eof_action=pass[v${n}]`); last = `v${n}`; n++;
  });
  PIP.forEach(([id, c0, c1, x, y]) => {
    const a = vt(c0), z = vt(c1) + 0.4, d = z - a;
    args.push('-loop', '1', '-framerate', '30', '-t', d.toFixed(3), '-i', path.join(BUILD, id + '.png'));
    f.push(`[${n}:v]format=yuva420p,fade=t=in:st=0:d=0.4:alpha=1,fade=t=out:st=${(d - .4).toFixed(3)}:d=0.4:alpha=1,setpts=PTS+${a.toFixed(3)}/TB[s${n}]`);
    f.push(`[${last}][s${n}]overlay=${x}:${y}:eof_action=pass[v${n}]`); last = `v${n}`; n++;
  });
  // music: looped under the voice, ducked while speaking, faded in/out
  args.push('-stream_loop', '-1', '-i', MUSIC); const mi = n;
  f.push(`[${mi}:a]loudnorm=I=${MUSIC_LUFS}:TP=-8:LRA=11,aresample=48000,afade=t=in:st=0:d=2.5,afade=t=out:st=${(dur - 5).toFixed(2)}:d=5,atrim=0:${dur.toFixed(3)}[bg]`);
  f.push(`[0:a]asplit=2[vo][sc]`, `[bg][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=700[duck]`, `[vo][duck]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]`);
  args.push('-filter_complex', f.join(';'), '-map', `[${last}]`, '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', dur.toFixed(3), '-movflags', '+faststart', OUT);
  const r = spawnSync(FF + 'ffmpeg', args, { encoding: 'utf8' }); if (r.status !== 0) throw new Error('ffmpeg: ' + r.stderr.slice(-2000));
  console.log('wrote', OUT, '| slides', starts.map((s) => s.toFixed(1)).join(' '), '| site back at', end.toFixed(1), '| 1879 card', vt(PIP[0][1]).toFixed(1));
}

await renderSlides();
if (!process.argv.includes('--slides')) compose();
