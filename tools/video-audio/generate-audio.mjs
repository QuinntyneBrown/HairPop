#!/usr/bin/env node
// Narration for one video folder (docs/videos/README.md).
//
//   node tools/video-audio/generate-audio.mjs docs/videos/NN-topic [--dry-run] [--engine edge|piper]
//   node tools/video-audio/generate-audio.mjs --say "HairPop" --out .cache/pronunciation-test.wav
//
// Engines (no paid service):
//   edge  (default) python -m edge_tts; EDGE_VOICE / EDGE_VOICE_2 pick the voices. Needs internet.
//   piper offline; PIPER_MODEL (and optionally PIPER_MODEL_2) point at .onnx voices,
//         PIPER_LENGTH_SCALE slows (>1) or speeds (<1) speech.
// PYTHON picks the interpreter (default python3). Writes <folder>/<folder>.mp3 and the timing
// manifest .cache/<folder>/manifest.json that tools/video-build syncs slides and captions to.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { WORDS_PER_MINUTE, countWords, loadLexicon, readScript, spokenText } from './script.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => (flag(name) ? args[args.indexOf(name) + 1] : fallback);

const PYTHON = process.env.PYTHON ?? 'python3';
const FFMPEG = process.env.FFMPEG_PATH ?? 'ffmpeg';
const FFPROBE = process.env.FFPROBE_PATH ?? 'ffprobe';
const engine = option('--engine', process.env.VIDEO_TTS_ENGINE ?? 'edge');
const RATE = 24000;
const GAP_PARAGRAPH = 0.45;
const GAP_SECTION = 0.9;

function run(cmd, cmdArgs, input) {
  return execFileSync(cmd, cmdArgs, { input, stdio: [input ? 'pipe' : 'ignore', 'pipe', 'pipe'] });
}

function duration(file) {
  return Number(
    run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
      .toString()
      .trim(),
  );
}

function voiceFor(speaker) {
  if (engine === 'piper') {
    const model = speaker
      ? (process.env.PIPER_MODEL_2 ?? process.env.PIPER_MODEL)
      : process.env.PIPER_MODEL;
    if (!model) throw new Error('set PIPER_MODEL to a Piper .onnx voice for --engine piper');
    return model;
  }
  if (engine === 'edge') {
    return speaker
      ? (process.env.EDGE_VOICE_2 ?? 'en-US-AvaMultilingualNeural')
      : (process.env.EDGE_VOICE ?? 'en-US-AndrewMultilingualNeural');
  }
  throw new Error(`unknown engine "${engine}" (edge or piper)`);
}

/** Synthesizes one paragraph to a normalized mono WAV, cached by engine, voice and text. */
function synthesize(text, speaker, cacheDir) {
  const voice = voiceFor(speaker);
  const scale = process.env.PIPER_LENGTH_SCALE ?? '1';
  const key = createHash('sha1')
    .update(`${engine}|${voice}|${scale}|${text}`)
    .digest('hex')
    .slice(0, 16);
  const out = join(cacheDir, `${key}.wav`);
  if (existsSync(out)) return out;
  const raw = join(cacheDir, `${key}.raw.${engine === 'edge' ? 'mp3' : 'wav'}`);
  if (engine === 'edge') {
    const proxy = process.env.HTTPS_PROXY ? ['--proxy', process.env.HTTPS_PROXY] : [];
    run(PYTHON, [
      '-m',
      'edge_tts',
      '--voice',
      voice,
      '--text',
      text,
      '--write-media',
      raw,
      ...proxy,
    ]);
  } else {
    run(PYTHON, ['-m', 'piper', '-m', voice, '--length-scale', scale, '-f', raw], text);
  }
  run(FFMPEG, [
    '-y',
    '-v',
    'error',
    '-i',
    raw,
    '-ac',
    '1',
    '-ar',
    String(RATE),
    '-c:a',
    'pcm_s16le',
    `${out}.tmp.wav`,
  ]);
  renameSync(`${out}.tmp.wav`, out);
  return out;
}

