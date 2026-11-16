// Records the Psychologymap tutorial: drives the real page in headless Edge (CDP), captures it with
// Page.startScreencast in real time, then muxes frames + narration + burned-in subtitles with ffmpeg.
//   node video/record.mjs            full render -> video/psychologymap-guide.mp4
//   node video/record.mjs --only ridge,detail   render a subset (preview)
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { launch, sleep } from './cdp.mjs';
import { synth, FF, LEAD } from './tts.mjs';
import { scenes as ALL, W, H, START } from './script.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_FILE = ['index.html', 'psychologymap-v2.html'].map((f) => path.resolve(here, '..', f)).find((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('window.PSYMAP'));
const PAGE = 'file:///' + PAGE_FILE.split(path.sep).join('/');
const argOnly = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1].split(',') : null; })();
const scenes = argOnly ? ALL.filter((s) => argOnly.includes(s.id)) : ALL;
const OUT = path.join(here, argOnly ? 'preview.mp4' : 'psychologymap-guide.mp4');
const FR = path.join(here, 'frames'); fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });

// ---------- overlay injected into the page (cursor, click ripple, highlight boxes, element finder) ----------
const OVERLAY = `(()=>{ if (window.__ov) return;
const st=document.createElement('style'); st.textContent=\`
#__cur{position:fixed;left:-50px;top:-50px;width:28px;height:28px;z-index:2147483647;pointer-events:none;opacity:0;transition:opacity .35s}
#__cur svg{display:block;filter:drop-shadow(0 2px 5px rgba(0,0,0,.7))}
.__rip{position:fixed;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:2px solid #7df0e2;z-index:2147483646;pointer-events:none;animation:__rip .65s ease-out forwards}
@keyframes __rip{to{transform:scale(4.4);opacity:0}}
.__hl{position:fixed;z-index:2147483645;pointer-events:none;border:2px solid #7df0e2;border-radius:10px;box-shadow:0 0 0 1px rgba(125,240,226,.25),0 0 26px rgba(125,240,226,.55),inset 0 0 20px rgba(125,240,226,.16);opacity:0;transition:opacity .35s ease}\`;
document.documentElement.appendChild(st);
const c=document.createElement('div'); c.id='__cur'; c.innerHTML='<svg width="28" height="28" viewBox="0 0 28 28"><path d="M4 2.5 L4 22 L9 17.4 L12.6 25 L16 23.5 L12.5 16 L19.5 16 Z" fill="#fff" stroke="#0b1220" stroke-width="1.7" stroke-linejoin="round"/></svg>';
document.documentElement.appendChild(c);
const mv=e=>{c.style.left=(e.clientX-4)+'px';c.style.top=(e.clientY-2)+'px'};
addEventListener('pointermove',mv,true); addEventListener('mousemove',mv,true);
addEventListener('pointerdown',e=>{const r=document.createElement('div');r.className='__rip';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.documentElement.appendChild(r);setTimeout(()=>r.remove(),800)},true);
const vis=e=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'};
const label=e=>((e.getAttribute('aria-label')||'')+' | '+(e.textContent||'')).replace(/\\s+/g,' ').trim();
window.__find=(sel,text,exact)=>{const els=[...document.querySelectorAll(sel)].filter(vis);
  if(text==null) return els[0]||null;
  return els.find(e=>exact?(e.textContent||'').replace(/\\s+/g,' ').trim()===text:label(e).includes(text))||null};
window.__ov={
  show(v){c.style.opacity=v?1:0},
  hl(x,y,w,h,ms){const d=document.createElement('div');d.className='__hl';Object.assign(d.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});document.documentElement.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.style.opacity=1));setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),450)},ms)},
  rect(sel,text,exact){const e=__find(sel,text,exact);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}},
  pt(sel,text,exact){const e=__find(sel,text,exact);if(!e)return null;const t=e.querySelector('circle.d')||e;const r=t.getBoundingClientRect();const cx=r.x+r.width/2,cy=r.y+r.height/2;
    for(let d=0;d<=14;d+=1)for(let a=0;a<16;a++){const x=cx+Math.cos(a*Math.PI/8)*d,y=cy+Math.sin(a*Math.PI/8)*d;const h=document.elementFromPoint(x,y);if(h&&(h===e||e.contains(h)))return {x,y}}return {x:cx,y:cy}},
  into(sel,text,exact){const e=__find(sel,text,exact);if(!e)return false;const r=e.getBoundingClientRect();if(r.top>80&&r.bottom<innerHeight-30)return 'visible';e.scrollIntoView({behavior:'smooth',block:'center'});return true}
};})();`;

