# Record updates

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The notifications subsystem supports this customer workflow. The `CustomerNotification` is the domain record that carries this slice's state. The slice addresses `L2-029`. Its central behavior is to create owned notifications from durable account, booking, review and privacy events.

## Description

`NotificationCenterPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `RecordCustomerUpdate` is the proposed application action in the Next.js API. Its responsibility is to create owned notifications from durable account, booking, review and privacy events. The API contract for this slice is listed below. A thin Next.js route handler validates the request and delegates to the action. The `CustomerNotification` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Prisma.

**Frontend.** Toast copy names the completed action and only claims what the response confirmed (L2-029 AC2, L2-031).

| Part | Value |
|------|-------|
| Application | customer |
| Route | every signed-in page (toasts) |
| Components | `FeedbackService` over the library `ToastService` |
| API token | `NOTIFICATIONS_API` |
| Render mode | Browser |
| Mocks | `notifications/booking-update/*`, `review-feedback/*`, `account-feedback/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| — | records are written by the API when events occur; the frontend reads them through `GET /api/notifications` | — | — | — | — |

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-029` | `L1-009` | Customer notification records must be created for material booking, review, account, and privacy events and link to the relevant owned destination when one exists. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for record updates](diagrams/c4-context.png)

### Containers

The customer web application calls the Next.js API. The API reads or changes the HairPop database.

![C4 container view for record updates](diagrams/c4-container.png)

### Components

The API endpoint delegates to `RecordCustomerUpdate`. The action applies the relevant rules around `CustomerNotification` and persistence.

![C4 component view for record updates](diagrams/c4-component.png)

### Class structure

`RecordCustomerUpdate` receives a typed request, uses `CustomerNotification`, and returns a typed result.

![Class diagram for record updates](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-029` while handling invalid or unavailable state without reporting success.

![Sequence diagram for record updates](diagrams/sequence-main.png)
