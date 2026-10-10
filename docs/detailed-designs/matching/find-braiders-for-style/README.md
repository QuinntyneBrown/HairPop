# Find braiders for style

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The matching subsystem supports this customer workflow. The `BraiderService` is the domain record that carries this slice's state. The slice addresses `L2-004`, `L2-005`, `L2-006`. Its central behavior is to match published offerings to the style and valid location and price filters.

## Description

`MatchingBraidersPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `FindEligibleBraiders` is the proposed Laravel application action. Its responsibility is to match published offerings to the style and valid location and price filters. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `BraiderService` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-004` | `L1-002` | Matching results must contain only active, published braiders who offer the selected published style, with service area, applicable starting price or range, rating summary where available, and supplied availability information. |
| `L2-005` | `L1-002` | Visitors must be able to search and narrow matching braiders by the mock's price and travel-distance criteria without losing the selected style. |
| `L2-006` | `L1-002` | Each matching result must identify the selected service that made the braider eligible and link to that braider's profile without claiming a personalized or verified match. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for find braiders for style](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for find braiders for style](diagrams/c4-container.png)

### Components

The API endpoint delegates to `FindEligibleBraiders`. The action applies the relevant rules around `BraiderService` and persistence.

![C4 component view for find braiders for style](diagrams/c4-component.png)

### Class structure

`FindEligibleBraiders` receives a typed request, uses `BraiderService`, and returns a typed result.

![Class diagram for find braiders for style](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-004`, `L2-005`, `L2-006` while handling invalid or unavailable state without reporting success.

![Sequence diagram for find braiders for style](diagrams/sequence-main.png)
