# Update account details

## Overview

HairPop connects customers with braiders through published styles, service offerings, and appointment workflows. The identity subsystem supports this customer workflow. The `CustomerAccount` is the domain record that carries this slice's state. The slice addresses `L2-014`. Its central behavior is to save owned contact details and invalidate verification after an email change.

## Description

`AccountSettingsPage` is the proposed Angular screen or dialog for this slice. It reads a typed API contract through an injection token and presents the states represented in the mocks. `UpdateCustomerDetails` is the proposed Laravel application action. Its responsibility is to save owned contact details and invalidate verification after an email change. The API route and request and response schema are <TO SUPPLY>. A thin Laravel controller validates the request and delegates to the action. The `CustomerAccount` model holds the persisted state relevant to the action. Ownership and publication checks run before private fields are returned or changed. The repository persists or reads records through Laravel data access.

## Requirements

| L2 ID | Refines (L1) | Requirement |
|-------|--------------|-------------|
| `L2-014` | `L1-004` | An authenticated customer must be able to update their own name, email, and phone number. A changed email must require verification before it is treated as verified contact information. |

## Diagrams

### System context

The customer uses HairPop for this capability. HairPop owns the state and publishes only the permitted result.

![C4 system context for update account details](diagrams/c4-context.png)

### Containers

The customer web application calls the Laravel API. The API reads or changes the HairPop database.

![C4 container view for update account details](diagrams/c4-container.png)

### Components

The API endpoint delegates to `UpdateCustomerDetails`. The action applies the relevant rules around `CustomerAccount` and persistence.

![C4 component view for update account details](diagrams/c4-component.png)

### Class structure

`UpdateCustomerDetails` receives a typed request, uses `CustomerAccount`, and returns a typed result.

![Class diagram for update account details](diagrams/class-structure.png)

### Behaviour

The sequence applies `L2-014` while handling invalid or unavailable state without reporting success.

![Sequence diagram for update account details](diagrams/sequence-main.png)
