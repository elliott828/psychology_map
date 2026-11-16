// Exploration helper: node video/probe.mjs <hash> <outName> [jsBeforeShot] [waitMs]
// Opens the local build at 1920x1080, optionally runs JS, saves video/qa/<outName>.jpg and prints the JS result.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { launch, sleep } from './cdp.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_FILE = ['index.html', 'psychologymap-v2.html'].map((f) => path.resolve(here, '..', f)).find((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('window.PSYMAP'));
const PAGE = 'file:///' + PAGE_FILE.split(path.sep).join('/');
const [hash = '#/map?lang=zh', out = 'probe', js = '', wait = '1800'] = process.argv.slice(2);
const H = +(process.env.H || 1080); const b = await launch(9333, { width: 1920, height: H });
try {
  await b.send('Page.enable'); await b.send('Page.bringToFront'); await b.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await b.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: H, deviceScaleFactor: 1, mobile: false });
  await b.send('Page.navigate', { url: PAGE + hash });
  await sleep(+wait);
  if (js) console.log(JSON.stringify(await b.ev(`(async()=>{${js}})()`), null, 1));
  await sleep(500);
  const { data } = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  fs.mkdirSync(path.join(here, 'qa'), { recursive: true });
  fs.writeFileSync(path.join(here, 'qa', out + '.jpg'), Buffer.from(data, 'base64'));
} finally { b.kill(); }
