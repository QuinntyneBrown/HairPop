#!/usr/bin/env node
// Records the screen captures for one video folder (docs/videos/README.md).
//
//   node tools/video-record/record-clips.mjs docs/videos/NN-topic [--clips a,b]
//
// Needs the built customer app (`npm run build` in frontend/) and e2e dependencies
// (`npm ci` in e2e/). Clips are defined in <folder>/clips/clips.mjs and written next to it.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const folder = args.find((a) => !a.startsWith('--'));
const clipsArg = args.includes('--clips') ? args[args.indexOf('--clips') + 1] : '';

if (!folder) {
  console.error('usage: record-clips.mjs <video folder> [--clips name,name]');
  process.exit(2);
}
const dir = resolve(folder);
if (!existsSync(join(dir, 'clips', 'clips.mjs'))) {
  console.error(`no clips/clips.mjs in ${dir}`);
  process.exit(2);
}
if (!existsSync(join(root, 'frontend/dist/customer/server/server.mjs'))) {
  console.error('build the customer app first: cd frontend && npm run build');
  process.exit(2);
}

const result = spawnSync('npx', ['playwright', 'test', '-c', 'video-clips/playwright.config.ts'], {
  cwd: join(root, 'e2e'),
  stdio: 'inherit',
  env: { ...process.env, VIDEO_DIR: dir, VIDEO_CLIPS: clipsArg },
});
process.exit(result.status ?? 1);
