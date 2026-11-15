// Provisional skeleton derived from the framework document. Superseded by psychologymap-data.js once reviewed.
window.PSYMAP_SKELETON = {
 "meta": {
  "provisional": true,
  "source": "psychologymap-v2-framework.md §2.4–2.5"
 },
 "threads": [
  {
   "id": "bio",
   "order": 0,
   "title": {
    "zh": "脑与生物",
    "en": "Brain & biology"
   },
   "question": {
    "zh": "心智如何从身体与演化中产生"
   },
   "color": "#3987e5"
  },
  {
   "id": "behavior",
   "order": 1,
   "title": {
    "zh": "学习与行为",
    "en": "Learning & behavior"
   },
   "question": {
    "zh": "经验如何塑造行为"
   },
   "color": "#d95926"
  },
  {
   "id": "cognition",
   "order": 2,
   "title": {
    "zh": "意识与认知",
    "en": "Mind & cognition"
   },
   "question": {
    "zh": "心智如何加工世界"
   },
   "color": "#199e70"
  },
  {
   "id": "difference",
   "order": 3,
   "title": {
    "zh": "个体差异与测量",
    "en": "Differences & measurement"
   },
   "question": {
    "zh": "人为何不同、如何度量"
   },
   "color": "#c98500"
  },
  {
   "id": "development",
   "order": 4,
   "title": {
    "zh": "毕生发展",
    "en": "Lifespan development"
   },
   "question": {
    "zh": "人如何成为自己"
   },
   "color": "#d55181"
  },
  {
   "id": "social",
   "order": 5,
   "title": {
    "zh": "社会与文化",
    "en": "Society & culture"
   },
   "question": {
    "zh": "他人与文化如何进入内心"
   },
   "color": "#0ca30c"
  },
  {
   "id": "humanistic",
   "order": 6,
   "title": {
    "zh": "人本与意义",
    "en": "Humanistic & meaning"
   },
   "question": {
    "zh": "人如何活出意义"
   },
   "color": "#9085e9"
  },
  {
   "id": "depth",
   "order": 7,
   "title": {
    "zh": "无意识与深度",
    "en": "Depth & the unconscious"
   },
   "question": {
    "zh": "意识之外的心灵如何运作"
   },
   "color": "#e66767"
  },
  {
   "id": "clinical",
   "order": 8,
   "title": {
    "zh": "临床与心理健康",
    "en": "Clinical & mental health"
   },
   "question": {
    "zh": "痛苦如何被理解与疗愈"
   },
   "color": "#12a4b8"
  }
 ],
 "roots": [
  {
   "id": "hippocrates",
   "type": "root",
   "title": {
    "zh": "体液说与气质"
   },
   "year": -400,
   "when": {
    "zh": "约公元前 400 年"
   },
   "summary": {
    "zh": "希波克拉底学派用四种体液解释性情与疾病，是气质类型学的源头"
   },
   "threads": [
    "difference",
    "clinical",
    "bio"
   ],
   "to": "factor-personality"
  },
  {
   "id": "buddhist",
   "type": "root",
   "title": {
    "zh": "佛教的禅修与心识分析"
   },
   "year": -450,
   "when": {
    "zh": "约公元前 5 世纪起"
   },
   "summary": {
    "zh": "以系统的内观训练观察注意、感受与念头的生灭"
   },
   "threads": [
    "clinical",
    "humanistic"
   ],
   "to": "mbsr"
  },
  {
   "id": "aristotle",
   "type": "root",
   "title": {
    "zh": "亚里士多德《论灵魂》"
   },
   "year": -350,
   "when": {
    "zh": "约公元前 350 年"
   },
   "summary": {
    "zh": "把灵魂当作生命体的功能来研究，并提出观念靠相似、对比、接近而联结"
   },
   "threads": [
    "cognition",
    "behavior"
   ],
   "to": null
  },
  {
   "id": "confucian-daoist",
   "type": "root",
   "title": {
    "zh": "儒道的心性修养"
   },
   "year": -300,
   "when": {
    "zh": "先秦"
   },
   "summary": {
    "zh": "把人格看作在关系与修养中养成的过程"
   },
   "threads": [
    "social",
    "humanistic"
   ],
   "to": "indigenous"
  },
  {
   "id": "stoic",
   "type": "root",
   "title": {
    "zh": "斯多葛学派"
   },
   "year": 100,
   "when": {
    "zh": "公元前 3 世纪至公元 2 世纪"
   },
   "summary": {
    "zh": "爱比克泰德：困扰人的不是事情，而是人对事情的看法"
   },
   "threads": [
    "clinical",
    "humanistic"
   ],
   "to": "cognitive-therapies"
  },
  {
   "id": "avicenna",
   "type": "root",
   "title": {
    "zh": "伊本·西那《医典》"
   },
   "year": 1025,
   "when": {
    "zh": "1025"
   },
   "summary": {
    "zh": "在医学体系中描述并分类了忧郁、躁狂等心理病症"
   },
   "threads": [
    "clinical",
    "bio"
   ],
   "to": "nosology"
  },
  {
   "id": "descartes",
   "type": "root",
   "title": {
    "zh": "笛卡尔的身心二元论"
   },
   "year": 1641,
   "when": {
    "zh": "1641"
   },
   "summary": {
    "zh": "《第一哲学沉思集》把心与身分开，留下\"两者如何相互作用\"的问题"
   },
   "threads": [
    "bio",
    "cognition"
   ],
   "to": null
  },
  {
   "id": "locke",
   "type": "root",
   "title": {
    "zh": "经验论与联想主义"
   },
   "year": 1690,
   "when": {
    "zh": "1690"
   },
   "summary": {
    "zh": "洛克《人类理解论》：心灵如白板，观念来自经验及其联结"
   },
   "threads": [
    "behavior",
    "cognition"
   ],
   "to": "law-of-effect"
  },
  {
   "id": "rousseau",
   "type": "root",
   "title": {
    "zh": "卢梭的儿童观"
   },
   "year": 1762,
   "when": {
    "zh": "1762"
   },
   "summary": {
    "zh": "《爱弥儿》主张童年有自身的阶段与价值"
   },
   "threads": [
    "development"
   ],
   "to": "child-study"
  },
  {
   "id": "mesmer",
   "type": "root",
   "title": {
    "zh": "催眠术的前身"
   },
   "year": 1774,
   "when": {
    "zh": "1774 起"
   },
   "summary": {
    "zh": "梅斯梅尔的\"动物磁气\"后被布雷德在 1843 年改称催眠，开启对暗示与意识分离的研究"
   },
   "threads": [
    "depth",
    "clinical"
   ],
   "to": "dissociation"
  },
  {
   "id": "kant",
   "type": "root",
   "title": {
    "zh": "康德的先验范畴"
   },
   "year": 1781,
   "when": {
    "zh": "1781"
   },
   "summary": {
    "zh": "《纯粹理性批判》：心灵用自带的结构组织经验"
   },
   "threads": [
    "cognition",
    "development"
   ],
   "to": "gestalt"
  },
  {
   "id": "pinel",
   "type": "root",
   "title": {
    "zh": "精神病院改革"
   },
   "year": 1793,
   "when": {
    "zh": "1793"
   },
   "summary": {
    "zh": "皮内尔在比塞特医院推行\"道德治疗\"，把疯癫当作可治疗的疾病"
   },
   "threads": [
    "clinical"
   ],
   "to": "nosology"
  },
  {
   "id": "gall",
   "type": "root",
   "title": {
    "zh": "颅相学"
   },
   "year": 1810,
   "when": {
    "zh": "1810"
   },
   "summary": {
    "zh": "加尔认为不同心理功能位于不同脑区；头骨测量是伪科学，但\"功能定位\"的想法被保留下来"
   },
   "threads": [
    "bio",
    "difference"
   ],
   "to": "localization"
  },
  {
   "id": "schopenhauer",
   "type": "root",
   "title": {
    "zh": "无意识的意志"
   },
   "year": 1819,
   "when": {
    "zh": "1819"
   },
   "summary": {
    "zh": "叔本华《作为意志和表象的世界》：驱动人的是非理性的意志（哈特曼《无意识哲学》，1869）"
   },
   "threads": [
    "depth"
   ],
   "to": "psychoanalysis"
  },
  {
   "id": "weber",
   "type": "root",
   "title": {
    "zh": "韦伯定律"
   },
   "year": 1834,
   "when": {
    "zh": "1834"
   },
   "summary": {
    "zh": "韦伯发现能察觉的差别与刺激强度成固定比例，感觉第一次被测量"
   },
   "threads": [
    "cognition"
   ],
   "to": "psychophysics"
  },
  {
   "id": "quetelet",
   "type": "root",
   "title": {
    "zh": "社会统计与\"平均人\""
   },
   "year": 1835,
   "when": {
    "zh": "1835"
   },
   "summary": {
    "zh": "凯特勒《论人》把正态分布用于人的特征"
   },
   "threads": [
    "difference",
    "social"
   ],
   "to": "individual-differences"
  },
  {
   "id": "kierkegaard",
   "type": "root",
   "title": {
    "zh": "存在哲学的开端"
   },
   "year": 1844,
   "when": {
    "zh": "1844"
   },
   "summary": {
    "zh": "克尔凯郭尔《焦虑的概念》：焦虑来自人面对自由与可能性"
   },
   "threads": [
    "humanistic"
   ],
   "to": "existential"
  },
  {
   "id": "helmholtz",
   "type": "root",
   "title": {
    "zh": "感官生理学"
   },
   "year": 1850,
   "when": {
    "zh": "1850"
   },
   "summary": {
    "zh": "赫尔姆霍兹测出神经传导速度，说明心理过程需要时间、可以测量"
   },
   "threads": [
    "bio",
    "cognition"
   ],
   "to": "experimental"
  },
  {
   "id": "darwin",
   "type": "root",
   "title": {
    "zh": "进化论"
   },
   "year": 1859,
   "when": {
    "zh": "1859"
   },
   "summary": {
    "zh": "《物种起源》；1872 年《人和动物的表情》把情绪放进演化的连续谱"
   },
   "threads": [
    "bio",
    "difference",
    "development"
   ],
   "to": "functionalism"
  },
  {
   "id": "volkerpsychologie",
   "type": "root",
   "title": {
    "zh": "民族心理学"
   },
   "year": 1860,
   "when": {
    "zh": "1860"
   },
   "summary": {
    "zh": "拉扎勒斯与施泰因塔尔创办杂志，研究语言、习俗与集体心理"
   },
   "threads": [
    "social"
   ],
   "to": "crowd"
  }
 ],
 "nodes": [
  {
   "id": "localization",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "脑功能定位"
   },
   "year": 1861,
   "landmark": {
    "zh": "布洛卡报告失语症病例"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "neuron-doctrine",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "神经元学说"
   },
   "year": 1891,
   "landmark": {
    "zh": "瓦尔代尔提出\"神经元\"一词，总结卡哈尔的工作"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "ethology",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "动物行为学"
   },
   "year": 1935,
   "landmark": {
    "zh": "洛伦茨发表印刻研究"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "stress-physiology",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "压力生理"
   },
   "year": 1936,
   "landmark": {
    "zh": "塞里提出一般适应综合征"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "hebbian",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "赫布学习与神经可塑性"
   },
   "year": 1949,
   "landmark": {
    "zh": "赫布《行为的组织》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "psychopharmacology",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "精神药理学"
   },
   "year": 1952,
   "landmark": {
    "zh": "氯丙嗪首次用于精神科"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "neuropsychology",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "神经心理学"
   },
   "year": 1957,
   "landmark": {
    "zh": "斯科维尔与米尔纳报告病人 H.M."
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "behavior-genetics",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "行为遗传学"
   },
   "year": 1960,
   "landmark": {
    "zh": "富勒与汤普森《行为遗传学》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "split-brain",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "裂脑研究"
   },
   "year": 1962,
   "landmark": {
    "zh": "加扎尼加、博根、斯佩里的首批报告"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "molecular-memory",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "记忆的分子机制"
   },
   "year": 1970,
   "landmark": {
    "zh": "坎德尔的海兔研究"
   },
   "status": "established",
   "influence": 2,
   "confidence": "medium",
   "tier": 2
  },
  {
   "id": "cognitive-neuroscience",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "认知神经科学"
   },
   "year": 1979,
   "landmark": {
    "zh": "学科名称在 1970 年代末形成（加扎尼加与乔治·米勒）"
   },
   "status": "established",
   "influence": 4,
   "confidence": "medium",
   "tier": 1
  },
  {
   "id": "evolutionary",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "进化心理学"
   },
   "year": 1992,
   "landmark": {
    "zh": "《适应的心智》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "affective-neuroscience",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "情感神经科学"
   },
   "year": 1994,
   "landmark": {
    "zh": "达马西奥《笛卡尔的错误》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "law-of-effect",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "效果律"
   },
   "year": 1898,
   "landmark": {
    "zh": "桑代克迷箱实验"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "classical-conditioning",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "经典条件作用"
   },
   "year": 1903,
   "landmark": {
    "zh": "巴甫洛夫马德里报告"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "behaviorism",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "行为主义"
   },
   "year": 1913,
   "landmark": {
    "zh": "华生《行为主义者眼中的心理学》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "neo-behaviorism",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "新行为主义"
   },
   "year": 1932,
   "landmark": {
    "zh": "托尔曼《动物和人的目的性行为》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "operant",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "操作性条件作用"
   },
   "year": 1938,
   "landmark": {
    "zh": "斯金纳《有机体的行为》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "behavior-therapy",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "行为治疗"
   },
   "year": 1958,
   "landmark": {
    "zh": "沃尔普《交互抑制心理治疗》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "social-learning",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "社会学习理论"
   },
   "year": 1961,
   "landmark": {
    "zh": "班杜拉波波玩偶实验"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "learned-helplessness",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "习得性无助"
   },
   "year": 1967,
   "landmark": {
    "zh": "塞利格曼与迈尔的实验"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "aba",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "应用行为分析"
   },
   "year": 1968,
   "landmark": {
    "zh": "《应用行为分析杂志》创刊"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "psychophysics",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "心理物理学"
   },
   "year": 1860,
   "landmark": {
    "zh": "费希纳《心理物理学纲要》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "experimental",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "实验心理学"
   },
   "year": 1879,
   "landmark": {
    "zh": "冯特在莱比锡建立实验室"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "memory-experiment",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "记忆的实验研究"
   },
   "year": 1885,
   "landmark": {
    "zh": "艾宾浩斯《论记忆》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "functionalism",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "机能主义"
   },
   "year": 1890,
   "landmark": {
    "zh": "詹姆斯《心理学原理》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "gestalt",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "格式塔心理学"
   },
   "year": 1912,
   "landmark": {
    "zh": "韦特海默似动现象论文"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "schema",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "图式与记忆重构"
   },
   "year": 1932,
   "landmark": {
    "zh": "巴特利特《记忆》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "cognitive-revolution",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "认知革命"
   },
   "year": 1956,
   "landmark": {
    "zh": "MIT 信息论研讨会；米勒\"神奇的数字 7±2\""
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "cognitive-psychology",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "认知心理学"
   },
   "year": 1967,
   "landmark": {
    "zh": "奈瑟《认知心理学》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "heuristics-biases",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "启发式与偏差"
   },
   "year": 1974,
   "landmark": {
    "zh": "特沃斯基与卡尼曼《科学》论文"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "connectionism",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "联结主义"
   },
   "year": 1986,
   "landmark": {
    "zh": "鲁梅尔哈特与麦克莱兰《并行分布加工》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "embodied",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "具身认知"
   },
   "year": 1991,
   "landmark": {
    "zh": "瓦雷拉等《具身心智》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "predictive-processing",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "预测加工"
   },
   "year": 2010,
   "landmark": {
    "zh": "弗里斯顿自由能原理综述"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "individual-differences",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "个体差异研究"
   },
   "year": 1869,
   "landmark": {
    "zh": "高尔顿《遗传的天才》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "g-factor",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "g 因素与因子分析"
   },
   "year": 1904,
   "landmark": {
    "zh": "斯皮尔曼论文"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "intelligence-testing",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "智力测验"
   },
   "year": 1905,
   "landmark": {
    "zh": "比奈—西蒙量表"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "trait",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "特质论"
   },
   "year": 1937,
   "landmark": {
    "zh": "奥尔波特《人格：心理学的解释》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "factor-personality",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "因素人格模型"
   },
   "year": 1947,
   "landmark": {
    "zh": "艾森克《人格的维度》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "test-theory",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "测验理论（信度与效度）"
   },
   "year": 1955,
   "landmark": {
    "zh": "克隆巴赫与米尔提出构念效度"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "person-situation",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "人—情境之争"
   },
   "year": 1968,
   "landmark": {
    "zh": "米歇尔《人格与评估》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "multiple-intelligences",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "多元智力"
   },
   "year": 1983,
   "landmark": {
    "zh": "加德纳《智能的结构》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "big-five",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "大五人格"
   },
   "year": 1985,
   "landmark": {
    "zh": "科斯塔与麦克雷 NEO 人格量表"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "open-science",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "可重复性危机与开放科学"
   },
   "year": 2011,
   "landmark": {
    "zh": "《假阳性心理学》论文"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "child-study",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "儿童研究运动"
   },
   "year": 1883,
   "landmark": {
    "zh": "霍尔《儿童心理的内容》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "sociocultural",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "社会文化理论"
   },
   "year": 1934,
   "landmark": {
    "zh": "维果茨基《思维与语言》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "cognitive-development",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "认知发展理论"
   },
   "year": 1936,
   "landmark": {
    "zh": "皮亚杰《儿童智力的起源》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "psychosocial",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "心理社会发展阶段"
   },
   "year": 1950,
   "landmark": {
    "zh": "埃里克森《童年与社会》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "attachment",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "依恋理论"
   },
   "year": 1958,
   "landmark": {
    "zh": "鲍尔比《孩子与母亲联结的性质》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "moral-development",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "道德发展"
   },
   "year": 1958,
   "landmark": {
    "zh": "科尔伯格博士论文"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "ecological",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "生态系统理论"
   },
   "year": 1979,
   "landmark": {
    "zh": "布朗芬布伦纳《人类发展生态学》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "lifespan",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "毕生发展心理学"
   },
   "year": 1980,
   "landmark": {
    "zh": "巴尔特斯等的《年度综述》文章"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "theory-of-mind",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "心理理论"
   },
   "year": 1983,
   "landmark": {
    "zh": "威默与佩尔纳错误信念任务"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "infant-cognition",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "婴儿认知研究"
   },
   "year": 1985,
   "landmark": {
    "zh": "巴亚尔容等对 5 个月婴儿客体永存的实验"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "crowd",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "群体心理学"
   },
   "year": 1895,
   "landmark": {
    "zh": "勒庞《乌合之众》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "field-theory",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "场论与群体动力"
   },
   "year": 1936,
   "landmark": {
    "zh": "勒温《拓扑心理学原理》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "conformity-obedience",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "从众与服从"
   },
   "year": 1951,
   "landmark": {
    "zh": "阿希线段实验（米尔格拉姆 1963）"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "prejudice",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "偏见研究"
   },
   "year": 1954,
   "landmark": {
    "zh": "奥尔波特《偏见的本质》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "dissonance",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "认知失调"
   },
   "year": 1957,
   "landmark": {
    "zh": "费斯廷格《认知失调理论》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "attribution",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "归因理论"
   },
   "year": 1958,
   "landmark": {
    "zh": "海德《人际关系心理学》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "indigenous",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "本土心理学"
   },
   "year": 1971,
   "landmark": {
    "zh": "土居健郎《\"甘え\"的构造》（华人本土心理学：杨国枢，1980 年代）"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "social-identity",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "社会认同理论"
   },
   "year": 1979,
   "landmark": {
    "zh": "塔菲尔与特纳"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "social-cognition",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "社会认知"
   },
   "year": 1984,
   "landmark": {
    "zh": "菲斯克与泰勒《社会认知》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "cultural",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "文化心理学"
   },
   "year": 1991,
   "landmark": {
    "zh": "马库斯与北山忍《文化与自我》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "needs",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "需求层次与自我实现"
   },
   "year": 1943,
   "landmark": {
    "zh": "马斯洛《人类动机理论》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "logotherapy",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "意义治疗"
   },
   "year": 1946,
   "landmark": {
    "zh": "弗兰克尔《活出生命的意义》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "person-centered",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "来访者中心疗法"
   },
   "year": 1951,
   "landmark": {
    "zh": "罗杰斯《来访者中心治疗》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "gestalt-therapy",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "格式塔治疗"
   },
   "year": 1951,
   "landmark": {
    "zh": "皮尔斯等《格式塔治疗》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "existential",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "存在主义心理治疗"
   },
   "year": 1958,
   "landmark": {
    "zh": "罗洛·梅等编《存在》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "flow",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "心流"
   },
   "year": 1975,
   "landmark": {
    "zh": "契克森米哈赖《超越无聊与焦虑》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "sdt",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "自我决定理论"
   },
   "year": 1985,
   "landmark": {
    "zh": "德西与瑞安《内在动机与自我决定》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "eft",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "情绪聚焦治疗"
   },
   "year": 1988,
   "landmark": {
    "zh": "格林伯格与约翰逊《伴侣情绪聚焦治疗》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "positive",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "积极心理学"
   },
   "year": 1998,
   "landmark": {
    "zh": "塞利格曼任 APA 主席时倡议"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "dissociation",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "催眠、癔症与解离"
   },
   "year": 1889,
   "landmark": {
    "zh": "让内《心理自动症》（沙可，1880 年代）"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "psychoanalysis",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "经典精神分析"
   },
   "year": 1895,
   "landmark": {
    "zh": "布洛伊尔与弗洛伊德《癔症研究》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "individual-psychology",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "个体心理学"
   },
   "year": 1912,
   "landmark": {
    "zh": "阿德勒成立个体心理学会"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "analytical-psychology",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "分析心理学"
   },
   "year": 1913,
   "landmark": {
    "zh": "荣格与弗洛伊德决裂并采用此名称"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "object-relations",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "客体关系"
   },
   "year": 1932,
   "landmark": {
    "zh": "克莱因《儿童精神分析》"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "ego-psychology",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "自我心理学"
   },
   "year": 1936,
   "landmark": {
    "zh": "安娜·弗洛伊德《自我与防御机制》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "neo-freudian",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "新弗洛伊德学派"
   },
   "year": 1937,
   "landmark": {
    "zh": "霍妮《我们时代的神经症人格》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "post-jungian",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "后荣格与原型心理学"
   },
   "year": 1949,
   "landmark": {
    "zh": "诺伊曼《意识的起源与历史》"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "lacanian",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "拉康派"
   },
   "year": 1953,
   "landmark": {
    "zh": "罗马报告"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "self-psychology",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "自体心理学"
   },
   "year": 1971,
   "landmark": {
    "zh": "科胡特《自体的分析》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "relational",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "关系精神分析"
   },
   "year": 1983,
   "landmark": {
    "zh": "格林伯格与米切尔《精神分析理论中的客体关系》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "mentalization",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "心智化"
   },
   "year": 1991,
   "landmark": {
    "zh": "福纳吉等关于反思功能的论文"
   },
   "status": "established",
   "influence": 2,
   "confidence": "medium",
   "tier": 2
  },
  {
   "id": "clinical-psychology",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "临床心理学诞生"
   },
   "year": 1896,
   "landmark": {
    "zh": "威特默在宾大开设心理诊所"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "nosology",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "现代精神病学分类"
   },
   "year": 1899,
   "landmark": {
    "zh": "克雷佩林教科书第六版"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "morita",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "森田疗法"
   },
   "year": 1919,
   "landmark": {
    "zh": "森田正马创立"
   },
   "status": "established",
   "influence": 2,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "dsm",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "DSM／ICD 诊断体系"
   },
   "year": 1952,
   "landmark": {
    "zh": "DSM 第一版（转折点：1980 年 DSM-III）"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "cognitive-therapies",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "认知取向治疗"
   },
   "year": 1955,
   "landmark": {
    "zh": "艾利斯开始理性治疗（贝克《抑郁症》1967）"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "family-systems",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "家庭系统治疗"
   },
   "year": 1956,
   "landmark": {
    "zh": "贝特森等提出双重束缚"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "common-factors",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "共同因素"
   },
   "year": 1961,
   "landmark": {
    "zh": "弗兰克《说服与治疗》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "biopsychosocial",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "生物—心理—社会模型"
   },
   "year": 1977,
   "landmark": {
    "zh": "恩格尔《科学》论文"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "cbt",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "认知行为治疗的整合"
   },
   "year": 1977,
   "landmark": {
    "zh": "梅钦鲍姆《认知行为矫正》"
   },
   "status": "established",
   "influence": 5,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "mbsr",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "正念减压"
   },
   "year": 1979,
   "landmark": {
    "zh": "卡巴金在麻省大学医学中心开设门诊"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "trauma",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "创伤研究与 PTSD"
   },
   "year": 1980,
   "landmark": {
    "zh": "DSM-III 纳入 PTSD"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "third-wave",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "第三浪潮"
   },
   "year": 1991,
   "landmark": {
    "zh": "莱恩汉 DBT 首个随机对照试验（ACT 1999，MBCT 2002）"
   },
   "status": "established",
   "influence": 4,
   "confidence": "high",
   "tier": 1
  },
  {
   "id": "ebp",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "循证心理实践"
   },
   "year": 1995,
   "landmark": {
    "zh": "APA 第 12 分会工作组报告"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "dimensional",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "维度化模型（RDoC／HiTOP）"
   },
   "year": 2010,
   "landmark": {
    "zh": "NIMH 发布 RDoC"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "connectome",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "人脑连接组"
   },
   "year": 2010,
   "landmark": {
    "zh": "NIH 人脑连接组计划启动"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "psychiatric-genomics",
   "type": "school",
   "thread": "bio",
   "title": {
    "zh": "精神疾病基因组学"
   },
   "year": 2014,
   "landmark": {
    "zh": "精神疾病基因组学联盟报告精神分裂症的 108 个相关位点"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "reward-prediction",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "奖赏预测误差"
   },
   "year": 1997,
   "landmark": {
    "zh": "舒尔茨、达扬与蒙塔古《预测与奖赏的神经基础》"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "computational-rl",
   "type": "school",
   "thread": "behavior",
   "title": {
    "zh": "计算强化学习"
   },
   "year": 2015,
   "landmark": {
    "zh": "深度强化学习在《自然》发表，学习理论与人工智能汇合"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "deep-learning-models",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "深度学习作为认知模型"
   },
   "year": 2012,
   "landmark": {
    "zh": "AlexNet 在图像识别竞赛中大幅领先"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "llm-cognition",
   "type": "school",
   "thread": "cognition",
   "title": {
    "zh": "大语言模型与认知研究"
   },
   "year": 2022,
   "landmark": {
    "zh": "ChatGPT 发布，语言模型成为心理学的研究对象与工具"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "digital-footprints",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "数字足迹与人格预测"
   },
   "year": 2013,
   "landmark": {
    "zh": "科辛斯基等用社交媒体点赞预测人格特质"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "network-psychometrics",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "症状网络模型"
   },
   "year": 2013,
   "landmark": {
    "zh": "博斯布姆与克拉默的综述"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "large-replications",
   "type": "school",
   "thread": "difference",
   "title": {
    "zh": "大规模重复研究"
   },
   "year": 2015,
   "landmark": {
    "zh": "开放科学合作组重复 100 项研究"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "abcd",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "青少年脑认知发展队列"
   },
   "year": 2015,
   "landmark": {
    "zh": "美国 ABCD 研究启动，追踪一万多名儿童"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "digital-childhood",
   "type": "school",
   "thread": "development",
   "title": {
    "zh": "屏幕与青少年心理之争"
   },
   "year": 2017,
   "landmark": {
    "zh": "特温格《i 世代》引发持续争论"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "weird",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "样本多样性批评（WEIRD）"
   },
   "year": 2010,
   "landmark": {
    "zh": "亨里奇等《世界上最怪异的人？》"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "moral-foundations",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "道德基础理论"
   },
   "year": 2012,
   "landmark": {
    "zh": "海特《正义之心》"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "misinformation",
   "type": "school",
   "thread": "social",
   "title": {
    "zh": "错误信息与极化研究"
   },
   "year": 2018,
   "landmark": {
    "zh": "《科学》刊出对网络真假新闻传播的大规模分析"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "self-compassion",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "自我关怀"
   },
   "year": 2003,
   "landmark": {
    "zh": "内夫提出概念并发表量表"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "pp2",
   "type": "school",
   "thread": "humanistic",
   "title": {
    "zh": "第二波积极心理学"
   },
   "year": 2016,
   "landmark": {
    "zh": "洛马斯与伊夫赞提出，主张把痛苦与意义纳入福祉研究"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "neuropsychoanalysis",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "神经精神分析"
   },
   "year": 2000,
   "landmark": {
    "zh": "国际神经精神分析学会成立"
   },
   "status": "established",
   "influence": 3,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "psychodynamic-evidence",
   "type": "school",
   "thread": "depth",
   "title": {
    "zh": "心理动力治疗的实证研究"
   },
   "year": 2010,
   "landmark": {
    "zh": "谢德勒《心理动力治疗的疗效》"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "unified-protocol",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "跨诊断统一方案"
   },
   "year": 2011,
   "landmark": {
    "zh": "巴洛等出版情绪障碍统一治疗方案"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "digital-mental-health",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "数字心理健康"
   },
   "year": 2017,
   "landmark": {
    "zh": "美国 FDA 批准首个处方数字疗法"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "process-based",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "基于过程的治疗"
   },
   "year": 2018,
   "landmark": {
    "zh": "海斯与霍夫曼《基于过程的 CBT》"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "icd-11",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "ICD-11 与复杂性 PTSD"
   },
   "year": 2019,
   "landmark": {
    "zh": "世界卫生大会通过 ICD-11"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  },
  {
   "id": "psychedelic-therapy",
   "type": "school",
   "thread": "clinical",
   "title": {
    "zh": "迷幻药辅助治疗"
   },
   "year": 2021,
   "landmark": {
    "zh": "MDMA 辅助治疗 PTSD 的三期试验结果发表"
   },
   "status": "emerging",
   "influence": null,
   "confidence": "high",
   "tier": 2
  }
 ],
 "edges": [
  {
   "from": "experimental",
   "to": "behaviorism",
   "type": "reacts",
   "note": {
    "zh": "反对内省法，只研究可观察的行为"
   },
   "confidence": "high"
  },
  {
   "from": "functionalism",
   "to": "behaviorism",
   "type": "develops",
   "note": {
    "zh": "关注适应与功能，为行为研究铺路"
   },
   "confidence": "high"
  },
  {
   "from": "behaviorism",
   "to": "cognitive-revolution",
   "type": "reacts",
   "note": {
    "zh": "乔姆斯基等指出刺激—反应无法解释语言与思维"
   },
   "confidence": "high"
  },
  {
   "from": "neo-behaviorism",
   "to": "cognitive-revolution",
   "type": "bridges",
   "note": {
    "zh": "托尔曼的\"认知地图\"在行为主义内部引入内部表征"
   },
   "confidence": "high"
  },
  {
   "from": "gestalt",
   "to": "field-theory",
   "type": "develops",
   "note": {
    "zh": "勒温出身柏林格式塔学派，把\"场\"用于社会行为"
   },
   "confidence": "high"
  },
  {
   "from": "gestalt",
   "to": "cognitive-psychology",
   "type": "bridges",
   "note": {
    "zh": "整体知觉与问题解决研究被认知心理学吸收"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-development",
   "to": "cognitive-revolution",
   "type": "bridges",
   "note": {
    "zh": "皮亚杰对心理结构的研究是认知转向的欧洲来源"
   },
   "confidence": "high"
  },
  {
   "from": "social-learning",
   "to": "cognitive-psychology",
   "type": "bridges",
   "note": {
    "zh": "观察学习引入注意、记忆等认知过程"
   },
   "confidence": "high"
  },
  {
   "from": "psychoanalysis",
   "to": "cognitive-therapies",
   "type": "reacts",
   "note": {
    "zh": "艾利斯与贝克都受精神分析训练，后因其难以检验而另立"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-revolution",
   "to": "cognitive-therapies",
   "type": "bridges",
   "note": {
    "zh": "提供\"信念与信息加工影响情绪\"的理论语言"
   },
   "confidence": "high"
  },
  {
   "from": "behavior-therapy",
   "to": "cbt",
   "type": "merges",
   "note": {
    "zh": "暴露、行为激活等技术并入"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-therapies",
   "to": "cbt",
   "type": "merges",
   "note": {
    "zh": "认知重评并入"
   },
   "confidence": "high"
  },
  {
   "from": "dissociation",
   "to": "psychoanalysis",
   "type": "develops",
   "note": {
    "zh": "弗洛伊德 1885 年随沙可学习"
   },
   "confidence": "high"
  },
  {
   "from": "dissociation",
   "to": "trauma",
   "type": "bridges",
   "note": {
    "zh": "让内的解离理论在 1980 年代创伤研究中被重新发现"
   },
   "confidence": "high"
  },
  {
   "from": "psychoanalysis",
   "to": "person-centered",
   "type": "reacts",
   "note": {
    "zh": "反对把人看作被驱力决定"
   },
   "confidence": "high"
  },
  {
   "from": "behaviorism",
   "to": "needs",
   "type": "reacts",
   "note": {
    "zh": "人本主义自称\"第三势力\"，同时反对行为主义与精神分析"
   },
   "confidence": "high"
  },
  {
   "from": "analytical-psychology",
   "to": "needs",
   "type": "bridges",
   "note": {
    "zh": "个体化与自我实现的观念相通"
   },
   "confidence": "high"
  },
  {
   "from": "object-relations",
   "to": "attachment",
   "type": "merges",
   "note": {
    "zh": "鲍尔比出身客体关系训练"
   },
   "confidence": "high"
  },
  {
   "from": "ethology",
   "to": "attachment",
   "type": "merges",
   "note": {
    "zh": "印刻与亲子联结的动物研究"
   },
   "confidence": "high"
  },
  {
   "from": "attachment",
   "to": "mentalization",
   "type": "develops",
   "note": {
    "zh": "以依恋研究解释理解他人心理的能力"
   },
   "confidence": "high"
  },
  {
   "from": "psychoanalysis",
   "to": "psychosocial",
   "type": "develops",
   "note": {
    "zh": "埃里克森把性心理阶段扩展为终生的心理社会阶段"
   },
   "confidence": "high"
  },
  {
   "from": "sociocultural",
   "to": "cultural",
   "type": "bridges",
   "note": {
    "zh": "\"心理过程以文化工具为中介\"的思想来源"
   },
   "confidence": "high"
  },
  {
   "from": "individual-differences",
   "to": "behavior-genetics",
   "type": "develops",
   "note": {
    "zh": "高尔顿的双生子法"
   },
   "confidence": "high"
  },
  {
   "from": "individual-differences",
   "to": "intelligence-testing",
   "type": "develops",
   "note": {
    "zh": "脉络内，列出以示完整"
   },
   "confidence": "high"
  },
  {
   "from": "g-factor",
   "to": "big-five",
   "type": "develops",
   "note": {
    "zh": "因子分析方法"
   },
   "confidence": "high"
  },
  {
   "from": "person-situation",
   "to": "trait",
   "type": "critiques",
   "note": {
    "zh": "行为的跨情境一致性低于特质论的假设"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-revolution",
   "to": "cognitive-neuroscience",
   "type": "merges",
   "note": {
    "zh": "认知模型"
   },
   "confidence": "high"
  },
  {
   "from": "neuropsychology",
   "to": "cognitive-neuroscience",
   "type": "merges",
   "note": {
    "zh": "脑损伤病例与成像方法"
   },
   "confidence": "high"
  },
  {
   "from": "hebbian",
   "to": "connectionism",
   "type": "develops",
   "note": {
    "zh": "\"一起放电的神经元连在一起\"成为网络学习规则"
   },
   "confidence": "high"
  },
  {
   "from": "stress-physiology",
   "to": "biopsychosocial",
   "type": "bridges",
   "note": {
    "zh": "压力把社会处境与身体疾病连起来"
   },
   "confidence": "high"
  },
  {
   "from": "nosology",
   "to": "dsm",
   "type": "develops",
   "note": {
    "zh": "描述性分类传统"
   },
   "confidence": "high"
  },
  {
   "from": "psychopharmacology",
   "to": "dsm",
   "type": "bridges",
   "note": {
    "zh": "药物试验需要可靠的诊断标准，推动 DSM-III"
   },
   "confidence": "medium"
  },
  {
   "from": "dimensional",
   "to": "dsm",
   "type": "critiques",
   "note": {
    "zh": "类别诊断的共病与异质性问题"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-neuroscience",
   "to": "dimensional",
   "type": "merges",
   "note": {
    "zh": "RDoC 以神经环路组织研究"
   },
   "confidence": "high"
  },
  {
   "from": "big-five",
   "to": "dimensional",
   "type": "bridges",
   "note": {
    "zh": "HiTOP 沿用人格的维度与层级结构"
   },
   "confidence": "high"
  },
  {
   "from": "mbsr",
   "to": "third-wave",
   "type": "merges",
   "note": {
    "zh": "正念练习"
   },
   "confidence": "high"
  },
  {
   "from": "cbt",
   "to": "third-wave",
   "type": "develops",
   "note": {
    "zh": "从改变想法的内容转向改变人与想法的关系"
   },
   "confidence": "high"
  },
  {
   "from": "morita",
   "to": "third-wave",
   "type": "bridges",
   "note": {
    "zh": "\"顺其自然、为所当为\"与接纳取向相近，但无直接师承"
   },
   "confidence": "medium"
  },
  {
   "from": "learned-helplessness",
   "to": "positive",
   "type": "develops",
   "note": {
    "zh": "塞利格曼从无助转向乐观与福祉"
   },
   "confidence": "high"
  },
  {
   "from": "needs",
   "to": "positive",
   "type": "develops",
   "note": {
    "zh": "继承对成长与潜能的关注"
   },
   "confidence": "high"
  },
  {
   "from": "positive",
   "to": "needs",
   "type": "critiques",
   "note": {
    "zh": "批评人本主义缺少实证方法"
   },
   "confidence": "high"
  },
  {
   "from": "cultural",
   "to": "cognitive-psychology",
   "type": "critiques",
   "note": {
    "zh": "许多\"普遍\"结论只在西方样本上成立"
   },
   "confidence": "high"
  },
  {
   "from": "open-science",
   "to": "social-cognition",
   "type": "critiques",
   "note": {
    "zh": "若干启动效应未能重复"
   },
   "confidence": "high"
  },
  {
   "from": "affective-neuroscience",
   "to": "trauma",
   "type": "bridges",
   "note": {
    "zh": "恐惧与威胁环路的研究"
   },
   "confidence": "high"
  },
  {
   "from": "connectionism",
   "to": "deep-learning-models",
   "type": "develops",
   "note": {
    "zh": "多层网络加上大数据与算力"
   },
   "confidence": "high"
  },
  {
   "from": "deep-learning-models",
   "to": "llm-cognition",
   "type": "develops",
   "note": {
    "zh": "同一类网络用于语言"
   },
   "confidence": "high"
  },
  {
   "from": "operant",
   "to": "reward-prediction",
   "type": "bridges",
   "note": {
    "zh": "强化被写成可计算的预测误差信号"
   },
   "confidence": "high"
  },
  {
   "from": "reward-prediction",
   "to": "computational-rl",
   "type": "develops",
   "note": {
    "zh": "同一套算法驱动人工智能体"
   },
   "confidence": "high"
  },
  {
   "from": "behavior-genetics",
   "to": "psychiatric-genomics",
   "type": "develops",
   "note": {
    "zh": "从双生子估计遗传率走向在基因组上找位点"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-neuroscience",
   "to": "connectome",
   "type": "develops",
   "note": {
    "zh": "从单个脑区转向全脑连接"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-neuroscience",
   "to": "abcd",
   "type": "develops",
   "note": {
    "zh": "把脑成像放进大规模追踪研究"
   },
   "confidence": "high"
  },
  {
   "from": "big-five",
   "to": "digital-footprints",
   "type": "develops",
   "note": {
    "zh": "用线上行为数据预测大五得分"
   },
   "confidence": "high"
  },
  {
   "from": "network-psychometrics",
   "to": "dsm",
   "type": "critiques",
   "note": {
    "zh": "症状彼此引发，不必假设背后有一个潜在疾病"
   },
   "confidence": "high"
  },
  {
   "from": "open-science",
   "to": "large-replications",
   "type": "develops",
   "note": {
    "zh": "把\"能否重复\"变成可以统计的问题"
   },
   "confidence": "high"
  },
  {
   "from": "cultural",
   "to": "weird",
   "type": "develops",
   "note": {
    "zh": "把文化差异的发现推进为对取样方式的批评"
   },
   "confidence": "high"
  },
  {
   "from": "moral-development",
   "to": "moral-foundations",
   "type": "reacts",
   "note": {
    "zh": "主张道德判断先凭直觉，推理在后"
   },
   "confidence": "high"
  },
  {
   "from": "social-cognition",
   "to": "misinformation",
   "type": "develops",
   "note": {
    "zh": "把信念形成的研究用于网络信息环境"
   },
   "confidence": "high"
  },
  {
   "from": "pp2",
   "to": "positive",
   "type": "critiques",
   "note": {
    "zh": "只讲积极面，忽略了痛苦在美好生活中的位置"
   },
   "confidence": "high"
  },
  {
   "from": "mbsr",
   "to": "self-compassion",
   "type": "bridges",
   "note": {
    "zh": "取自佛教的\"慈悲\"，并以正念为成分"
   },
   "confidence": "high"
  },
  {
   "from": "cognitive-neuroscience",
   "to": "neuropsychoanalysis",
   "type": "bridges",
   "note": {
    "zh": "用脑损伤与成像研究检验精神分析的概念"
   },
   "confidence": "high"
  },
  {
   "from": "psychoanalysis",
   "to": "psychodynamic-evidence",
   "type": "develops",
   "note": {
    "zh": "用随机对照试验与元分析检验动力治疗"
   },
   "confidence": "high"
  },
  {
   "from": "cbt",
   "to": "unified-protocol",
   "type": "develops",
   "note": {
    "zh": "一套方案处理多种情绪障碍的共同机制"
   },
   "confidence": "high"
  },
  {
   "from": "third-wave",
   "to": "process-based",
   "type": "develops",
   "note": {
    "zh": "从\"哪种疗法\"转向\"哪个改变过程\""
   },
   "confidence": "high"
  },
  {
   "from": "cbt",
   "to": "digital-mental-health",
   "type": "develops",
   "note": {
    "zh": "把结构化的治疗做成程序与应用"
   },
   "confidence": "high"
  },
  {
   "from": "psychopharmacology",
   "to": "psychedelic-therapy",
   "type": "develops",
   "note": {
    "zh": "药物与心理治疗在同一疗程中配合"
   },
   "confidence": "high"
  },
  {
   "from": "trauma",
   "to": "icd-11",
   "type": "develops",
   "note": {
    "zh": "长期反复创伤的后果被单列为复杂性 PTSD"
   },
   "confidence": "high"
  }
 ]
};
