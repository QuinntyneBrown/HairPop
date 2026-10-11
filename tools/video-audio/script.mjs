// Strict parser for a video's script.md (docs/videos/README.md), shared by the audio
// generator and the video builder.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const WORDS_PER_MINUTE = 150;

/**
 * @typedef {{ kind: 'speech', speaker: string | null, text: string, line: number }
 *   | { kind: 'pause', seconds: number, line: number }} Item
 * @typedef {{ heading: string | null, line: number, items: Item[] }} Section
 * @typedef {{ title: string, sections: Section[] }} Script
 */

/** Parses script.md; throws with every problem and its line number. */
export function parseScript(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const errors = [];
  if (!/^# \S/.test(lines[0] ?? '')) errors.push('line 1: the first line must be "# NN · Title"');
  const title = (lines[0] ?? '').replace(/^# /, '').trim();
  /** @type {Section[]} */
  const sections = [{ heading: null, line: 1, items: [] }];
  let paragraph = [];
  let start = 0;

  const flush = () => {
    if (!paragraph.length) return;
    let text = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    let speaker = null;
    const named = text.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
    if (named) {
      speaker = named[1].trim();
      text = named[2];
    }
    sections.at(-1).items.push({ kind: 'speech', speaker, text, line: start });
    paragraph = [];
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;
    if (/^```/.test(line)) errors.push(`line ${n}: fenced code blocks are not allowed`);
    if (/^\s*\|/.test(line)) errors.push(`line ${n}: tables are not allowed`);
    if (/\[[^\]]+\]\([^)]+\)/.test(line)) errors.push(`line ${n}: links are not allowed`);
    if (/<\/?[a-z][^>]*>/i.test(line)) errors.push(`line ${n}: HTML is not allowed`);
    if (/^#\s/.test(line)) errors.push(`line ${n}: only the first line may be a "# " title`);
    if (/^###/.test(line)) errors.push(`line ${n}: use "## " sections only`);
    const heading = line.match(/^## (.+)$/);
    const pause = line.match(/^\[pause (\d+(?:\.\d+)?)s\]$/);
    if (heading) {
      flush();
      sections.push({ heading: heading[1].trim(), line: n, items: [] });
    } else if (pause) {
      flush();
      sections.at(-1).items.push({ kind: 'pause', seconds: Number(pause[1]), line: n });
    } else if (/^\s*$/.test(line)) {
      flush();
    } else if (/^- /.test(line)) {
      flush();
      start = n;
      paragraph.push(line.slice(2));
      flush();
    } else {
      if (!paragraph.length) start = n;
      paragraph.push(line);
    }
  }
  flush();
  const script = { title, sections: sections.filter((s) => s.items.length || s.heading) };
  if (!script.sections.some((s) => s.items.some((it) => it.kind === 'speech'))) {
    errors.push('the script has no narration');
  }
  if (errors.length) throw new Error(`script.md is invalid:\n  ${errors.join('\n  ')}`);
  return script;
}

/** The words a reader sees: markdown emphasis and code ticks removed. */
export function plainText(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`/g, '');
}

export function countWords(text) {
  return plainText(text).split(/\s+/).filter(Boolean).length;
}

const here = dirname(fileURLToPath(import.meta.url));

/** Spoken replacements from pronunciations.json, longest first, whole words only. */
export function loadLexicon(file = join(here, 'pronunciations.json')) {
  const entries = Object.entries(JSON.parse(readFileSync(file, 'utf8')));
  entries.sort((a, b) => b[0].length - a[0].length);
  return entries.map(([written, spoken]) => ({
    pattern: new RegExp(
      `(?<![\\w-])${written.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`,
      'g',
    ),
    spoken,
  }));
}

/** The text handed to the speech engine. */
export function spokenText(text, lexicon) {
  let spoken = plainText(text);
  for (const { pattern, spoken: replacement } of lexicon)
    spoken = spoken.replace(pattern, replacement);
  return spoken;
}

export function readScript(folder) {
  return parseScript(readFileSync(join(folder, 'script.md'), 'utf8'));
}
