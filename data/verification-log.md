# 核对记录

日期：2026-11-15。范围：build-spec A2（核对原先 confidence 非 high 的节点与关系）以及 A1 新增内容。

## 方法与局限

- 有联网。使用：网页检索与抓取，以及 Wikidata、英文维基百科（wikitext）、Crossref、Open Library 的公开接口。只发送人名、书名、论文题名、年份等通用检索词。
- “high”表示至少有一个来源与我方记录相符（人物：维基数据条目的生卒年与我方一致；论文：Crossref 记录的题名、作者、年份一致；书：Open Library 或维基条目一致；理论：英文维基条目中同时出现年份与提出者，或有一手记录）。关系的 high 只表示其事实基础有来源支持，关系类型与方向仍是人的判断。
- 英文维基与维基数据本身不是一手来源；凡是只能取得再版记录（章节再版、期刊再刊）的，在“来源”栏里已注明。
- 中文书名：没有可靠的中文图书目录可查。凡未能确认通行中译名的书，在 summary 末尾写“中译名未核实，此处中文题名为直译或沿用旧数据。”（比规格要求的“暂无通行中译名”措辞更谨慎，因为没有证据表明“不存在”）。只有明确查不到中译本、并做过检索的几本写“暂无通行中译名”。
- 没有改动 psychologymap-skeleton.js，也没有改动 data/ 以外的任何文件。

## 一、与框架文档不一致

数据里的年份没有因核对而偏离框架（validate.js 仍逐条校验骨架年份）。下列是需要设计者改框架文档或做决定的地方：

1. **cognitive-neuroscience（框架 1979，标 ⚠）**：找不到 1979 的出处。认知神经科学学会称这一名称诞生于“1970 年代末”的纽约出租车里（加扎尼加与乔治·米勒）；一处二手来源写 1978。数据保留 1979 并标 medium。建议框架改写为“1970 年代末”，标志年处理成“约 1978–1979”或改用有明确日期的事件（例如 1982 年首届认知神经科学会议、1989 年《认知神经科学杂志》创刊——这两项未在本次核对）。来源：https://www.cogneurosociety.org/background/ ，https://www.wikiwand.com/en/articles/Michael_S._Gazzaniga
2. **abcd（框架 2015）**：2015 是资助启动年，儿童招募在 2016–2018 年，有综述写“2016 年秋启动”。数据保留 2015，标 medium。来源：https://docs.abcdstudy.org/latest/study/ ，https://pmc.ncbi.nlm.nih.gov/articles/PMC10757308
3. **“进行中”的成员与框架正文不符**：框架 2.7 把 23 条近年条目都称为 2010 年以后登场，但其中 reward-prediction（1997）、self-compassion（2003）、neuropsychoanalysis（2000）早于 2010，校验规则要求它们是“已成型”；反过来 predictive-processing（2010）、open-science（2011）、dimensional（2010）在 2.4 骨架里，却是“进行中”。所以数量碰巧仍是 99 与 23，但成员与 2.4/2.7 的分法不同。建议框架正文改成按年份划分的说法。
4. **书的数量下限**：框架 3.4 写“每条脉络 ≥ 8 本”，build-spec A1 写“≥ 12 本”。validate.js 按 12 本执行。
5. **框架 2.5 带 ⚠ 的两条关系**：morita → third-wave（有英文维基对重合点的论述，已升为 high）；psychopharmacology → dsm（英文维基称统一诊断标准是为便于药物监管，并提到 Feighner/RDC 的影响，但没有直接说明“药物试验推动了 DSM-III”，保持 medium）。
6. **框架 2.6 的年份**：weber（1834）与 volkerpsychologie（1860）的具体年份英文维基未载，沿用框架；buddhist、hippocrates 为约数。

## 二、事实有改动的条目

- 人物 trivers（Robert Trivers）：补充卒年 2026（https://www.wikidata.org/wiki/Q918334（英文维基：Robert Trivers））
- 人物 ekman（Paul Ekman）：补充卒年 2025（https://www.wikidata.org/wiki/Q355527（英文维基：Paul Ekman））
- 人物 dayan：生年 null → 1965（https://www.wikidata.org/wiki/Q7173587（英文维基：Peter Dayan））
- 人物 bransford：生年 null → 1943（https://www.wikidata.org/wiki/Q6228105（英文维基：John D. Bransford））
- 人物 bransford（John Bransford）：补充卒年 2022（https://www.wikidata.org/wiki/Q6228105（英文维基：John D. Bransford））
- 人物 simon（Theodore Simon）：生年 1872 → 1873（https://www.wikidata.org/wiki/Q969139（英文维基：Théodore Simon））
- 人物 goldberg（Lewis Goldberg）：补充卒年 2026（https://www.wikidata.org/wiki/Q1822099（英文维基：Lewis Goldberg））
- 人物 vroom（Victor Vroom）：补充卒年 2023（https://www.wikidata.org/wiki/Q1971933（英文维基：Victor Vroom））
- 人物 yang-kuo-shu（Kuo-Shu Yang）：补充卒年 2018（https://www.wikidata.org/wiki/Q9298773（英文维基：Yang Kuo-shu））
- 人物 kitayama：生年 null → 1957（https://www.wikidata.org/wiki/Q60751878（英文维基：Shinobu Kitayama））
- 人物 deci（Edward Deci）：补充卒年 2026（https://www.wikidata.org/wiki/Q5344000（英文维基：Edward L. Deci））
- 人物 clark（David M. Clark）：生年 1955 → 1954（https://www.wikidata.org/wiki/Q5236904（英文维基：David M. Clark））
- 人物 foa（Edna Foa）：补充卒年 2026（https://www.wikidata.org/wiki/Q5340017（英文维基：Edna Foa））
- 人物 resick：生年 null → 1950（https://www.wikidata.org/wiki/Q58148667（英文维基：Patricia Resick））
- 人物 linehan（Marsha Linehan）：补充卒年 2026（https://www.wikidata.org/wiki/Q274156（英文维基：Marsha M. Linehan））
- 人物 segal：生年 null → 1956（https://www.wikidata.org/wiki/Q8072351（英文维基：Zindel Segal））
- 人物 williams-mark：生年 null → 1952（https://www.wikidata.org/wiki/Q6106462（英文维基：J. Mark G. Williams））
- 人物 teasdale：生年 null → 1950（https://www.wikidata.org/wiki/Q6228338（英文维基：John D. Teasdale））
- 人物 krueger：生年 null → 1950（https://www.wikidata.org/wiki/Q49637177（英文维基：Robert F. Krueger））
- 人物 caspi：生年 null → 1960（https://www.wikidata.org/wiki/Q25506911（英文维基：Avshalom Caspi））
- 书 dep-w-dream-monk：去掉关联理论 sandplay（该书讲明惠的梦日记，与沙盘游戏无关）
- 理论 diathesis-stress：标志事件的论文题目由“精神分裂症：一个脆弱性模型”改为“脆弱性：看待精神分裂症的新视角”（据 https://doi.org/10.1037/e544502009-010 的题名记录）
- 理论 scaffolding：提出者去掉维果茨基（该术语出自伍德、布鲁纳与罗斯 1976；维果茨基的“最近发展区”是思想来源，已由 zone-of-proximal-development 承担）
- 理论 compassion-focused：提出者去掉内夫（自我关怀是另一条线）；证据档位 moderate → limited，使其与“多为小样本研究”的说明一致
- 理论 three-laws-behavior-genetics：提出者补入特克海默（2000 年论文作者；普洛明与布沙尔为相关研究的代表）
- 理论 empirically-supported-treatments：提出者补入钱布利斯
- 书 dif-w-why-we-differ：年份 null → 2023；英文名注明为意译（原书为中文著作）
- 书 dif-w-quiet：书名：内向者优势 → 内向性格的竞争力
- 书 soc-w-geography-thought：书名：思维的地理 → 思维版图
- 书 soc-w-culture-self：类型：论文集 → 单篇论文；中文题名与角色相应调整
- 书 dep-w-soul-architects：年份 null → 2024；书名更正为原版 Seelenzauber（英文版名 Soul Magic）
- 书 dep-w-dream-monk：书名：高山寺的梦僧 / The Dream Monk of Kosenji → 明惠：活在梦中的僧人 / The Buddhist Priest Myōe: A Life of Dreams
- 理论 weird-samples：所属学派 cultural → weird（骨架 2.7 中 weird 是独立条目，原先它下面没有理论）

另：以下条目的类型或归属有调整，见“新增”说明：weird-samples 理论改归 weird 学派；soc-w-righteous-mind 增挂 moral-foundations；cli-w-icd-11-cdddr 增挂 icd-11；haidt、neff、nosek、herman、dayan、hayes、henrich 各增挂一个新学派。

## 三、删除的条目

没有删除。两本有疑问的书都找到了存在的证据，已更正后保留：

- dif-w-why-we-differ：确有其书，是王芳（北京师范大学）的中文原创著作，理想国·北京日报出版社 2023 年 7 月；年份补为 2023。
- dep-w-soul-architects：确有其书，是 Steve Ayan 的《Seelenzauber》（dtv，2024），英文版《Soul Magic: A Century of Psychotherapy》；年份补为 2024，书名更正。

## 四、新增与数量变化

| 类型 | 之前 | 之后 |
|---|---|---|
| school | 122 | 122 |
| theory | 230 | 253 |
| person | 277 | 310 |
| concept | 92 | 138 |
| work | 131 | 185 |
| application | 7 | 7 |
| edges | 193 | 193 |
| roots | 20 | 20 |

confidence 分布（节点）：之前 high 585 / medium 246 / low 28；之后 high 954 / medium 40 / low 21。关系：之前 high 137 / medium 56；之后 high 166 / medium 27。

## 五、仍未能核实的项目

