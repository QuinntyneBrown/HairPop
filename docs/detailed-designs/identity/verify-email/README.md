# Verify email

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The identity subsystem supports this customer workflow. The `EmailVerification` is the domain record that carries this slice's state. The slice addresses `L2-013`. Its central behavior is to consume a single-use verification challenge or issue a controlled resend.

## Description

`VerifyEmailPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `VerifyCustomerEmail` is the proposed Laravel application action. Its responsibility is to consume a single-use verification challenge or issue a controlled resend. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `EmailVerification` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-013` | `L1-004` | Account email verification must use a time-limited, single-use link and provide a controlled resend action. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for verify email](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for verify email](diagrams/c4-container.png)

### Components

The API endpoint delegates to `VerifyCustomerEmail`. The action applies the relevant rules around `EmailVerification` and persistence.

![C4 component view for verify email](diagrams/c4-component.png)

### Class structure

`VerifyCustomerEmail` receives a typed request, uses `EmailVerification`, and returns a typed result.

![Class diagram for verify email](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-013` while handling invalid or unavailable state without reporting success.

![Sequence diagram for verify email](diagrams/sequence-main.png)
