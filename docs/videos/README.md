# HairPop demo videos

Narrated walkthroughs of the HairPop customer web app. Every screen capture is the real, built Angular app recorded against the e2e stub API, so the cast, copy and states match the mocks and the Playwright suite.

| # | Video | Runtime | Covers |
|---|---|---|---|
| 01 | [Discovering styles](01-discovering-styles/README.md) | 4:24 | Style gallery, categories, search, paging, failure and offline states, style detail, partial data |
| 02 | [Finding a braider](02-finding-a-braider/README.md) | 5:13 | Matching braiders, search, filter dialog and its validation, Braiders destination, braider profile, portfolio and reviews |
| 03 | [Accounts and signing in](03-accounts-and-sign-in/README.md) | 3:43 | Create account, validation and retries, sign in, refused credentials, rate limits, signed-in shell |
| 04 | [Help, privacy and recovery](04-help-privacy-and-recovery/README.md) | 3:56 | Cookie consent, theme toggle, help, terms and privacy, error pages, keyboard support |

Each folder holds `script.md` (transcript), `slides.html` (deck cued to the script), `README.md` (outline and run sheet), `clips/clips.mjs` (scripted recordings), the recorded `clips/*.mp4`, the narration `NN-topic.mp3` and the captioned 1920x1080 `NN-topic.mp4`. Open `slides.html` in a browser to step through a deck with the arrow keys; recordings play on their slides.

## Making or changing a video

Run from the repository root. The `creating-videos` skill (`.claude/skills/creating-videos/SKILL.md`) describes the file formats and the quality checklist.

```sh
# 1. The app and the browser tooling
(cd frontend && npm ci && npm run build)
(cd e2e && npm ci)

# 2. Screen captures: <folder>/clips/clips.mjs -> <folder>/clips/<name>.mp4
node tools/video-record/record-clips.mjs docs/videos/NN-topic [--clips name,name]

# 3. Narration and timing manifest (.cache/NN-topic/manifest.json)
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --dry-run
node tools/video-audio/generate-audio.mjs docs/videos/NN-topic                 # Edge (online)
PIPER_MODEL=/path/to/voice.onnx node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --engine piper

# 4. Slides, recordings, narration and captions -> NN-topic.mp4
node tools/video-build/build-video.mjs docs/videos/NN-topic --check
node tools/video-build/build-video.mjs docs/videos/NN-topic --slides-only
node tools/video-build/build-video.mjs docs/videos/NN-topic
```

Environment variables: `CHROMIUM_PATH` (or `EDGE_PATH`) points the recorder and builder at an installed Chromium when Playwright's own browser is missing; `FFMPEG_PATH` and `FFPROBE_PATH` pick ffmpeg; `PYTHON` picks the interpreter that has `edge-tts` or `piper-tts`; `EDGE_VOICE` / `EDGE_VOICE_2` and `PIPER_MODEL` / `PIPER_MODEL_2` pick voices; `PIPER_LENGTH_SCALE` slows Piper speech (the current videos use `1.1`).

The current narration was synthesized offline with Piper's `en-us-lessac-medium` voice (from the `rhasspy/piper` v0.0.2 release), because the build environment's network policy blocks the Edge read-aloud service. Re-running step 3 without `--engine piper` regenerates it with Edge's neural voices; re-check the clip timings afterwards.

## Screen captures

`clips/clips.mjs` default-exports a list of clips. Each clip has a `name`, an optional `consent` (`'essential'` by default, `null` for a first visit), `colorScheme`, `viewport` and `pace`, an unrecorded `setup` and a recorded `run`. Both receive:

- `page` and `api`: the Playwright page and the e2e `Api` fixture (`api.given(...)` adds stub rules for the browser and the SSR server).
- `fixtures`: the e2e fixture modules (`styles`, `braiders`, `session`, `content`, `consent`, `errors`).
- `pages`: the e2e page objects, so clips hold no selectors.
- `act`: human-paced input with a drawn cursor (`moveTo`, `click`, `type`, `select`, `press`, `scrollTo`, `scrollBy`, `scrollTop`, `wait`, `hideCursor`).

The recorder (`e2e/video-clips/`) captures compositor frames over CDP and encodes them at 1408x792, 30 fps. `pace` multiplies every `act` pause: record once, run `build-video.mjs --check` to see each clip slide's length, and set `pace` so the clip ends a second or two before the next slide. The builder speeds a clip up when it is longer than its narration and holds the last frame when it is shorter.

## Slides

Decks share `assets/slides.css` (design-system tokens and fonts) and `assets/slides.js`. A `<section data-clip="clips/x.mp4">` with an `<aside class="clip-notes">` plays a recording in a 1408x792 frame; `data-clip-delay="s"` holds its first frame. `?slide=N` or `#N` opens a slide; `?render=1` is the builder's 1:1 render mode.
