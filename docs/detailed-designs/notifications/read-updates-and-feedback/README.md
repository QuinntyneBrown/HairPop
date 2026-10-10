# Read updates and feedback

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The notifications subsystem supports this customer workflow. The `CustomerNotification` is the domain record that carries this slice's state. The slice addresses `L2-030`, `L2-031`. Its central behavior is to present recent owned records and acknowledge read state with accurate feedback.

## Description

`NotificationCenterPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `ReadCustomerUpdates` is the proposed Laravel application action. Its responsibility is to present recent owned records and acknowledge read state with accurate feedback. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `CustomerNotification` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-030` | `L1-009` | The notification center must show owned notifications in recent-first order with read and unread states, permit marking an item read, and show an empty state when none exist. |
| `L2-031` | `L1-009` | Booking, review, account, and cookie actions must use the mock's informational, success, warning, and danger feedback patterns, including action, stacked, and persistent variants where appropriate. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for read updates and feedback](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for read updates and feedback](diagrams/c4-container.png)

### Components

The API endpoint delegates to `ReadCustomerUpdates`. The action applies the relevant rules around `CustomerNotification` and persistence.

![C4 component view for read updates and feedback](diagrams/c4-component.png)

### Class structure

`ReadCustomerUpdates` receives a typed request, uses `CustomerNotification`, and returns a typed result.

![Class diagram for read updates and feedback](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-030`, `L2-031` while handling invalid or unavailable state without reporting success.

![Sequence diagram for read updates and feedback](diagrams/sequence-main.png)
