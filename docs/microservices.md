# HairPop Microservices Architecture

This document outlines the microservices needed to refactor HairPop into an event-driven architecture.

## Overview

HairPop will be decomposed into the following bounded contexts, each running as an independent microservice communicating via events.

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Identity    │   │   Braiders    │   │    Users      │
│   Service     │   │   Service     │   │   Service     │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        │                   ▼                   │
        │           ┌───────────────┐          │
        │           │   Reviews     │          │
        │           │   Service     │          │
        │           └───────────────┘          │
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Message Bus (Event Broker)                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Microservices

### 1. Identity Service

**Status:** ✅ Already Implemented

**Purpose:** Handles authentication, authorization, and security concerns.

**Bounded Context:** Security & Access Control

**Entities:**
- User (authentication context)
- Role
- Permission
- RefreshToken
- ApiKey

**Capabilities:**
- User registration and authentication
- JWT token generation and validation
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Password management
- Account lockout protection
- API key management

**Events Published:**
- `UserRegistered`
- `UserAuthenticated`
- `UserLoggedOut`
- `PasswordChanged`
- `RoleAssigned`
- `RoleRevoked`
- `AccountLocked`
- `AccountUnlocked`

**Events Consumed:**
- `UserProfileDeleted` → Cleanup auth records

---

### 2. Braiders Service

**Status:** 🔄 To Be Extracted

**Purpose:** Manages braider profiles, services offered, availability, and portfolio.

**Bounded Context:** Braider Management

**Entities:**
- Braider
- BraiderProfile
- Service (hair services offered)
- Availability
- Portfolio
- Location

**Capabilities:**
- Braider registration and profile management
- Service catalog management
- Availability scheduling
- Portfolio/gallery management
- Location and service area management
- Search and discovery

**Events Published:**
- `BraiderCreated`
- `BraiderUpdated`
- `BraiderDeleted`
- `BraiderVerified`
- `ServiceAdded`
- `ServiceRemoved`
- `AvailabilityUpdated`
- `PortfolioUpdated`

**Events Consumed:**
- `ReviewCreated` → Update average rating
- `ReviewDeleted` → Recalculate rating
- `UserDeleted` → Handle orphaned reviews

---

### 3. Users Service

**Status:** 🔄 To Be Extracted

**Purpose:** Manages user profiles, preferences, and customer-related data.

**Bounded Context:** Customer Management

**Entities:**
- User (profile context)
- UserPreferences
- FavoriteBraiders
- SearchHistory
- NotificationSettings

**Capabilities:**
- User profile management
- Preferences and settings
- Favorite braiders list
- Search history
- Notification preferences

**Events Published:**
- `UserProfileCreated`
- `UserProfileUpdated`
- `UserProfileDeleted`
- `PreferencesUpdated`
- `BraiderFavorited`
- `BraiderUnfavorited`

**Events Consumed:**
- `UserRegistered` → Create user profile
- `BraiderDeleted` → Remove from favorites

---

### 4. Reviews Service

**Status:** 🔄 To Be Extracted

**Purpose:** Manages reviews, ratings, and feedback for braiders.

**Bounded Context:** Feedback & Ratings

**Entities:**
- Review
- Rating
- ReviewResponse (braider replies)
- ReviewReport (flagged content)

**Capabilities:**
- Create, update, delete reviews
- Rating aggregation
- Review moderation
- Braider response management
- Report handling

**Events Published:**
- `ReviewCreated`
- `ReviewUpdated`
- `ReviewDeleted`
- `ReviewReported`
- `ReviewApproved`
- `ReviewRejected`
- `BraiderResponded`

**Events Consumed:**
- `UserProfileDeleted` → Anonymize reviews
- `BraiderDeleted` → Archive reviews

---

### 5. Booking Service

**Status:** 📋 Planned

**Purpose:** Handles appointment scheduling and booking management.

**Bounded Context:** Scheduling & Appointments

**Entities:**
- Booking
- Appointment
- BookingRequest
- Cancellation

**Capabilities:**
- Appointment scheduling
- Booking requests and confirmations
- Cancellation handling
- Calendar integration
- Reminder scheduling

**Events Published:**
- `BookingRequested`
- `BookingConfirmed`
- `BookingCancelled`
- `BookingCompleted`
- `BookingRescheduled`
- `ReminderSent`

**Events Consumed:**
- `AvailabilityUpdated` → Validate bookings
- `BraiderDeleted` → Cancel pending bookings
- `UserProfileDeleted` → Handle orphaned bookings

---

### 6. Notification Service

**Status:** 📋 Planned

**Purpose:** Centralized notification delivery across channels.

**Bounded Context:** Communication

**Entities:**
- Notification
- NotificationTemplate
- DeliveryLog