- schildkraut（Joseph Schildkraut）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1934（medium）
- dolan（Ray Dolan）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- costa（Paul Costa）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1942（medium）
- roberts（Brent Roberts）：Wikidata 记为 1950 年，英文维基条目无出生日期，无法互证；保持 null。
- simmons（Joseph Simmons）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- nelson（Leif Nelson）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- simonsohn（Uri Simonsohn）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- nosek（Brian Nosek）：Wikidata 记为 1950 年生，明显有误（与其学术生涯不符）；英文维基无出生日期。保持 1973 但降为 low。
- hazan（Cindy Hazan）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- shaver（Phillip Shaver）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- wimmer（Heinz Wimmer）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- perner（Josef Perner）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- saffran（Jenny Saffran）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- hwang（Kwang-Kuo Hwang）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1945（medium）
- goodman（Paul Goodman）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1911（medium）
- greenberg-leslie（Leslie Greenberg）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1945（medium）
- brickman（Philip Brickman）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1941（medium）
- bateman（Anthony Bateman）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- bordin（Edward Bordin）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1913（medium）
- jacobson（Neil Jacobson）：未在维基数据/英文维基找到可用的生卒年记录，保留原值 1949（medium）
- meyer（Victor Meyer）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- tedeschi（Richard Tedeschi）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- cuthbert（Bruce Cuthbert）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- kotov（Roman Kotov）：未在维基数据/英文维基找到可用的生卒年记录，生年保持 null
- abcd：2015（资助/启动）与 2016（招募开始）两种说法并存，建议设计者决定是否在界面写成“2015 启动，2016–2018 招募”
- cognitive-neuroscience：1979 无法证实（来源仅称“1970 年代末”，一处称 1978）；已保留框架年份，需设计者决定是否改写为“1970 年代末”
- 理论 chomsky-review：1959 年《语言》杂志书评；联网未专门核对
- 理论 identity-statuses：马西亚 1966（JPSP）；联网只检到 1993 年再版，未取得原文记录
- 理论 did-model：普特南 1989 年《多重人格障碍的诊断与治疗》；条目只提到年份，未取得更多记录
- 理论 sandplay：卡尔夫《沙盘游戏》1966 年；英文维基条目未载年份与作者细节，未取得一手记录
- 理论 scientist-practitioner：1949 年博尔德会议；联网未专门核对
- 理论 diathesis-stress：祖宾与斯普林 1977 年《脆弱性：看待精神分裂症的新视角》；联网只检到 1975 年的预印本记录（PsycEXTRA），1977 年刊出版本未取得，保留 medium
- 理论 panic-cognitive-model：克拉克 1986《惊恐的认知模型》（Behaviour Research and Therapy）：作者与模型内容可由多处二手文献互证，但 1986 年份未在联网核对中取得一手记录
- 理论 empirically-supported-treatments：钱布利斯等 1998 年更新清单；联网未取得对应一手记录
- 理论 ebpp-three-component：APA 2006 年循证实践声明（American Psychologist 61）；联网未能取得一手记录
- 书 cli-w-icd-11-cdddr：世界卫生组织《ICD-11 精神、行为与神经发育障碍：临床描述与诊断要点》；Open Library 无记录，2024 年份未取得一手记录，保留 medium
- 书 cli-w-rdoc-matrix：RDoC 框架 2010 年由 Insel 等发表（Am J Psychiatry）；“RDoC 矩阵”作为网页资源的发布年份未单独核对，保留 medium
- 关系 cognitive-neuroscience>affective-neuroscience（develops）：解释性判断，无直接来源，保持 medium
- 关系 evolutionary>affective-neuroscience（bridges）：解释性判断，无直接来源，保持 medium
- 关系 psychopharmacology>affective-neuroscience（develops）：解释性判断，无直接来源，保持 medium
- 关系 neo-behaviorism>social-learning（develops）：解释性判断，无直接来源，保持 medium
- 关系 classical-conditioning>learned-helplessness（develops）：解释性判断，无直接来源，保持 medium
- 关系 behavior-therapy>aba（bridges）：解释性判断，无直接来源，保持 medium
- 关系 functionalism>cognitive-psychology（bridges）：解释性判断，无直接来源，保持 medium
- 关系 cognitive-psychology>heuristics-biases（develops）：解释性判断，无直接来源，保持 medium
- 关系 connectionism>predictive-processing（develops）：解释性判断，无直接来源，保持 medium
- 关系 embodied>predictive-processing（bridges）：解释性判断，无直接来源，保持 medium
- 关系 g-factor>intelligence-testing（bridges）：解释性判断，无直接来源，保持 medium
- 关系 psychosocial>lifespan（develops）：解释性判断，无直接来源，保持 medium
- 关系 ecological>lifespan（bridges）：解释性判断，无直接来源，保持 medium
- 关系 field-theory>conformity-obedience（develops）：解释性判断，无直接来源，保持 medium
- 关系 dissonance>social-cognition（develops）：解释性判断，无直接来源，保持 medium
- 关系 prejudice>social-identity（develops）：解释性判断，无直接来源，保持 medium
- 关系 indigenous>cultural（develops）：解释性判断，无直接来源，保持 medium
- 关系 weird-samples>social-cognition（critiques）：解释性判断，无直接来源，保持 medium
- 关系 needs>sdt（bridges）：解释性判断，无直接来源，保持 medium
- 关系 logotherapy>positive（develops）：解释性判断，无直接来源，保持 medium
- 关系 relational>mentalization（bridges）：解释性判断，无直接来源，保持 medium
- 关系 clinical-psychology>common-factors（bridges）：解释性判断，无直接来源，保持 medium
- 关系 common-factors>ebp（bridges）：解释性判断，无直接来源，保持 medium
- 关系 diathesis-stress>dimensional（bridges）：解释性判断，无直接来源，保持 medium
- 关系 working-memory-model>app-human-factors（applies）：解释性判断，无直接来源，保持 medium
- 关系 cbt>app-self-help（applies）：解释性判断，无直接来源，保持 medium
- 关系 psychopharmacology>dsm（bridges）：解释性判断，无直接来源，保持 medium
- 新增人物 sullivan-patrick（Patrick F. Sullivan）：生年未能核实，保持 null/low
- 新增人物 turkheimer（Eric Turkheimer）：生年未能核实，保持 null/low
- 新增人物 darcy（Alison Darcy）：生年未能核实，保持 null/low
- 新增人物 lomas（Tim Lomas）：生年未能核实，保持 null/low
- 新增人物 shedler（Jonathan Shedler）：生年未能核实，保持 null/low
- 新增理论 symptom-network-theory：年份来自引用惯例，未取得一手记录
- 新增理论 many-labs：Klein 等 2014，Social Psychology；联网只取得配套数据论文
- 新增理论 dual-systems-model：Steinberg 2008, Developmental Review；Casey 等 2008 同年；联网只取得再版记录
- 新增理论 unified-protocol-model：版权页年份 2011，Open Library 记 2010 年末，取 2011
- 新增书 bio-w-advice-young-investigator：https://openlibrary.org/search?q=advice+for+a+young+investigator+cajal（英译本 1999；西班牙文原版 1897 为公认书目信息，未在线取得一手记录）
- 新增书 bhv-w-aba-cooper：https://openlibrary.org/search?q=applied+behavior+analysis+cooper+heron+heward（初版 1987 年，未在线取得一手记录）
- 新增书 bhv-w-reinforcement-learning：https://openlibrary.org/search?q=reinforcement+learning+an+introduction+sutton（初版 1998 年，未在线取得一手记录）
- 新增书 cog-w-elements-psychophysics：https://openlibrary.org/search?q=elements+of+psychophysics+fechner（英译本 1966；德文 1860 为公认书目信息）
- 新增书 cog-w-principles-physiological-psychology：https://openlibrary.org/search?q=principles+of+physiological+psychology+wundt（英译本 1904；德文 1873–74 为公认书目信息）
- 新增书 dev-w-abcd-imaging-acquisition：（题名据 Casey 等 2018，Dev Cogn Neurosci；联网未直接取得该条记录，同刊的 Volkow 等 2018 篇见 https://doi.org/10.1016/j.dcn.2017.10.002）
- 新增书 dep-w-ego-mechanisms-defence：https://openlibrary.org/search?q=ego+and+the+mechanisms+of+defence（英译本 1937；德文 1936 为公认书目信息）
- 新增书 cli-w-clinical-psychology-witmer：《心理诊所》创刊号 1907，据心理学史公认引用；联网只检到 1996 年的同名期刊，未取得原文记录
- 新增书 cli-w-morita-nature-therapy：英文维基载其专著 1928 年；中文题名“神经质的本态与疗法”为对日文原题的直译
- 新增书 cli-w-need-new-medical-model：Science 196, 1977；联网只取得 1978 年的再版章节 https://doi.org/10.1016/b978-0-409-95009-0.50006-1
- 新增书 cli-w-cognitive-therapy-basics：初版 1995 年，Open Library 无初版记录，未取得一手记录
- 新增书 cli-w-division12-task-force：The Clinical Psychologist 48(1)，1995；联网未取得一手记录
- 新增书 cli-w-ebpp-statement：American Psychologist 61(4)，2006；联网未取得一手记录
- 新增书 cli-w-unified-protocol-guide：https://openlibrary.org/search?q=unified+protocol+barlow（版权页 2011，OL 记 2010）
- 新增人物 hippocrates-of-cos、epictetus：生卒年只有约数，born 保持 null、confidence 为 low
- 源头 confucian-daoist：没有找到可与“先秦”“心性修养”互证的在线来源，仅为通行概括
- 源头 weber（1834）、volkerpsychologie（1860）：英文维基条目没有记载具体年份，沿用框架年份
- 源头 buddhist（约公元前 5 世纪起）、hippocrates（约公元前 400 年）：年代为约数，各来源有出入，沿用框架

## 六、逐项记录

每行：节点 id｜核对了什么｜结论｜来源（名称与网址）。来源缩写：维基数据 = https://www.wikidata.org/wiki/Q…；DOI = https://doi.org/…；OL = Open Library 搜索页。

