# 04 · Help, privacy and recovery

> **Runtime:** ~4 min · **Audience:** Product, design and engineering people new to HairPop · **Prerequisites:** None

**Video:** [04-help-privacy-and-recovery.mp4](04-help-privacy-and-recovery.mp4) · [Slides](slides.html) · **Audio:** [04-help-privacy-and-recovery.mp3](04-help-privacy-and-recovery.mp3) · [Transcript](script.md) · [Recordings](clips/clips.mjs)

## Why this video exists

Consent, themes, help, legal text, error pages and keyboard support apply to every page. This video shows them working in the real app (L2-031 to L2-037, L2-041, L2-042, L2-048).

## Learning objectives

By the end, the viewer can:

- Explain how optional-data consent is asked for and revised
- Describe how the theme toggle behaves and persists
- Find help, terms and privacy and know they never invent text
- Recognise each error destination and its next step
- Navigate the app with the keyboard

## Key questions

| Question | What a strong answer includes |
|---|---|
| Is anything optional stored before consent? | No; nothing is pre-selected and an answer is required |
| Where is consent revised? | Cookie preferences in the footer |
| What does the 500 page show? | A support reference with the time, Contact support and Try again |
| What does the first Tab do? | Reveals Skip to content |

## Code / assets on screen

| File | What to show |
|---|---|
| `frontend/projects/customer/src/app/shared/cookie-banner.ts` | Consent banner |
| `frontend/projects/customer/src/app/shared/cookie-preferences.dialog.ts` | Preferences dialog |
| `frontend/projects/customer/src/app/pages/help/help.page.ts` | Help |
| `frontend/projects/customer/src/app/pages/errors/` | Error destinations |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 00:00-00:28 | Introduction | Scope and routes |
| 00:28-01:24 | Privacy | Banner, dialog validation, toast, footer revision |
| 01:24-01:42 | Theme | Dark theme across navigation and reload |
| 01:42-02:10 | Help | Four topics, Email support, reference |
| 02:10-02:29 | Legal | Terms and Privacy with effective dates |
| 02:29-03:03 | Errors | 404, 403, 500 with reference, offline |
| 03:03-03:28 | Keyboard | Skip link, focus rings, route focus |
| 03:28-03:55 | Recap | Things to remember |

## Demo commands

Run from the repository root. Recording needs the built customer app and e2e dependencies; narration uses the offline Piper engine here (see [the index](../README.md) for Edge).

```sh
(cd frontend && npm ci && npm run build)
(cd e2e && npm ci)
node tools/video-record/record-clips.mjs docs/videos/04-help-privacy-and-recovery
node tools/video-audio/generate-audio.mjs docs/videos/04-help-privacy-and-recovery --dry-run
PIPER_MODEL=/path/to/en-us-lessac-medium.onnx PIPER_LENGTH_SCALE=1.1 \
  node tools/video-audio/generate-audio.mjs docs/videos/04-help-privacy-and-recovery --engine piper
node tools/video-build/build-video.mjs docs/videos/04-help-privacy-and-recovery --check
node tools/video-build/build-video.mjs docs/videos/04-help-privacy-and-recovery
```

## Pitfalls

- The consent clips set `consent` per clip; the default is a returning visitor who chose essential only.
- Keyboard clips call `act.hideCursor()` so the drawn pointer does not suggest a mouse.

## References

- [Playwright: CDP sessions](https://playwright.dev/docs/api/class-cdpsession)
- [Piper text to speech](https://github.com/rhasspy/piper)
- [edge-tts](https://github.com/rany2/edge-tts)
- [FFmpeg filters: overlay, tpad, ass](https://ffmpeg.org/ffmpeg-filters.html)
