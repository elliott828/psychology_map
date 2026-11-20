// Narration + on-page actions for the Psychologymap tutorial (Chinese UI, 1920x960 page area).
// Each scene: lines [{ sub, say?, p? }] (say = TTS text if different; p = extra pause after the line, seconds)
// and run(A): actions, scheduled with `await A.at(lineIndex, offsetSeconds)`.
export const W = 1920, H = 960;
export const START = '#/map?lang=zh';

export const scenes = [
  {
    id: 'intro',
    lines: [
      { sub: '这是 Psychologymap，一张心理学思想地图。', say: '这是 Psychology map，一张心理学思想地图。' },
      { sub: '做它的初衷是：心理学不是某一位大师的学说，' },
      { sub: '而是一百多年里，许多条线索同时生长出来的领域。' },
      { sub: '所以这张地图保持中立，不从任何一个学派出发。' },
      { sub: '它想让你看见：一个理论从哪里来，和谁对话，又走向了哪里。' },
      { sub: '下面我们一边操作，一边看怎么用它。' },
    ],
    async run(A) {
      await A.at(0, 0.4); A.hlSel('.brand', 2600, 10);
      await A.at(3, 0.2); A.hlSel('#intro', 3800, 10);
      await A.at(5, 0.3); await A.showCursor(1500, 520); await A.move(1300, 470, 900);
    },
  },
  {
    id: 'hourglass',
    lines: [
      { sub: '首页是一个时间沙漏，从上往下读。' },
      { sub: '上半部是源头：1879 年以前，两千多年的哲学、医学和修行传统。', say: '上半部是源头：一八七九年以前，两千多年的哲学、医学和修行传统。' },
      { sub: '它们在瓶颈处汇聚。这一年，心理学成为一门实验科学。' },
      { sub: '下半部，九条脉络一路展开到今天；底部开口，表示它还在生长。' },
      { sub: '按住鼠标左右拖动，可以旋转沙漏。', p: 0.8 },
      { sub: '点左侧的脉络名称，这条脉络会转到正面。', p: 0.6 },
      { sub: '鼠标停在节点上，会出现它的简介。', p: 0.8 },
      { sub: '圆点越大，代表它在大众中越有名。' },
      { sub: '滚动鼠标滚轮可以放大沙漏，看清密集处的名字；在手机上，用双指缩放。', p: 1.2 },
    ],
    async run(A) {
      await A.at(1, 0.2); A.hl(745, 112, 720, 270, 3600); await A.move(1110, 250, 1200);
      await A.at(2, 0.1); await A.move(1112, 392, 900); A.hl(1020, 360, 300, 60, 2600);
      await A.at(3, 0.2); A.hl(740, 410, 840, 520, 3600); await A.move(1250, 700, 1200);
      await A.at(4, 0.3); await A.drag(1360, 700, 900, 700, 2200); await A.sleep(300); await A.drag(1000, 700, 1260, 700, 1600);
      await A.at(5, 0.2); await A.clickSel('#glassSide button', '无意识与深度');
      await A.at(6, 0.1); await A.move(1166, 531, 1100); await A.sleep(1600); await A.move(1021, 625, 900);
      await A.at(7, 0.1); A.hlSel('#glegend', 2600, 8); await A.move(1166, 531, 1000);
      await A.at(8, 0.2); await A.wheel(1000, 600, -600, 1200); await A.sleep(1800); await A.clickSel('#gzoom button[data-z="reset"]');
    },
  },
  {
    id: 'ridge',
    lines: [
      { sub: '点左下角的「展开为地图」，沙漏会摊开成九列山脊。', p: 0.4 },
      { sub: '横轴是时间；山峰越高，说明那个年代登场的重要学派越多。' },
      { sub: '鼠标经过山脊上的圆点，就能看到这个学派的简介。', p: 0.6 },
      { sub: '上方的「标注」，可以在学派、人物和著作之间切换。', p: 1.6 },
      { sub: '想知道高度怎么来的，点「高度怎么算？」就有说明。', p: 2.4 },
    ],
    async run(A) {
      await A.at(0, 0.6); await A.clickSel('#enter');
      await A.at(1, 0.3); A.hl(1000, 120, 640, 175, 3000); await A.move(1290, 175, 1000);
      await A.at(2, 0.1); await A.hoverSel('#ridge g.sch', '认知心理学', 1600);
      await A.at(3, 0.0); await A.clickSel('#sub button', '人物', true); await A.sleep(900); await A.clickSel('#sub button', '学派', true);
      await A.at(4, 0.0); await A.clickSel('#sub button', '高度怎么算'); await A.sleep(2600); await A.closeHow();
    },
  },
  {
    id: 'detail',
    lines: [
      { sub: '点任意一个圆点，右侧会打开它的详情。以荣格的分析心理学为例。' },
      { sub: '最上面是它的要点，以及代表人物和代表作。' },
      { sub: '「评分」告诉你它的历史影响、证据状况，和在大众中的知名度。' },
      { sub: '同时，地图上会亮起它和其他学派的关系线：从哪里分出，又启发了谁。' },
      { sub: '详情里的每个名字都可以点击，顺着关系一路走下去。', p: 1.6 },
    ],
    async run(A) {
      await A.at(0, 1.0); await A.clickSel('#ridge g.sch', '分析心理学'); await A.move(1640, 330, 700);
      await A.at(1, 0.1); A.hlSel('#panel', 3600, -8, { dy: 150, h: 310 });
      await A.at(2, 0.1); A.hlText('#panel *', '评分', 3800, { h: 215, wSel: '#panel', exact: true });
      await A.at(3, 0.2); A.hl(560, 470, 700, 470, 4200); await A.move(860, 760, 900); await A.move(1000, 560, 1200);
      await A.at(4, 0.2); await A.scrollTo('#panel .rel', '需求层次与自我实现'); await A.clickSel('#panel .rel', '需求层次与自我实现');
    },
  },
  {
    id: 'thread',
    lines: [
      { sub: '想细看一条脉络，就点左侧的脉络名称。', p: 0.6 },
      { sub: '这里把这条脉络的学派按时间排开，下方列出它们的关键理论、提出者和年份。' },
      { sub: '曲线下方的连线，标出学派之间的继承、分支和反对。' },
      { sub: '顶部的色块，可以切换到其他脉络。', p: 1.4 },
    ],
    async run(A) {
      await A.closePanel();
      await A.at(0, 0.5); await A.clickSel('#ridge g.tlabel', '无意识与深度');
      await A.at(1, 0.4); A.hl(480, 490, 1360, 440, 3600); await A.wheel(1100, 700, 360, 900); await A.sleep(1400); await A.wheel(1100, 700, -360, 900);
      await A.at(2, 0.1); A.hl(480, 440, 1360, 60, 3400); await A.move(900, 462, 1200);
      await A.at(3, 0.2); await A.clickSel('#vThread [data-thread]', '人本与意义');
    },
  },
  {
    id: 'structure',
    lines: [
      { sub: '顶部导航的「结构」，回答另一个问题：今天的心理学由哪些部分组成。', p: 0.4 },
      { sub: '一百多个学派各占一格：纵向是它在哪个层次解释人，横向是它主要在做什么。' },
      { sub: '鼠标停在一个学派上，同一条脉络的其他学派会一起亮起。', p: 0.8 },
      { sub: '上方的筛选，可以只看证据较强的，或者某一类活动。', p: 1.4 },
    ],
    async run(A) {
      await A.at(0, 0.5); await A.clickSel('#topNav button', '结构');
      await A.at(1, 0.2); A.hl(14, 300, 150, 640, 2600); await A.sleep(1200); A.hl(160, 268, 1740, 34, 2800);
      await A.at(2, 0.1); await A.hoverSel('#vStructure [data-open]', '分析心理学', 1800); await A.hoverSel('#vStructure [data-open]', '认知心理学', 1600);
      await A.at(3, 0.2); await A.clickSel('#sub button', '证据状况'); await A.sleep(2400); await A.key('Escape'); await A.clickXY(1400, 120);
    },
  },
  {
    id: 'people',
    lines: [
      { sub: '「人物」页是一条时间轴：每个人一条线，从出生到去世。', p: 0.3 },
      { sub: '线上的圆点，是他提出某个理论的年份。' },
      { sub: '现代心理学之前的人物默认收在左侧，需要时可以展开。', p: 1.6 },
      { sub: '排序可以按年代或按影响，也可以只看某一条脉络。', p: 1.0 },
      { sub: '点任何一个人，就能看到他的理论和著作。', p: 1.4 },
    ],
    async run(A) {
      await A.at(0, 0.4); await A.clickSel('#topNav button', '人物');
      await A.at(1, 0.1); await A.hoverSel('#vPeople [data-open]', '查尔斯·达尔文', 2200);
      await A.at(2, 0.1); A.hlSel('#vPeople .ppre', 2400, 6); await A.sleep(1400); await A.clickSel('#vPeople [data-pfull]'); await A.sleep(1600); await A.clickSel('#sub button, #vPeople button', '现代', true);
      await A.at(3, 0.2); await A.clickSel('#vPeople [data-psort]', '影响'); await A.sleep(900); await A.clickSel('#vPeople [data-pthread]', '无意识与深度');
      await A.at(4, 0.2); await A.clickSel('#vPeople [data-open]', '卡尔·古斯塔夫·荣格');
    },
  },
  {
    id: 'questions',
    lines: [
      { sub: '如果你带着一个生活里的困惑而来，可以从「问题」开始。', p: 0.6 },
      { sub: '比如「拖延」：几条脉络各自给出解释，并标出证据有多强。' },
      { sub: '点卡片里的概念，就能跳到它的详情，看它的来历。', p: 1.6 },
      { sub: '旁边还有学界的「争论」，和流传很广的「误读」。', p: 2.0 },
    ],
    async run(A) {
      await A.closePanel();
      await A.at(0, 0.5); await A.clickSel('#topNav button', '问题');
      await A.at(1, 0.0); await A.clickSel('#vQuestions .qcard', '拖延'); await A.sleep(700); A.hl(22, 400, 1876, 205, 3600);
      await A.at(2, 0.2); await A.clickSel('#vQuestions [data-open]', '三种基本心理需要'); await A.sleep(2600); await A.closePanel();
      await A.at(3, 0.1); await A.clickSel('#vQuestions [data-qtab]', '争论'); await A.sleep(2200); await A.clickSel('#vQuestions [data-qtab]', '流行误读');
    },
  },
  {
    id: 'search',
    lines: [
      { sub: '知道自己要找什么，就用右上角的搜索框，或者直接按斜杠键。', p: 0.4 },
      { sub: '学派、理论、人物、书和问题都能搜，中文、英文都可以。' },
      { sub: '比如输入「依恋」，或者「Bowlby」。', say: '比如输入「依恋」，或者 Bowlby。', p: 2.6 },
      { sub: '选中一个结果，就会直接打开它。', p: 1.6 },
    ],
    async run(A) {
      await A.at(0, 0.6); await A.move(1560, 30, 1000); await A.sleep(300); await A.key('/');
      await A.at(2, 0.0); await A.type('依恋', 300); await A.sleep(1300); await A.selectAll(); await A.type('Bowlby', 170);
      await A.at(3, 0.1); await A.clickSel('#results button[data-id]');
    },
  },
  {
    id: 'reading',
    lines: [
      { sub: '最后是「阅读」。在「阅读路径」里，输入一个理论或学派。', p: 2.4 },
      { sub: '阅读路径分成三列：先读、这个学派本身，和接着读。' },
      { sub: '先读，是理解它之前需要的；接着读，是它启发出来的方向。' },
      { sub: '每本书都给出豆瓣上评分最高的中文版，和推荐的英文版，点击就能打开。', p: 0.6 },
      { sub: '这样，你不只知道一个名字，还知道该从哪本书开始。', p: 0.8 },
    ],
    async run(A) {
      await A.closePanel(); await A.quiet(`document.getElementById('q').value='';document.getElementById('q').blur()`);
      await A.at(0, 0.3); await A.clickSel('#topNav button', '阅读'); await A.sleep(500); await A.clickSel('#pathq'); await A.type('认知心理学', 200); await A.sleep(450); await A.clickSel('#pathres [data-pick]', '认知心理学');
      await A.at(1, 0.3); A.hlSel('#vReading .pcol.up', 2400, 6, { h: 60 }); await A.sleep(900); A.hlSel('#vReading .pcol.me', 2400, 6, { h: 60 }); await A.sleep(900); A.hlSel('#vReading .pcol.dn', 2400, 6, { h: 60 });
      await A.at(2, 0.2); A.hlSel('#vReading .pcol.up', 2400, 6); await A.at(2, 2.8); A.hlSel('#vReading .pcol.dn', 3400, 6);
      await A.at(3, 0.1); A.hlSel('#vReading .pcol.me .ed.zh', 3400, 6); await A.sleep(1700); A.hlSel('#vReading .pcol.me .ed.en', 3000, 6);
      await A.at(4, 0.0); await A.wheel(1000, 640, 420, 1400);
    },
  },
  {
    id: 'outro',
    lines: [
      { sub: '右上角可以随时切换中文和英文。', p: 1.2 },
      { sub: '最简单的用法，只有三步：' },
      { sub: '从一个你关心的问题开始，找到解释它的理论，再沿着阅读路径读下去。' },
      { sub: '祝你在这张地图上，找到自己的路。', p: 1.0 },
    ],
    async run(A) {
      await A.at(0, 0.3); await A.clickSel('[data-lang="en"]'); await A.sleep(1400); await A.clickSel('[data-lang="zh"]');
      await A.at(1, 0.2); await A.clickSel('#topNav button', '脉络'); await A.sleep(400); await A.clickSel('#sub button', '时间沙漏', true);
      await A.at(2, 0.3); await A.drag(1300, 640, 1000, 640, 3000);
      await A.at(3, 0.2); await A.move(1700, 600, 1400); await A.hideCursor();
    },
  },
];
