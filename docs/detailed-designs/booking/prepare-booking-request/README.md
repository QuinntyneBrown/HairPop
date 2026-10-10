# Prepare booking request

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The booking subsystem supports this customer workflow. The `BookingDraft` is the domain record that carries this slice's state. The slice addresses `L2-015`, `L2-016`. Its central behavior is to validate the selected service and slot and present current terms for review.

## Description

`BookingRequestPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `PrepareBookingRequest` is the proposed Laravel application action. Its responsibility is to validate the selected service and slot and present current terms for review. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `BookingDraft` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-015` | `L1-005` | The booking request must use a service currently offered by the selected braider and a currently offered time, and collect customer contact and hair details shown in the mock. |
| `L2-016` | `L1-005` | Before final submission, the customer must be able to review the selected service and time, estimated price and duration, location or service area, applicable cancellation policy, contact details, and hair details. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for prepare booking request](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for prepare booking request](diagrams/c4-container.png)

### Components

The API endpoint delegates to `PrepareBookingRequest`. The action applies the relevant rules around `BookingDraft` and persistence.

![C4 component view for prepare booking request](diagrams/c4-component.png)

### Class structure

`PrepareBookingRequest` receives a typed request, uses `BookingDraft`, and returns a typed result.

![Class diagram for prepare booking request](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-015`, `L2-016` while handling invalid or unavailable state without reporting success.

![Sequence diagram for prepare booking request](diagrams/sequence-main.png)
