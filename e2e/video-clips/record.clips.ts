/**
 * Records the screen captures a demo video plays (docs/videos/README.md). Not a test suite:
 * each clip in `<VIDEO_DIR>/clips/clips.mjs` drives the real app against the stub API with a
 * visible cursor, and the frames are encoded to `<VIDEO_DIR>/clips/<name>.mp4`.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { CDPSession, Locator, Page } from '@playwright/test';

import { Api, ConsentChoice, test } from '../fixtures/api';
import * as braiders from '../fixtures/braiders';
import * as consent from '../fixtures/consent';
import * as content from '../fixtures/content';
import * as errors from '../fixtures/errors';
import * as session from '../fixtures/session';
import * as styles from '../fixtures/styles';
import { BraiderProfilePage } from '../pages/braider-profile.page';
import { ConsentBanner, CookiePreferencesDialog } from '../pages/consent';
import { ErrorPage } from '../pages/error-page.page';
import { FilterBraidersDialog } from '../pages/filter-braiders.dialog';
import { HelpPage } from '../pages/help.page';
import { LegalPage } from '../pages/legal.page';
import { MatchingBraidersPage } from '../pages/matching-braiders.page';
import { Shell } from '../pages/shell';
import { SignInPage } from '../pages/sign-in.page';
import { SignUpPage } from '../pages/sign-up.page';
import { StyleDetailPage } from '../pages/style-detail.page';
import { StyleGalleryPage } from '../pages/style-gallery.page';
import { Toasts } from '../pages/toasts';

const fixtures = { braiders, consent, content, errors, session, styles };
const pages = {
  BraiderProfilePage,
  ConsentBanner,
  CookiePreferencesDialog,
  ErrorPage,
  FilterBraidersDialog,
  HelpPage,
  LegalPage,
  MatchingBraidersPage,
  Shell,
  SignInPage,
  SignUpPage,
  StyleDetailPage,
  StyleGalleryPage,
  Toasts,
};

/** What a clip's `setup` and `run` receive. */
interface ClipContext {
  page: Page;
  api: Api;
  fixtures: typeof fixtures;
  pages: typeof pages;
  act: Actor;
}

interface Clip {
  name: string;
  consent?: ConsentChoice;
  colorScheme?: 'light' | 'dark';
  viewport?: { width: number; height: number };
  /** Multiplies every pause, to stretch a recording to its narration. */
  pace?: number;
  /** Unrecorded: API state and the first page. */
  setup?: (ctx: ClipContext) => Promise<void>;
  /** Recorded. */
  run: (ctx: ClipContext) => Promise<void>;
}

const videoDir = resolve(process.env['VIDEO_DIR'] ?? '');
const only = (process.env['VIDEO_CLIPS'] ?? '').split(',').filter(Boolean);
const clips: Clip[] = process.env['VIDEO_DIR']
  ? (await import(pathToFileURL(join(videoDir, 'clips', 'clips.mjs')).href)).default
  : [];

/** A cursor drawn into the page, since a headless browser paints none. */
const CURSOR_SCRIPT = `(() => {
  const KEY = '__demoCursor';
  const install = () => {
    if (document.getElementById(KEY)) return;
    const cursor = document.createElement('div');
    cursor.id = KEY;
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<svg width="30" height="30" viewBox="0 0 30 30"><path d="M5 3 L5 24 L10.5 18.6 L14.3 27 L18 25.4 L14.3 17.2 L21.8 17.2 Z" fill="#111" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    Object.assign(cursor.style, {
      position: 'fixed', left: '0', top: '0', width: '30px', height: '30px',
      pointerEvents: 'none', zIndex: '2147483647', margin: '-4px 0 0 -5px',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.35))',
    });
    document.documentElement.appendChild(cursor);
    const place = (x, y) => { cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)'; };
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch {}
    place(saved ? saved.x : -100, saved ? saved.y : -100);
    document.addEventListener('mousemove', (e) => {
      place(e.clientX, e.clientY);
      try { sessionStorage.setItem(KEY, JSON.stringify({ x: e.clientX, y: e.clientY })); } catch {}
    }, true);
    document.addEventListener('mousedown', (e) => {
      const ring = document.createElement('div');
      ring.setAttribute('aria-hidden', 'true');
      Object.assign(ring.style, {
        position: 'fixed', left: (e.clientX - 18) + 'px', top: (e.clientY - 18) + 'px',
        width: '36px', height: '36px', borderRadius: '50%', pointerEvents: 'none',
        border: '3px solid rgba(236, 72, 153, .85)', zIndex: '2147483646',
        transition: 'transform .45s ease-out, opacity .45s ease-out',
      });
      document.documentElement.appendChild(ring);
      requestAnimationFrame(() => { ring.style.transform = 'scale(1.8)'; ring.style.opacity = '0'; });
      setTimeout(() => ring.remove(), 600);
    }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();`;

/** Human-paced input: the cursor glides to a target before acting on it. */
class Actor {
  private x = 704;
  private y = 420;
  /** Seconds spent in pauses, reported so `pace` can be tuned. */
  waited = 0;

  constructor(
    private readonly page: Page,
    private readonly pace = 1,
  ) {}

  wait(ms: number): Promise<void> {
    this.waited += (ms * this.pace) / 1000;
    return this.page.waitForTimeout(ms * this.pace);
  }

