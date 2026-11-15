> 本仓库中的文件名：`psychologymap-v2-framework.md` → `docs/V2_FRAMEWORK.md`，`psychologymap-v2-build-spec.md` → `docs/V2_BUILD_SPEC.md`，`psychologymap-v2.1-spec.md` → `docs/V2_1_SPEC.md`；构建产物 `psychologymap-v2.html` → `index.html`。

# Psychologymap v2 框架

本文件是 v2 的设计基准：先定义知识结构和数据格式，再定义可视化规则。执行者按本文件产出数据和页面；与本文件冲突之处以本文件为准，认为本文件有错时在汇报中指出，不要自行改动骨架。

## 1. 定位

中立的心理学思想地图。不以任何一位人物或学派为中心；荣格与其他人物同等对待，只是"无意识与深度"脉络中的一个学派。

组织原则是**思想脉络**：一条脉络 = 围绕同一个根问题、前后相承的一串学派。脉络之间的分支、汇流、反动是地图的主要内容。旧版的"四个世界"废弃。

## 2. 知识结构

### 2.1 九条脉络

顺序即首页从上到下的排列，相邻的脉络在思想上也相邻；首尾相接（临床 ↔ 脑与生物，经由精神医学）。

| id | 名称 | 根问题 |
|---|---|---|
| bio | 脑与生物 | 心智如何从身体与演化中产生 |
| behavior | 学习与行为 | 经验如何塑造行为 |
| cognition | 意识与认知 | 心智如何加工世界 |
| difference | 个体差异与测量 | 人为何不同、如何度量 |
| development | 毕生发展 | 人如何成为自己 |
| social | 社会与文化 | 他人与文化如何进入内心 |
| humanistic | 人本与意义 | 人如何活出意义 |
| depth | 无意识与深度 | 意识之外的心灵如何运作 |
| clinical | 临床与心理健康 | 痛苦如何被理解与疗愈 |

### 2.2 两岸

- **源头**（1860 以前，不属于任何脉络）：二十个思想来源，清单见 2.6。每个源头标明它主要流入哪几条脉络。
- **应用**（脉络的下游，不单列为脉络）：教育与学习、工作与组织、健康与医疗、司法、设计与人机、公共政策、日常自助。应用心理学的分支（工业组织、健康心理学、学习科学等）作为 `application` 节点，用 `applies` 边连回供给它的学派。

### 2.3 三个互相独立的维度

每个节点同时带三个标签，取代单一父类：

- `thread`（主脉络）+ `alsoThreads`（次脉络，可空）
- `level` 解释层次：`bio` 生物 / `individual` 个体心智 / `relational` 关系 / `sociocultural` 社会文化
- `activity` 活动类型：`theory` 理论 / `research` 基础研究 / `clinical` 临床 / `method` 方法 / `applied` 应用

### 2.4 学派骨架（第一层）

格式：`id｜中文名｜标志年｜标志事件`。标志年必须对应一个可查证的事件，不用"大约某年代"。标 ⚠ 的条目年份把握较低，执行时请核对并在汇报中说明。

**bio**
- localization｜脑功能定位｜1861｜布洛卡报告失语症病例
- neuron-doctrine｜神经元学说｜1891｜瓦尔代尔提出"神经元"一词，总结卡哈尔的工作
- ethology｜动物行为学｜1935｜洛伦茨发表印刻研究
- stress-physiology｜压力生理｜1936｜塞里提出一般适应综合征
- hebbian｜赫布学习与神经可塑性｜1949｜赫布《行为的组织》
- psychopharmacology｜精神药理学｜1952｜氯丙嗪首次用于精神科
- neuropsychology｜神经心理学｜1957｜斯科维尔与米尔纳报告病人 H.M.
- behavior-genetics｜行为遗传学｜1960｜富勒与汤普森《行为遗传学》
- split-brain｜裂脑研究｜1962｜加扎尼加、博根、斯佩里的首批报告
- molecular-memory｜记忆的分子机制｜1970｜坎德尔的海兔研究 ⚠
- cognitive-neuroscience｜认知神经科学｜1979｜学科名称在 1970 年代末形成（加扎尼加与乔治·米勒）⚠
- evolutionary｜进化心理学｜1992｜《适应的心智》
- affective-neuroscience｜情感神经科学｜1994｜达马西奥《笛卡尔的错误》

