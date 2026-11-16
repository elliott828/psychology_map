import fs from 'node:fs';
import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { launch, sleep } from './cdp.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_FILE = ['index.html', 'psychologymap-v2.html'].map((f) => path.resolve(here, '..', f)).find((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('window.PSYMAP'));
const PAGE = 'file:///' + PAGE_FILE.split(path.sep).join('/');
const b = await launch(9335, { width: 1920, height: 960 });
try {
  await b.send('Page.enable');
  await b.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 960, deviceScaleFactor: 1, mobile: false });
  await b.send('Page.navigate', { url: PAGE + '#/map?lang=zh' });
  await sleep(2500);
  const r = await b.ev(`(()=>{const x=[...document.querySelectorAll('#glassSide button')].find(b=>b.textContent.includes('无意识与深度'));const q=x.getBoundingClientRect();return {x:q.x+q.width/2,y:q.y+q.height/2}})()`);
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: r.x, y: r.y, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: r.x, y: r.y, button: 'left', clickCount: 1 });
  await sleep(3000);
  const found = {};
  for (let y = 360; y < 950; y += 5) for (let x = 650; x < 1650; x += 5) {
    await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    const t = await b.ev(`(()=>{const t=document.getElementById('tip');return t.style.display==='block'?t.textContent.slice(0,14):''})()`);
    if (t && !found[t]) found[t] = [x, y];
  }
  console.log(JSON.stringify(found, null, 0));
} finally { b.kill(); }