### person

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| geschwind | 生卒年 | 1926–1984 → 1926–1984，与来源一致 | https://www.wikidata.org/wiki/Q322772（英文维基：Norman Geschwind） |
| shelley-taylor | 生卒年 | 1946 → 1946，与来源一致 | https://www.wikidata.org/wiki/Q769477（英文维基：Shelley E. Taylor） |
| bliss | 生卒年 | 1940 → 1940，与来源一致 | https://www.wikidata.org/wiki/Q7807064（英文维基：Timothy Bliss） |
| lomo | 生卒年 | 1935 → 1935，与来源一致 | https://www.wikidata.org/wiki/Q15088330（英文维基：Terje Lømo） |
| schildkraut | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| milner | 生卒年 | 1918 → 1918，与来源一致 | https://www.wikidata.org/wiki/Q468228（英文维基：Brenda Milner） |
| squire | 生卒年 | 1941 → 1941，与来源一致 | https://www.wikidata.org/wiki/Q1128088（英文维基：Larry Squire） |
| plomin | 生卒年 | 1948 → 1948，与来源一致 | https://www.wikidata.org/wiki/Q3401334（英文维基：Robert Plomin） |
| bouchard | 生卒年 | 1937 → 1937，与来源一致 | https://www.wikidata.org/wiki/Q7791023（英文维基：Thomas J. Bouchard Jr.） |
| bogen | 生卒年 | 1926–2005 → 1926–2005，与来源一致 | https://www.wikidata.org/wiki/Q1475720（英文维基：Joseph Bogen） |
| koch | 生卒年 | 1956 → 1956，与来源一致 | https://www.wikidata.org/wiki/Q1084303（英文维基：Christof Koch） |
| trivers | 生卒年 | 1943 → 1943–2026，与来源一致（已改动） | https://www.wikidata.org/wiki/Q918334（英文维基：Robert Trivers） |
| cosmides | 生卒年 | 1957 → 1957，与来源一致 | https://www.wikidata.org/wiki/Q451962（英文维基：Leda Cosmides） |
| tooby | 生卒年 | 1952–2023 → 1952–2023，与来源一致 | https://www.wikidata.org/wiki/Q1701956（英文维基：John Tooby） |
| buss | 生卒年 | 1953 → 1953，与来源一致 | https://www.wikidata.org/wiki/Q1173874（英文维基：David Buss） |
| ledoux | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q707263（英文维基：Joseph E. LeDoux） |
| ekman | 生卒年 | 1934 → 1934–2025，与来源一致（已改动） | https://www.wikidata.org/wiki/Q355527（英文维基：Paul Ekman） |
| barrett | 生卒年 | 1963 → 1963，与来源一致 | https://www.wikidata.org/wiki/Q6557970（英文维基：Lisa Feldman Barrett） |
| sapolsky | 生卒年 | 1957 → 1957，与来源一致 | https://www.wikidata.org/wiki/Q3118802（英文维基：Robert Sapolsky） |
| rescorla | 生卒年 | 1940–2020 → 1940–2020，与来源一致 | https://www.wikidata.org/wiki/Q2305479（英文维基：Robert A. Rescorla） |
| wagner | 生卒年 | 1934–2018 → 1934–2018，与来源一致 | https://www.wikidata.org/wiki/Q4730929（英文维基：Allan R. Wagner） |
| garcia | 生卒年 | 1917–2012 → 1917–2012，与来源一致 | https://www.wikidata.org/wiki/Q6234845（英文维基：John Garcia (psychologist)） |
| ferster | 生卒年 | 1922–1981 → 1922–1981，与来源一致 | https://www.wikidata.org/wiki/Q5077640（英文维基：Charles Ferster） |
| herrnstein | 生卒年 | 1930–1994 → 1930–1994，与来源一致 | https://www.wikidata.org/wiki/Q1689788（英文维基：Richard Herrnstein） |
| baer | 生卒年 | 1931–2002 → 1931–2002，与来源一致 | https://www.wikidata.org/wiki/Q5294000（英文维基：Donald M. Baer） |
| wolf | 生卒年 | 1935–2004 → 1935–2004，与来源一致 | https://www.wikidata.org/wiki/Q6906511（英文维基：Montrose Wolf） |
| risley | 生卒年 | 1937–2007 → 1937–2007，与来源一致 | https://www.wikidata.org/wiki/Q91191676（英文维基：Todd Risley） |
| atkinson | 生卒年 | 1929 → 1929，与来源一致 | https://www.wikidata.org/wiki/Q503888（英文维基：Richard C. Atkinson） |
| shiffrin | 生卒年 | 1942 → 1942，与来源一致 | https://www.wikidata.org/wiki/Q7329020（英文维基：Richard Shiffrin） |
| baddeley | 生卒年 | 1934 → 1934，与来源一致 | https://www.wikidata.org/wiki/Q575287（英文维基：Alan Baddeley） |
| gigerenzer | 生卒年 | 1947 → 1947，与来源一致 | https://www.wikidata.org/wiki/Q108184（英文维基：Gerd Gigerenzer） |
| loftus | 生卒年 | 1944 → 1944，与来源一致 | https://www.wikidata.org/wiki/Q262154（英文维基：Elizabeth Loftus） |
| schacter | 生卒年 | 1952 → 1952，与来源一致 | https://www.wikidata.org/wiki/Q369879（英文维基：Daniel Schacter） |
| mcclelland | 生卒年 | 1948 → 1948，与来源一致 | https://www.wikidata.org/wiki/Q93125（英文维基：James McClelland (psychologist)） |
| pinker | 生卒年 | 1954 → 1954，与来源一致 | https://www.wikidata.org/wiki/Q212730（英文维基：Steven Pinker） |
| lakoff | 生卒年 | 1941 → 1941，与来源一致 | https://www.wikidata.org/wiki/Q313772（英文维基：George Lakoff） |
| varela | 生卒年 | 1946–2001 → 1946–2001，与来源一致 | https://www.wikidata.org/wiki/Q923582（英文维基：Francisco Varela） |
| rosch | 生卒年 | 1938 → 1938，与来源一致 | https://www.wikidata.org/wiki/Q132475（英文维基：Eleanor Rosch） |
| friston | 生卒年 | 1959 → 1959，与来源一致 | https://www.wikidata.org/wiki/Q6371926（英文维基：Karl J. Friston） |
| dayan | 生卒年 | null → 1965，与来源一致（已改动） | https://www.wikidata.org/wiki/Q7173587（英文维基：Peter Dayan） |
| dolan | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q110234965 |
| bransford | 生卒年 | null → 1943–2022，与来源一致（已改动） | https://www.wikidata.org/wiki/Q6228105（英文维基：John D. Bransford） |
| ann-brown | 生卒年 | 1943–1999 → 1943–1999，与来源一致 | https://www.wikidata.org/wiki/Q1017265（英文维基：Ann Brown） |
| carroll | 生卒年 | 1916–2003 → 1916–2003，与来源一致 | https://www.wikidata.org/wiki/Q132336（英文维基：John Bissell Carroll） |
| simon | 生卒年 | 1872–1961 → 1873–1961，与来源一致（已改动） | https://www.wikidata.org/wiki/Q969139（英文维基：Théodore Simon） |
| stern | 生卒年 | 1871–1938 → 1871–1938，与来源一致 | https://www.wikidata.org/wiki/Q57347（英文维基：William Stern (psychologist)） |
| flynn | 生卒年 | 1934–2020 → 1934–2020，与来源一致 | https://www.wikidata.org/wiki/Q1383120（英文维基：James Flynn (academic)） |
| rasch | 生卒年 | 1901–1980 → 1901–1980，与来源一致 | https://www.wikidata.org/wiki/Q325895（英文维基：Georg Rasch） |
| gardner | 生卒年 | 1943 → 1943，与来源一致 | https://www.wikidata.org/wiki/Q176515（英文维基：Howard Gardner） |
| sternberg | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q362357（英文维基：Robert Sternberg） |
| costa | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| mccrae | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q16732259（英文维基：Robert R. McCrae） |
| goldberg | 生卒年 | 1932 → 1932–2026，与来源一致（已改动） | https://www.wikidata.org/wiki/Q1822099（英文维基：Lewis Goldberg） |
| roberts | 生卒年 | Wikidata 记为 1950 年，英文维基条目无出生日期，无法互证；保持 null。 | https://www.wikidata.org/wiki/Q47568713 |
| simmons | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q742642 |
| nelson | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| simonsohn | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q24259798 |
| nosek | 生卒年 | Wikidata 记为 1950 年生，明显有误（与其学术生涯不符）；英文维基无出生日期。保持 1973 但降为 low。 | https://www.wikidata.org/wiki/Q22096791 |
| ioannidis | 生卒年 | 1965 → 1965，与来源一致 | https://www.wikidata.org/wiki/Q6251482（英文维基：John Ioannidis） |
| bem | 生卒年 | 1938 → 1938，与来源一致 | https://www.wikidata.org/wiki/Q1166994（英文维基：Daryl Bem） |
| bruner | 生卒年 | 1915–2016 → 1915–2016，与来源一致 | https://www.wikidata.org/wiki/Q114867（英文维基：Jerome Bruner） |
| marcia | 生卒年 | 1937 → 1937，与来源一致 | https://www.wikidata.org/wiki/Q6138908（英文维基：James Marcia） |
| hazan | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q137708828 |
| shaver | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| gilligan | 生卒年 | 1936 → 1936，与来源一致 | https://www.wikidata.org/wiki/Q284025（英文维基：Carol Gilligan） |
| baumrind | 生卒年 | 1927–2018 → 1927–2018，与来源一致 | https://www.wikidata.org/wiki/Q446567（英文维基：Diana Baumrind） |
| premack | 生卒年 | 1925–2015 → 1925–2015，与来源一致 | https://www.wikidata.org/wiki/Q1176168（英文维基：David Premack） |
| wimmer | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| perner | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| baron-cohen | 生卒年 | 1958 → 1958，与来源一致 | https://www.wikidata.org/wiki/Q918343（英文维基：Simon Baron-Cohen） |
| baillargeon | 生卒年 | 1954 → 1954，与来源一致 | https://www.wikidata.org/wiki/Q7312966（英文维基：Renée Baillargeon） |
| spelke | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q3051273（英文维基：Elizabeth Spelke） |
| saffran | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q6179459 |
| gopnik | 生卒年 | 1955 → 1955，与来源一致 | https://www.wikidata.org/wiki/Q2647225（英文维基：Alison Gopnik） |
| meltzoff | 生卒年 | 1950 → 1950，与来源一致 | https://www.wikidata.org/wiki/Q4758101（英文维基：Andrew N. Meltzoff） |
| kuhl | 生卒年 | 1946 → 1946，与来源一致 | https://www.wikidata.org/wiki/Q7145662（英文维基：Patricia K. Kuhl） |
| schein | 生卒年 | 1928–2023 → 1928–2023，与来源一致 | https://www.wikidata.org/wiki/Q116375（英文维基：Edgar Schein） |
| vroom | 生卒年 | 1932 → 1932–2023，与来源一致（已改动） | https://www.wikidata.org/wiki/Q1971933（英文维基：Victor Vroom） |
| cialdini | 生卒年 | 1945 → 1945，与来源一致 | https://www.wikidata.org/wiki/Q1198516（英文维基：Robert Cialdini） |
| zimbardo | 生卒年 | 1933–2024 → 1933–2024，与来源一致 | https://www.wikidata.org/wiki/Q296042（英文维基：Philip Zimbardo） |
| darley | 生卒年 | 1938–2018 → 1938–2018，与来源一致 | https://www.wikidata.org/wiki/Q954369（英文维基：John M. Darley） |
| latane | 生卒年 | 1937 → 1937，与来源一致 | https://www.wikidata.org/wiki/Q4902973（英文维基：Bibb Latané） |
| adorno | 生卒年 | 1903–1969 → 1903–1969，与来源一致 | https://www.wikidata.org/wiki/Q152388（英文维基：Theodor W. Adorno） |
| steele | 生卒年 | 1946 → 1946，与来源一致 | https://www.wikidata.org/wiki/Q5129029（英文维基：Claude Steele） |
| aronson | 生卒年 | 1932 → 1932，与来源一致 | https://www.wikidata.org/wiki/Q449733（英文维基：Elliot Aronson） |
| greenwald | 生卒年 | 1939 → 1939，与来源一致 | https://www.wikidata.org/wiki/Q573305（英文维基：Anthony Greenwald） |
| ross | 生卒年 | 1942–2021 → 1942–2021，与来源一致 | https://www.wikidata.org/wiki/Q6514844（英文维基：Lee Ross） |
| hwang | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| yang-kuo-shu | 生卒年 | 1932 → 1932–2018，与来源一致（已改动） | https://www.wikidata.org/wiki/Q9298773（英文维基：Yang Kuo-shu） |
| turner | 生卒年 | 1947–2011 → 1947–2011，与来源一致 | https://www.wikidata.org/wiki/Q16886231（英文维基：John Turner (psychologist)） |
| fiske | 生卒年 | 1952 → 1952，与来源一致 | https://www.wikidata.org/wiki/Q7647829（英文维基：Susan Fiske） |
| bargh | 生卒年 | 1955 → 1955，与来源一致 | https://www.wikidata.org/wiki/Q1699046（英文维基：John Bargh） |
| rosenthal | 生卒年 | 1933–2024 → 1933–2024，与来源一致 | https://www.wikidata.org/wiki/Q1365573（英文维基：Robert Rosenthal (psychologist)） |
| markus | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q5688001（英文维基：Hazel Rose Markus） |
| kitayama | 生卒年 | null → 1957，与来源一致（已改动） | https://www.wikidata.org/wiki/Q60751878（英文维基：Shinobu Kitayama） |
| shweder | 生卒年 | 1945 → 1945，与来源一致 | https://www.wikidata.org/wiki/Q241488（英文维基：Richard Shweder） |
| hofstede | 生卒年 | 1928–2020 → 1928–2020，与来源一致 | https://www.wikidata.org/wiki/Q313908（英文维基：Geert Hofstede） |
| nisbett | 生卒年 | 1941 → 1941，与来源一致 | https://www.wikidata.org/wiki/Q118221（英文维基：Richard E. Nisbett） |
| henrich | 生卒年 | 1968 → 1968，与来源一致 | https://www.wikidata.org/wiki/Q973493（英文维基：Joseph Henrich） |
| haidt | 生卒年 | 1963 → 1963，与来源一致 | https://www.wikidata.org/wiki/Q845573（英文维基：Jonathan Haidt） |
| goodman | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| deci | 生卒年 | 1942 → 1942–2026，与来源一致（已改动） | https://www.wikidata.org/wiki/Q5344000（英文维基：Edward L. Deci） |
| ryan | 生卒年 | 1953 → 1953，与来源一致 | https://www.wikidata.org/wiki/Q16975690（英文维基：Richard M. Ryan） |
| lepper | 生卒年 | 1944 → 1944，与来源一致 | https://www.wikidata.org/wiki/Q6768562（英文维基：Mark Lepper） |
| greenberg-leslie | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| johnson-sue | 生卒年 | 1947–2024 → 1947–2024，与来源一致 | https://www.wikidata.org/wiki/Q7634155（英文维基：Sue Johnson） |
| fredrickson | 生卒年 | 1964 → 1964，与来源一致 | https://www.wikidata.org/wiki/Q4858897（英文维基：Barbara Fredrickson） |
| duckworth | 生卒年 | 1970 → 1970，与来源一致 | https://www.wikidata.org/wiki/Q16198258（英文维基：Angela Duckworth） |
| dweck | 生卒年 | 1946 → 1946，与来源一致 | https://www.wikidata.org/wiki/Q2939829（英文维基：Carol Dweck） |
| brickman | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| vaillant | 生卒年 | 1934 → 1934，与来源一致 | https://www.wikidata.org/wiki/Q5538980（英文维基：George Eman Vaillant） |
| samuels | 生卒年 | 1949 → 1949，与来源一致 | https://www.wikidata.org/wiki/Q4758499（英文维基：Andrew Samuels） |
| benjamin | 生卒年 | 1946 → 1946，与来源一致 | https://www.wikidata.org/wiki/Q459075（英文维基：Jessica Benjamin） |
| fonagy | 生卒年 | 1952 → 1952，与来源一致 | https://www.wikidata.org/wiki/Q329295（英文维基：Peter Fonagy） |
| bateman | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| frances | 生卒年 | 1942 → 1942，与来源一致 | https://www.wikidata.org/wiki/Q4731652（英文维基：Allen Frances） |
| wampold | 生卒年 | 1948 → 1948，与来源一致 | https://www.wikidata.org/wiki/Q20641956（英文维基：Bruce Wampold） |
| rosenzweig | 生卒年 | 1907–2004 → 1907–2004，与来源一致 | https://www.wikidata.org/wiki/Q930584（英文维基：Saul Rosenzweig） |
| luborsky | 生卒年 | 1920–2009 → 1920–2009，与来源一致 | https://www.wikidata.org/wiki/Q1820958（英文维基：Lester Luborsky） |
| bordin | 生卒年 | 未能联网核实，保持原状（medium） | （查无条目） |
| zubin | 生卒年 | 1900–1990 → 1900–1990，与来源一致 | https://www.wikidata.org/wiki/Q18737276（英文维基：Joseph Zubin） |
| meichenbaum | 生卒年 | 1940 → 1940，与来源一致 | https://www.wikidata.org/wiki/Q1240150（英文维基：Donald Meichenbaum） |
| jacobson | 生卒年 | 未能联网核实，保持原状（medium） | https://www.wikidata.org/wiki/Q99315703 |
| meyer | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| clark | 生卒年 | 1955 → 1954，与来源一致（已改动） | https://www.wikidata.org/wiki/Q5236904（英文维基：David M. Clark） |
| foa | 生卒年 | 1937 → 1937–2026，与来源一致（已改动） | https://www.wikidata.org/wiki/Q5340017（英文维基：Edna Foa） |
| resick | 生卒年 | null → 1950，与来源一致（已改动） | https://www.wikidata.org/wiki/Q58148667（英文维基：Patricia Resick） |
| shapiro | 生卒年 | 1948–2019 → 1948–2019，与来源一致 | https://www.wikidata.org/wiki/Q460858（英文维基：Francine Shapiro） |
| van-der-kolk | 生卒年 | 1943 → 1943，与来源一致 | https://www.wikidata.org/wiki/Q4896407（英文维基：Bessel van der Kolk） |
| levine | 生卒年 | 1942 → 1942，与来源一致 | https://www.wikidata.org/wiki/Q3376418（英文维基：Peter A. Levine） |
| tedeschi | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q130392466 |
| hayes | 生卒年 | 1948 → 1948，与来源一致 | https://www.wikidata.org/wiki/Q3906227（英文维基：Steven C. Hayes） |
| linehan | 生卒年 | 1943 → 1943–2026，与来源一致（已改动） | https://www.wikidata.org/wiki/Q274156（英文维基：Marsha M. Linehan） |
| segal | 生卒年 | null → 1956，与来源一致（已改动） | https://www.wikidata.org/wiki/Q8072351（英文维基：Zindel Segal） |
| williams-mark | 生卒年 | null → 1952，与来源一致（已改动） | https://www.wikidata.org/wiki/Q6106462（英文维基：J. Mark G. Williams） |
| teasdale | 生卒年 | null → 1950，与来源一致（已改动） | https://www.wikidata.org/wiki/Q6228338（英文维基：John D. Teasdale） |
| gilbert | 生卒年 | 1951 → 1951，与来源一致 | https://www.wikidata.org/wiki/Q15995096（英文维基：Paul Gilbert (psychologist)） |
| neff | 生卒年 | 1966 → 1966，与来源一致 | https://www.wikidata.org/wiki/Q20831189（英文维基：Kristin Neff） |
| insel | 生卒年 | 1951 → 1951，与来源一致 | https://www.wikidata.org/wiki/Q891667（英文维基：Thomas R. Insel） |
| cuthbert | 生卒年 | 未能联网核实，保持原状（low） | （查无条目） |
| kotov | 生卒年 | 未能联网核实，保持原状（low） | https://www.wikidata.org/wiki/Q109700637 |
| krueger | 生卒年 | null → 1950，与来源一致（已改动） | https://www.wikidata.org/wiki/Q49637177（英文维基：Robert F. Krueger） |
| caspi | 生卒年 | null → 1960，与来源一致（已改动） | https://www.wikidata.org/wiki/Q25506911（英文维基：Avshalom Caspi） |
| lazarus | 生卒年 | 1922–2002 → 1922–2002，与来源一致 | https://www.wikidata.org/wiki/Q328053（英文维基：Richard Lazarus） |
| folkman | 生卒年 | 1938 → 1938，与来源一致 | https://www.wikidata.org/wiki/Q34527543（英文维基：Susan Folkman） |
| rotter | 生卒年 | 1916–2014 → 1916–2014，与来源一致 | https://www.wikidata.org/wiki/Q1372204（英文维基：Julian Rotter） |

