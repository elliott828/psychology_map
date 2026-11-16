// Minimal Chrome DevTools Protocol driver for headless Edge.
// Each launch uses its own temporary profile; kill() ends every Edge process started with that profile.
import { spawn, spawnSync } from 'node:child_process'; import path from 'node:path'; import fs from 'node:fs'; import os from 'node:os';
export const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function killProfile(tag) {
  spawnSync('powershell', ['-NoProfile', '-Command',
    `Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | Where-Object { $_.CommandLine -like '*${tag}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`]);
}

export async function launch(port = 9222, { width = 1920, height = 1080 } = {}) {
  const tag = 'psymap-rec-' + process.pid + '-' + port;
  const prof = path.join(os.tmpdir(), tag);
  fs.rmSync(prof, { recursive: true, force: true });
  const p = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--window-size=${width},${height}`, '--hide-scrollbars',
    `--user-data-dir=${prof}`, '--no-first-run', '--force-device-scale-factor=1', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  let ok = false;
  for (let i = 0; i < 80; i++) { try { await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); ok = true; break; } catch { await sleep(250); } }
  if (!ok) { killProfile(tag); throw new Error('edge did not start'); }
  const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pend = new Map(); const handlers = [];
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const { res, rej } = pend.get(m.id); pend.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else if (m.method) handlers.forEach((h) => h(m)); });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
  const kill = () => { try { ws.close(); } catch {} killProfile(tag); try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} };
  process.on('exit', () => killProfile(tag));
  return { send, ev, kill, on: (h) => handlers.push(h) };
}
