# 02 · Finding a braider

> **Runtime:** ~5 min · **Audience:** Product, design and engineering people new to HairPop · **Prerequisites:** 01 · Discovering styles

**Video:** [02-finding-a-braider.mp4](02-finding-a-braider.mp4) · [Slides](slides.html) · **Audio:** [02-finding-a-braider.mp3](02-finding-a-braider.mp3) · [Transcript](script.md) · [Recordings](clips/clips.mjs)

## Why this video exists

Choosing a braider is the trust decision at the heart of HairPop. This video shows matching, search, filters and the public profile working in the real app (L2-004 to L2-009, L2-035).

## Learning objectives

By the end, the viewer can:

- Read a matching card: availability, honest rating, area, service price
- Search and filter braiders without losing the style
- Explain how the filter dialog validates, fails and recovers
- Describe what a public profile shows and what it keeps private

## Key questions

| Question | What a strong answer includes |
|---|---|
| Why “Not yet rated”? | A braider with no published reviews gets no number |
| Where do filters live? | In a CDK dialog; applied filters show as chips and in the URL |
| What happens to entries on failure? | They stay; the dialog says nothing was changed |
| What stays private? | The studio address, until the braider accepts |

## Code / assets on screen

| File | What to show |
|---|---|
| `frontend/projects/customer/src/app/pages/matching-braiders/matching-braiders.page.ts` | Matching list, search, chips, empty states |
| `frontend/projects/customer/src/app/pages/matching-braiders/filter-braiders.dialog.ts` | Filter dialog |
| `frontend/projects/customer/src/app/pages/braider-profile/braider-profile.page.ts` | Profile, portfolio, reviews |
| `e2e/fixtures/braiders.ts` | Nia, Aisha and Jules |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 00:00-00:33 | Introduction | Scope and routes |
| 00:33-01:20 | Matching | Availability, rating, unrated, service price |
| 01:20-01:39 | Search | Narrow by name, no matches |
| 01:39-02:08 | Filters | Price and distance, chips, reopen, Cancel |
| 02:08-02:57 | Validation | Price below the lowest, server failure, no matches |
| 02:57-03:09 | Braiders | The Braiders destination |
| 03:09-04:12 | Profile | Identity, services, terms, work, reviews |
| 04:12-04:41 | Edge cases | Reviews failure, new braider |
| 04:41-05:12 | Recap | Things to remember |

## Demo commands

Run from the repository root. Recording needs the built customer app and e2e dependencies; narration uses the offline Piper engine here (see [the index](../README.md) for Edge).

```sh
(cd frontend && npm ci && npm run build)
(cd e2e && npm ci)
node tools/video-record/record-clips.mjs docs/videos/02-finding-a-braider
node tools/video-audio/generate-audio.mjs docs/videos/02-finding-a-braider --dry-run
PIPER_MODEL=/path/to/en-us-lessac-medium.onnx PIPER_LENGTH_SCALE=1.1 \
  node tools/video-audio/generate-audio.mjs docs/videos/02-finding-a-braider --engine piper
node tools/video-build/build-video.mjs docs/videos/02-finding-a-braider --check
node tools/video-build/build-video.mjs docs/videos/02-finding-a-braider
```

## Pitfalls

- “Request an appointment” links to `/book/:slug`, which is not built yet; the recordings never follow it.
- The profile clip scrolls with `scrollIntoViewIfNeeded`, so short pages may scroll back; keep targets in reading order.

## References

- [Playwright: CDP sessions](https://playwright.dev/docs/api/class-cdpsession)
- [Piper text to speech](https://github.com/rhasspy/piper)
- [edge-tts](https://github.com/rany2/edge-tts)
- [FFmpeg filters: overlay, tpad, ass](https://ffmpeg.org/ffmpeg-filters.html)