### school

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| molecular-memory | 标志年与事件 | 1970 年坎德尔等人关于海兔缩鳃反射习惯化与去习惯化的《科学》论文 | https://doi.org/10.1126/science.167.3926.1745 |
| predictive-processing | 标志年与事件 | 2010 年弗里斯顿《自由能原理：统一的脑理论？》发表于《自然·神经科学评论》 | https://doi.org/10.1038/nrn2787 |
| indigenous | 标志年与事件 | 土居健郎《甘えの構造》1971 年出版（英译 The Anatomy of Dependence） | https://en.wikipedia.org/wiki/Takeo_Doi |
| mentalization | 标志年与事件 | 1991 年福纳吉、斯蒂尔夫妇等《理解心理状态的能力：反思自体》（Infant Mental Health Journal 12） | https://doi.org/10.1002/1097-0355(199123)12:3<201::aid-imhj2280120307>3.0.co;2-7 |
| morita | 标志年与事件 | 森田疗法一般认为创立于 1919 年（另有资料称体系成形于 1920 年前后，专著 1928 年） | https://en.wikipedia.org/wiki/Shoma_Morita ; https://finde-zukunft.de/english-blog/apv8f5n5zrjnze9grkhnb02azn8glm |
| digital-mental-health | 标志年与事件 | 2017 年 9 月美国 FDA 批准 Pear 公司的 reSET，为首个处方数字疗法 | https://psychnews.psychiatryonline.org/doi/10.1176/appi.pn.2017.pp10a3 ; https://www.news-medical.net/news/20170914/FDA-permits-first-digital-therapeutic-device-for-treatment-of-substance-use-disorders.aspx |
| process-based | 标志年与事件 | 海斯与霍夫曼《基于过程的 CBT》2018 年出版；其前导论文《认知行为治疗的第三浪潮与基于过程的照护的兴起》发表于 2017 年 | https://openlibrary.org/search?q=process-based+cbt ; https://doi.org/10.1002/wps.20442 |
| psychedelic-therapy | 标志年与事件 | 2021 年 MDMA 辅助治疗重度 PTSD 的三期试验发表于《自然·医学》 | https://doi.org/10.3410/f.740083967.793585598（对该论文的评述记录，确认 2021 年） |
| abcd | 标志年与事件 | 2015 为资助与启动年；一万多名儿童的招募在 2016–2018 年。有综述称研究“于 2016 年秋启动”，框架写 2015，保留并标 medium | https://docs.abcdstudy.org/latest/study/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10757308 ; https://doi.org/10.1016/j.dcn.2017.10.002 |
| cognitive-neuroscience | 标志年（1979） | 多个来源只说“1970 年代末”；有一处二手来源给 1978；找不到 1979 的明确出处。保留框架年份并标 medium | https://www.cogneurosociety.org/background/ ; https://www.wikiwand.com/en/articles/Michael_S._Gazzaniga |

### theory

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| wernicke-geschwind | 年份与提出者 | 1874 年；提出者 wernicke、broca、geschwind：来源核对一致 | https://en.wikipedia.org/wiki/Wernicke's_area |
| behavioral-biology-synthesis | 年份与提出者 | 2017 年；提出者 sapolsky：来源核对一致 | https://en.wikipedia.org/wiki/Behave_(book) |
| glucocorticoid-cascade | 年份与提出者 | 1986 年；提出者 sapolsky、mcewen：来源核对一致 | https://en.wikipedia.org/wiki/Robert_Sapolsky ; https://doi.org/10.1126/sageke.2002.38.cp21（对萨波尔斯基、克雷与麦克尤恩论文的再版记录；原文刊于 1986 年 Endocrine Reviews） |
| luria-functional-systems | 年份与提出者 | 1962 年；提出者 luria：来源核对一致 | https://en.wikipedia.org/wiki/Alexander_Luria |
| three-laws-behavior-genetics | 年份与提出者 | 2000 年；提出者 plomin、bouchard：来源核对一致 | https://en.wikipedia.org/wiki/Behavioural_genetics ; https://doi.org/10.1111/1467-8721.00084 |
| left-brain-interpreter | 年份与提出者 | 1978 年；提出者 gazzaniga、ledoux：来源核对一致 | https://en.wikipedia.org/wiki/Michael_Gazzaniga |
| aplysia-synaptic-memory | 年份与提出者 | 1982 年；提出者 kandel：来源核对一致 | https://en.wikipedia.org/wiki/Eric_Kandel ; https://doi.org/10.1126/science.6289442 |
| cheater-detection | 年份与提出者 | 1989 年；提出者 cosmides、tooby：来源核对一致 | https://en.wikipedia.org/wiki/Evolutionary_psychology ; https://doi.org/10.1016/0010-0277(89)90023-1 |
| primary-emotion-systems | 年份与提出者 | 1998 年；提出者 panksepp：来源核对一致 | https://en.wikipedia.org/wiki/Jaak_Panksepp |
| basic-emotions | 年份与提出者 | 1971 年；提出者 ekman：来源核对一致 | https://en.wikipedia.org/wiki/Paul_Ekman ; https://doi.org/10.1037/h0030377 |
| constructed-emotion | 年份与提出者 | 2017 年；提出者 barrett：来源核对一致 | https://en.wikipedia.org/wiki/Lisa_Feldman_Barrett |
| conditioned-emotional-response | 年份与提出者 | 1920 年；提出者 watson、rayner：来源核对一致 | https://en.wikipedia.org/wiki/Little_Albert_experiment |
| reciprocal-determinism | 年份与提出者 | 1978 年；提出者 bandura：来源核对一致 | https://en.wikipedia.org/wiki/Albert_Bandura ; https://doi.org/10.1037/0003-066x.33.4.344 |
| helplessness-revised | 年份与提出者 | 2016 年；提出者 seligman：来源核对一致 | https://en.wikipedia.org/wiki/Learned_helplessness ; https://doi.org/10.1037/rev0000033 |
| seven-dimensions-aba | 年份与提出者 | 1968 年；提出者 baer、wolf、risley：来源核对一致 | https://en.wikipedia.org/wiki/Applied_behavior_analysis ; https://doi.org/10.1901/jaba.1968.1-91 |
| james-lange | 年份与提出者 | 1884 年；提出者 james：来源核对一致 | https://en.wikipedia.org/wiki/James%E2%80%93Lange_theory |
| chomsky-review | 年份与提出者 | 1959 年《语言》杂志书评；联网未专门核对 | https://en.wikipedia.org/wiki/Noam_Chomsky |
| free-energy-principle | 年份与提出者 | 2010 年；提出者 friston：来源核对一致 | https://en.wikipedia.org/wiki/Free_energy_principle |
| computational-psychiatry | 年份与提出者 | 2012 年；提出者 friston、dayan、dolan：来源核对一致 | https://en.wikipedia.org/wiki/Computational_neuroscience ; https://en.wikipedia.org/wiki/Computational_psychiatry |
| how-people-learn | 年份与提出者 | 1999 年；提出者 bransford、ann-brown：来源核对一致 | https://en.wikipedia.org/wiki/John_D._Bransford |
| fluid-crystallized | 年份与提出者 | 1963 年；提出者 cattell：来源核对一致 | https://en.wikipedia.org/wiki/Fluid_and_crystallized_intelligence ; https://doi.org/10.1037/h0046743 |
| chc-model | 年份与提出者 | 1993 年；提出者 carroll、cattell：来源核对一致 | https://en.wikipedia.org/wiki/Cattell%E2%80%93Horn%E2%80%93Carroll_theory |
| iq-concept | 年份与提出者 | 1916 年；提出者 terman、stern、binet：来源核对一致 | https://en.wikipedia.org/wiki/Stanford%E2%80%93Binet_Intelligence_Scales |
| sixteen-pf | 年份与提出者 | 1949 年；提出者 cattell：来源核对一致 | https://en.wikipedia.org/wiki/16PF_Questionnaire |
| irt | 年份与提出者 | 1960 年；提出者 rasch：来源核对一致 | https://en.wikipedia.org/wiki/Item_response_theory |
| mi-theory | 年份与提出者 | 1999 年；提出者 gardner：来源核对一致 | https://en.wikipedia.org/wiki/Theory_of_multiple_intelligences |
| triarchic-theory | 年份与提出者 | 1985 年；提出者 sternberg：来源核对一致 | https://en.wikipedia.org/wiki/Triarchic_theory_of_intelligence |
| personality-continuity | 年份与提出者 | 2000 年；提出者 roberts：来源核对一致 | https://en.wikipedia.org/wiki/Brent_Roberts ; https://doi.org/10.1037/0033-2909.126.1.3 |
| adolescence-storm-stress | 年份与提出者 | 1904 年；提出者 hall：来源核对一致 | https://en.wikipedia.org/wiki/G._Stanley_Hall |
| piaget-stages | 年份与提出者 | 1947 年；提出者 piaget：来源核对一致 | https://en.wikipedia.org/wiki/Jean_Piaget |
| scaffolding | 年份与提出者 | 1976 年；提出者 bruner、vygotsky：来源核对一致 | https://en.wikipedia.org/wiki/Instructional_scaffolding |
| identity-statuses | 年份与提出者 | 马西亚 1966（JPSP）；联网只检到 1993 年再版，未取得原文记录 | https://en.wikipedia.org/wiki/James_Marcia |
| adult-attachment | 年份与提出者 | 1987 年；提出者 hazan、shaver、bowlby：来源核对一致 | https://en.wikipedia.org/wiki/Attachment_in_adults ; https://doi.org/10.4324/9781351153683-17（原文 1987 年发于 J. Personality and Social Psychology，此为再版） |
| six-stage-moral-reasoning | 年份与提出者 | 1969 年；提出者 kohlberg：来源核对一致 | https://en.wikipedia.org/wiki/Lawrence_Kohlberg's_stages_of_moral_development |
| ethic-of-care | 年份与提出者 | 1982 年；提出者 gilligan：来源核对一致 | https://en.wikipedia.org/wiki/Ethics_of_care |
| parenting-styles | 年份与提出者 | 1966 年；提出者 baumrind：来源核对一致 | https://en.wikipedia.org/wiki/Parenting_styles |
| soc-model | 年份与提出者 | 1990 年；提出者 baltes：来源核对一致 | https://en.wikipedia.org/wiki/Paul_Baltes ; https://doi.org/10.1017/cbo9780511665684.003 |
| false-belief-task | 年份与提出者 | 1983 年；提出者 wimmer、perner：来源核对一致 | https://en.wikipedia.org/wiki/Sally%E2%80%93Anne_test ; https://doi.org/10.1016/0010-0277(83)90004-5 |
| mindblindness | 年份与提出者 | 1985 年；提出者 baron-cohen：来源核对一致 | https://en.wikipedia.org/wiki/Simon_Baron-Cohen ; https://doi.org/10.1016/0010-0277(85)90022-8 |
| core-knowledge | 年份与提出者 | 1990 年；提出者 spelke：来源核对一致 | https://en.wikipedia.org/wiki/Elizabeth_Spelke |
| infant-statistical-learning | 年份与提出者 | 1996 年；提出者 saffran：来源核对一致 | https://en.wikipedia.org/wiki/Jenny_Saffran ; https://doi.org/10.1126/science.274.5294.1926 |
| neonatal-imitation | 年份与提出者 | 1977 年；提出者 meltzoff：来源核对一致 | https://en.wikipedia.org/wiki/Andrew_N._Meltzoff ; https://doi.org/10.1126/science.897687 ; 2016 年大规模纵向研究未能重复：https://doi.org/10.1016/j.cub.2016.03.047 |
| leadership-climates | 年份与提出者 | 1939 年；提出者 lewin：来源核对一致 | https://en.wikipedia.org/wiki/Kurt_Lewin |
| expectancy-theory | 年份与提出者 | 1964 年；提出者 vroom：来源核对一致 | https://en.wikipedia.org/wiki/Expectancy_theory |
| authoritarian-personality | 年份与提出者 | 1950 年；提出者 adorno：来源核对一致 | https://en.wikipedia.org/wiki/The_Authoritarian_Personality |
| face-and-favor | 年份与提出者 | 1987 年；提出者 hwang：来源核对一致 | https://doi.org/10.1086/228588 |
| paradoxical-intention | 年份与提出者 | 1960 年；提出者 frankl：来源核对一致 | https://doi.org/10.1176/appi.psychotherapy.1960.14.3.520 |
| two-chair-technique | 年份与提出者 | 1979 年；提出者 perls、greenberg-leslie：来源核对一致 | https://en.wikipedia.org/wiki/Gestalt_therapy ; https://doi.org/10.1037/h0085895 |
| terror-management | 年份与提出者 | 1986 年；提出者 becker：来源核对一致 | https://en.wikipedia.org/wiki/Terror_management_theory ; https://doi.org/10.1007/978-1-4613-9564-5_10 |
| eft-couples | 年份与提出者 | 1988 年；提出者 greenberg-leslie、johnson-sue：来源核对一致 | https://en.wikipedia.org/wiki/Emotionally_focused_therapy |
| hedonic-adaptation | 年份与提出者 | 1971 年；提出者 brickman：来源核对一致 | https://en.wikipedia.org/wiki/Hedonic_treadmill |
| charcot-hysteria | 年份与提出者 | 1887 年；提出者 charcot：来源核对一致 | https://en.wikipedia.org/wiki/Jean-Martin_Charcot |
| did-model | 年份与提出者 | 普特南 1989 年《多重人格障碍的诊断与治疗》；条目只提到年份，未取得更多记录 | https://en.wikipedia.org/wiki/Dissociative_identity_disorder |
| oedipus-complex | 年份与提出者 | 1910 年；提出者 freud：来源核对一致 | https://en.wikipedia.org/wiki/Oedipus_complex |
| defense-hierarchy | 年份与提出者 | 1977 年；提出者 vaillant：来源核对一致 | https://en.wikipedia.org/wiki/Defence_mechanism |
| interpersonal-theory | 年份与提出者 | 1953 年；提出者 sullivan、fromm：来源核对一致 | https://en.wikipedia.org/wiki/Harry_Stack_Sullivan |
| london-developmental-school | 年份与提出者 | 1944 年；提出者 fordham、neumann：来源核对一致 | https://en.wikipedia.org/wiki/Michael_Fordham |
| archetypal-psychology | 年份与提出者 | 1975 年；提出者 hillman、von-franz：来源核对一致 | https://en.wikipedia.org/wiki/Archetypal_psychology |
| sandplay | 年份与提出者 | 卡尔夫《沙盘游戏》1966 年；英文维基条目未载年份与作者细节，未取得一手记录 | （无） |
| mirror-stage | 年份与提出者 | 1949 年；提出者 lacan：来源核对一致 | https://en.wikipedia.org/wiki/Jacques_Lacan |
| intersubjectivity | 年份与提出者 | 1988 年；提出者 mitchell、benjamin：来源核对一致 | https://en.wikipedia.org/wiki/Jessica_Benjamin |
| reflective-function | 年份与提出者 | 1991 年；提出者 fonagy：来源核对一致 | https://doi.org/10.1002/1097-0355(199123)12:3<201::aid-imhj2280120307>3.0.co;2-7 |
| mbt | 年份与提出者 | 1999 年；提出者 fonagy、bateman：来源核对一致 | https://en.wikipedia.org/wiki/Mentalization-based_treatment ; https://doi.org/10.1176/ajp.156.10.1563 |
| scientist-practitioner | 年份与提出者 | 1949 年博尔德会议；联网未专门核对 | https://en.wikipedia.org/wiki/Scientist%E2%80%93practitioner_model |
| morita-model | 年份与提出者 | 1928 年；提出者 shoma-morita：来源核对一致 | https://en.wikipedia.org/wiki/Morita_therapy |
| bowen-theory | 年份与提出者 | 1966 年；提出者 bowen：来源核对一致 | https://en.wikipedia.org/wiki/Murray_Bowen ; https://doi.org/10.1016/s0010-440x(66)80065-2 |
| expressed-emotion | 年份与提出者 | 1972 年；提出者 —：来源核对一致 | https://en.wikipedia.org/wiki/Expressed_emotion ; https://doi.org/10.1192/bjp.121.3.241 |
| dodo-bird | 年份与提出者 | 1975 年；提出者 rosenzweig、luborsky：来源核对一致 | https://en.wikipedia.org/wiki/Dodo_bird_verdict ; https://doi.org/10.1001/archpsyc.1975.01760260059004 |
| working-alliance | 年份与提出者 | 1979 年；提出者 bordin：来源核对一致 | https://en.wikipedia.org/wiki/Therapeutic_alliance ; https://doi.org/10.1037/h0085885 |
| diathesis-stress | 年份与提出者 | 祖宾与斯普林 1977 年《脆弱性：看待精神分裂症的新视角》；联网只检到 1975 年的预印本记录（PsycEXTRA），1977 年刊出版本未取得，保留 medium | （无） |
| exposure-response-prevention | 年份与提出者 | 1966 年；提出者 meyer：来源核对一致 | https://en.wikipedia.org/wiki/Exposure_therapy ; https://doi.org/10.1016/0005-7967(66)90023-4 |
| panic-cognitive-model | 年份与提出者 | 克拉克 1986《惊恐的认知模型》（Behaviour Research and Therapy）：作者与模型内容可由多处二手文献互证，但 1986 年份未在联网核对中取得一手记录 | （无） |
| act-model | 年份与提出者 | 1999 年；提出者 hayes：来源核对一致 | https://en.wikipedia.org/wiki/Acceptance_and_commitment_therapy |
| compassion-focused | 年份与提出者 | 2005 年；提出者 gilbert、neff：来源核对一致 | https://en.wikipedia.org/wiki/Paul_Gilbert_(psychologist) |
| empirically-supported-treatments | 年份与提出者 | 钱布利斯等 1998 年更新清单；联网未取得对应一手记录 | （无） |
| ebpp-three-component | 年份与提出者 | APA 2006 年循证实践声明（American Psychologist 61）；联网未能取得一手记录 | （无） |
| p-factor | 年份与提出者 | 2014 年；提出者 caspi：来源核对一致 | https://doi.org/10.1177/2167702613497473（2013 年网络首发，2014 年纸本刊出于第 2 卷第 2 期） |
| post-traumatic-growth | 年份与提出者 | 1996 年；提出者 tedeschi：来源核对一致 | https://en.wikipedia.org/wiki/Post-traumatic_growth ; https://doi.org/10.1002/jts.2490090305 |

