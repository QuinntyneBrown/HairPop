# 03 · Accounts and signing in

> **Runtime:** ~4 min · **Audience:** Product, design and engineering people new to HairPop · **Prerequisites:** None

**Video:** [03-accounts-and-sign-in.mp4](03-accounts-and-sign-in.mp4) · [Slides](slides.html) · **Audio:** [03-accounts-and-sign-in.mp3](03-accounts-and-sign-in.mp3) · [Transcript](script.md) · [Recordings](clips/clips.mjs)

## Why this video exists

Accounts protect customers' appointments, so their failure paths matter as much as the happy path. This video shows creating an account and signing in, including what HairPop deliberately does not reveal (L2-010, L2-011, L2-040).

## Learning objectives

By the end, the viewer can:

- Describe the create-account fields and validation
- Explain why retries never create two accounts
- Explain why sign in never says which credential was wrong
- Recognise the signed-in shell

## Key questions

| Question | What a strong answer includes |
|---|---|
| What does sign-up require? | Name, full email, password of at least 12 characters |
| How are duplicate accounts avoided? | A retry reuses the same Idempotency-Key |
| What does a refused sign in say? | Check your email and password; never which one |
| Where does sign in return? | A returnUrl on HairPop only; external addresses are ignored |

## Code / assets on screen

| File | What to show |
|---|---|
| `frontend/projects/customer/src/app/pages/sign-up/sign-up.page.ts` | Create account |
| `frontend/projects/customer/src/app/pages/sign-in/sign-in.page.ts` | Sign in |
| `e2e/fixtures/session.ts` | Maya Chen and the auth answers |

## Run sheet

| Time | Segment | Content |
|---|---|---|
| 00:00-00:30 | Introduction | Scope and routes |
| 00:30-01:11 | Create account | Empty form, malformed email, short password |
| 01:11-01:51 | Failures | Server failure keeps entries, then success |
| 01:51-02:33 | Sign in | Validation, refused credentials, rate limit |
| 02:33-03:10 | Signed in | Top bar shows Maya; return address rules |
| 03:10-03:42 | Recap | Things to remember |

## Demo commands

Run from the repository root. Recording needs the built customer app and e2e dependencies; narration uses the offline Piper engine here (see [the index](../README.md) for Edge).

```sh
(cd frontend && npm ci && npm run build)
(cd e2e && npm ci)
node tools/video-record/record-clips.mjs docs/videos/03-accounts-and-sign-in
node tools/video-audio/generate-audio.mjs docs/videos/03-accounts-and-sign-in --dry-run
PIPER_MODEL=/path/to/en-us-lessac-medium.onnx PIPER_LENGTH_SCALE=1.1 \
  node tools/video-audio/generate-audio.mjs docs/videos/03-accounts-and-sign-in --engine piper
node tools/video-build/build-video.mjs docs/videos/03-accounts-and-sign-in --check
node tools/video-build/build-video.mjs docs/videos/03-accounts-and-sign-in
```

## Pitfalls

- Forgot password and Verify email are linked but their pages are not built yet; the recordings only point at them.
- Sign in from the top bar has no return address, so it lands on the gallery.

## References

- [Playwright: CDP sessions](https://playwright.dev/docs/api/class-cdpsession)
- [Piper text to speech](https://github.com/rhasspy/piper)
- [edge-tts](https://github.com/rany2/edge-tts)
- [FFmpeg filters: overlay, tpad, ass](https://ffmpeg.org/ffmpeg-filters.html)
