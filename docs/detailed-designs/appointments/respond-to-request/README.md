# Respond to request

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The appointments subsystem supports this braider workflow. The `BookingRequest` is the domain record that carries this slice's state. The slice addresses `L2-020`. Its central behavior is to accept or decline an assigned pending request against its current version.

## Description

`BraiderRequestsPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `RespondToBookingRequest` is the proposed Laravel application action. Its responsibility is to accept or decline an assigned pending request against its current version. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `BookingRequest` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-020` | `L1-006` | The request's braider must be able to accept or decline it from an existing authenticated management surface. Acceptance must record the agreed time and amount status; a stale response must not overwrite a later state. |

## Diagrams

### System context

The braider uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for respond to request](diagrams/c4-context.png)

### Containers

The braider management surface calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for respond to request](diagrams/c4-container.png)

### Components

The API endpoint delegates to `RespondToBookingRequest`. The action applies the relevant rules around `BookingRequest` and persistence.

![C4 component view for respond to request](diagrams/c4-component.png)

### Class structure

`RespondToBookingRequest` receives a typed request, uses `BookingRequest`, and returns a typed result.

![Class diagram for respond to request](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-020` while handling invalid or unavailable state without reporting success.

![Sequence diagram for respond to request](diagrams/sequence-main.png)
