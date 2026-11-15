// Offline self-test: edition-selection rule, output format, Douban parser, answer validation.
import assert from 'node:assert/strict';
import { selectEdition, buildEntry, zhQueryVariants, olQueryVariants, mainTitle, surname } from './lib.mjs';
import { parseSubject } from './fetch-books.mjs';
import { parseAnswer } from './match-books.mjs';
import { extractDoubanCover, doubanSize, workKeyOf, firstCoverId } from './fetch-covers.mjs';

let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok  ' + name); };

const S = (id, rating, votes, year, extra = {}) => ({ doubanId: id, title: 'T' + id, author: 'A', translator: 'Tr', publisher: 'P' + id, year, rating, votes, ...extra });

t('>=30 votes: highest rating wins', () => {
  const r = selectEdition([S('1', 9.5, 10, 2020), S('2', 8.1, 5000, 2012), S('3', 8.6, 412, 2025), S('4', 7.0, 90000, 2000)]);
  assert.equal(r.best.doubanId, '3');
  assert.equal(r.alt.length, 2);
  assert.deepEqual(r.alt.map((e) => e.doubanId), ['2', '4']);
});
t('none reach 30: most votes wins', () => {
  const r = selectEdition([S('1', 9.9, 5, 2020), S('2', 6.0, 29, 2010), S('3', 8.0, 12, 2022)]);
  assert.equal(r.best.doubanId, '2');
});
t('rating tie: newer year wins', () => {
  assert.equal(selectEdition([S('1', 8.5, 120, 2010), S('2', 8.5, 180, 2018)]).best.doubanId, '2');
});
t('100+ ratings outrank a higher rating from 30-99 ratings', () => {
  assert.equal(selectEdition([S('1', 8.8, 53, 2026), S('2', 8.6, 900, 2017)]).best.doubanId, '2');
});
t('simplified beats traditional; Japanese original dropped', () => {
  const r = selectEdition([S('1', 9.4, 631, 2019, { title: '行為' }), S('2', 8.4, 23, 1971, { title: '「甘え」の構造' }), S('3', 8.0, 40, 2020, { title: '行为' })]);
  assert.equal(r.best.doubanId, '3');
  assert.deepEqual(r.alt.map((e) => e.doubanId), ['1']);
  const only = buildEntry({ subjects: [S('1', 9.4, 631, 2019, { title: '行為' })], zhIds: ['1'], olCands: [], olKey: null, model: 'm' });
  assert.equal(only.zh.script, 'hant');
  assert.equal(selectEdition([S('2', 8.4, 23, 1971, { title: '「甘え」の構造' })]).best, null);
});
t('votes tie below 30: newer year wins', () => {
  assert.equal(selectEdition([S('1', 8, 10, 2010), S('2', 7, 10, 2018)]).best.doubanId, '2');
});
t('missing rating/votes handled; alt capped at 2', () => {
  const r = selectEdition([S('1', null, null, 2001), S('2', 8, 40, null), S('3', 7, 31, 2000), S('4', 6, 99, 1999)]);
  assert.equal(r.best.doubanId, '2');
  assert.equal(r.alt.length, 2);
  assert.deepEqual(selectEdition([]), { best: null, alt: [] });
});

const subjects = [S('10785583', 8.1, 51234, 2012), S('999', 8.6, 412, 2025), S('555', 7.7, 20, 2001)];
const olCands = [{ key: '/works/OL1W', title: 'Thinking, Fast and Slow', author: ['Daniel Kahneman'], firstPublished: 2011, editions: 90 }];
t('output format (spec 5.2)', () => {
  const e = buildEntry({ subjects, zhIds: ['10785583', '999', '555', 'nope'], olCands, olKey: '/works/OL1W', model: 'deepseek-chat', note: 'ok', date: '2026-11-15' });
  assert.deepEqual(Object.keys(e), ['zh', 'en', 'matchedBy', 'matchNote', 'fetchedAt', 'sameWork']);
  assert.deepEqual(e.sameWork, ['10785583', '999', '555']);
  assert.deepEqual(Object.keys(e.zh), ['title', 'author', 'translator', 'publisher', 'year', 'doubanId', 'url', 'rating', 'votes', 'alt']);
  assert.deepEqual(Object.keys(e.zh.alt[0]), ['title', 'publisher', 'year', 'url', 'rating', 'votes']);
  assert.equal(e.zh.doubanId, '999');
  assert.equal(e.zh.url, 'https://book.douban.com/subject/999/');
  assert.equal(e.zh.alt.length, 2);
  assert.deepEqual(Object.keys(e.en), ['title', 'author', 'openLibrary', 'firstPublished']);
  assert.equal(e.en.openLibrary, 'https://openlibrary.org/works/OL1W');
  assert.equal(e.en.author, 'Daniel Kahneman');
  assert.equal(e.fetchedAt, '2026-11-15');
});
t('unmatched sides are null', () => {
  const e = buildEntry({ subjects, zhIds: [], olCands, olKey: null, model: 'deepseek-chat' });
  assert.equal(e.zh, null); assert.equal(e.en, null);
});
t('model answers are validated against candidates', () => {
  const a = parseAnswer({ zh: ['999', 'bogus', 555], en: '/works/OLX', note: 'x' }, subjects, olCands);
  assert.deepEqual(a.zh, ['999', '555']); assert.equal(a.en, null);
});
t('search strings', () => {
  const bh = { title: { zh: '行为' }, zhQuery: '行为 萨波尔斯基', enRec: { title: 'Behave: The Biology of Humans at Our Best and Worst', author: 'Robert M. Sapolsky' } };
  assert.deepEqual(zhQueryVariants(bh).map((v) => v.query), ['行为']);
  const v2 = zhQueryVariants({ title: { zh: '谁说了算？自由意志' }, zhQuery: '谁说了算：自由意志 加扎尼加' });
  assert.deepEqual(v2.map((v) => v.query), ['谁说了算', '谁说了算：自由意志']);
  assert.equal(zhQueryVariants({ zhQuery: null }), null);
  assert.deepEqual(zhQueryVariants({ title: { zh: '行为' } }).map((v) => v.source), ['title.zh']);
  assert.equal(mainTitle('A Title - Sub'), 'A Title');
  assert.equal(surname('Robert M. Sapolsky'), 'Sapolsky');
  assert.equal(surname('Jerome H. Barkow, Leda Cosmides'), 'Barkow');
  const ol = olQueryVariants(bh);
  assert.deepEqual(ol[0].params, { title: 'Behave', author: 'Sapolsky' });
  assert.deepEqual(ol[1].params, { q: 'Behave Sapolsky' });
  assert.equal(olQueryVariants({ enRec: null }), null);
});

