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