### application

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| app-education-learning | 年份与标志事件 | 《人是如何学习的》1999 年出版（美国国家研究委员会） | https://openlibrary.org/search?q=how+people+learn+bransford |
| app-health-psychology | 年份与标志事件 | 美国心理学会第 38 分会（健康心理学）1978 年成立 | https://societyforhealthpsychology.org/about/our-history/ |
| app-forensic | 年份与标志事件 | 明斯特贝格《在证人席上》1908 年 | https://en.wikipedia.org/wiki/Hugo_M%C3%BCnsterberg ; https://openlibrary.org/search?q=on+the+witness+stand+munsterberg |
| app-human-factors | 年份与标志事件 | 诺曼《日常事物的设计》初版 1988 年（原名 The Psychology of Everyday Things） | https://en.wikipedia.org/wiki/The_Design_of_Everyday_Things |
| app-self-help | 年份与标志事件 | 伯恩斯《Feeling Good》1980 年版 | https://en.wikipedia.org/wiki/David_D._Burns |

### concept

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| binding-problem | 定义与出处是否准确 | 定义与来源一致（损失厌恶 1979 年由卡尼曼与特沃斯基提出；登门槛 1966 年由弗里德曼与弗雷泽提出） | https://en.wikipedia.org/wiki/Binding_problem |
| interpreter-effect | 定义与出处是否准确 | 定义与来源一致（损失厌恶 1979 年由卡尼曼与特沃斯基提出；登门槛 1966 年由弗里德曼与弗雷泽提出） | https://en.wikipedia.org/wiki/Michael_Gazzaniga |
| habit-loop | 定义与出处是否准确 | 定义与来源一致（损失厌恶 1979 年由卡尼曼与特沃斯基提出；登门槛 1966 年由弗里德曼与弗雷泽提出） | https://en.wikipedia.org/wiki/The_Power_of_Habit |
| behavioral-contract | 定义与出处是否准确 | 定义与常见用法一致，未取得单独出处，保留 medium | https://en.wikipedia.org/wiki/Behavior_contract |
| loss-aversion | 定义与出处是否准确 | 定义与来源一致（损失厌恶 1979 年由卡尼曼与特沃斯基提出；登门槛 1966 年由弗里德曼与弗雷泽提出） | https://en.wikipedia.org/wiki/Loss_aversion |
| foot-in-the-door | 定义与出处是否准确 | 定义与来源一致（损失厌恶 1979 年由卡尼曼与特沃斯基提出；登门槛 1966 年由弗里德曼与弗雷泽提出） | https://en.wikipedia.org/wiki/Foot-in-the-door_technique |

