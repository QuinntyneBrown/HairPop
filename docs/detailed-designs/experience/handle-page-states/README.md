# Handle page states

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The experience subsystem supports this customer workflow. The `PageState` is the domain record that carries this slice's state. The slice addresses `L2-035`, `L2-036`, `L2-037`. Its central behavior is to map loading, empty, partial, failed and unauthorized outcomes to safe actions.

## Description

`CustomerRouteShell` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `ResolvePageState` is the proposed Laravel application action. Its responsibility is to map loading, empty, partial, failed and unauthorized outcomes to safe actions. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `PageState` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-035` | `L1-011` | Each page must implement the applicable states listed for it in the mock manifest and distinguish an empty data set from criteria that yield no results. |
| `L2-036` | `L1-011` | Validation, submitting, failed, partial, and offline states must match the manifest and preserve entered work when retry is possible. |
| `L2-037` | `L1-011` | Unknown pages, unauthorized resources, server errors, and offline navigation must use the corresponding mock destination with an appropriate next action. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for handle page states](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for handle page states](diagrams/c4-container.png)

### Components

The API endpoint delegates to `ResolvePageState`. The action applies the relevant rules around `PageState` and persistence.

![C4 component view for handle page states](diagrams/c4-component.png)

### Class structure

`ResolvePageState` receives a typed request, uses `PageState`, and returns a typed result.

![Class diagram for handle page states](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-035`, `L2-036`, `L2-037` while handling invalid or unavailable state without reporting success.

![Sequence diagram for handle page states](diagrams/sequence-main.png)