**behavior**
- law-of-effect｜效果律｜1898｜桑代克迷箱实验
- classical-conditioning｜经典条件作用｜1903｜巴甫洛夫马德里报告
- behaviorism｜行为主义｜1913｜华生《行为主义者眼中的心理学》
- neo-behaviorism｜新行为主义｜1932｜托尔曼《动物和人的目的性行为》
- operant｜操作性条件作用｜1938｜斯金纳《有机体的行为》
- behavior-therapy｜行为治疗｜1958｜沃尔普《交互抑制心理治疗》
- social-learning｜社会学习理论｜1961｜班杜拉波波玩偶实验
- learned-helplessness｜习得性无助｜1967｜塞利格曼与迈尔的实验
- aba｜应用行为分析｜1968｜《应用行为分析杂志》创刊

**cognition**
- psychophysics｜心理物理学｜1860｜费希纳《心理物理学纲要》
- experimental｜实验心理学｜1879｜冯特在莱比锡建立实验室
- memory-experiment｜记忆的实验研究｜1885｜艾宾浩斯《论记忆》
- functionalism｜机能主义｜1890｜詹姆斯《心理学原理》
- gestalt｜格式塔心理学｜1912｜韦特海默似动现象论文
- schema｜图式与记忆重构｜1932｜巴特利特《记忆》
- cognitive-revolution｜认知革命｜1956｜MIT 信息论研讨会；米勒"神奇的数字 7±2"
- cognitive-psychology｜认知心理学｜1967｜奈瑟《认知心理学》
- heuristics-biases｜启发式与偏差｜1974｜特沃斯基与卡尼曼《科学》论文
- connectionism｜联结主义｜1986｜鲁梅尔哈特与麦克莱兰《并行分布加工》
- embodied｜具身认知｜1991｜瓦雷拉等《具身心智》
- predictive-processing｜预测加工｜2010｜弗里斯顿自由能原理综述

**difference**
- individual-differences｜个体差异研究｜1869｜高尔顿《遗传的天才》
- g-factor｜g 因素与因子分析｜1904｜斯皮尔曼论文
- intelligence-testing｜智力测验｜1905｜比奈—西蒙量表
- trait｜特质论｜1937｜奥尔波特《人格：心理学的解释》
- factor-personality｜因素人格模型｜1947｜艾森克《人格的维度》
- test-theory｜测验理论（信度与效度）｜1955｜克隆巴赫与米尔提出构念效度
- person-situation｜人—情境之争｜1968｜米歇尔《人格与评估》
- multiple-intelligences｜多元智力｜1983｜加德纳《智能的结构》
- big-five｜大五人格｜1985｜科斯塔与麦克雷 NEO 人格量表
- open-science｜可重复性危机与开放科学｜2011｜《假阳性心理学》论文

**development**
- child-study｜儿童研究运动｜1883｜霍尔《儿童心理的内容》
- sociocultural｜社会文化理论｜1934｜维果茨基《思维与语言》
- cognitive-development｜认知发展理论｜1936｜皮亚杰《儿童智力的起源》
- psychosocial｜心理社会发展阶段｜1950｜埃里克森《童年与社会》
- attachment｜依恋理论｜1958｜鲍尔比《孩子与母亲联结的性质》
- moral-development｜道德发展｜1958｜科尔伯格博士论文
- ecological｜生态系统理论｜1979｜布朗芬布伦纳《人类发展生态学》
- lifespan｜毕生发展心理学｜1980｜巴尔特斯等的《年度综述》文章
- theory-of-mind｜心理理论｜1983｜威默与佩尔纳错误信念任务
- infant-cognition｜婴儿认知研究｜1985｜巴亚尔容等对 5 个月婴儿客体永存的实验