const html = `<h1><span property="v:itemreviewed">思考，快与慢</span></h1>
<div id="info">
<span><span class="pl"> 作者</span>:
<a href="/x">[美] 丹尼尔·卡尼曼</a>
</span><br/>
<span><span class="pl"> 译者</span>:
<a href="/a">胡晓姣</a>
/
<a href="/b">李爱民</a>
</span><br/>
<span class="pl">出版社:</span>
<a href="/p">中信出版社</a>
<br>
<span class="pl">副标题:</span> 副<br/>
<span class="pl">出版年:</span> 2012-7<br/>
<span class="pl">ISBN:</span> 9787508633558<br/>
</div>
<div class="rating_self clearfix"><strong class="ll rating_num " property="v:average"> 8.1 </strong>
<span property="v:votes">25537</span>`;
t('Douban parser', () => {
  const s = parseSubject(html, '1');
  assert.equal(s.title, '思考，快与慢'); assert.equal(s.author, '[美] 丹尼尔·卡尼曼'); assert.equal(s.translator, '胡晓姣 / 李爱民');
  assert.equal(s.publisher, '中信出版社'); assert.equal(s.year, 2012); assert.equal(s.isbn, '9787508633558');
  assert.equal(s.subtitle, '副'); assert.equal(s.rating, 8.1); assert.equal(s.votes, 25537);
  const e = parseSubject('<html>nothing</html>', '2');
  assert.equal(e.rating, null); assert.equal(e.author, null); assert.equal(e.year, null);
});

t('Douban cover extraction', () => {
  const page = `<div id="mainpic" class=""><a class="nbg" href="https://img3.doubanio.com/view/subject/l/public/s29699988.jpg" title="x"><img src="https://img3.doubanio.com/view/subject/s/public/s29699988.jpg" alt="x"></a></div>`;
  const u = extractDoubanCover(page);
  assert.equal(u, 'https://img3.doubanio.com/view/subject/l/public/s29699988.jpg');
  assert.equal(doubanSize(u, 'm'), 'https://img3.doubanio.com/view/subject/m/public/s29699988.jpg');
  assert.equal(doubanSize(u, 's'), 'https://img3.doubanio.com/view/subject/s/public/s29699988.jpg');
  assert.equal(extractDoubanCover('<div id="mainpic"><img src="http://img1.doubanio.com/view/subject/s/public/s1.jpg"></div>'), 'https://img1.doubanio.com/view/subject/s/public/s1.jpg');
  assert.equal(extractDoubanCover('<a class="nbg" href="https://img1.doubanio.com/f/book-default-lpic.gif">'), null);
  assert.equal(extractDoubanCover('<a class="nbg" href="https://evil.example/x.jpg">'), null);
  assert.equal(extractDoubanCover('<html>nothing</html>'), null);
});
t('Open Library cover helpers', () => {
  assert.equal(workKeyOf('https://openlibrary.org/works/OL15992072W'), '/works/OL15992072W');
  assert.equal(workKeyOf('https://evil.example/works/OL1W'), null);
  assert.equal(firstCoverId({ covers: [-1, 0, 8231856, 5] }), 8231856);
  assert.equal(firstCoverId({ covers: [-1] }), null); assert.equal(firstCoverId({}), null);
});

console.log(`\n${n} tests passed`);