### work

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| bio-w-blueprint | 书名、作者、初版年份 | 作者 Robert Plomin、年份 2018 与 Open Library 一致；中文版存在（36氪文章提及《蓝图》），完整中文书名未核实 | https://openlibrary.org/search?q=blueprint+plomin ; https://www.36kr.com/p/1722949517313 |
| bio-w-who-in-charge | 书名、作者、初版年份 | 作者、年份 2011 一致；中译本《谁说了算：自由意志的心理学解读》浙江人民出版社 2013（据 Goodreads/豆瓣版本列表） | https://book.douban.com/subject/6812045/ ; https://openlibrary.org/search?q=who%27s+in+charge+gazzaniga |
| bio-w-brain-that-changes | 书名、作者、初版年份 | 作者、年份 2007 与 Open Library 一致 | https://openlibrary.org/search?q=the+brain+that+changes+itself |
| bhv-w-self-efficacy | 书名、作者、初版年份 | 《Self-Efficacy: The Exercise of Control》W. H. Freeman 1997（据出版社页面与维基条目）；中译本曾有（书名未能核实） | https://macmillanlearning.com/ed/uk/product/Self-Efficacy/p/0716728508 ; https://wikipedia.com/wiki/Self-Efficacy_(book) |
| bhv-w-conditioned-reflexes | 书名、作者、初版年份 | 作者、年份 1927（英译本）与 Open Library 一致 | https://openlibrary.org/search?q=conditioned+reflexes+pavlov |
| bhv-w-behaviorism-watson | 书名、作者、初版年份 | 作者、年份 1924 与 Open Library 一致（有书评列为 1925，应为不同版次） | https://openlibrary.org/search?q=behaviorism+watson |
| cog-w-remembering | 书名、作者、初版年份 | 《Remembering》1932 与 Open Library 一致 | https://openlibrary.org/search?q=remembering+bartlett |
| cog-w-surfing-uncertainty | 书名、作者、初版年份 | 作者 Andy Clark、年份 2016 与 Open Library 一致；未找到中译本，已去掉题名里的英文括注 | https://openlibrary.org/search?q=surfing+uncertainty+clark |
| cog-w-gestalt-psychology | 书名、作者、初版年份 | 《Gestalt Psychology》1929（H. Liveright）与维康图书馆目录一致 | https://wellcomecollection.org/works/nwtx72rm |
| cog-w-geb | 书名、作者、初版年份 | 《Gödel, Escher, Bach》1979，作者 Douglas Hofstadter；Open Library 搜索未命中，依据 Wikipedia | https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach |
| dif-w-intelligence-vsi | 书名、作者、初版年份 | 牛津通识读本《Intelligence: A Very Short Introduction》Ian J. Deary，2001（OUP） | https://en.wikipedia.org/wiki/Ian_J._Deary |
| dif-w-why-we-differ | 书名、作者、初版年份 | 王芳（北京师范大学）著，理想国·北京日报出版社 2023 年 7 月；这是中文原创书而非译本，旧数据的“Why We Differ”只是英文意译 | https://www.jiemian.com/article/14770399.html（图注：王芳 著，理想国·北京日报出版社 2023-7） |
| dif-w-quiet | 书名、作者、初版年份 | 作者、年份 2012 一致；原题名“内向者优势”有误（那是另一本书），中信出版社简体中文版书名为《内向性格的竞争力》（据苏宁图书页面） | https://product.suning.com/0071615541/12446287535.html ; https://www.litlovers.com/reading-guides/non-fiction/quiet-cain |
| dif-w-science-fictions | 书名、作者、初版年份 | 作者 Stuart Ritchie、年份 2020 与 Open Library 一致；已把题名里的“（暂无通行中译）”移出，改为在 summary 注明中译名未核实 | https://openlibrary.org/search?q=science+fictions+ritchie |
| dif-w-statistical-method | 书名、作者、初版年份 | 作者 Stephen Stigler、年份 2016 与 Open Library 一致 | https://openlibrary.org/search?q=seven+pillars+of+statistical+wisdom |
| soc-w-geography-thought | 书名、作者、初版年份 | 作者、年份 2003 一致；中信出版社中译本书名为《思维版图》（豆瓣条目列有 2006、2010、2017 版），原“思维的地理”不是通行译名 | https://book.douban.com/subject/1378201/ ; https://openlibrary.org/search?q=geography+of+thought+nisbett |
| soc-w-lucifer-effect | 书名、作者、初版年份 | 作者、年份 2007 一致；中译本《路西法效应》三联书店，孙佩妏、陈雅馨译（2010） | https://openlibrary.org/search?q=lucifer+effect+zimbardo ; https://www.thenewslens.com/article/98076 |
| soc-w-culture-self | 书名、作者、初版年份 | 这是《心理学评论》上的一篇论文（1991，Psychological Review 98），而不是旧数据所称“论文集” | https://doi.org/10.1037/0033-295X.98.2.224（据 Psychological Review 记录；年份 1991 为公认引用） |
| hum-w-meaning-of-anxiety | 书名、作者、初版年份 | 作者 Rollo May、年份 1950 与 Open Library 一致；中文版 2004 年出版（据豆瓣作者简介） | https://openlibrary.org/search?q=the+meaning+of+anxiety+rollo+may ; https://book.douban.com/subject/1379709/ |
| dep-w-soul-architects | 书名、作者、初版年份 | 史蒂夫·阿扬（Steve Ayan）著，德文版《Seelenzauber》dtv 2024 年 8 月；西班牙文版《Arquitectos del alma》（Paidós 2025）；英文版《Soul Magic: A Century of Psychotherapy》（Pushkin Press 2026）。书确有其本，旧数据的年份缺失、标题“Soul Architects”不是任何一版的原名，已更正；未找到中译本 | https://www.spektrum.de/rezension/buchkritik-zu-seelenzauber/2243805 ; https://www.planetadelibros.com/libro-arquitectos-del-alma/416472 |
| dep-w-dream-monk | 书名、作者、初版年份 | 河合隼雄《明恵 夢を生きる》京都松柏社 1987 年 4 月（获新潮学艺奖）；英译本 The Buddhist Priest Myōe: A Life of Dreams，Mark Unno 译，Lapis Press 1992。旧数据的英文名“The Dream Monk of Kosenji”与中文名“高山寺的梦僧”查无出处，已更正；未找到中译本 | https://buddhism.lib.ntu.edu.tw/en/search/search_detail.jsp?seq=195148 ; https://tricycle.org/magazine/buddhist-priest-myoe/ |
| dep-w-fairy-tales | 书名、作者、初版年份 | 作者 M.-L. von Franz、年份 1970 与 Open Library 一致（《The Interpretation of Fairy Tales》） | https://openlibrary.org/search?q=interpretation+of+fairy+tales+von+franz |
| dep-w-soul-code | 书名、作者、初版年份 | 作者 James Hillman、年份 1996 与 Open Library 一致 | https://openlibrary.org/search?q=the+soul%27s+code+hillman |
| cli-w-go-home-again | 书名、作者、初版年份 | 作者 Monica McGoldrick、年份 1995 与 Open Library 一致 | https://openlibrary.org/search?q=you+can+go+home+again+mcgoldrick |
| cli-w-living-untethered | 书名、作者、初版年份 | 作者 Michael A. Singer、年份 2022 与 Open Library 一致 | https://openlibrary.org/search?q=living+untethered+singer |
| cli-w-icd-11-cdddr | 书名、作者、初版年份 | 世界卫生组织《ICD-11 精神、行为与神经发育障碍：临床描述与诊断要点》；Open Library 无记录，2024 年份未取得一手记录，保留 medium | （无） |
| cli-w-rdoc-matrix | 书名、作者、初版年份 | RDoC 框架 2010 年由 Insel 等发表（Am J Psychiatry）；“RDoC 矩阵”作为网页资源的发布年份未单独核对，保留 medium | https://doi.org/10.1176/appi.ajp.2010.09091379 |
| cli-w-stress-prescription | 书名、作者、初版年份 | 作者 Elissa Epel、年份 2022 与 Open Library 一致 | https://openlibrary.org/search?q=the+stress+prescription+epel |
| cli-w-persuasion-healing | 书名、作者、初版年份 | 作者 Jerome D. Frank、年份 1961 与 Open Library 一致 | https://openlibrary.org/search?q=persuasion+and+healing+frank |

### edge

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| cognitive-neuroscience>affective-neuroscience | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| evolutionary>affective-neuroscience | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| psychopharmacology>affective-neuroscience | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| neuropsychology>split-brain | 方向与理由 | 裂脑研究（斯佩里、加扎尼加）是对胼胝体切开病人的特殊脑损伤研究 | https://en.wikipedia.org/wiki/Split-brain |
| monoamine-hypothesis>dopamine-hypothesis | 方向与理由 | 两者都是“神经递质失调”解释精神症状的假说，后者条目引用前者 | https://en.wikipedia.org/wiki/Dopamine_hypothesis_of_schizophrenia |
| neo-behaviorism>social-learning | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| classical-conditioning>learned-helplessness | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| behavior-therapy>aba | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| experimental>memory-experiment | 方向与理由 | 艾宾浩斯受冯特等实验心理学影响，把实验法用于记忆 | https://en.wikipedia.org/wiki/Hermann_Ebbinghaus |
| functionalism>cognitive-psychology | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| cognitive-psychology>heuristics-biases | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| connectionism>predictive-processing | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| embodied>predictive-processing | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| g-factor>intelligence-testing | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| person-situation>big-five | 方向与理由 | 人与情境之争后转向互动论，特质研究重新活跃 | https://en.wikipedia.org/wiki/Person%E2%80%93situation_debate |
| open-science>embodied | 方向与理由 | 面部反馈（Strack 1988）的注册重复报告与“权力姿势”的大样本重复均未能重现原结果 | https://doi.org/10.1177/1745691616674460 ; https://doi.org/10.1177/0956797614553946 |
| flynn-effect>intelligence-testing | 方向与理由 | 弗林效应源于智力测验重新标准化时发现的分数逐代上升 | https://en.wikipedia.org/wiki/Flynn_effect |
| child-study>cognitive-development | 方向与理由 | 皮亚杰 1919–1921 年在比奈的巴黎实验室与西蒙共事，儿童研究与测量传统直接影响其起点 | https://en.wikipedia.org/wiki/Jean_Piaget |
| cognitive-development>theory-of-mind | 方向与理由 | 心理理论条目把皮亚杰的自我中心研究列为前身，威默与佩尔纳 1983 年的错误信念任务由此发展 | https://en.wikipedia.org/wiki/Theory_of_mind ; https://doi.org/10.1016/0010-0277(83)90004-5 |
| psychosocial>lifespan | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| ecological>lifespan | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| infant-cognition>theory-of-mind | 方向与理由 | 翁伊希与巴亚尔容 2005 年用婴儿注视时间测隐性错误信念 | https://doi.org/10.1126/science.1107621 |
| sociocultural>ecological | 方向与理由 | 布朗芬布伦纳明确把维果茨基与勒温列为理论的重要影响 | https://en.wikipedia.org/wiki/Ecological_systems_theory |
| social-identity>crowd | 方向与理由 | 社会认同视角（如 SIDE 模型）对“人入群即失去理智”提出修正 | https://en.wikipedia.org/wiki/Crowd_psychology |
| field-theory>conformity-obedience | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| dissonance>social-cognition | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| prejudice>social-identity | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| indigenous>cultural | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| independent-interdependent-self>fundamental-attribution-error | 方向与理由 | 跨文化研究显示东亚样本的基本归因偏差较弱 | https://en.wikipedia.org/wiki/Fundamental_attribution_error |
| weird-samples>social-cognition | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| logotherapy>existential | 方向与理由 | 英文维基把意义治疗列为存在治疗的一个分支 | https://en.wikipedia.org/wiki/Existential_therapy |
| needs>sdt | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| sdt>positive | 方向与理由 | 瑞安与德西 2000 年的自我决定理论论文发表于《美国心理学家》积极心理学专刊 | https://doi.org/10.1037/0003-066x.55.1.68 |
| logotherapy>positive | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| overjustification>behaviorism | 方向与理由 | 莱珀等 1973 年的研究：预期奖励会降低内在兴趣，被用来质疑单纯强化的解释 | https://en.wikipedia.org/wiki/Overjustification_effect |
| terror-management>psychoanalysis | 方向与理由 | 恐惧管理理论源自贝克尔《拒斥死亡》，后者综合弗洛伊德与兰克 | https://en.wikipedia.org/wiki/Terror_management_theory |
| ego-psychology>self-psychology | 方向与理由 | 科胡特在芝加哥受传统精神分析训练，受安娜·弗洛伊德影响，后来转向自体心理学 | https://en.wikipedia.org/wiki/Heinz_Kohut |
| dissociation>analytical-psychology | 方向与理由 | 荣格曾于 1902–03 年在巴黎随让内学习，其“情结”概念借鉴解离观念 | https://en.wikipedia.org/wiki/Carl_Jung |
| relational>mentalization | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| clinical-psychology>common-factors | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| rosenhan-experiment>nosology | 方向与理由 | 罗森汉 1973 年《在精神病院里保持清醒》批评诊断的可靠性 | https://en.wikipedia.org/wiki/Rosenhan_experiment |
| psychoanalysis>family-systems | 方向与理由 | 家庭治疗条目提到早期先驱多出身精神分析，又对其个体内心取向不满 | https://en.wikipedia.org/wiki/Family_therapy |
| common-factors>ebp | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| diathesis-stress>dimensional | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| aba>app-education-learning | 方向与理由 | 应用行为分析被用于教育，如恩格尔曼 1968 年的直接教学 | https://en.wikipedia.org/wiki/Applied_behavior_analysis |
| big-five>app-industrial-organizational | 方向与理由 | 大五人格（尤其是尽责性）与工作绩效相关，被用于人员测评 | https://en.wikipedia.org/wiki/Big_Five_personality_traits |
| intelligence-testing>app-industrial-organizational | 方向与理由 | 1917 年斯坦福—比奈量表被改编为团体测验，用于选拔 | https://en.wikipedia.org/wiki/Industrial_and_organizational_psychology |
| affordances>app-human-factors | 方向与理由 | 诺曼把吉布森的“可供性”引入产品设计 | https://en.wikipedia.org/wiki/Affordance |
| working-memory-model>app-human-factors | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| cbt>app-self-help | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| habit-loop>app-self-help | 方向与理由 | 《习惯的力量》把“线索—惯例—奖赏”写成面向大众的方法 | https://en.wikipedia.org/wiki/The_Power_of_Habit |
| analytical-psychology>needs | 方向与理由 | 维基自我实现条目指出其与荣格“个体化”概念相似，但无直接师承 | https://en.wikipedia.org/wiki/Self-actualization |
| psychopharmacology>dsm | 方向与理由 | 属于解释性判断，未找到可直接互证的一手来源，保持 medium | （无） |
| morita>third-wave | 方向与理由 | 英文维基指出森田疗法与接纳承诺疗法在“接受无法改变的、通过行动疗愈”上多有重合，但无师承 | https://en.wikipedia.org/wiki/Morita_therapy |
| gestalt>gestalt-therapy | 方向与理由 | 格式塔治疗借用整体与图形—背景的概念，但并非格式塔心理学的延伸 | https://en.wikipedia.org/wiki/Gestalt_therapy |
| evolutionary>attachment | 方向与理由 | 鲍尔比的依恋理论以演化与行为学为基础 | https://en.wikipedia.org/wiki/Attachment_theory |

