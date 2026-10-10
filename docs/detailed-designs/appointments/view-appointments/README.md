# View appointments

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The appointments subsystem supports this customer workflow. The `Appointment` is the domain record that carries this slice's state. The slice addresses `L2-018`, `L2-019`. Its central behavior is to load only owned summaries and lifecycle detail with state-dependent disclosure.

## Description

`AppointmentsPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `ReadOwnedAppointments` is the proposed Laravel application action. Its responsibility is to load only owned summaries and lifecycle detail with state-dependent disclosure. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `Appointment` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-018` | `L1-006` | My Appointments must show only the signed-in customer's requests and appointments, including upcoming and past items and their current status, with links to detail or care and review as appropriate. |
| `L2-019` | `L1-006` | The detail screen must reflect the current lifecycle state and show the service, braider, local time, price status, available location, contact path, policy, preparation checklist, and allowed actions. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for view appointments](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for view appointments](diagrams/c4-container.png)

### Components

The API endpoint delegates to `ReadOwnedAppointments`. The action applies the relevant rules around `Appointment` and persistence.

![C4 component view for view appointments](diagrams/c4-component.png)

### Class structure

`ReadOwnedAppointments` receives a typed request, uses `Appointment`, and returns a typed result.

![Class diagram for view appointments](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-018`, `L2-019` while handling invalid or unavailable state without reporting success.

![Sequence diagram for view appointments](diagrams/sequence-main.png)
