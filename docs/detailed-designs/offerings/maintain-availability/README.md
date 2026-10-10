# Maintain availability

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The offerings subsystem supports this braider workflow. The `OfferedSlot` is the domain record that carries this slice's state. The slice addresses `L2-028`. Its central behavior is to publish or withdraw owned slots and prevent conflicting confirmations.

## Description

`BraiderAvailabilityPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `MaintainOfferedSlot` is the proposed Laravel application action. Its responsibility is to publish or withdraw owned slots and prevent conflicting confirmations. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `OfferedSlot` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-028` | `L1-008` | A braider must be able to publish, revise, and withdraw their own offered slots; booking must validate slot availability at submission and response time. |

## Diagrams

### System context

The braider uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for maintain availability](diagrams/c4-context.png)

### Containers

The braider management surface calls the Laravel API. The API reads or changes the HairPop database.

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