  /** Parks the drawn cursor off screen, for keyboard-only passages. */
  async hideCursor(): Promise<void> {
    await this.page.evaluate(() => {
      sessionStorage.setItem('__demoCursor', JSON.stringify({ x: -100, y: -100 }));
      const cursor = document.getElementById('__demoCursor');
      if (cursor) cursor.style.transform = 'translate(-100px,-100px)';
    });
  }

  async moveTo(target: Locator): Promise<void> {
    await target.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    if (!box) throw new Error(`no box for ${target}`);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const steps = Math.max(12, Math.min(45, Math.round(Math.hypot(x - this.x, y - this.y) / 14)));
    await this.page.mouse.move(x, y, { steps });
    this.x = x;
    this.y = y;
  }

  async click(target: Locator, after = 700): Promise<void> {
    await this.moveTo(target);
    await this.wait(250);
    await target.click();
    await this.wait(after);
  }

  async type(target: Locator, text: string, after = 400): Promise<void> {
    await this.click(target, 200);
    await target.pressSequentially(text, { delay: 65 });
    await this.wait(after);
  }

  async press(key: string, after = 700): Promise<void> {
    await this.page.keyboard.press(key);
    await this.wait(after);
  }

  async select(target: Locator, value: string, after = 600): Promise<void> {
    await this.moveTo(target);
    await this.wait(250);
    await target.selectOption(value);
    await this.wait(after);
  }

  /** Scrolls the page smoothly so the target sits near the top third. */
  async scrollTo(target: Locator, after = 900): Promise<void> {
    await target.evaluate((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 4;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
    await this.wait(after);
  }

  async scrollBy(dy: number, after = 900): Promise<void> {
    await this.page.evaluate((y) => window.scrollBy({ top: y, behavior: 'smooth' }), dy);
    await this.wait(after);
  }

  async scrollTop(after = 700): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await this.wait(after);
  }
}

/** Collects compositor frames over CDP; frames arrive only when the page changes. */
class Screencast {
  private cdp?: CDPSession;
  private readonly frames: { data: Buffer; t: number }[] = [];
  private startedAt = 0;

  constructor(private readonly page: Page) {}

  async start(): Promise<void> {
    this.cdp = await this.page.context().newCDPSession(this.page);
    this.cdp.on('Page.screencastFrame', (frame) => {
      this.frames.push({ data: Buffer.from(frame.data, 'base64'), t: Date.now() / 1000 });
      void this.cdp
        ?.send('Page.screencastFrameAck', { sessionId: frame.sessionId })
        .catch(() => {});
    });
    this.startedAt = Date.now() / 1000;
    await this.cdp.send('Page.startScreencast', {
      format: 'jpeg',
      quality: 92,
      maxWidth: 1408,
      maxHeight: 1408,
      everyNthFrame: 1,
    });
  }

  /** Stops and encodes the frames to an H.264 MP4 at 30 fps. */
  async save(out: string, size: { width: number; height: number }): Promise<number> {
    const end = Date.now() / 1000;
    await this.cdp?.send('Page.stopScreencast');
    if (!this.frames.length) throw new Error('the screencast produced no frames');
    const work = `${out}.frames`;
    rmSync(work, { recursive: true, force: true });
    mkdirSync(work, { recursive: true });
    const lines: string[] = [];
    // The first frame covers the time before it arrived.
    this.frames[0].t = this.startedAt;
    this.frames.forEach((frame, i) => {
      const name = `f${String(i).padStart(5, '0')}.jpg`;
      writeFileSync(join(work, name), frame.data);
      const next = i + 1 < this.frames.length ? this.frames[i + 1].t : end;
      lines.push(`file '${name}'`, `duration ${Math.max(0.001, next - frame.t).toFixed(3)}`);
    });
    lines.push(`file 'f${String(this.frames.length - 1).padStart(5, '0')}.jpg'`);
    writeFileSync(join(work, 'list.txt'), lines.join('\n') + '\n');
    execFileSync(
      process.env['FFMPEG_PATH'] ?? 'ffmpeg',
      [
        '-y',
        '-loglevel',
        'error',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        join(work, 'list.txt'),
        '-vf',
        `scale=${size.width}:${size.height}:flags=lanczos,fps=30,format=yuv420p`,
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '20',
        '-movflags',
        '+faststart',
        '-an',
        out,
      ],
      { stdio: 'inherit' },
    );
    rmSync(work, { recursive: true, force: true });
    return end - this.startedAt;
  }
}

for (const clip of clips) {
  if (only.length && !only.includes(clip.name)) continue;
  test.describe(clip.name, () => {
    test.use({
      consent: clip.consent === undefined ? 'essential' : clip.consent,
      colorScheme: clip.colorScheme ?? 'light',
      ...(clip.viewport ? { viewport: clip.viewport } : {}),
    });

    test(`records ${clip.name}`, async ({ page, api }) => {
      await page.addInitScript(CURSOR_SCRIPT);
      const act = new Actor(page, clip.pace);
      const ctx: ClipContext = { page, api, fixtures, pages, act };
      await clip.setup?.(ctx);
      act.waited = 0;
      await page.mouse.move(704, 420);
      await page.waitForTimeout(300);
      const cast = new Screencast(page);
      await cast.start();
      await clip.run(ctx);
      const size = clip.viewport ?? { width: 1408, height: 792 };
      const seconds = await cast.save(join(videoDir, 'clips', `${clip.name}.mp4`), size);
      console.log(`${clip.name}: ${seconds.toFixed(1)} s, ${act.waited.toFixed(1)} s of it paused`);
    });
  });
}
