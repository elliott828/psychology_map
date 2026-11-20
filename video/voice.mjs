// Human voice-over: replaces the synthesized narration with a recording.
//   voice/narration.mp3  the recording (all scenes in one file)
//   voice/draft.srt      its rough auto-subtitles; only the cue TIMES are used, numbered as in that file
// SUBS below is the corrected subtitle text, each entry spanning draft cues [first, last].
// ANCHORS maps every script line of a scene (script.mjs, by index) to the draft cue where it is spoken,
// so the scenes' `A.at(line)` actions land on the spoken words. HOLD adds silence after a scene
// when its on-screen actions need longer than the speech.
import fs from 'node:fs'; import path from 'node:path'; import { spawnSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
import { FF, dur } from './tts.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
export const VOICE_FILE = path.join(here, 'voice', 'narration.mp3');
const DRAFT = path.join(here, 'voice', 'draft.srt');

export const SUBS = [
  [1, 3, '我对心理学很感兴趣，所以我阅读了大量荣格和阿德勒的心理学。'],
  [4, 5, '但是我也知道，他们的理论是有局限性的，'],
  [6, 7, '主观的判断很多，不一定适用于现在的心理学的理论体系。'],
  [8, 8, '我后来也读到了《行为》和《命定》'],
  [9, 10, '这样的基于神经和现代科学发展出来的心理学的论点和框架。'],
  [11, 12, '那我很好奇，到底心理学整体看上去是怎么发展的。'],
  [13, 14, '我在以前的视频节目里边，提到了《灵魂建筑师》这本书，'],
  [15, 16, '实际上那本书就提供了一个比较好的脉络：'],
  [17, 18, '从弗洛伊德开始，心理学往什么样的方向去发展。'],
  [19, 19, '当然，这仍然不是全部。'],
  [20, 21, '所以我就自己做了一个网站，给我自己提供一个阅读的体系框架。'],
  [22, 23, '这就是我今天这个视频想要说到的网站：'],
  [24, 25, 'Psychologymap，一张心理学思想地图。'],
  [26, 27, '它并不是根据我的偏好而着重渲染了荣格或者是阿德勒。'],
  [28, 29, '它呈现一个完整的心理学地图：每一个理论是怎么发展出来的，'],
  [30, 31, '它和什么样的理论体系有过交集、有过冲突，'],
  [32, 32, '最后这个理论又发展到了什么方向。'],
  [33, 34, '接下来我们一边操作，一边看怎么使用它。'],
  [35, 36, '首页是一个时间沙漏，从上往下读。'],
  [37, 39, '上半部分是源头：1879 年以前，两千多年的哲学、医学和修行传统。'],
  [40, 41, '它们在瓶颈处交汇。这一年，心理学成为一门实验科学。'],
  [42, 43, '下半部分有九条脉络，这九条脉络一路展开到今天；'],
  [44, 45, '底部是开口的，表示它还在生长。'],
  [46, 47, '按住鼠标，或者按住你的手机屏幕左右拖动，就可以旋转沙漏。'],
  [48, 49, '点击左侧的脉络的名称，这条脉络就会转到正面。'],
  [50, 51, '鼠标或者是你的手指停在那个节点上，就会看到它的简介。'],
  [52, 53, '每条脉络上的圆点越大，就代表它在大众当中越有名。'],
  [54, 55, '滚动鼠标可以放大沙漏，看清密集处的名字；'],
  [56, 56, '在手机上，你就用两个手指缩放。'],
  [57, 58, '点左下角的「展开为地图」，沙漏就会摊开成九列山脊。'],
  [59, 61, '横轴是时间；山峰越高，说明那个年代登场的重要学派越多。'],
  [62, 63, '鼠标经过山脊上的圆点，就能看到这个学派的简介。'],
  [64, 65, '上方的「标注」，可以在学派、人物和著作之间切换。'],
  [66, 68, '你想知道高度怎么来的，那就点「高度怎么算？」，这里边就有说明。'],
  [69, 70, '点击任何一个圆点，右侧就会打开它的详情。'],
  [71, 71, '以荣格的分析心理学为例。'],
  [72, 73, '最上面是它的要点，以及代表人物和代表作。'],
  [74, 75, '「评分」告诉你它的历史影响、证据状况，和在大众中的知名度。'],
  [76, 77, '同时，地图上会亮起它和其他学派的关系线：'],
  [78, 79, '这个山脉它从哪里分叉出去，又启发了什么样的学派。'],
  [80, 81, '详情里边每个名字都可以点击，你可以顺着关系一路走下去。'],
  [82, 83, '想细看一条脉络，就点击左侧的脉络名称。'],
  [84, 84, '这里把这条脉络的学派按时间分开，'],
  [85, 86, '下方列出了它们的关键理论、提出者和年份。'],
  [87, 88, '曲线下方的连线，标出学派之间的继承、分叉和反对意见。'],
  [89, 89, '顶部的色块，可以切换到其他的脉络。'],
  [90, 90, '顶部导航的「结构」主要回答一个问题：'],
  [91, 91, '今天的心理学到底由哪些部分组成。'],
  [92, 93, '一百多个学派各占一格：纵向是它在哪个层次解释人的心理，'],
  [94, 94, '横向是它主要在做什么。'],
  [95, 96, '鼠标停在一个学派上，同一条脉络的其他学派就会一起亮起。'],
  [97, 98, '上方的筛选，可以只看证据较强的，或者某一类的活动。'],
  [99, 101, '「人物」页是一条时间轴：每个人一条线，从出生到去世。'],
  [102, 102, '线上的圆点，是他提出某个理论的年份。'],
  [103, 105, '现代心理学之前的人物默认收在左侧，需要时可以展开。'],
  [106, 107, '排序可以按年代或者影响，也可以只看某一条脉络。'],
  [108, 109, '点任何一个人，就能看到他的理论和著作。'],
  [110, 111, '如果你带着一个生活里的困惑而来，就可以从「问题」开始。'],
  [112, 114, '比如「拖延」：几条脉络各自给出解释，并标记出证据是有多强的。'],
  [115, 117, '证据越强的，你阅读起来的那个文献的可信度就越高。'],
  [118, 120, '点卡片里的概念，就能跳到它的详情，看它的来历。'],
  [121, 122, '旁边还有学界的「争论」，和流传很久的「误读」。'],
  [123, 124, '知道自己想要什么的话呢，你就直接用右上角的搜索框，'],
  [125, 125, '或者按斜杠键。'],
  [126, 127, '学派、理论、人物、书和问题都能搜，中文和英文都可以。'],
  [128, 128, '比如输入「依恋」，或者是「鲍尔比（Bowlby）」。'],
  [129, 129, '选中一个结果，就会直接打开它。'],
  [130, 131, '最后是「阅读」。在「阅读路径」里输入一个理论或者学派。'],
  [132, 133, '阅读路径分成三列：先读、这个学派本身，和接着读。'],
  [134, 134, '先读，是理解它之前需要的文献；'],
  [135, 136, '接着读，是它启发出来的方向。'],
  [137, 139, '你读完了本学派的著作以后，可以沿着它启发出来的方向继续阅读下去。'],
  [140, 141, '每本书都给出豆瓣上评分最高的中文版和推荐的英文版，'],
  [142, 142, '点击就可以打开。'],
  [143, 145, '这样，你不止知道一个名字，还能知道这本书怎么找。'],
  [146, 146, '右上角还可以随时切换中文和英文。'],
  [147, 147, '最简单的用法就是三步：'],
  [148, 149, '从一个你关心的问题开始，找到解释它的理论，'],
  [150, 150, '然后再沿着阅读路径读下去。'],
  [151, 151, '祝你在这张地图上找到自己的路。'],
  [152, 152, '谢谢大家！'],
];

// script line i of each scene -> draft cue where it is spoken (first cue of the scene = scene start)
export const ANCHORS = {
  intro: [24, 26, 27, 28, 30, 33], hourglass: [35, 37, 40, 42, 46, 48, 50, 52, 54], ridge: [57, 59, 62, 64, 66],
  detail: [69, 72, 74, 76, 80], thread: [82, 84, 87, 89], structure: [90, 92, 95, 97], people: [99, 102, 103, 106, 108],
  questions: [110, 112, 118, 121], search: [123, 126, 128, 129], reading: [130, 132, 134, 140, 143], outro: [146, 147, 148, 151],
};
const FIRST = { intro: 1 }; // scene starts at its first anchor unless set here
// GAP: silence inserted inside a scene just before script line i is spoken, { scene: { line: seconds } }
export const GAP = { ridge: { 4: 2.0 } };
export const HOLD = { hourglass: 1.6, ridge: 3.0, thread: 0.8, structure: 1.6, people: 0.6, questions: 2.0, search: 2.0, outro: 1.6 };

export function cues() {
  const t = (s) => { const [h, m, x] = s.replace(',', '.').split(':'); return +h * 3600 + +m * 60 + +x; };
  const out = {};
  for (const b of fs.readFileSync(DRAFT, 'utf8').replace(/\r/g, '').split(/\n\s*\n/)) {
    const m = b.trim().match(/^(\d+)\n([\d:,]+)\s*-->\s*([\d:,]+)/); if (m) out[+m[1]] = { a: t(m[2]), z: t(m[3]) };
  }
  return out;
}

/* where each scene sits in the recording: { id, from, to, gaps:[{at, d}] } (same cuts as voicePlan) */
export function sceneMaps() {
  const C = cues(), len = dur(VOICE_FILE), order = Object.keys(ANCHORS);
  const cutBefore = (n) => { const prev = C[n - 1]; if (!prev) return 0; return prev.z < C[n].a ? (prev.z + C[n].a) / 2 : Math.max(prev.a, C[n].a - .03); };
  const first = (id) => FIRST[id] || ANCHORS[id][0];
  return order.map((id, i) => ({ id, from: i === 0 ? 0 : cutBefore(first(id)), to: order[i + 1] ? cutBefore(first(order[i + 1])) : len,
    gaps: Object.entries(GAP[id] || {}).map(([k, d]) => ({ at: cutBefore(ANCHORS[id][+k]), d })).sort((p, q) => p.at - q.at) }));
}

const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8' }); if (r.status !== 0) throw new Error(cmd + ' ' + (r.stderr || '').slice(-600)); };

/* same shape as tts.synth(): [{ id, total, timing:[{start,end,text}], wav, subs:[{start,end,text}] }], times relative to the scene */
export function voicePlan(scenes) {
  const C = cues(), len = dur(VOICE_FILE);
  const firstCue = (id) => FIRST[id] || ANCHORS[id][0];
  // cut between scenes in the middle of the pause before the scene's first cue (or just before it if there is none)
  const cutBefore = (n) => { const prev = C[n - 1]; if (!prev) return 0; return prev.z < C[n].a ? (prev.z + C[n].a) / 2 : Math.max(prev.a, C[n].a - .03); };
  const dir = path.join(here, 'voice'); const out = [];
  scenes.forEach((s, si) => {
    if (!ANCHORS[s.id] || ANCHORS[s.id].length !== s.lines.length) throw new Error(`voice: anchors for ${s.id} do not match its ${s.lines.length} lines`);
    const from = si === 0 && s.id === 'intro' ? 0 : cutBefore(firstCue(s.id));
    const order = Object.keys(ANCHORS), nextId = order[order.indexOf(s.id) + 1], to = nextId ? cutBefore(firstCue(nextId)) : len;
    const hold = HOLD[s.id] || 0, gaps = Object.entries(GAP[s.id] || {}).map(([i, d]) => ({ at: cutBefore(ANCHORS[s.id][+i]), d })).sort((p, q) => p.at - q.at);
    const total = to - from + hold + gaps.reduce((a, g) => a + g.d, 0);
    const m = (t) => t - from + gaps.filter((g) => g.at <= t + 1e-6).reduce((a, g) => a + g.d, 0); // recording time -> scene time
    const timing = ANCHORS[s.id].map((n, i) => ({ start: m(C[n].a), end: m(C[n].z), text: s.lines[i].sub }));
    const subs = SUBS.filter(([a]) => C[a].a >= from - .01 && C[a].a < to - .01).map(([a, b, text]) => ({ start: m(C[a].a), end: m(Math.min(C[b].z, to)), text }));
    const wav = path.join(dir, `scene${String(si + 1).padStart(2, '0')}.wav`), cuts = [from, ...gaps.map((g) => g.at), to];
    const parts = cuts.slice(0, -1).map((c, k) => `[s${k}]atrim=${c.toFixed(3)}:${cuts[k + 1].toFixed(3)},asetpts=PTS-STARTPTS${k < gaps.length ? `,apad=pad_dur=${gaps[k].d}` : ''}[p${k}]`);
    const fc = `[0:a]asplit=${parts.length}${parts.map((_, k) => `[s${k}]`).join('')};${parts.join(';')};${parts.map((_, k) => `[p${k}]`).join('')}concat=n=${parts.length}:v=0:a=1,apad,atrim=0:${total.toFixed(3)}[o]`;
    run(FF + 'ffmpeg', ['-y', '-v', 'error', '-i', VOICE_FILE, '-filter_complex', fc, '-map', '[o]', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);
    out.push({ id: s.id, total, timing, wav, subs });
  });
  return out;
}

/* corrected subtitles on the recording's own clock, for review: node video/voice.mjs */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const C = cues(), f = (s) => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  const used = new Set(); SUBS.forEach(([a, b]) => { for (let i = a; i <= b; i++) used.add(i); });
  const missing = Object.keys(C).map(Number).filter((n) => !used.has(n)); if (missing.length) console.warn('draft cues not covered:', missing.join(','));
  fs.writeFileSync(path.join(here, 'voice', 'subs-zh.srt'), SUBS.map(([a, b, t], i) => `${i + 1}\n${f(C[a].a)} --> ${f(C[b].z)}\n${t}\n`).join('\n'), 'utf8');
  console.log(SUBS.length + ' subtitles -> voice/subs-zh.srt');
}
