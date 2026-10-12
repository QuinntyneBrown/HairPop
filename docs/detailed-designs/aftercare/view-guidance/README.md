# View guidance

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The aftercare subsystem supports this customer workflow. The `CareGuidance` is the domain record that carries this slice's state. The slice addresses `L2-024`. Its central behavior is to show available preparation or aftercare guidance for the booked service.

## Description

`CareAndReviewPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `GetVisitGuidance` is the proposed application action in the Next.js API. Its responsibility is to show available preparation or aftercare guidance for the booked service. The API contract for this slice is listed below. A thin Next.js route handler validates the request and delegates to the action. The `CareGuidance` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Prisma.

**Frontend.** `guidance: null` shows the empty guidance state while the review form stays usable (L2-024 AC3).

| Part | Value |
|------|-------|
| Application | customer |
| Route | `/appointments/:ref/care` |
| Components | `CareAndReviewPage` |
| API token | `APPOINTMENTS_API` (`AppointmentsApi.care`) |
| Render mode | Browser (signed in) |
| Mocks | `pages/care-and-review/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| GET | `/api/appointments/{ref}/care` | customer (owner) | — | 200 `CareDetail` | 401; 404 |

```ts
interface CareDetail {
  reference: string; service: string; braider: { slug: string; name: string }; date: string;
  guidance: { items: string[]; source: string } | null;
  review: 'open' | 'submitted' | 'not_allowed';
}
```

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-024` | `L1-007` | The platform must show the braider's relevant preparation checklist before a visit and the booked style's care guidance after a completed visit when content is available. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for view guidance](diagrams/c4-context.png)

### Containers

The customer web application calls the Next.js API. The API reads or changes the HairPop database.

![C4 container view for view guidance](diagrams/c4-container.png)

### Components

The API endpoint delegates to `GetVisitGuidance`. The action applies the relevant rules around `CareGuidance` and persistence.

![C4 component view for view guidance](diagrams/c4-component.png)

### Class structure

`GetVisitGuidance` receives a typed request, uses `CareGuidance`, and returns a typed result.

![Class diagram for view guidance](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-024` while handling invalid or unavailable state without reporting success.

![Sequence diagram for view guidance](diagrams/sequence-main.png)
