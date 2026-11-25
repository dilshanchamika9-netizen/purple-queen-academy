// Lesson narration with Azure Speech: Sinhala si-LK-ThiliniNeural, English en-IN-NeerjaNeural.
// Needs repo secrets AZURE_SPEECH_KEY and AZURE_SPEECH_REGION.
// Writes assets/audio/{lang}/{hash}.mp3 and assets/audio/manifest.json. Existing files are kept.
import fs from 'node:fs';
import vm from 'node:vm';
const KEY = process.env.AZURE_SPEECH_KEY, REGION = process.env.AZURE_SPEECH_REGION;
if (!KEY || !REGION) { console.log('No Azure key yet: skipping narration.'); process.exit(0); }
const VOICE = { en: ['en-IN', 'en-IN-NeerjaNeural'], si: ['si-LK', 'si-LK-ThiliniNeural'] };
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/js/lessons.js', 'utf8'), ctx);
for (const f of ['lessons2','lessons3','lessons4','lessons5','lessons6', 'lessons7', 'lessons8', 'lessons9', 'lessons10', 'lessons11', 'lessons12', 'lessons13', 'lessons14', 'lessons15', 'lessons16', 'lessons17', 'lessons18', 'lessons19', 'lessons20', 'lessons21']) vm.runInContext(fs.readFileSync('assets/js/' + f + '.js', 'utf8'), ctx);
const MODS = ctx.window.PQ_MODULES, P = ctx.window.PQ_PRACTICE;
const keys = new Set();
const add = (o) => { if (o && o.en) { keys.add('en|' + o.en); if (o.si) keys.add('si|' + o.si); } };
MODS.forEach(M => M.lessons.forEach(l => { add(l.title); l.steps.forEach(s => add(s.text)); }));
Object.values(P).forEach(a => a.forEach(t => add(t.q)));
// same FNV-1a hash as learn.js
const hash = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const manifest = {};
for (const lang of ['en', 'si']) fs.mkdirSync(`assets/audio/${lang}`, { recursive: true });
let made = 0, failed = 0;
for (const key of keys) {
  const lang = key.slice(0, 2), text = key.slice(3);
  const h = hash(key), file = `assets/audio/${lang}/${h}.mp3`;
  if (!fs.existsSync(file)) {
    const spoken = text.replace(/[“”]/g, '"').replace(/×/g, lang === 'si' ? ' ගුණ කිරීම ' : ' times ');
    const ssml = `<speak version="1.0" xml:lang="${VOICE[lang][0]}"><voice name="${VOICE[lang][1]}"><prosody rate="-8%">${esc(spoken)}</prosody></voice></speak>`;
    const r = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'purple-queen-tts' },
      body: ssml,
    });
    if (!r.ok) { console.error('TTS failed', r.status, key.slice(0, 60)); failed++; continue; }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); made++;
    await new Promise(res => setTimeout(res, 150));
  }
  manifest[h] = 1;
}
fs.writeFileSync('assets/audio/manifest.json', JSON.stringify(manifest));
console.log(`narration: ${made} new, ${failed} failed, ${Object.keys(manifest).length} total`);
if (failed) process.exitCode = 1;
