# Get help and legal content

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The information subsystem supports this customer workflow. The `PublishedContent` is the domain record that carries this slice's state. The slice addresses `L2-032`, `L2-033`. Its central behavior is to deliver current approved help, terms and privacy text through public pages.

## Description

`HelpAndLegalPages` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `GetPublishedContent` is the proposed Laravel application action. Its responsibility is to deliver current approved help, terms and privacy text through public pages. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `PublishedContent` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-032` | `L1-010` | The help page must explain requests, estimates, changes, and reviews and provide an actionable support contact path that can include a request reference. |
| `L2-033` | `L1-010` | Public Terms and Privacy pages must show approved, current product text and remain reachable from the customer shell and relevant account or booking flows. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for get help and legal content](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for get help and legal content](diagrams/c4-container.png)

### Components

The API endpoint delegates to `GetPublishedContent`. The action applies the relevant rules around `PublishedContent` and persistence.

![C4 component view for get help and legal content](diagrams/c4-component.png)

### Class structure

`GetPublishedContent` receives a typed request, uses `PublishedContent`, and returns a typed result.

![Class diagram for get help and legal content](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-032`, `L2-033` while handling invalid or unavailable state without reporting success.

![Sequence diagram for get help and legal content](diagrams/sequence-main.png)