**Capabilities:**
- Email notifications
- Push notifications
- SMS notifications
- In-app notifications
- Template management

**Events Published:**
- `NotificationSent`
- `NotificationFailed`
- `NotificationRead`

**Events Consumed:**
- `BookingConfirmed` → Send confirmation
- `BookingCancelled` → Send cancellation notice
- `ReviewCreated` → Notify braider
- `UserRegistered` → Send welcome email
- `ReminderSent` → Deliver reminder

---

### 7. Search Service

**Status:** 📋 Planned

**Purpose:** Provides fast, optimized search across braiders and services.

**Bounded Context:** Discovery

**Entities:**
- SearchIndex (Elasticsearch/similar)
- SearchQuery
- SearchResult

**Capabilities:**
- Full-text search
- Geo-location search
- Faceted filtering
- Search suggestions
- Trending searches

**Events Published:**
- `SearchPerformed`

**Events Consumed:**
- `BraiderCreated` → Index braider
- `BraiderUpdated` → Update index
- `BraiderDeleted` → Remove from index
- `ReviewCreated` → Update rating in index
- `ServiceAdded` → Update services index

---

### 8. Media Service

**Status:** 📋 Planned

**Purpose:** Handles file uploads, image processing, and media storage.

**Bounded Context:** Media Management

**Entities:**
- Media
- MediaMetadata
- ProcessingJob

**Capabilities:**
- Image upload and storage
- Image resizing and optimization
- CDN integration
- Media validation

**Events Published:**
- `MediaUploaded`
- `MediaProcessed`
- `MediaDeleted`

**Events Consumed:**
- `PortfolioUpdated` → Process images
- `BraiderDeleted` → Cleanup media
- `UserProfileDeleted` → Cleanup media

---

## Shared Infrastructure

### Message Bus

**Technology Options:**
- RabbitMQ
- Azure Service Bus
- AWS SNS/SQS
- Apache Kafka

**Pattern:** Publish/Subscribe with dead-letter queues

### API Gateway

**Responsibilities:**
- Request routing
- Authentication forwarding
- Rate limiting
- Request/response transformation
- API versioning

### Shared Libraries

Located in `src/Shared/`:

| Library | Purpose |
|---------|---------|
| `Shared.Messaging.Abstractions` | Event/command interfaces |
| `Shared.Contracts` | Shared DTOs and contracts |
| `Shared.Events` | Domain event definitions |
| `Shared.Infrastructure` | Common infrastructure code |

---

## Event Catalog

### Domain Events

| Event | Publisher | Consumers |
|-------|-----------|-----------|
| `UserRegistered` | Identity | Users, Notification |
| `UserAuthenticated` | Identity | - |
| `UserProfileCreated` | Users | - |
| `UserProfileDeleted` | Users | Identity, Reviews, Booking, Media |
| `BraiderCreated` | Braiders | Search |
| `BraiderUpdated` | Braiders | Search |
| `BraiderDeleted` | Braiders | Search, Users, Reviews, Booking, Media |
| `ReviewCreated` | Reviews | Braiders, Notification, Search |
| `ReviewDeleted` | Reviews | Braiders, Search |
| `BookingConfirmed` | Booking | Notification |
| `BookingCancelled` | Booking | Notification |
| `AvailabilityUpdated` | Braiders | Booking |

---

## Data Ownership

Each service owns its data and exposes it only through APIs or events.

| Service | Database | Data Owned |
|---------|----------|------------|
| Identity | IdentityDb | Auth credentials, roles, permissions |
| Braiders | BraidersDb | Braider profiles, services, availability |
| Users | UsersDb | User profiles, preferences, favorites |
| Reviews | ReviewsDb | Reviews, ratings, responses |
| Booking | BookingDb | Appointments, bookings |
| Notification | NotificationDb | Templates, delivery logs |
| Search | Elasticsearch | Search indices (read model) |
| Media | MediaDb + Blob Storage | Media metadata, files |

---

## Migration Strategy

### Phase 1: Foundation
1. ✅ Identity Service (complete)
2. Set up message bus infrastructure
3. Create shared libraries
4. Implement API Gateway

### Phase 2: Core Services
1. Extract Braiders Service
2. Extract Users Service
3. Establish event communication

### Phase 3: Supporting Services
1. Extract Reviews Service
2. Implement Search Service
3. Implement Notification Service

### Phase 4: Advanced Features
1. Implement Booking Service
2. Implement Media Service
3. Add monitoring and tracing

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Services | .NET 8.0 |
| API Gateway | YARP / Ocelot |
| Message Bus | RabbitMQ / Azure Service Bus |
| Databases | SQL Server (per service) |
| Search | Elasticsearch |
| Caching | Redis |
| Monitoring | OpenTelemetry, Seq |
| Containers | Docker, Kubernetes |
