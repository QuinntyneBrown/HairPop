#!/usr/bin/env node
// Builds the captioned 1920x1080 MP4 for one video folder (docs/videos/README.md).
//
//   node tools/video-build/build-video.mjs docs/videos/NN-topic [--check | --slides-only]
//
// Needs the narration and timing manifest from tools/video-audio/generate-audio.mjs, e2e
// dependencies (Playwright drives headless Chromium) and ffmpeg with libx264 and libass.
// EDGE_PATH or CHROMIUM_PATH picks the browser; FFMPEG_PATH / FFPROBE_PATH pick ffmpeg.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { WORDS_PER_MINUTE, countWords, plainText, readScript } from '../video-audio/script.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const slidesOnly = args.includes('--slides-only');
const folderArg = args.find((a) => !a.startsWith('--'));
if (!folderArg) {
  console.error('usage: build-video.mjs <video folder> [--check | --slides-only]');
  process.exit(2);
}
const folder = resolve(folderArg);
const name = basename(folder);
const cacheDir = join(root, '.cache', name);
mkdirSync(cacheDir, { recursive: true });
const FFMPEG = process.env.FFMPEG_PATH ?? 'ffmpeg';
const FFPROBE = process.env.FFPROBE_PATH ?? 'ffprobe';
const FPS = 30;

function ffmpeg(ffArgs) {
  execFileSync(FFMPEG, ['-y', '-v', 'error', ...ffArgs], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
}

function probeDuration(file) {
  return Number(
    execFileSync(FFPROBE, [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'csv=p=0',
      file,
    ])
      .toString()
      .trim(),
  );
}

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;

// ---- Timing: the manifest, or an estimate from word counts for --check before synthesis.
const script = readScript(folder);
const manifestFile = join(cacheDir, 'manifest.json');
let manifest;
if (existsSync(manifestFile)) {
  manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
} else if (check) {
  console.warn('no timing manifest yet: estimating from word counts');
  let t = 0;
  manifest = { duration: 0, sections: [] };
  for (const section of script.sections) {
    const entry = { heading: section.heading, start: t, paragraphs: [] };
    for (const item of section.items) {
      if (item.kind === 'pause') {
        t += item.seconds;
        continue;
      }
      const d = (countWords(item.text) / WORDS_PER_MINUTE) * 60;
      entry.paragraphs.push({ text: item.text, start: t, end: t + d });
      t += d + 0.45;
    }
    entry.end = t;
    manifest.sections.push(entry);
  }
  manifest.duration = t;
} else {
  console.error(`no ${manifestFile}: run tools/video-audio/generate-audio.mjs first`);
  process.exit(1);
}

const normalize = (s) =>
  plainText(s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** The time narration reaches a phrase: section headings exactly, sentences by word count. */
function cueTime(cue) {
  const wanted = normalize(cue);
  const hits = [];
  for (const section of manifest.sections) {
    if (section.heading && normalize(section.heading) === wanted) hits.push(section.start);
    for (const p of section.paragraphs) {
      const text = normalize(p.text);
      let at = text.indexOf(wanted);
      while (at !== -1) {
        const before = text.slice(0, at).split(' ').filter(Boolean).length;
        const total = text.split(' ').filter(Boolean).length;
        hits.push(p.start + ((p.end - p.start) * before) / total);
        at = text.indexOf(wanted, at + 1);
      }
    }
  }
  return hits;
}

// ---- Slides.
const require = createRequire(join(root, 'e2e/package.json'));
const { chromium } = require('@playwright/test');
const executablePath = process.env.EDGE_PATH ?? process.env.CHROMIUM_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});
const deckUrl = pathToFileURL(join(folder, 'slides.html')).href;
await page.goto(`${deckUrl}?render=1&slide=1`);
const deck = await page.evaluate(() => window.__deck);
if (!deck) throw new Error('slides.html did not load ../assets/slides.js');

const problems = [];
const slides = deck.slides.map((slide) => ({ ...slide, start: 0 }));
slides.forEach((slide, i) => {
  if (i === 0) return;
  if (!slide.cue) {
    problems.push(`slide ${i + 1} (${slide.id ?? 'no id'}) has no data-cue`);
    return;
  }
  const hits = cueTime(slide.cue);
  if (!hits.length) problems.push(`slide ${i + 1}: cue not found in script.md: "${slide.cue}"`);
  else if (hits.length > 1) problems.push(`slide ${i + 1}: cue is not unique: "${slide.cue}"`);
  slide.start = hits[0] ?? 0;
  if (slide.start < slides[i - 1].start)
    problems.push(`slide ${i + 1}: cue is out of narration order`);
});
const end = manifest.duration + 1.2;
slides.forEach((slide, i) => {
  slide.end = i + 1 < slides.length ? slides[i + 1].start : end;
  slide.duration = slide.end - slide.start;
});

console.log('slide  start     length  clip');
for (const slide of slides) {
  let note = '';
  if (slide.clip) {
    const file = join(folder, slide.clip);
    if (!existsSync(file)) {
      problems.push(`slide ${slide.index + 1}: missing clip ${slide.clip}`);
    } else {
      slide.clipLength = probeDuration(file);
      const room = slide.duration - slide.clipDelay;
      slide.speed = Math.max(1, slide.clipLength / Math.max(0.5, room));
      note = `${slide.clip} ${slide.clipLength.toFixed(1)} s${slide.speed > 1 ? ` x${slide.speed.toFixed(2)}` : ''}`;
      if (slide.speed > 1.6)
        console.warn(
          `  warning: slide ${slide.index + 1} plays its clip at x${slide.speed.toFixed(2)}; give it more narration`,
        );
    }
  }
  console.log(
    `${String(slide.index + 1).padStart(5)}  ${fmt(slide.start)}  ${slide.duration.toFixed(1).padStart(6)}  ${note}`,
  );
  if (slide.duration < 4) console.warn(`  warning: slide ${slide.index + 1} shows for under 4 s`);
  if (slide.duration > 90) console.warn(`  warning: slide ${slide.index + 1} shows for over 90 s`);
}
console.log(`total ${fmt(end)}`);
if (problems.length) {
  console.error(problems.map((p) => `error: ${p}`).join('\n'));
  await browser.close();
  process.exit(1);
}
if (check) {
  await browser.close();
  process.exit(0);
}