function silence(seconds, cacheDir) {
  const out = join(cacheDir, `silence-${seconds.toFixed(2)}.wav`);
  if (!existsSync(out)) {
    run(FFMPEG, [
      '-y',
      '-v',
      'error',
      '-f',
      'lavfi',
      '-i',
      `anullsrc=r=${RATE}:cl=mono`,
      '-t',
      seconds.toFixed(3),
      '-c:a',
      'pcm_s16le',
      out,
    ]);
  }
  return out;
}

if (flag('--say')) {
  const lexicon = loadLexicon();
  const out = resolve(option('--out', join(root, '.cache/pronunciation-test.wav')));
  mkdirSync(dirname(out), { recursive: true });
  const cacheDir = join(root, '.cache/audio');
  mkdirSync(cacheDir, { recursive: true });
  const spoken = spokenText(option('--say', ''), lexicon);
  run(FFMPEG, ['-y', '-v', 'error', '-i', synthesize(spoken, null, cacheDir), out]);
  console.log(`"${spoken}" -> ${out}`);
  process.exit(0);
}

const folderArg = args.find(
  (a, i) => !a.startsWith('--') && !['--engine', '--out'].includes(args[i - 1]),
);
if (!folderArg) {
  console.error('usage: generate-audio.mjs <video folder> [--dry-run] [--engine edge|piper]');
  process.exit(2);
}
const folder = resolve(folderArg);
const name = basename(folder);
const script = readScript(folder);
const lexicon = loadLexicon();

let words = 0;
for (const section of script.sections) {
  const sectionWords = section.items.reduce(
    (n, it) => n + (it.kind === 'speech' ? countWords(it.text) : 0),
    0,
  );
  words += sectionWords;
  const minutes = sectionWords / WORDS_PER_MINUTE;
  console.log(
    `${(section.heading ?? '(intro)').padEnd(44)} ${String(sectionWords).padStart(5)} words  ~${minutes.toFixed(1)} min`,
  );
  if (minutes > 9) console.warn(`  warning: section "${section.heading}" runs over 9 minutes`);
}
const pauses = script.sections.flatMap((s) => s.items).filter((it) => it.kind === 'pause');
const estimate = words / WORDS_PER_MINUTE + pauses.reduce((n, p) => n + p.seconds, 0) / 60;
console.log(`${script.title}: ${words} words, ~${estimate.toFixed(1)} min`);
if (flag('--dry-run')) process.exit(0);

const cacheDir = join(root, '.cache', name);
const audioCache = join(root, '.cache/audio');
mkdirSync(cacheDir, { recursive: true });
mkdirSync(audioCache, { recursive: true });

const files = [];
const manifest = { title: script.title, engine, duration: 0, sections: [] };
let t = 0;
script.sections.forEach((section, si) => {
  const entry = { heading: section.heading, start: t, end: t, paragraphs: [] };
  section.items.forEach((item, ii) => {
    if (item.kind === 'pause') {
      files.push(silence(item.seconds, audioCache));
      t += item.seconds;
      return;
    }
    const clip = synthesize(spokenText(item.text, lexicon), item.speaker, audioCache);
    const seconds = duration(clip);
    entry.paragraphs.push({ text: item.text, speaker: item.speaker, start: t, end: t + seconds });
    files.push(clip);
    t += seconds;
    const last = ii === section.items.length - 1;
    const gap = last ? (si === script.sections.length - 1 ? 0.8 : GAP_SECTION) : GAP_PARAGRAPH;
    files.push(silence(gap, audioCache));
    t += gap;
    process.stdout.write('.');
  });
  entry.end = t;
  manifest.sections.push(entry);
});
process.stdout.write('\n');

const list = join(cacheDir, 'audio-list.txt');
writeFileSync(list, files.map((f) => `file '${f}'`).join('\n') + '\n');
const mp3 = join(folder, `${name}.mp3`);
run(FFMPEG, [
  '-y',
  '-v',
  'error',
  '-f',
  'concat',
  '-safe',
  '0',
  '-i',
  list,
  '-c:a',
  'libmp3lame',
  '-b:a',
  '128k',
  '-ar',
  String(RATE),
  mp3,
]);
manifest.duration = duration(mp3);
writeFileSync(join(cacheDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`${mp3}: ${(manifest.duration / 60).toFixed(2)} min (${engine})`);
