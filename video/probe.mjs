// Exploration helper: node video/probe.mjs <hash> <outName> [jsBeforeShot] [waitMs]
// Opens the local build at 1920x1080, optionally runs JS, saves video/qa/<outName>.jpg and prints the JS result.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { launch, sleep } from './cdp.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const PAGE_FILE = ['index.html', 'psychologymap-v2.html'].map((f) => path.resolve(here, '..', f)).find((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('window.PSYMAP'));
const PAGE = 'file:///' + PAGE_FILE.split(path.sep).join('/');
const [hash = '#/map?lang=zh', out = 'probe', js = '', wait = '1800'] = process.argv.slice(2);
const W = +(process.env.W || 1920), H = +(process.env.H || 1080), phone = W < 760; const b = await launch(9333, { width: W, height: H });
try {
  await b.send('Page.enable'); await b.send('Page.bringToFront'); await b.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
  if (phone) await b.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await b.send('Page.navigate', { url: PAGE + hash });
  await sleep(+wait);
  if (js) console.log(JSON.stringify(await b.ev(`(async()=>{${js}})()`), null, 1));
  await sleep(500);
  const { data } = await b.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  fs.mkdirSync(path.join(here, 'qa'), { recursive: true });
  fs.writeFileSync(path.join(here, 'qa', out + '.jpg'), Buffer.from(data, 'base64'));
} finally { b.kill(); }