**social**
- crowd｜群体心理学｜1895｜勒庞《乌合之众》
- field-theory｜场论与群体动力｜1936｜勒温《拓扑心理学原理》
- conformity-obedience｜从众与服从｜1951｜阿希线段实验（米尔格拉姆 1963）
- prejudice｜偏见研究｜1954｜奥尔波特《偏见的本质》
- dissonance｜认知失调｜1957｜费斯廷格《认知失调理论》
- attribution｜归因理论｜1958｜海德《人际关系心理学》
- indigenous｜本土心理学｜1971｜土居健郎《"甘え"的构造》（华人本土心理学：杨国枢，1980 年代）
- social-identity｜社会认同理论｜1979｜塔菲尔与特纳
- social-cognition｜社会认知｜1984｜菲斯克与泰勒《社会认知》
- cultural｜文化心理学｜1991｜马库斯与北山忍《文化与自我》

**humanistic**
- needs｜需求层次与自我实现｜1943｜马斯洛《人类动机理论》
- logotherapy｜意义治疗｜1946｜弗兰克尔《活出生命的意义》
- person-centered｜来访者中心疗法｜1951｜罗杰斯《来访者中心治疗》
- gestalt-therapy｜格式塔治疗｜1951｜皮尔斯等《格式塔治疗》
- existential｜存在主义心理治疗｜1958｜罗洛·梅等编《存在》
- flow｜心流｜1975｜契克森米哈赖《超越无聊与焦虑》
- sdt｜自我决定理论｜1985｜德西与瑞安《内在动机与自我决定》
- eft｜情绪聚焦治疗｜1988｜格林伯格与约翰逊《伴侣情绪聚焦治疗》
- positive｜积极心理学｜1998｜塞利格曼任 APA 主席时倡议

**depth**
- dissociation｜催眠、癔症与解离｜1889｜让内《心理自动症》（沙可，1880 年代）
- psychoanalysis｜经典精神分析｜1895｜布洛伊尔与弗洛伊德《癔症研究》
- individual-psychology｜个体心理学｜1912｜阿德勒成立个体心理学会
- analytical-psychology｜分析心理学｜1913｜荣格与弗洛伊德决裂并采用此名称
- object-relations｜客体关系｜1932｜克莱因《儿童精神分析》
- ego-psychology｜自我心理学｜1936｜安娜·弗洛伊德《自我与防御机制》
- neo-freudian｜新弗洛伊德学派｜1937｜霍妮《我们时代的神经症人格》
- post-jungian｜后荣格与原型心理学｜1949｜诺伊曼《意识的起源与历史》
- lacanian｜拉康派｜1953｜罗马报告
- self-psychology｜自体心理学｜1971｜科胡特《自体的分析》
- relational｜关系精神分析｜1983｜格林伯格与米切尔《精神分析理论中的客体关系》
- mentalization｜心智化｜1991｜福纳吉等关于反思功能的论文 ⚠

**clinical**
- clinical-psychology｜临床心理学诞生｜1896｜威特默在宾大开设心理诊所
- nosology｜现代精神病学分类｜1899｜克雷佩林教科书第六版
- morita｜森田疗法｜1919｜森田正马创立
- dsm｜DSM／ICD 诊断体系｜1952｜DSM 第一版（转折点：1980 年 DSM-III）
- cognitive-therapies｜认知取向治疗｜1955｜艾利斯开始理性治疗（贝克《抑郁症》1967）
- family-systems｜家庭系统治疗｜1956｜贝特森等提出双重束缚
- common-factors｜共同因素｜1961｜弗兰克《说服与治疗》
- biopsychosocial｜生物—心理—社会模型｜1977｜恩格尔《科学》论文
- cbt｜认知行为治疗的整合｜1977｜梅钦鲍姆《认知行为矫正》
- mbsr｜正念减压｜1979｜卡巴金在麻省大学医学中心开设门诊
- trauma｜创伤研究与 PTSD｜1980｜DSM-III 纳入 PTSD
- third-wave｜第三浪潮｜1991｜莱恩汉 DBT 首个随机对照试验（ACT 1999，MBCT 2002）
- ebp｜循证心理实践｜1995｜APA 第 12 分会工作组报告
- dimensional｜维度化模型（RDoC／HiTOP）｜2010｜NIMH 发布 RDoC

### 2.5 关键的跨脉络关系

执行时全部录入，并补充脉络内部的关系。格式：`from → to｜类型｜理由`。

