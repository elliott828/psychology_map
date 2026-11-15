# 书目抓取与匹配管线

给每本书配上中文版的豆瓣链接与评分，以及英文版的 Open Library 链接。规格见 `psymap-v2.1-spec.md` 第 5 节。

## 填写密钥（仅匹配步骤需要）

DeepSeek 密钥只从下面两处之一读取，不会写进代码、日志或缓存：

1. 环境变量：`DEEPSEEK_API_KEY`
   - PowerShell：`$env:DEEPSEEK_API_KEY = "你的密钥"`
2. 文件 `tools/.env`（已被 git 忽略）：复制 `tools/.env.example` 为 `tools/.env`，写入 `DEEPSEEK_API_KEY=你的密钥`

没有密钥时，匹配脚本打印一句说明后正常退出。

## 两条命令

```
node tools/fetch-books.mjs     # 第一步：抓取豆瓣与 Open Library 候选，存入 data/cache/（无需密钥）
node tools/match-books.mjs     # 第二步：请 DeepSeek 判定同一部著作，按规则选版本，写出 data/book-links.json
```

- 抓取每 2.5 秒一次请求、单线程，可随时中断，重跑会跳过已有缓存。遇到 403/418/429、验证码或登录页会停下，已得结果保留，请等一段时间再重跑，不要绕过。
- 检索策略：豆瓣建议接口只按书名匹配，所以只用中文主标题（`zhQuery` 去掉作者，冒号前部分）检索，无结果再用完整标题；Open Library 用英文主标题加作者姓检索，无结果再试 `q=主标题 姓`。缓存记录用了哪个变体。取前 5 个豆瓣候选，同名异书由匹配步骤按作者区分。
- 匹配脚本默认跳过 `book-links.json` 里已有的书；加 `--force` 全部重做，`--only <书的id>` 只做一本。
- 离线自测：`node tools/selftest.mjs`。

## 封面缩略图（第三步，无需密钥）

```
node tools/fetch-covers.mjs                          # 为 book-links.json 里的每本书下载封面
node tools/fetch-covers.mjs --only <书的id>          # 只做一本
node tools/fetch-covers.mjs --limit 10 --force       # 只做前 10 本；--force 忽略缓存并重新下载
```

- 中文封面：读取所选中文版的豆瓣详情页，取 `a.nbg` / `#mainpic` 里的封面地址，下载中图（`/m/`，404 时退到 `/s/`），跳过豆瓣默认占位图（`book-default`）。英文封面：读取 Open Library 作品记录，取 `covers` 里第一个正数 id，下载 `-M.jpg`；`covers.openlibrary.org` 可能转到 `archive.org`，只跟随这一种跳转。小于 1000 字节或不是图片的响应视为没有封面。
- 输出：`covers/<书的id>.zh.jpg`、`covers/<书的id>.en.jpg`（与 HTML 同级的文件夹，需随页面一起发布），以及只列出实际存在文件的 `data/covers.json`。查到的图片地址与“没有封面”的结果缓存在 `data/cache/covers/`，重跑不会重复请求；已有的图片文件会跳过。
- 礼貌规则：单线程、同一时间只跑一个进程；`User-Agent` 为 `psymap-book-lookup/0.1`；不带 Cookie，不带 Referer，不伪造任何请求头；请求 `book.douban.com` 间隔不少于 2.5 秒，其余主机不少于 1 秒。遇到 403/418/429、验证码或登录页，该主机在本次运行中不再请求（不重试、不绕过），另一主机继续，结束时会列出被拒的主机。进度写入 `tools/covers.log`。
- 构建：`node build.js` 读取 `data/covers.json`（可缺省），只接受形如 `covers/xxx.jpg|jpeg|png|webp` 的相对路径，其余丢弃并给出警告，合并为 `D.bookCovers[id] = { zh?, en? }`（与 `bookLinks` 分开，封面不依赖链接是否存在）；构建摘要行打印 `covers: N`。页面中文界面先用中文封面再用英文封面，英文界面相反；没有封面时不显示图片，也不留空位。
- `--no-zh`：只下载英文封面，完全不访问 `book.douban.com` 与 `doubanio.com`（豆瓣图片主机曾返回 418 时使用）。
- 繁体版：`book-links.json` 中 `zh.script` 为 `"hant"` 的中文版，在中文版标签旁显示“繁體”（英文界面显示 Trad.）。
