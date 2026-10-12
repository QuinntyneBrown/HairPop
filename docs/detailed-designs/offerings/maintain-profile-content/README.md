# Maintain profile content

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The offerings subsystem supports this braider workflow. The `BraiderProfile` is the domain record that carries this slice's state. The slice addresses `L2-027`. Its central behavior is to publish permitted portfolio, area and policy fields under visibility rules.

## Description

`BraiderProfileEditor` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `MaintainBraiderProfile` is the proposed application action in the Next.js API. Its responsibility is to publish permitted portfolio, area and policy fields under visibility rules. The API contract for this slice is listed below. A thin Next.js route handler validates the request and delegates to the action. The `BraiderProfile` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Prisma.

**Frontend.** The editor is a dedicated screen, so its form is not an inline page form. The dialog checks type and size before upload and the API checks again (L2-027 AC4).

**Backend.** `MaintainBraiderProfile` is braider-only and edits the signed-in braider's own profile. `PATCH` applies with a conditional update on `Braider.version`; an older version is 409 `stale` and keeps the newer values (L2-047 AC4). `area` is required (1–120 characters); `bio` is at most 600 characters and the address and policies at most 1,000; an empty optional field is stored as "not given" and read back as `''`. The public profile and new booking options read the new values at once, while existing requests keep the policies they were sent with (L2-027 AC2); the studio address never appears publicly (AC3). An upload's type is decided from the file's bytes, not its name or declared type: only JPG, PNG and WebP up to 5 MB are stored, anything else is 422 `errors.photo` and nothing is saved (AC4). The image is kept in PostgreSQL (`MediaFile`) and served publicly from `/api/media/{id}` with its checked type and `X-Content-Type-Options: nosniff`; the item's `image.alt` is its caption (1–120 characters). `styleSlug` is optional and must name a published style; items added before styles were recorded read `styleSlug: null`. Removing a photo deletes its stored image; another braider's photo is 403.

| Part | Value |
|------|-------|
| Application | braider |
| Route | `/manage/profile` |
| Components | `BraiderProfileEditor`, `AddPortfolioItemDialog` |
| API token | `BRAIDER_PROFILE_API` (`BraiderProfileApi`) |
| Render mode | Browser (braider app) |
| Mocks | `pages/braider-profile-content/*`, `dialogs/add-portfolio-item/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| GET | `/api/braider/profile` | braider | — | 200 `BraiderProfileContent` | 401; 403 |
| PATCH | `/api/braider/profile` | braider | `ProfileInput & { version }` | 200 `BraiderProfileContent` | 409 `stale`; 422 |
| POST | `/api/braider/portfolio` | braider | multipart: `photo` (JPG, PNG or WebP ≤ 5 MB), `caption`, `styleSlug` | 201 `PortfolioItem` | 422 `errors.photo` |
| DELETE | `/api/braider/portfolio/{id}` | braider (owner) | — | 204 | 403 |

```ts
interface ProfileInput { bio: string; area: string; studioAddress: string; preparation: string; changePolicy: string; cancellationPolicy: string }
interface PortfolioItem { id: string; image: Image | null; caption: string; styleSlug: string }
interface BraiderProfileContent extends ProfileInput { version: number; portfolio: PortfolioItem[]; styles: { slug: string; name: string }[] }
```

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-027` | `L1-008` | A braider must be able to maintain their own publishable portfolio material, service area, booking and cancellation terms, and preparation guidance; private contact or studio details must follow the visibility rules of the customer journey. |
| `L2-047` | `L1-015` | Each braider management screen and dialog must implement the states listed for it in the mock manifest, edit through dialogs or dedicated screens rather than inline page forms, and report conflicts without overwriting newer data. |

## Diagrams

### System context

The braider uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for maintain profile content](diagrams/c4-context.png)

### Containers

The braider management surface calls the Next.js API. The API reads or changes the HairPop database.

![C4 container view for maintain profile content](diagrams/c4-container.png)

### Components

The API endpoint delegates to `MaintainBraiderProfile`. The action applies the relevant rules around `BraiderProfile` and persistence.

![C4 component view for maintain profile content](diagrams/c4-component.png)

### Class structure

`MaintainBraiderProfile` receives a typed request, uses `BraiderProfile`, and returns a typed result.

![Class diagram for maintain profile content](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-027` while handling invalid or unavailable state without reporting success.

![Sequence diagram for maintain profile content](diagrams/sequence-main.png)