- experimental → behaviorism｜reacts｜反对内省法，只研究可观察的行为
- functionalism → behaviorism｜develops｜关注适应与功能，为行为研究铺路
- behaviorism → cognitive-revolution｜reacts｜乔姆斯基等指出刺激—反应无法解释语言与思维
- neo-behaviorism → cognitive-revolution｜bridges｜托尔曼的"认知地图"在行为主义内部引入内部表征
- gestalt → field-theory｜develops｜勒温出身柏林格式塔学派，把"场"用于社会行为
- gestalt → cognitive-psychology｜bridges｜整体知觉与问题解决研究被认知心理学吸收
- cognitive-development → cognitive-revolution｜bridges｜皮亚杰对心理结构的研究是认知转向的欧洲来源
- social-learning → cognitive-psychology｜bridges｜观察学习引入注意、记忆等认知过程
- psychoanalysis → cognitive-therapies｜reacts｜艾利斯与贝克都受精神分析训练，后因其难以检验而另立
- cognitive-revolution → cognitive-therapies｜bridges｜提供"信念与信息加工影响情绪"的理论语言
- behavior-therapy → cbt｜merges｜暴露、行为激活等技术并入
- cognitive-therapies → cbt｜merges｜认知重评并入
- dissociation → psychoanalysis｜develops｜弗洛伊德 1885 年随沙可学习
- dissociation → trauma｜bridges｜让内的解离理论在 1980 年代创伤研究中被重新发现
- psychoanalysis → person-centered｜reacts｜反对把人看作被驱力决定
- behaviorism → needs｜reacts｜人本主义自称"第三势力"，同时反对行为主义与精神分析
- analytical-psychology → needs｜bridges｜个体化与自我实现的观念相通
- object-relations → attachment｜merges｜鲍尔比出身客体关系训练
- ethology → attachment｜merges｜印刻与亲子联结的动物研究
- attachment → mentalization｜develops｜以依恋研究解释理解他人心理的能力
- psychoanalysis → psychosocial｜develops｜埃里克森把性心理阶段扩展为终生的心理社会阶段
- sociocultural → cultural｜bridges｜"心理过程以文化工具为中介"的思想来源
- individual-differences → behavior-genetics｜develops｜高尔顿的双生子法
- individual-differences → intelligence-testing｜develops｜（脉络内，列出以示完整）
- g-factor → big-five｜develops｜因子分析方法
- person-situation → trait｜critiques｜行为的跨情境一致性低于特质论的假设
- cognitive-revolution → cognitive-neuroscience｜merges｜认知模型
- neuropsychology → cognitive-neuroscience｜merges｜脑损伤病例与成像方法
- hebbian → connectionism｜develops｜"一起放电的神经元连在一起"成为网络学习规则
- stress-physiology → biopsychosocial｜bridges｜压力把社会处境与身体疾病连起来
- nosology → dsm｜develops｜描述性分类传统
- psychopharmacology → dsm｜bridges｜药物试验需要可靠的诊断标准，推动 DSM-III ⚠
- dimensional → dsm｜critiques｜类别诊断的共病与异质性问题
- cognitive-neuroscience → dimensional｜merges｜RDoC 以神经环路组织研究
- big-five → dimensional｜bridges｜HiTOP 沿用人格的维度与层级结构
- mbsr → third-wave｜merges｜正念练习
- cbt → third-wave｜develops｜从改变想法的内容转向改变人与想法的关系
- morita → third-wave｜bridges｜"顺其自然、为所当为"与接纳取向相近，但无直接师承 ⚠
- learned-helplessness → positive｜develops｜塞利格曼从无助转向乐观与福祉
- needs → positive｜develops｜继承对成长与潜能的关注
- positive → needs｜critiques｜批评人本主义缺少实证方法
- heuristics-biases → 应用·公共政策｜applies｜行为经济学与助推
- cultural → cognitive-psychology｜critiques｜许多"普遍"结论只在西方样本上成立
- open-science → social-cognition｜critiques｜若干启动效应未能重复
- affective-neuroscience → trauma｜bridges｜恐惧与威胁环路的研究

### 2.6 源头

格式：`id｜名称｜年份（负数为公元前，用于定位）｜时间说法｜一句话｜流入的脉络（第一个为主）｜直接流向的学派（可空）`。