await page.evaluate(() => document.fonts.ready);
for (const slide of slides) {
  await page.evaluate((i) => window.__deck.show(i), slide.index);
  await page.waitForTimeout(80);
  slide.png = join(cacheDir, `slide-${String(slide.index + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: slide.png });
  if (slide.clip) {
    slide.box = await page.evaluate(() => {
      const r = document.querySelector('section.active video.clip').getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    });
  }
}
await browser.close();
console.log(`rendered ${slides.length} slides to ${cacheDir}`);
if (slidesOnly) process.exit(0);

// ---- Segments: each slide for its duration, with its recording laid over the clip area.
const encode = [
  '-c:v',
  'libx264',
  '-preset',
  'medium',
  '-crf',
  '20',
  '-pix_fmt',
  'yuv420p',
  '-r',
  String(FPS),
];
const segments = [];
for (const slide of slides) {
  const out = join(cacheDir, `segment-${String(slide.index + 1).padStart(2, '0')}.mp4`);
  const t = slide.duration.toFixed(3);
  if (slide.clip) {
    const { x, y, w, h } = slide.box;
    const played = slide.clipLength / slide.speed;
    const hold = Math.max(0, slide.duration - slide.clipDelay - played) + 0.5;
    const clipChain = [
      `setpts=(PTS-STARTPTS)/${slide.speed.toFixed(4)}`,
      `fps=${FPS}`,
      `scale=${w}:${h}:flags=lanczos`,
      `tpad=start_mode=clone:start_duration=${slide.clipDelay}:stop_mode=clone:stop_duration=${hold.toFixed(3)}`,
    ].join(',');
    ffmpeg([
      '-loop',
      '1',
      '-framerate',
      String(FPS),
      '-i',
      slide.png,
      '-i',
      join(folder, slide.clip),
      '-filter_complex',
      `[1:v]${clipChain}[c];[0:v][c]overlay=${x}:${y}:shortest=0,format=yuv420p[v]`,
      '-map',
      '[v]',
      '-t',
      t,
      ...encode,
      '-an',
      out,
    ]);
  } else {
    ffmpeg([
      '-loop',
      '1',
      '-framerate',
      String(FPS),
      '-i',
      slide.png,
      '-t',
      t,
      ...encode,
      '-an',
      out,
    ]);
  }
  segments.push(out);
  process.stdout.write('.');
}
process.stdout.write('\n');
const list = join(cacheDir, 'segments.txt');
writeFileSync(list, segments.map((s) => `file '${s}'`).join('\n') + '\n');
const silent = join(cacheDir, 'video-only.mp4');
ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

// ---- Captions: each paragraph split into short lines, timed by word count.
function chunks(text) {
  const words = plainText(text).split(/\s+/).filter(Boolean);
  const out = [];
  let current = [];
  for (const word of words) {
    current.push(word);
    const long = current.length >= 14;
    const breakable = /[.!?;:,]$/.test(word) && current.length >= 6;
    if (long || breakable) {
      out.push(current);
      current = [];
    }
  }
  if (current.length) {
    if (out.length && current.length < 4) out[out.length - 1].push(...current);
    else out.push(current);
  }
  return out;
}

const assTime = (s) => {
  const cs = Math.round(s * 100);
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const sec = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
};
const events = [];
for (const section of manifest.sections) {
  for (const p of section.paragraphs) {
    const parts = chunks(p.text);
    const total = parts.reduce((n, c) => n + c.length, 0);
    let t = p.start;
    for (const part of parts) {
      const d = ((p.end - p.start) * part.length) / total;
      const text = part.join(' ').replace(/[{}\\]/g, '');
      events.push(`Dialogue: 0,${assTime(t)},${assTime(t + d)},Caption,,0,0,0,,${text}`);
      t += d;
    }
  }
}
const ass = join(cacheDir, 'captions.ass');
writeFileSync(
  ass,
  [
    '[Script Info]',
    'ScriptType: v4.00+',
    'PlayResX: 1920',
    'PlayResY: 1080',
    'WrapStyle: 0',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Caption,Manrope,38,&H00FFFFFF,&H00FFFFFF,&H00261334,&H28261334,0,0,0,0,100,100,0,0,3,14,0,2,240,240,58,1',
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
    ...events,
  ].join('\n') + '\n',
);

const fontsDir = join(root, 'docs/design-system/assets/fonts');
const mp4 = join(folder, `${name}.mp4`);
const escaped = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'");
ffmpeg([
  '-i',
  silent,
  '-i',
  join(folder, `${name}.mp3`),
  '-vf',
  `ass='${escaped(ass)}':fontsdir='${escaped(fontsDir)}'`,
  ...encode,
  '-c:a',
  'aac',
  '-b:a',
  '160k',
  '-movflags',
  '+faststart',
  '-shortest',
  mp4,
]);
rmSync(silent);
console.log(`${mp4}: ${fmt(probeDuration(mp4))}`);
