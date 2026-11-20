# 使用讲解视频

`psychologymap-guide.mp4`：网站使用讲解，中文界面、中文配音，约 5 分钟。画面全部是对真实页面的录屏，鼠标指针、点击波纹和青色高亮框是录制时叠加上去的；字幕放在画面下方单独的字幕条里，不遮挡页面。配套字幕文件为 `psychologymap-guide.srt`。

## 重新生成

需要 Windows（中文语音用系统自带的 OneCore 语音 Huihui）、Microsoft Edge、Node 18 以上和 ffmpeg（需带 libass）。

```powershell
$env:FFMPEG_DIR = "C:\path\to\ffmpeg\bin"   # ffmpeg 已在 PATH 中时可省略
node build.js                                # 先构建页面
node video/record.mjs                        # 合成配音 → 实时录屏 → 输出 mp4 与 srt
```

- `script.mjs`：讲解稿和每一场的页面操作，改视频只需要改这个文件。
  - `lines`：每一行字幕。`sub` 是屏幕上显示的文字；`say` 是交给语音合成的文字（例如把 1879 写成"一八七九"）；`p` 是这一行念完后额外停顿的秒数。
  - `run(A)`：这一场的操作，用 `await A.at(行号, 偏移秒)` 对齐到某一句话的开始。可用的操作有 `clickSel`、`hoverSel`、`drag`、`wheel`、`type`、`key`、`hl`、`hlSel`、`closePanel` 等，定义在 `record.mjs` 里。
- `tts.mjs`：逐行合成语音并缓存在 `tts/`，只有改动过的行才会重新合成。可以用 `VOICE`、`RATE` 环境变量换音色、调语速。
- `record.mjs`：用无头 Edge 打开构建好的页面（1920×960），通过 DevTools 协议实时截屏并执行操作；页面下方留出 120px 的字幕条，最后用 ffmpeg 合成 1920×1080、30fps 的视频。
- 辅助工具：
  - `stills.mjs`：从视频里截取指定秒数的静帧，存进 `qa/` 供检查。
  - `probe.mjs`：给某个路由的页面截一张图。
  - `findglass.mjs`：在沙漏上逐点扫描，找出每个节点的屏幕坐标（沙漏是画在 canvas 上的，没有 DOM 元素可以定位）。

## 用真人录音

`node video/record.mjs --voice` 用 `voice/` 里的录音代替合成语音（录音文件本身不进仓库）：

- `voice/narration.mp3`：整段录音。
- `voice/draft.srt`：录音的自动字幕粗稿，只用它的时间轴；序号就是 `voice.mjs` 里引用的编号。
- `voice.mjs`：
  - `SUBS`：校对后的字幕文字，每条注明对应粗稿的第几到第几条。
  - `ANCHORS`：每一场讲解稿的每一行，对应录音里第几条字幕开始说，画面操作据此对齐。
  - `HOLD`：画面操作比讲话长的场景，在场景末尾补几秒静音。
- 换一版录音时，替换这两个文件，再按新粗稿的编号更新 `SUBS` 和 `ANCHORS`。`node video/voice.mjs` 会输出 `voice/subs-zh.srt`，供核对字幕；如果有粗稿条目没被字幕覆盖，它会提示。

## B-roll 与背景音乐

`node video/broll.mjs` 在已经渲染好的配音版视频上叠加 B-roll 和背景音乐，输出 `psychologymap-guide-broll.mp4`，不需要重新录屏：

- 开场 6 张全屏幻灯片（人物、往期书封、《行为》《命定》、心理学发展时间线、《灵魂建筑师》、从弗洛伊德开始），只覆盖页面区域，字幕条保持可见；讲到 1879 年时右上角出现冯特实验室的小卡片。幻灯片写在 `broll.mjs` 的 `SLIDES` 里，用无头 Edge 渲染成图片（`broll/build/`，不进仓库）。
- 出现时间用录音粗稿的字幕编号指定（`FULL`、`PIP`），再根据上一次渲染的 `marks.json` 和 `voice.mjs` 换算成视频时间。
- 背景音乐 `broll/assets/music.ogg`：Satie《Gymnopédie No.1》公共领域录音，首尾交叉淡入接长；响度归一到 -26 LUFS，说话时自动压低。
- 素材来源与署名见 `broll/素材来源.md`。`node video/broll.mjs --slides` 只渲染幻灯片，用于检查版式。