### person(新增)

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| sporns | 生卒年 | 1963，与来源一致 | https://www.wikidata.org/wiki/Q7082997（英文维基：Olaf Sporns） |
| sullivan-patrick | 生卒年 | 未找到可靠生年记录，born 保持 null、confidence 为 low | （无） |
| schultz | 生卒年 | 1944，与来源一致 | https://www.wikidata.org/wiki/Q21166889（英文维基：Wolfram Schultz） |
| sutton | 生卒年 | 1950，与来源一致 | https://www.wikidata.org/wiki/Q7328833（英文维基：Richard S. Sutton） |
| hinton | 生卒年 | 1947，与来源一致 | https://www.wikidata.org/wiki/Q92894（英文维基：Geoffrey Hinton） |
| kosinski | 生卒年 | 1982，与来源一致 | https://www.wikidata.org/wiki/Q28175767（英文维基：Michal Kosinski） |
| borsboom | 生卒年 | 1973，与来源一致 | https://www.wikidata.org/wiki/Q43466848（英文维基：Denny Borsboom） |
| steinberg | 生卒年 | 1952，与来源一致 | https://www.wikidata.org/wiki/Q1287405（英文维基：Laurence Steinberg） |
| turkheimer | 生卒年 | 未找到可靠生年记录，born 保持 null、confidence 为 low | （无） |
| darcy | 生卒年 | 未找到可靠生年记录，born 保持 null、confidence 为 low | （无） |
| twenge | 生卒年 | 1971，与来源一致 | https://www.wikidata.org/wiki/Q32979574（英文维基：Jean Twenge） |
| mcguire | 生卒年 | 1925–2007，与来源一致 | https://www.wikidata.org/wiki/Q30347257（英文维基：William J. McGuire） |
| lomas | 生卒年 | 未找到可靠生年记录，born 保持 null、confidence 为 low | （无） |
| solms | 生卒年 | 1961，与来源一致 | https://www.wikidata.org/wiki/Q1382575（英文维基：Mark Solms） |
| shedler | 生卒年 | 未找到可靠生年记录，born 保持 null、confidence 为 low | （无） |
| barlow | 生卒年 | 1942，与来源一致 | https://www.wikidata.org/wiki/Q12405796（英文维基：David H. Barlow） |
| hofmann | 生卒年 | 1964，与来源一致 | https://www.wikidata.org/wiki/Q37837264（英文维基：Stefan Hofmann） |
| griffiths | 生卒年 | 1946–2023，与来源一致 | https://www.wikidata.org/wiki/Q85317587（英文维基：Roland Griffiths） |
| chambless | 生卒年 | 1948–2023，与来源一致 | https://www.wikidata.org/wiki/Q91843738（英文维基：Dianne Chambless） |
| hippocrates-of-cos | 生卒年 | 传统上记为约公元前 460–约前 370 年，均为约数；不填估计值，born 保持 null、confidence 为 low | https://www.wikidata.org/wiki/Q5264（记为 c. 460–370 BCE） |
| ibn-sina | 生卒年 | 980–1037，与来源一致 | https://www.wikidata.org/wiki/Q8011（英文维基：Avicenna） |
| epictetus | 生卒年 | 传统上记为约 50–约 135/138 年，均为约数；不填估计值，born 保持 null、confidence 为 low | 英文维基 Epictetus 条目 |
| john-locke | 生卒年 | 1632–1704，与来源一致 | https://www.wikidata.org/wiki/Q9353（英文维基：John Locke） |
| jean-jacques-rousseau | 生卒年 | 1712–1778，与来源一致 | https://www.wikidata.org/wiki/Q6527（英文维基：Jean-Jacques Rousseau） |
| franz-mesmer | 生卒年 | 1734–1815，与来源一致 | https://www.wikidata.org/wiki/Q160202（英文维基：Franz Mesmer） |
| immanuel-kant | 生卒年 | 1724–1804，与来源一致 | https://www.wikidata.org/wiki/Q9312（英文维基：Immanuel Kant） |
| philippe-pinel | 生卒年 | 1745–1826，与来源一致 | https://www.wikidata.org/wiki/Q311594（英文维基：Philippe Pinel） |
| franz-gall | 生卒年 | 1758–1828，与来源一致 | https://www.wikidata.org/wiki/Q57511（英文维基：Franz Joseph Gall） |
| arthur-schopenhauer | 生卒年 | 1788–1860，与来源一致 | https://www.wikidata.org/wiki/Q38193（英文维基：Arthur Schopenhauer） |
| adolphe-quetelet | 生卒年 | 1796–1874，与来源一致 | https://www.wikidata.org/wiki/Q20012（英文维基：Adolphe Quetelet） |
| soren-kierkegaard | 生卒年 | 1813–1855，与来源一致 | https://www.wikidata.org/wiki/Q6512（英文维基：Søren Kierkegaard） |
| hermann-helmholtz | 生卒年 | 1821–1894，与来源一致 | https://www.wikidata.org/wiki/Q60024（英文维基：Hermann von Helmholtz） |
| moritz-lazarus | 生卒年 | 1824–1903，与来源一致 | https://www.wikidata.org/wiki/Q544428（英文维基：Moritz Lazarus） |

### theory(新增)

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| discrete-neuron-theory | 年份与提出者 | 核对一致：维基载：卡哈尔 1888 年用高尔基染色得出分立结论，瓦尔代尔 1891 年命名“neuron” | https://en.wikipedia.org/wiki/Neuron_doctrine |
| connectome-concept | 年份与提出者 | 核对一致：斯波恩斯、托诺尼、克特尔 2005 | https://doi.org/10.1371/journal.pcbi.0010042 |
| polygenic-risk | 年份与提出者 | 核对一致：国际精神分裂症联盟 2009 年多基因报告；PGC 2014 年 108 个位点 | https://doi.org/10.1038/nature08185 ; https://doi.org/10.1038/nature13595 |
| dopamine-prediction-error | 年份与提出者 | 核对一致：Science 275, 1997 | https://doi.org/10.1126/science.275.5306.1593 |
| temporal-difference-learning | 年份与提出者 | 核对一致：Machine Learning 3, 1988 | https://doi.org/10.1023/a:1022633531479 |
| deep-cnn-vision-model | 年份与提出者 | 核对一致：AlexNet 论文（NIPS 2012，2017 年 CACM 再刊）；“与视觉皮层相似”的说法属于后续研究，评价为 limited | https://doi.org/10.1145/3065386 |
| llm-theory-of-mind-test | 年份与提出者 | 核对一致：PNAS 2024；预印本 2023 | https://doi.org/10.1073/pnas.2405460121 |
| likes-predict-traits | 年份与提出者 | 核对一致：PNAS 2013 | https://doi.org/10.1073/pnas.1218772110 |
| symptom-network-theory | 年份与提出者 | 部分核对，保留 medium：年份来自引用惯例，未取得一手记录 | https://doi.org/10.1017/S0140525X09991567（Cramer 等，BBS 2010；联网检索未直接命中，题名与年份据通行引用） |
| many-labs | 年份与提出者 | 部分核对，保留 medium：Klein 等 2014，Social Psychology；联网只取得配套数据论文 | https://doi.org/10.5334/jopd.ad（数据论文） |
| dual-systems-model | 年份与提出者 | 部分核对，保留 medium：Steinberg 2008, Developmental Review；Casey 等 2008 同年；联网只取得再版记录 | https://doi.org/10.4324/9781315096278-19（斯坦伯格 2008 年论文的再版） |
| conversational-agent-cbt | 年份与提出者 | 核对一致：Fitzpatrick, Darcy, Vierhile 2017, JMIR Mental Health | https://doi.org/10.2196/mental.7785 |
| smartphone-mental-health-link | 年份与提出者 | 核对一致：Clinical Psychological Science，2017 年网络首发，2018 年刊出 | https://doi.org/10.1177/2167702617723376 |
| moral-foundations-theory | 年份与提出者 | 核对一致：Haidt & Joseph, Daedalus 2004 | https://doi.org/10.1162/0011526042365555 |
| psychological-inoculation | 年份与提出者 | 核对一致：McGuire 1961 | https://doi.org/10.1037/h0048344 |
| self-compassion-model | 年份与提出者 | 核对一致：Neff 2003 | https://doi.org/10.1080/15298860309032 |
| second-wave-positive-psychology | 年份与提出者 | 核对一致：2015 年网络首发，2016 年纸本 | https://doi.org/10.1007/s10902-015-9668-y |
| dreaming-forebrain-mechanism | 年份与提出者 | 核对一致：Solms 2000, Behavioral and Brain Sciences 23 | https://doi.org/10.1017/cbo9780511615511.004（BBS 2000 论文的再版章节） |
| psychodynamic-efficacy | 年份与提出者 | 核对一致：Shedler 2010, American Psychologist 65；联网只取得再版记录 | https://doi.org/10.1007/978-1-60761-792-1_2（再版章节） |
| unified-protocol-model | 年份与提出者 | 部分核对，保留 medium：版权页年份 2011，Open Library 记 2010 年末，取 2011 | https://openlibrary.org/search?q=unified+protocol+barlow |
| process-based-therapy | 年份与提出者 | 核对一致：Hayes & Hofmann 2017 World Psychiatry；2018 年专著 | https://doi.org/10.1002/wps.20442 |
| complex-ptsd | 年份与提出者 | 核对一致：Herman 1992, Journal of Traumatic Stress | https://doi.org/10.1002/jts.2490050305 |
| psilocybin-mystical-experience | 年份与提出者 | 核对一致：Griffiths 等 2006, Psychopharmacology | https://doi.org/10.3410/f.1040591.496273（对该论文的评述记录） |

### concept(新增)

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| aphasia | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| synapse | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| chemical-imbalance | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| memory-consolidation | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| limbic-system | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| trial-and-error | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| stimulus-response | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| intervening-variable | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| counterconditioning | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| controllability | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| just-noticeable-difference | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| introspection | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| i-and-me | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| information-processing-metaphor | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| distributed-representation | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| extended-mind | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| positive-manifold | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| mental-age | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| neuroticism | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| cross-situational-consistency | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| openness | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| developmental-milestones | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| private-speech | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| moral-dilemma | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| multidirectionality | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| violation-of-expectation | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| deindividuation | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| scapegoating | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| effort-justification | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| guanxi | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| pursue-withdraw-cycle | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| dissociation-concept | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| idealized-self | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| ego-self-axis | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| imaginary-symbolic-real | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| mirroring | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| enactment | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| mentalizing | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| case-formulation | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| categorical-diagnosis | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| psychic-interaction | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| predisposing-precipitating-perpetuating | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| randomized-controlled-trial | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| wanting-liking | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| common-humanity | 定义 | 依据公认文献撰写，不含需核实的年份 | — |
| affective-consciousness | 定义 | 依据公认文献撰写，不含需核实的年份 | — |

