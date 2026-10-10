# Report review

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The profiles subsystem supports this customer workflow. The `ReviewReport` is the domain record that carries this slice's state. The slice addresses `L2-009`. Its central behavior is to record a reason against a published review for moderation.

## Description

`ReportReviewDialog` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `ReportPublishedReview` is the proposed Laravel application action. Its responsibility is to record a reason against a published review for moderation. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `ReviewReport` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-009` | `L1-003` | An authenticated customer must be able to report a published review with a reason. Reports must enter a moderation workflow without immediately changing the public review. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for report review](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for report review](diagrams/c4-container.png)

### Components

The API endpoint delegates to `ReportPublishedReview`. The action applies the relevant rules around `ReviewReport` and persistence.

![C4 component view for report review](diagrams/c4-component.png)

### Class structure

`ReportPublishedReview` receives a typed request, uses `ReviewReport`, and returns a typed result.

![Class diagram for report review](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-009` while handling invalid or unavailable state without reporting success.

![Sequence diagram for report review](diagrams/sequence-main.png)
