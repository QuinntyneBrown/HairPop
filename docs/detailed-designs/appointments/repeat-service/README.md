# Repeat service

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The appointments subsystem supports this customer workflow. The `BookingDraft` is the domain record that carries this slice's state. The slice addresses `L2-023`. Its central behavior is to start a new draft from a completed visit using a currently offered service.

## Description

`AppointmentDetailPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `PrepareRepeatBooking` is the proposed application action in the Next.js API. Its responsibility is to start a new draft from a completed visit using a currently offered service. The API contract for this slice is listed below. A thin Next.js route handler validates the request and delegates to the action. The `BookingDraft` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Prisma.

**Frontend.** Book again navigates to the booking form with the service preselected and no slot chosen (L2-023 AC1). `service_unavailable` opens the braider's profile with a warning toast (L2-023 AC2).

**Backend.** `PrepareRepeatBooking` answers for the owner's completed visit only (409 `not_completed` otherwise; 404 for another customer's reference). It returns the visit's braider and service when the service is still published for a published style and the braider is published, and 409 `service_unavailable` otherwise (L2-023 AC2). It creates nothing and carries no time over.

| Part | Value |
|------|-------|
| Application | customer |
| Route | `/appointments/:ref` and `/appointments/:ref/care` → `/book/:braiderSlug?service=:id` |
| Components | `AppointmentDetailPage`, `CareAndReviewPage` |
| API token | `APPOINTMENTS_API` (`AppointmentsApi.repeatBooking`) |
| Render mode | Browser |
| Mocks | `pages/my-appointments/default`, `pages/care-and-review/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| GET | `/api/appointments/{ref}/repeat-booking` | customer (owner) | — | 200 `{ braiderSlug: string; serviceId: string }` | 409 `service_unavailable`; 404 |

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-023` | `L1-006` | Rebooking must preselect the completed appointment's braider and service when still offered and require the customer to choose a current offered time and review current terms. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for repeat service](diagrams/c4-context.png)

### Containers

The customer web application calls the Next.js API. The API reads or changes the HairPop database.

![C4 container view for repeat service](diagrams/c4-container.png)

### Components

The API endpoint delegates to `PrepareRepeatBooking`. The action applies the relevant rules around `BookingDraft` and persistence.

![C4 component view for repeat service](diagrams/c4-component.png)

### Class structure

`PrepareRepeatBooking` receives a typed request, uses `BookingDraft`, and returns a typed result.

![Class diagram for repeat service](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-023` while handling invalid or unavailable state without reporting success.

![Sequence diagram for repeat service](diagrams/sequence-main.png)