// ---------- browser + capture ----------
const b = await launch(9341, { width: W, height: H });
const frames = []; let capturing = false, seq = 0;
b.on((m) => {
  if (m.method !== 'Page.screencastFrame') return;
  const { data, sessionId } = m.params; const t = Date.now() / 1000;
  b.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  if (!capturing) { frames.last = { data, t }; return; }
  const f = path.join(FR, String(++seq).padStart(6, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(data, 'base64')); frames.push({ f, t });
});

// ---------- action API ----------
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
let cx = W / 2, cy = H / 2;
const mouse = (type, x, y, extra = {}) => b.send('Input.dispatchMouseEvent', { type, x, y, button: 'none', ...extra });
function mkA(T0, timing) {
  const A = {
    sleep,
    async at(i, off = 0) { const target = (T0 + LEAD + 0 + timing[i].start - LEAD + off) * 1000; const w = target - Date.now(); if (w > 0) await sleep(w); },
    async showCursor(x, y) { cx = x; cy = y; await mouse('mouseMoved', x, y); await b.ev('__ov.show(1)'); await sleep(350); },
    async hideCursor() { await b.ev('__ov.show(0)'); },
    async move(x, y, ms = 700) {
      const x0 = cx, y0 = cy, n = Math.max(6, Math.round(ms / 34)), t0 = Date.now();
      for (let i = 1; i <= n; i++) { const k = ease(i / n); cx = x0 + (x - x0) * k; cy = y0 + (y - y0) * k; await mouse('mouseMoved', cx, cy); const w = t0 + (ms * i) / n - Date.now(); if (w > 0) await sleep(w); }
    },
    async clickXY(x, y, ms) { await A.move(x, y, ms ?? Math.min(900, 300 + Math.hypot(x - cx, y - cy) * 0.6)); await sleep(120);
      await mouse('mousePressed', x, y, { button: 'left', clickCount: 1, buttons: 1 }); await sleep(70); await mouse('mouseReleased', x, y, { button: 'left', clickCount: 1 }); await sleep(150); },
    async rect(sel, text, exact) {
      const vis = await b.ev(`__ov.into(${JSON.stringify(sel)},${JSON.stringify(text ?? null)},${!!exact})`);
      if (vis === false) throw new Error(`not found: ${sel} ${text ?? ''}`);
      if (vis === true) await sleep(750);
      return b.ev(`__ov.rect(${JSON.stringify(sel)},${JSON.stringify(text ?? null)},${!!exact})`);
    },
    async pt(sel, text, exact) { await A.rect(sel, text, exact); return b.ev(`__ov.pt(${JSON.stringify(sel)},${JSON.stringify(text ?? null)},${!!exact})`); },
    async clickSel(sel, text, exact) { const p = await A.pt(sel, text, exact); await A.clickXY(p.x, p.y); },
    async hoverSel(sel, text, ms = 1500) { const p = await A.pt(sel, text); await A.move(p.x, p.y, 800); await sleep(ms); },
    async drag(x1, y1, x2, y2, ms = 1500) {
      await A.move(x1, y1, 600); await mouse('mousePressed', x1, y1, { button: 'left', clickCount: 1, buttons: 1 });
      const n = Math.max(6, Math.round(ms / 34)), t0 = Date.now();
      for (let i = 1; i <= n; i++) { const k = ease(i / n); cx = x1 + (x2 - x1) * k; cy = y1 + (y2 - y1) * k; await mouse('mouseMoved', cx, cy, { button: 'left', buttons: 1 }); const w = t0 + (ms * i) / n - Date.now(); if (w > 0) await sleep(w); }
      await mouse('mouseReleased', x2, y2, { button: 'left', clickCount: 1 });
    },
    async wheel(x, y, dy, ms = 800) { await A.move(x, y, 500); const n = Math.max(6, Math.round(ms / 40)); for (let i = 0; i < n; i++) { await mouse('mouseWheel', x, y, { deltaX: 0, deltaY: dy / n }); await sleep(ms / n); } },
    async scrollTo(sel, text) { await A.rect(sel, text); },
    async type(text, perChar = 250) { for (const ch of text) { await b.send('Input.insertText', { text: ch }); await sleep(perChar); } },
    async selectAll() { await b.ev(`(()=>{const e=document.activeElement;if(e&&e.select){e.select()}})()`); await sleep(250); },
    async key(k) {
      const map = { Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, '/': { key: '/', code: 'Slash', windowsVirtualKeyCode: 191, text: '/' } }[k];
      await b.send('Input.dispatchKeyEvent', { type: map.text ? 'keyDown' : 'rawKeyDown', ...map }); await b.send('Input.dispatchKeyEvent', { type: 'keyUp', ...map, text: undefined }); await sleep(120);
    },
    async closeHow() { const open = await b.ev(`document.getElementById('how').classList.contains('open')`); if (open) await A.key('Escape'); },
    async closePanel() { const r = await b.ev(`__ov.rect('#panel [data-close]',null,false)`); if (r) await A.clickXY(r.x + r.w / 2, r.y + r.h / 2); },
    async quiet(js) { await b.ev(js); },
    async log(js) { console.log('   [log]', JSON.stringify(await b.ev(js))); },
    hl(x, y, w, h, ms = 2600) { b.ev(`__ov.hl(${x},${y},${w},${h},${ms})`).catch(() => {}); },
    async hlSel(sel, ms = 2600, pad = 8, o = {}) {
      const r = await b.ev(`__ov.rect(${JSON.stringify(sel)},null,false)`); if (!r) { console.warn('hl miss', sel); return; }
      const y = r.y + (o.dy || 0), h = o.h ?? r.h; A.hl(r.x - pad, y - pad, r.w + 2 * pad, h + 2 * pad, ms);
    },
    async hlText(sel, text, ms, o = {}) {
      const r = await b.ev(`__ov.rect(${JSON.stringify(sel)},${JSON.stringify(text)},${!!o.exact})`); if (!r) { console.warn('hl miss', text); return; }
      const wr = o.wSel ? await b.ev(`__ov.rect(${JSON.stringify(o.wSel)},null,false)`) : r;
      A.hl(wr.x + 8, r.y - 8, wr.w - 16, (o.h ?? r.h) + 16, ms);
    },
  };
  return A;
}

// ---------- run ----------
const plan = synth(scenes);
try {
  await b.send('Page.enable'); await b.send('Page.bringToFront');
  await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await b.send('Page.addScriptToEvaluateOnNewDocument', { source: OVERLAY });
  await b.send('Page.navigate', { url: PAGE + (argOnly && scenes[0].start ? scenes[0].start : START) });
  await sleep(2500); await b.ev(OVERLAY);
  if (argOnly && scenes[0].prep) await scenes[0].prep(mkA(Date.now() / 1000, plan[0].timing));
  await b.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  await sleep(800);
  const T = Date.now() / 1000; capturing = true;
  if (frames.last) { const f = path.join(FR, String(++seq).padStart(6, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(frames.last.data, 'base64')); frames.push({ f, t: T }); }
  let off = 0; const marks = [];
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i], p = plan[i], T0 = T + off;
    const w = T0 * 1000 - Date.now(); if (w > 0) await sleep(w);
    marks.push(T0); console.log(`scene ${s.id} @${off.toFixed(1)}s (${p.total.toFixed(1)}s)`);
    try { await s.run(mkA(T0, p.timing)); } catch (e) { console.warn(`  ! ${s.id}: ${e.message}`); }
    const late = Date.now() / 1000 - (T0 + p.total); if (late > 0) console.warn(`  ! ${s.id} actions overran by ${late.toFixed(2)}s`);
    off += p.total;
  }
  const w = (T + off) * 1000 - Date.now(); if (w > 0) await sleep(w);
  capturing = false; await b.send('Page.stopScreencast');
  const total = off;
  console.log(`captured ${frames.length} frames over ${total.toFixed(1)}s (${(frames.length / total).toFixed(1)} fps avg)`);

  // ---------- assemble ----------
  const list = []; for (let i = 0; i < frames.length; i++) {
    const t0 = frames[i].t - T, t1 = i + 1 < frames.length ? frames[i + 1].t - T : total; if (t1 <= 0) continue;
    list.push(`file '${frames[i].f.split(path.sep).join('/')}'`, `duration ${Math.max(0.001, Math.min(t1, total) - Math.max(0, t0)).toFixed(4)}`);
  }
  list.push(`file '${frames[frames.length - 1].f.split(path.sep).join('/')}'`);
  fs.writeFileSync(path.join(here, 'frames.txt'), list.join('\n'));
  // narration track
  fs.writeFileSync(path.join(here, 'audio.txt'), plan.map((p) => `file '${p.wav.split(path.sep).join('/')}'`).join('\n'));
  // subtitles (ASS, in the band under the page)
  const ts = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = (s % 60).toFixed(2).padStart(5, '0'); return `${h}:${String(m).padStart(2, '0')}:${x}`; };
  const srt = (s) => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), sec = Math.floor((ms % 60000) / 1000); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  const ev = []; const srtL = []; let n = 0, acc = 0;
  plan.forEach((p) => { p.timing.forEach((l) => { const a = acc + l.start - 0.05, z = acc + l.end + 0.25; ev.push(`Dialogue: 0,${ts(a)},${ts(z)},Sub,,0,0,0,,${l.text}`); srtL.push(`${++n}\n${srt(a)} --> ${srt(z)}\n${l.text}\n`); }); acc += p.total; });
  const ass = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nWrapStyle: 0\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Sub,Microsoft YaHei,42,&H00F4F7FA,&H000000FF,&H00140B07,&H00140B07,0,0,0,0,100,100,1,0,1,0,0,2,80,80,38,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${ev.join('\n')}\n`;
  fs.writeFileSync(path.join(here, 'subs.ass'), ass, 'utf8');
  if (!argOnly) fs.writeFileSync(path.join(here, 'psychologymap-guide.srt'), srtL.join('\n'), 'utf8');
  const vf = `fps=30,format=yuv420p,pad=1920:1080:0:0:color=0x070b14,drawbox=x=0:y=${H}:w=1920:h=1:color=0x7df0e2@0.28:t=fill,subtitles=subs.ass:fontsdir='C\\:/Windows/Fonts'`;
  const r = spawnSync(FF + 'ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'frames.txt', '-f', 'concat', '-safe', '0', '-i', 'audio.txt',
    '-vf', vf, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', total.toFixed(3), '-movflags', '+faststart', OUT], { cwd: here, encoding: 'utf8' });
  if (r.status !== 0) throw new Error('ffmpeg: ' + r.stderr.slice(-1500));
  console.log('wrote', OUT);
  fs.writeFileSync(path.join(here, 'marks.json'), JSON.stringify(scenes.map((s, i) => ({ id: s.id, at: +(marks[i] - T).toFixed(2), len: +plan[i].total.toFixed(2) })), null, 1));
} finally { b.kill(); }