### work(新增)

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| bio-w-cerebral-cortex-man | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=cerebral+cortex+of+man+penfield |
| bio-w-advice-young-investigator | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=advice+for+a+young+investigator+cajal（英译本 1999；西班牙文原版 1897 为公认书目信息，未在线取得一手记录） |
| bio-w-human-connectome | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1371/journal.pcbi.0010042 |
| bio-w-pgc-108-loci | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1038/nature13595 |
| bio-w-neural-substrate-prediction-reward | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1126/science.275.5306.1593 |
| bhv-w-animal-intelligence | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=animal+intelligence+thorndike |
| bhv-w-purposive-behavior | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=purposive+behavior+in+animals+and+men |
| bhv-w-reciprocal-inhibition | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=psychotherapy+by+reciprocal+inhibition |
| bhv-w-aba-cooper | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=applied+behavior+analysis+cooper+heron+heward（初版 1987 年，未在线取得一手记录） |
| bhv-w-reinforcement-learning | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=reinforcement+learning+an+introduction+sutton（初版 1998 年，未在线取得一手记录） |
| bhv-w-human-level-deep-rl | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.3410/f.725368782.793506817（对该论文的评述记录，确认 2015 年《自然》） |
| cog-w-elements-psychophysics | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=elements+of+psychophysics+fechner（英译本 1966；德文 1860 为公认书目信息） |
| cog-w-principles-physiological-psychology | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=principles+of+physiological+psychology+wundt（英译本 1904；德文 1873–74 为公认书目信息） |
| cog-w-imagenet-classification | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1145/3065386（NIPS 2012 论文的 2017 年 CACM 再刊） |
| cog-w-using-cognitive-psychology-gpt3 | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.31234/osf.io/6dfgk（预印本 2022；PNAS 2023 刊出） |
| dif-w-dimensions-personality | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=dimensions+of+personality+eysenck |
| dif-w-construct-validity | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1037/h0040957 |
| dif-w-private-traits-predictable | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1073/pnas.1218772110 |
| dif-w-network-analysis-psychopathology | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1146/annurev-clinpsy-050212-185608 |
| dif-w-estimating-reproducibility | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1126/science.aac4716 |
| dev-w-adolescence-hall | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=adolescence+g+stanley+hall |
| dev-w-life-span-propositions | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1037/0012-1649.23.5.611 |
| dev-w-mindblindness | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=mindblindness+baron-cohen |
| dev-w-abcd-imaging-acquisition | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | （题名据 Casey 等 2018，Dev Cogn Neurosci；联网未直接取得该条记录，同刊的 Volkow 等 2018 篇见 https://doi.org/10.1016/j.dcn.2017.10.002） |
| dev-w-igen | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=igen+twenge |
| dev-w-anxious-generation | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=the+anxious+generation+haidt |
| soc-w-psychology-interpersonal-relations | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=psychology+of+interpersonal+relations+heider |
| soc-w-anatomy-dependence | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://en.wikipedia.org/wiki/Takeo_Doi |
| soc-w-integrative-theory-intergroup-conflict | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1093/oso/9780199269464.003.0005（再版）；1979 年原载 Austin & Worchel 编《群际关系的社会心理学》 |
| soc-w-weirdest-people | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.2139/ssrn.1601785（工作论文）；BBS 2010 刊出 |
| soc-w-spread-true-false-news | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1126/science.aap9559 |
| hum-w-gestalt-therapy | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=gestalt+therapy+perls+hefferline+goodman |
| hum-w-intrinsic-motivation-self-determination | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=intrinsic+motivation+and+self-determination+in+human+behavior |
| hum-w-hold-me-tight | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=hold+me+tight+sue+johnson |
| hum-w-self-compassion-neff | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1080/15298860309032 |
| hum-w-second-wave-positive-psychology | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1007/s10902-015-9668-y |
| dep-w-psychological-automatism | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=automatisme+psychologique+janet |
| dep-w-ego-mechanisms-defence | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=ego+and+the+mechanisms+of+defence（英译本 1937；德文 1936 为公认书目信息） |
| dep-w-ecrits | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=ecrits+lacan |
| dep-w-object-relations-psychoanalytic-theory | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=object+relations+in+psychoanalytic+theory |
| dep-w-affect-regulation-mentalization | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=affect+regulation+mentalization+fonagy |
| dep-w-brain-inner-world | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=the+brain+and+the+inner+world+solms |
| dep-w-efficacy-psychodynamic | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.1007/978-1-60761-792-1_2（再版章节）；原文 American Psychologist 2010 |
| dep-w-seelenzauber | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://www.spektrum.de/rezension/buchkritik-zu-seelenzauber/2243805 ; https://www.planetadelibros.com/libro-arquitectos-del-alma/416472 |
| cli-w-clinical-psychology-witmer | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | 《心理诊所》创刊号 1907，据心理学史公认引用；联网只检到 1996 年的同名期刊，未取得原文记录 |
| cli-w-morita-nature-therapy | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | 英文维基载其专著 1928 年；中文题名“神经质的本态与疗法”为对日文原题的直译 |
| cli-w-need-new-medical-model | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | Science 196, 1977；联网只取得 1978 年的再版章节 https://doi.org/10.1016/b978-0-409-95009-0.50006-1 |
| cli-w-cognitive-therapy-basics | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | 初版 1995 年，Open Library 无初版记录，未取得一手记录 |
| cli-w-division12-task-force | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | The Clinical Psychologist 48(1)，1995；联网未取得一手记录 |
| cli-w-ebpp-statement | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | American Psychologist 61(4)，2006；联网未取得一手记录 |
| cli-w-unified-protocol-guide | 书名、作者、初版年份 | 存在性与作者可信，年份来自公认书目信息，未取得在线一手记录，保留 medium | https://openlibrary.org/search?q=unified+protocol+barlow（版权页 2011，OL 记 2010） |
| cli-w-woebot-trial | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.2196/mental.7785 |
| cli-w-process-based-cbt | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://openlibrary.org/search?q=process-based+cbt+hayes+hofmann |
| cli-w-mdma-phase3 | 书名、作者、初版年份 | 存在，作者与年份与来源一致 | https://doi.org/10.3410/f.740083967.793585598（对该论文的评述记录，确认 2021 年） |

### root

| id | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| hippocrates | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Humorism |
| buddhist | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Mindfulness |
| aristotle | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/On_the_Soul |
| confucian-daoist | 年份与说法 | “先秦”“儒道心性修养”一语属通行概括，未取得可互证的来源 | （英文维基“Chinese psychology”条目未覆盖此点，未取得来源） |
| stoic | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Epictetus |
| avicenna | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/The_Canon_of_Medicine |
| descartes | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Meditations_on_First_Philosophy |
| locke | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/An_Essay_Concerning_Human_Understanding |
| rousseau | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Emile,_or_On_Education |
| mesmer | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Franz_Mesmer |
| kant | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Critique_of_Pure_Reason |
| pinel | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Philippe_Pinel |
| gall | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Phrenology |
| schopenhauer | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/The_World_as_Will_and_Representation |
| weber | 年份与说法 | 说法与来源一致；具体年份维基未载，依据公认年份 | https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law（1834 年份维基未载，依据韦伯《论触觉》公认年份） |
| quetelet | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Adolphe_Quetelet |
| kierkegaard | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/The_Concept_of_Anxiety |
| helmholtz | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/Hermann_von_Helmholtz |
| darwin | 年份与说法 | 年份、人物与说法与来源一致 | https://en.wikipedia.org/wiki/On_the_Origin_of_Species ; https://en.wikipedia.org/wiki/The_Expression_of_the_Emotions_in_Man_and_Animals |
| volkerpsychologie | 年份与说法 | 说法与来源一致；具体年份维基未载，依据公认年份 | https://en.wikipedia.org/wiki/V%C3%B6lkerpsychologie（1860 年份维基未载） |

## 设计者复核（2026-11-15）

- 2026 年新增的五个卒年逐一复查：trivers（3 月 12 日）、foa（3 月 24 日）、deci（2 月 14 日）、goldberg（3 月 29 日）均有校方、研究所或主流媒体讣告，确认。
- linehan：多处报道称其于 2026 年 11 月 10 日去世，但截至复核时未见家属或华盛顿大学的正式声明。卒年保留 2026，置信度由 high 降为 medium，待官方确认后再升。

## v2.1 数据修订（2026-11-15，工作 D）

范围：v2.1 规格第 1 节（荣格的影响线、学派的代表人物与代表作、每个理论都有可读的书、书的书目字段）。有联网，只发送书名、人名、年份等通用检索词。

### 一、荣格的影响线（1.1）

| 条目 | 核对内容 | 结论 | 来源 |
|---|---|---|---|
| analytical-psychology 影响分 | 3 → 4 | 已改；4—5 分占比 38.4% → 39.4%，仍低于 40% 上限，校验通过 | （内部评分） |
| psychological-types → factor-personality（bridges） | 外向与内向的术语出自《心理类型》（1921），艾森克把它改造成连续的、可测量的维度 | 来源一致：荣格把二者当作两种类型，艾森克（1947 年起）把外向—内向写成因素分析中的一个维度。另有说明：外向性的更早研究可追到海曼斯，荣格是现代用法的命名者。边的措辞据此只写“术语被改造成可测量的维度”，未写“继承” | https://webspace.ship.edu/cgboer/genpsytraits.html ; https://www.personality-project.org/revelle/publications/wr.ext.rev2.pdf ; https://en.wikipedia.org/wiki/Extraversion_and_introversion |
| 新节点 mbti；psychological-types → mbti（develops） | 迈尔斯与母亲布里格斯据荣格类型论编制；1962 年 ETS 出版第一版 MBTI 手册；人物生卒年 | 一致：Katharine Cook Briggs 1875—1968，Isabel Briggs Myers 1897—1980；Briggs 在 1923 年前后读到《心理类型》；1962 年 ETS 采用并出版手册（有的来源称“研究版”）。证据状况按现有“流行误读”条目填 mixed（重测不稳定、维度呈连续分布、预测力弱）；大众知名度 5。置信度 high，唯“1962”的具体含义（手册还是研究版）来源略有出入，landmark 只写“出版第一版手册”。挂在学派 trait（特质论）之下，理由见汇报 | https://en.wikipedia.org/wiki/Myers%E2%80%93Briggs_Type_Indicator ; https://eu.themyersbriggs.com/en/tools/MBTI/Myers-Briggs-history ; https://en.wikipedia.org/wiki/Katharine_Cook_Briggs ; https://hrcak.srce.hr/file/384153 |
| 新节点 life-stages；life-stages → lifespan（bridges） | 荣格论“人生的阶段”与中年转折 | 内容一致（前半生与后半生的任务不同，转折约在 35—40 岁）。写成年份有出入：二手来源给出约 1930、1931、1933 年；德文《Die Lebenswende》收入 1931 年《当代的心灵问题》，英译《The Stages of Life》收入 1933 年《寻找灵魂的现代人》。年份取约 1930（成文时间），置信度 medium。边是 bridges 而非 develops，因为成人发展研究（如列文森）是借用个体化与中年的想法，而非直接师承；列文森借用荣格一点有来源支持。“中年危机”一词是 1965 年雅克斯所创，不是荣格，故节点 evidenceNote 注明其普遍性并不被后来的追踪研究支持 | https://www.institute4learning.com/the-stages-of-life-according-to-carl-jung/ ; https://www.artofmanliness.com/articles/the-seasons-of-a-mans-life-the-mid-life-transition/ ; https://www.perlego.com/book/1665434/the-adult-development-of-cg-jung-rle-jung-pdf |
| 新节点 active-imagination；active-imagination → sandplay（develops） | 《超越功能》1916 年写成、数十年后才发表，是对积极想象的最早论述；卡尔夫在荣格的鼓励下去伦敦随洛温菲尔德学习“世界技术”，再以荣格心理学改造为沙盘游戏，并有研究者（乔多罗）称沙盘是一种积极想象 | 来源一致，但多为二手；洛温菲尔德与荣格相遇的时间各处说法不一（1937 或 1956），故不写进数据。边的 confidence 取 medium。《超越功能》另有“1957 年私印、1958 年德文修订本发表、收入全集第八卷”的说法，landmark 只写“数十年后才发表” | https://sunypress.edu/Books/T/The-Transcendent-Function2 ; https://jungpage.org/learn/articles/analytical-psychology/582-editors-preface-to-the-transcendent-function ; https://cjc-rcc.ucalgary.ca/article/download/69457/54279/208450 |
| analytical-psychology → app-self-help（applies） | 荣格对病人罗兰·哈泽德的建议，经比尔·威尔逊记述，是戒酒互助会创立的源头之一 | 一致：哈泽德→（牛津团契）→埃比·萨奇尔→比尔·威尔逊；威尔逊 1961 年 1 月致信荣格，荣格 1 月 30 日回信，提出“spiritus contra spiritum”，信 1963 年刊于《Grapevine》。哈泽德受治疗的时间各处不一（1926、1931 或 1932 年），数据里不写年份。来源多为二手，一手信件未能亲见，但这一链条在互助会史料里是通行的叙述，边 confidence 取 high，措辞为“源头之一” | https://wccm.org/outreach-areas/addiction-recovery/carl-jung-letter-to-bill-w ; https://recoverytable.blogspot.com/2011/05/jung-wilson-correspondence.html ; https://dougtoft.substack.com/p/alcoholism-as-the-thirst-for-wholeness |
| word-association-complex 的 summary | 1907 年前后荣格用检流计记录联想实验中的皮肤电变化；“情结”有概念卡 | 一致：1907 年荣格与彼得森发表《用检流计和呼吸描记器对正常人与精神病人的心理生理研究》，把检流计用于联想实验；确认概念卡 complex 存在。已把这一句写进 summary，未新建关系 | https://pure.mpg.de/pubman/item/item_2368472_2/component/file_2368471/Peterson_Jung_1907_Psycho-physicall.pdf ; https://sidis.net/galvanicjung1.htm |

新增人物：isabel-briggs-myers、katharine-briggs（生卒年据上表来源，high）。

### 二、其余新增人物（1.2 需要）

vosoughi、casey、jennifer-mitchell 分别是学派 misinformation、abcd、psychedelic-therapy 的标志性论文的第一作者；生年未查到可靠来源，`born: null` 并标 `confidence: low`（校验允许）。

### 三、书目字段（1.3）

- 每本书补了 `lang`、`original`、`enRec`、`zhQuery`。英译本与版本信息来自出版社、图书馆目录与书商页面，逐条抽查了下列：《被讨厌的勇气》（Atria，2018，版权页未署译者）、《思维与语言》（MIT Press 2012 修订扩充版，柯祖林编）、《影响力》（Harper Business 2021 增补版）、《共时性》（普林斯顿 2010 平装本）、《智能的结构》（Basic Books 1993 十周年版）。其余多数版本凭熟悉的出版信息填写，未逐条核对；凡拿不准版本时一律写原版或首版，没有写“修订版”“纪念版”。
- 期刊论文、会议论文、网络资源的 `enRec` 写的是文献本身的出处（期刊卷期页码），`edition` 栏里放出处；这类文献的 `zhQuery` 一般为 `null`（无单行本中译）。
- dep-w-soul-architects 与 dep-w-seelenzauber 是同一本书的两个重复节点（见上文旧记录），均保留，书目字段相同。英文版《Soul Magic》2026 年 Pushkin Press 出版的信息来自旧核对记录，未再次核对。
- 新增 117 本书（含期刊文章与手册），用来保证每个理论至少被一本书引用，并让部分学派的 keyWork 指向标志事件对应的著作；另有 20 本已有的书增挂了它们实际讲到的理论。
- 中文检索词 `zhQuery` 多数是“中文书名 作者”的最佳猜测，部分书（标 confidence: medium 的新增书尤其如此）是否有中译本未能确认，留给抓取与匹配阶段判断。
- 关系 basic-emotions → constructed-emotion（critiques）方向反了：理由写的是建构情绪理论挑战基本情绪。已改为 constructed-emotion → basic-emotions，英文译文的键同步更改。
