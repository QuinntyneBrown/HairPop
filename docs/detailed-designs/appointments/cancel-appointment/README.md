# Cancel appointment

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The appointments subsystem supports this customer workflow. The `Appointment` is the domain record that carries this slice's state. The slice addresses `L2-022`. Its central behavior is to apply permitted cancellation once after the owner reviews current terms.

## Description

`CancelAppointmentDialog` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `CancelOwnedAppointment` is the proposed Laravel application action. Its responsibility is to apply permitted cancellation once after the owner reviews current terms. The API contract for this slice is listed below. A thin Laravel controller validates the request and delegates to the action. The `Appointment` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

**Frontend.** The destructive dialog shows the reference and current terms before confirmation; dismissing leaves the status unchanged (L2-022).

| Part | Value |
|------|-------|
| Application | customer |
| Route | dialog over `/appointments/:ref` |
| Components | `CancelAppointmentDialog` |
| API token | `APPOINTMENTS_API` (`AppointmentsApi.cancel`) |
| Render mode | Browser |
| Mocks | `dialogs/cancel-appointment/*` |

**API contract.** All paths are relative to the API origin; JSON bodies; errors use `ApiErrorBody`.

| Method | Path | Access | Request | Success | Errors |
|--------|------|--------|---------|---------|--------|
| POST | `/api/appointments/{ref}/cancellation` | customer (owner) | `{}` | 200 `{ status: 'cancelled' }` (repeat calls return the same) | 409 `not_cancellable`; 404 |

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-022` | `L1-006` | An owner must be able to review the applicable cancellation terms and explicitly confirm cancellation where the current policy permits it. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for cancel appointment](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for cancel appointment](diagrams/c4-container.png)

### Components

The API endpoint delegates to `CancelOwnedAppointment`. The action applies the relevant rules around `Appointment` and persistence.

![C4 component view for cancel appointment](diagrams/c4-component.png)

### Class structure

`CancelOwnedAppointment` receives a typed request, uses `Appointment`, and returns a typed result.

![Class diagram for cancel appointment](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-022` while handling invalid or unavailable state without reporting success.

![Sequence diagram for cancel appointment](diagrams/sequence-main.png)
