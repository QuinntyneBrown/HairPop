# 01 · Discovering styles

> **Runtime:** ~4.5 min · **Audience:** Product, design and engineering people new to HairPop · **Prerequisites:** None

**Video:** [01-discovering-styles.mp4](01-discovering-styles.mp4) · [Slides](slides.html) · **Audio:** [01-discovering-styles.mp3](01-discovering-styles.mp3) · [Transcript](script.md) · [Recordings](clips/clips.mjs)

## Why this video exists

Style discovery is the first thing every customer does. This video shows each gallery and style detail behaviour working in the real app, so reviewers can see L2-001, L2-002, L2-003, L2-035 and L2-036 without running anything.

## Learning objectives

By the end, the viewer can:

- Describe what a gallery card shows and what it leaves out
- Use categories, search, Clear filters and paging, and explain why they live in the address
- Recognise the failure, offline and partial-data states and how they recover
- Follow a style to the braiders who offer it

## Key questions

| Question | What a strong answer includes |
|---|---|
| What does a card show? | Eyebrow, name, typical time, typical price when published, Explore link |
| How do criteria persist? | Category, search and page are in the URL; Clear filters resets both |
| What happens when a load fails? | An explanation, Try again, and the chosen category kept |
| What if a fact is missing? | It is left out, or a partial warning names it with Retry |

## Code / assets on screen

| File | What to show |
|---|---|
| `frontend/projects/customer/src/app/pages/style-gallery/style-gallery.page.ts` | Gallery, categories, search, paging, states |
| `frontend/projects/customer/src/app/pages/style-detail/style-detail.page.ts` | Facts, variations, quote factors, partial warning |
| `e2e/fixtures/styles.ts` | Cast styles used by the recordings |
| `clips/clips.mjs` | The scripted recordings |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 00:00-00:35 | Introduction | What the video covers and how it was recorded |
| 00:35-01:22 | Gallery | Cards, typical time and price, missing values |
| 01:22-02:07 | Criteria | Categories, search, no matches, Clear filters |
| 02:07-02:27 | Paging | Showing 1–2 of 3, Next keeps the category |
| 02:27-02:58 | Recovery | Server error and offline, both retried |
| 02:58-03:41 | Style detail | Facts, variations, quote factors, Find a braider |
| 03:41-03:58 | Partial data | Typical wear warning and Retry |
| 03:58-04:23 | Recap | Things to remember |

## Demo commands

Run from the repository root. Recording needs the built customer app and e2e dependencies; narration uses the offline Piper engine here (see [the index](../README.md) for Edge).

```sh
(cd frontend && npm ci && npm run build)
(cd e2e && npm ci)
node tools/video-record/record-clips.mjs docs/videos/01-discovering-styles
node tools/video-audio/generate-audio.mjs docs/videos/01-discovering-styles --dry-run
PIPER_MODEL=/path/to/en-us-lessac-medium.onnx PIPER_LENGTH_SCALE=1.1 \
  node tools/video-audio/generate-audio.mjs docs/videos/01-discovering-styles --engine piper
node tools/video-build/build-video.mjs docs/videos/01-discovering-styles --check
node tools/video-build/build-video.mjs docs/videos/01-discovering-styles
```

## Pitfalls

- Clip waits are scaled by `pace`; re-tune it whenever the narration changes so the recording ends just before the next slide.
- Rules with `times` are consumed separately by the SSR stub and the browser; add a later rule in `run` when a retry must succeed.

## References

- [Playwright: CDP sessions](https://playwright.dev/docs/api/class-cdpsession)
- [Piper text to speech](https://github.com/rhasspy/piper)
- [edge-tts](https://github.com/rany2/edge-tts)
- [FFmpeg filters: overlay, tpad, ass](https://ffmpeg.org/ffmpeg-filters.html)