- hippocrates｜体液说与气质｜-400｜约公元前 400 年｜希波克拉底学派用四种体液解释性情与疾病，是气质类型学的源头｜difference,clinical,bio｜factor-personality
- buddhist｜佛教的禅修与心识分析｜-450｜约公元前 5 世纪起｜以系统的内观训练观察注意、感受与念头的生灭｜clinical,humanistic｜mbsr
- aristotle｜亚里士多德《论灵魂》｜-350｜约公元前 350 年｜把灵魂当作生命体的功能来研究，并提出观念靠相似、对比、接近而联结｜cognition,behavior｜
- confucian-daoist｜儒道的心性修养｜-300｜先秦｜把人格看作在关系与修养中养成的过程｜social,humanistic｜indigenous
- stoic｜斯多葛学派｜100｜公元前 3 世纪至公元 2 世纪｜爱比克泰德：困扰人的不是事情，而是人对事情的看法｜clinical,humanistic｜cognitive-therapies
- avicenna｜伊本·西那《医典》｜1025｜1025｜在医学体系中描述并分类了忧郁、躁狂等心理病症｜clinical,bio｜nosology
- descartes｜笛卡尔的身心二元论｜1641｜1641｜《第一哲学沉思集》把心与身分开，留下"两者如何相互作用"的问题｜bio,cognition｜
- locke｜经验论与联想主义｜1690｜1690｜洛克《人类理解论》：心灵如白板，观念来自经验及其联结｜behavior,cognition｜law-of-effect
- rousseau｜卢梭的儿童观｜1762｜1762｜《爱弥儿》主张童年有自身的阶段与价值｜development｜child-study
- mesmer｜催眠术的前身｜1774｜1774 起｜梅斯梅尔的"动物磁气"后被布雷德在 1843 年改称催眠，开启对暗示与意识分离的研究｜depth,clinical｜dissociation
- kant｜康德的先验范畴｜1781｜1781｜《纯粹理性批判》：心灵用自带的结构组织经验｜cognition,development｜gestalt
- pinel｜精神病院改革｜1793｜1793｜皮内尔在比塞特医院推行"道德治疗"，把疯癫当作可治疗的疾病｜clinical｜nosology
- gall｜颅相学｜1810｜1810｜加尔认为不同心理功能位于不同脑区；头骨测量是伪科学，但"功能定位"的想法被保留下来｜bio,difference｜localization
- schopenhauer｜无意识的意志｜1819｜1819｜叔本华《作为意志和表象的世界》：驱动人的是非理性的意志（哈特曼《无意识哲学》，1869）｜depth｜psychoanalysis
- weber｜韦伯定律｜1834｜1834｜韦伯发现能察觉的差别与刺激强度成固定比例，感觉第一次被测量｜cognition｜psychophysics
- quetelet｜社会统计与"平均人"｜1835｜1835｜凯特勒《论人》把正态分布用于人的特征｜difference,social｜individual-differences
- kierkegaard｜存在哲学的开端｜1844｜1844｜克尔凯郭尔《焦虑的概念》：焦虑来自人面对自由与可能性｜humanistic｜existential
- helmholtz｜感官生理学｜1850｜1850｜赫尔姆霍兹测出神经传导速度，说明心理过程需要时间、可以测量｜bio,cognition｜experimental
- darwin｜进化论｜1859｜1859｜《物种起源》；1872 年《人和动物的表情》把情绪放进演化的连续谱｜bio,difference,development｜functionalism
- volkerpsychologie｜民族心理学｜1860｜1860｜拉扎勒斯与施泰因塔尔创办杂志，研究语言、习俗与集体心理｜social｜crowd

### 2.7 近年与前沿

标志年在 2010 年及以后的学派一律带 `status:'emerging'`（进行中），不论它列在 2.4 还是本节；本节里早于 2010 年的三条（奖赏预测误差、神经精神分析、自我关怀）是已成型学派，2.4 里的预测加工、开放科学、维度化模型则属于进行中。按此规则共 23 个进行中。它们的重要性还没有经过时间检验，不打历史影响分，界面上与已成型的学派区别显示。地图的右端（沙漏的底部）是开放的，不封口。这一节会随时间增补。

**bio**
- connectome｜人脑连接组｜2010｜NIH 人脑连接组计划启动
- psychiatric-genomics｜精神疾病基因组学｜2014｜精神疾病基因组学联盟报告精神分裂症的 108 个相关位点

