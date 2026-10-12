# Maintain availability

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The offerings subsystem supports this braider workflow. The `OfferedSlot` is the domain record that carries this slice's state. The slice addresses `L2-028`. Its central behavior is to publish or withdraw owned slots and prevent conflicting confirmations.

## Description

`BraiderAvailabilityPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `MaintainOfferedSlot` is the proposed application action in the Next.js API. Its responsibility is to publish or withdraw owned slots and prevent conflicting confirmations. The API contract for this slice is listed below. A thin Next.js route handler validates the request and delegates to the action. The `OfferedSlot` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Prisma.

**Frontend.** A requested slot shows its reference and offers no withdraw action.

| Part | Value |
|------|-------|
| Application | braider |
| Route | `/manage/availability` |
| Components | `BraiderAvailabilityPage`, `AddSlotDialog`, `WithdrawSlotDialog` |
| API token | `BRAIDER_SLOTS_API` (`BraiderSlotsApi`) |
| Render mode | Browser (braider app) |
| Mocks | `pages/braider-availability/*`, `dialogs/add-slot/*`, `dialogs/withdraw-slot/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| GET | `/api/braider/slots` | braider | — | 200 `{ data: OfferedSlot[] }` | 401; 403 |
| POST | `/api/braider/slots` | braider | `{ date: 'YYYY-MM-DD'; time: 'HH:mm'; maxHours: number }` | 201 `OfferedSlot` | 422 `errors.date` (past); 409 `overlap` |
| DELETE | `/api/braider/slots/{id}` | braider (owner) | — | 204 | 409 `requested`; 403 |

```ts
interface OfferedSlot { id: string; start: IsoDateTime; maxHours: number; requestReference: string | null }
```

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-028` | `L1-008` | A braider must be able to publish, revise, and withdraw their own offered slots; booking must validate slot availability at submission and response time. |
| `L2-047` | `L1-015` | Each braider management screen and dialog must implement the states listed for it in the mock manifest, edit through dialogs or dedicated screens rather than inline page forms, and report conflicts without overwriting newer data. |

## Diagrams

### System context

The braider uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for maintain availability](diagrams/c4-context.png)

### Containers

The braider management surface calls the Next.js API. The API reads or changes the HairPop database.

![C4 container view for maintain availability](diagrams/c4-container.png)

### Components

The API endpoint delegates to `MaintainOfferedSlot`. The action applies the relevant rules around `OfferedSlot` and persistence.

![C4 component view for maintain availability](diagrams/c4-component.png)

### Class structure

`MaintainOfferedSlot` receives a typed request, uses `OfferedSlot`, and returns a typed result.

![Class diagram for maintain availability](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-028` while handling invalid or unavailable state without reporting success.

![Sequence diagram for maintain availability](diagrams/sequence-main.png)
