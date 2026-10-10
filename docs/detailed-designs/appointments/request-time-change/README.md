# Request time change

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The appointments subsystem supports this customer workflow. The `AppointmentChange` is the domain record that carries this slice's state. The slice addresses `L2-021`. Its central behavior is to record an offered replacement while retaining the agreed time until acceptance.

## Description

`ChangeAppointmentDialog` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `ProposeAppointmentChange` is the proposed Laravel application action. Its responsibility is to record an offered replacement while retaining the agreed time until acceptance. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `AppointmentChange` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-021` | `L1-006` | An owner must be able to propose a new offered time where the appointment policy permits changes; the existing agreed time remains authoritative until the assigned braider accepts the change. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for request time change](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for request time change](diagrams/c4-container.png)

### Components

The API endpoint delegates to `ProposeAppointmentChange`. The action applies the relevant rules around `AppointmentChange` and persistence.

![C4 component view for request time change](diagrams/c4-component.png)

### Class structure

`ProposeAppointmentChange` receives a typed request, uses `AppointmentChange`, and returns a typed result.

![Class diagram for request time change](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-021` while handling invalid or unavailable state without reporting success.

![Sequence diagram for request time change](diagrams/sequence-main.png)