**behavior**
- reward-prediction｜奖赏预测误差｜1997｜舒尔茨、达扬与蒙塔古《预测与奖赏的神经基础》
- computational-rl｜计算强化学习｜2015｜深度强化学习在《自然》发表，学习理论与人工智能汇合

**cognition**
- deep-learning-models｜深度学习作为认知模型｜2012｜AlexNet 在图像识别竞赛中大幅领先
- llm-cognition｜大语言模型与认知研究｜2022｜ChatGPT 发布，语言模型成为心理学的研究对象与工具

**difference**
- digital-footprints｜数字足迹与人格预测｜2013｜科辛斯基等用社交媒体点赞预测人格特质
- network-psychometrics｜症状网络模型｜2013｜博斯布姆与克拉默的综述
- large-replications｜大规模重复研究｜2015｜开放科学合作组重复 100 项研究

**development**
- abcd｜青少年脑认知发展队列｜2015｜美国 ABCD 研究获资助启动（2016 年起招募），追踪一万多名儿童
- digital-childhood｜屏幕与青少年心理之争｜2017｜特温格《i 世代》引发持续争论

**social**
- weird｜样本多样性批评（WEIRD）｜2010｜亨里奇等《世界上最怪异的人？》
- moral-foundations｜道德基础理论｜2012｜海特《正义之心》
- misinformation｜错误信息与极化研究｜2018｜《科学》刊出对网络真假新闻传播的大规模分析

**humanistic**
- self-compassion｜自我关怀｜2003｜内夫提出概念并发表量表
- pp2｜第二波积极心理学｜2016｜洛马斯与伊夫赞提出，主张把痛苦与意义纳入福祉研究

**depth**
- neuropsychoanalysis｜神经精神分析｜2000｜国际神经精神分析学会成立
- psychodynamic-evidence｜心理动力治疗的实证研究｜2010｜谢德勒《心理动力治疗的疗效》

**clinical**
- unified-protocol｜跨诊断统一方案｜2011｜巴洛等出版情绪障碍统一治疗方案
- digital-mental-health｜数字心理健康｜2017｜美国 FDA 批准首个处方数字疗法
- process-based｜基于过程的治疗｜2018｜海斯与霍夫曼《基于过程的 CBT》
- icd-11｜ICD-11 与复杂性 PTSD｜2019｜世界卫生大会通过 ICD-11
- psychedelic-therapy｜迷幻药辅助治疗｜2021｜MDMA 辅助治疗 PTSD 的三期试验结果发表

### 2.8 近年条目的关系

- connectionism → deep-learning-models｜develops｜多层网络加上大数据与算力
- deep-learning-models → llm-cognition｜develops｜同一类网络用于语言
- operant → reward-prediction｜bridges｜强化被写成可计算的预测误差信号
- reward-prediction → computational-rl｜develops｜同一套算法驱动人工智能体
- behavior-genetics → psychiatric-genomics｜develops｜从双生子估计遗传率走向在基因组上找位点
- cognitive-neuroscience → connectome｜develops｜从单个脑区转向全脑连接
- cognitive-neuroscience → abcd｜develops｜把脑成像放进大规模追踪研究
- big-five → digital-footprints｜develops｜用线上行为数据预测大五得分
- network-psychometrics → dsm｜critiques｜症状彼此引发，不必假设背后有一个潜在疾病
- open-science → large-replications｜develops｜把"能否重复"变成可以统计的问题
- cultural → weird｜develops｜把文化差异的发现推进为对取样方式的批评
- moral-development → moral-foundations｜reacts｜主张道德判断先凭直觉，推理在后
- social-cognition → misinformation｜develops｜把信念形成的研究用于网络信息环境
- pp2 → positive｜critiques｜只讲积极面，忽略了痛苦在美好生活中的位置
- mbsr → self-compassion｜bridges｜取自佛教的"慈悲"，并以正念为成分
- cognitive-neuroscience → neuropsychoanalysis｜bridges｜用脑损伤与成像研究检验精神分析的概念
- psychoanalysis → psychodynamic-evidence｜develops｜用随机对照试验与元分析检验动力治疗
- cbt → unified-protocol｜develops｜一套方案处理多种情绪障碍的共同机制
- third-wave → process-based｜develops｜从"哪种疗法"转向"哪个改变过程"
- cbt → digital-mental-health｜develops｜把结构化的治疗做成程序与应用
- psychopharmacology → psychedelic-therapy｜develops｜药物与心理治疗在同一疗程中配合
- trauma → icd-11｜develops｜长期反复创伤的后果被单列为复杂性 PTSD

