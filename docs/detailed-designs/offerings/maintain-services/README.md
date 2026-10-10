# Maintain services

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The offerings subsystem supports this braider workflow. The `BraiderService` is the domain record that carries this slice's state. The slice addresses `L2-026`. Its central behavior is to publish or revise an owned style-linked service with valid price and duration.

## Description

`BraiderServicesPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `MaintainBraiderService` is the proposed Laravel application action. Its responsibility is to publish or revise an owned style-linked service with valid price and duration. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `BraiderService` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-026` | `L1-008` | An authenticated braider must be able to add, revise, unpublish, and remove their own style-linked offerings, including a starting price or range, typical duration, and service-specific preparation details. |

## Diagrams

### System context

The braider uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for maintain services](diagrams/c4-context.png)

### Containers

The braider management surface calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for maintain services](diagrams/c4-container.png)

### Components

The API endpoint delegates to `MaintainBraiderService`. The action applies the relevant rules around `BraiderService` and persistence.

![C4 component view for maintain services](diagrams/c4-component.png)

### Class structure

`MaintainBraiderService` receives a typed request, uses `BraiderService`, and returns a typed result.

![Class diagram for maintain services](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-026` while handling invalid or unavailable state without reporting success.

![Sequence diagram for maintain services](diagrams/sequence-main.png)