## 3. 数据格式

单个文件 `data/psychologymap-data.js`，内容为 `window.PSYMAP = { ... }`（页面以 file:// 打开，不能用 fetch 读 JSON）。全部用中文撰写，另给英文名用于搜索；日文暂缓。

```js
window.PSYMAP = {
  meta: { version, generated, counts },
  threads: [{ id, order, title:{zh,en}, question:{zh}, color }],
  roots: [{ id, title:{zh,en}, year, summary:{zh}, feeds:[schoolId] }],
  nodes: [ /* 见下 */ ],
  edges: [{ from, to, type, note:{zh}, year?, confidence }],
  questions: [{ id, title:{zh}, lenses:[{ node, take:{zh} }] }],
  debates: [{ id, title:{zh}, year, sides:[{ node, position:{zh} }], summary:{zh} }],
  myths: [{ id, claim:{zh}, verdict, correction:{zh}, related:[nodeId] }]
};
```

### 3.1 节点

所有节点共有：`id`（kebab-case，全局唯一）、`type`、`title:{zh,en}`、`summary:{zh}`（一到两句，说人话）、`confidence`（`high`｜`medium`｜`low`，指对事实与年份的把握）。

| type | 追加字段 |
|---|---|
| `school` 学派／运动 | `thread`, `alsoThreads`, `level`, `activity`, `year`, `yearEnd?`, `landmark:{zh}`, `tier`, `influence`, `evidence`, `evidenceNote:{zh}`, `popularity` |
| `theory` 理论／模型 | `school`, `year`, `landmark:{zh}`, `people:[personId]`, `influence`, `evidence`, `evidenceNote:{zh}`, `popularity` |
| `person` 人物 | `name:{zh,en}`, `born`, `died?`, `schools:[schoolId]`（可多个）, `role:{zh}` |
| `concept` 概念 | `school`, `plain:{zh}` 白话定义, `example:{zh}` 生活例子, `misuse:{zh}` 常见误用 |
| `work` 书 | `author`, `year`, `schools:[schoolId]`, `theories?:[theoryId]`, `role`, `depth`（沿用旧版取值） |
| `application` 应用分支 | `domain`（教育／组织／健康／司法／设计／政策／自助）, `year`, `landmark:{zh}` |

- `tier`：1 = 首页就显示（每条脉络最多 7 个），2 = 放大后显示。
- `status`（学派）：`established`（默认）或 `emerging`（2010 年以后登场，见 2.7）。`emerging` 的条目不填 `influence`，`evidence` 照常填写。
- 源头条目放在 `roots`：`{ id, title:{zh,en}, year, when:{zh}, summary:{zh}, threads:[threadId], to?:schoolId }`。
- 一个人物可属于多个学派（如班杜拉、鲍尔比），不要复制成两个人。

### 3.2 关系类型

| type | 含义 | 方向 |
|---|---|---|
| `develops` | 发展、继承 | 前者 → 后者 |
| `branches` | 带分歧的分出、决裂 | 母体 → 分支 |
| `reacts` | 以反对前者来定义自己 | 被反对者 → 反对者 |
| `merges` | 作为来源之一汇入 | 来源 → 汇成者 |
| `bridges` | 概念被借用，无师承 | 来源 → 借用者 |
| `critiques` | 实证或概念上的批评、修正 | 批评者 → 被批评者 |
| `applies` | 理论被用于某个应用分支 | 理论 → 应用 |

每条边必须有 `note`（一句理由，≤40 字）。类型由人判断，禁止按规律批量生成。没有把握的边标 `confidence:'medium'` 或不录。

结构性关系不进 `edges`，由字段表达：理论属于学派（`school`）、人物提出理论（`people`）、书对应学派（`schools`）。

### 3.3 三项评分

三项互相独立，不合并成总分。

- `influence` 历史影响，1–5。5 = 改变了整个学科的走向（如行为主义、认知革命、精神分析）；3 = 在本脉络内重要；1 = 小众。**5 分不超过学派总数的 15%，4–5 分合计不超过 40%。**
- `evidence` 证据状况，枚举：`strong` 大量可重复的研究支持｜`moderate` 有支持但有边界｜`mixed` 结论不一或存在重复失败｜`limited` 研究少｜`historical` 主要是历史意义，核心主张已被修正｜`conceptual` 属于哲学或解释框架，不以实验检验。配 `evidenceNote` 一句说明。
- `popularity` 大众知名度，1–5。与学术地位无关（MBTI 知名度高、证据弱，就如实标）。

### 3.4 数量目标

| 内容 | 目标 |
|---|---|
| 学派 | 骨架 99 个 + 近年与前沿 23 个，可增不可删 |
| 源头 | 2.6 的 20 个 |
| 关系 | ≥ 160（含 2.5 与 2.8 的全部关系） |
| 理论 | ≥ 110（旧版 62 条全部迁移并重新归属） |
| 人物 | ≥ 120（旧版人物全部迁移） |
| 概念 | ≥ 60 |
| 书 | 旧版全部迁移，每条脉络 ≥ 12 本，每个学派至少 1 本书或标志性文献 |
| 问题入口 | 12（如拖延、焦虑、亲密关系中的重复模式、原生家庭、自卑、意义感、习惯、从众、记忆可靠吗、性格能改吗、创伤、专注），每个 ≥ 3 个不同脉络的解释 |
| 争论 | 10（如弗洛伊德与荣格决裂、行为主义与认知革命、人—情境之争、先天与后天、DSM 与维度模型、可重复性危机） |
| 流行误读 | 10（如 MBTI、马斯洛"金字塔"、左右脑人格、斯坦福监狱实验、只用了 10% 的大脑） |

### 3.5 质量规则

- 不编造。年份、书名、人名拿不准就标 `confidence` 并在汇报里列出；宁可少录。
- 旧版数据的归属错误要纠正：依恋理论归 `development`（次脉络 `depth`）；大五人格归 `difference`；心理测量归 `difference`；组织心理与学习科学改为 `application` 节点。
- 旧版每个体系里的"与荣格路径的关系"字段不迁移。
- `summary` 面向爱好者：不堆术语，不写"深刻影响""广泛应用"这类空话，写它具体主张什么。

## 4. 可视化框架

### 4.1 首页的三种读法

| 模式 | 排列依据 | 回答的问题 |
|---|---|---|
| 脉络（默认） | 时间 × 九条脉络 | 思想怎样生长、彼此影响 |
| 结构 | 解释层次 × 活动类型的矩阵 | 现在的心理学由哪些部分组成 |
| 人物 | 人物按年代或影响排列 | 这些思想是谁提出的 |

"脉络"模式的画法待定（样本见 `visual-samples.html`：A 长河／B 线路图／C 群山）。

### 4.2 层级

全景（脉络与 tier 1 学派）→ 学派（全部学派与关系）→ 理论与人物 → 概念与书。层级用面包屑明确显示和切换，缩放只是快捷方式。各层的时间轴方向一致（桌面横向）。

### 4.3 桌面

- 首页按窗口尺寸排版，不与详情层共用固定画布；任何标签不小于 12px。
- 标题与说明文字不压在图上。
- 悬停一个节点：只高亮它的关系，其余淡化；点击锁定并打开右侧详情栏。
- 详情栏：一句话主张、三项评分、关系列表（带理由）、相关概念、阅读阶梯。
- 筛选：年代、脉络、证据状况、活动类型。两个节点可并排对比。
- 搜索给出结果列表。每个节点有可分享的链接（URL hash）。

### 4.4 手机

- 不缩小桌面地图。时间改为纵向，上下滑动；脉络用顶部标签横向切换，一次看一条。
- 关系不画线，写成节点卡片上的标签（"汇入 毕生发展 · 依恋理论"），点按跳转。
- 详情用底部抽屉。导航用底部标签栏：脉络／问题／人物／阅读。
- 点一下展开，点标题进入；可点区域不小于 44px。

### 4.5 保留

山峰底图保留；现有的中层（人物 × 理论）与底层（书）内容全部保留并迁入新数据。
