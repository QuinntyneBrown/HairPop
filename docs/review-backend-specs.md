# Review Management - Backend Specifications

## Overview

The Review Management feature provides CRUD operations for managing customer reviews of professional braiders in the HairPop platform. This module follows the same MediatR pattern with FluentValidation for request validation.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | .NET | 8.0 |
| ORM | Entity Framework Core | 9.0.0 |
| CQRS Pattern | MediatR | 12.4.1 |
| Validation | FluentValidation | 11.11.0 |
| API Documentation | Swagger/OpenAPI | Latest |

## Domain Model

### Entity: Review

The core entity representing a customer review.

```csharp
public class Review
{
    public Guid ReviewId { get; set; }
}
```

**Note:** The Review entity is currently in a minimal implementation state. Future enhancements will add additional fields such as rating, content, braider reference, and user reference.

### Data Transfer Object: ReviewDto

```csharp
public class ReviewDto
{
    public Guid ReviewId { get; set; }
}
```

### Extension Methods

```csharp
public static class ReviewExtensions
{
    public static ReviewDto ToDto(this Review review)
    {
        return new ReviewDto
        {
            ReviewId = review.ReviewId
        };
    }
}
```

---

## API Endpoints

### Base Route: `/api/reviews`

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/reviews` | Create a new review | CreateReviewRequest | CreateReviewResponse |
| GET | `/api/reviews` | Get all reviews | None | GetReviewsResponse |
| GET | `/api/reviews/{reviewId}` | Get review by ID | reviewId (GUID) | GetReviewByIdResponse |
| PUT | `/api/reviews` | Update a review | UpdateReviewRequest | UpdateReviewResponse |
| DELETE | `/api/reviews/{reviewId}` | Delete a review | reviewId (GUID) | DeleteReviewResponse |

---

## Feature Specifications

### SPEC-RV-001: Create Review

**Description:** Create a new customer review in the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall generate a unique GUID for new reviews | Implemented |
| AC-002 | System shall return HTTP 200 with created review on success | Implemented |
| AC-003 | System shall validate request data before creation | Implemented |

#### Request Model

```csharp
public class CreateReviewRequest : IRequest<CreateReviewResponse>
{
}
```

#### Response Model

```csharp
public class CreateReviewResponse
{
    public ReviewDto Review { get; set; }
}
```

#### Validation Rules

```csharp
public class CreateReviewRequestValidator
    : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        // Validation rules to be extended
    }
}
```

---

### SPEC-RV-002: Get All Reviews

**Description:** Retrieve a list of all reviews in the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall return all reviews in the database | Implemented |
| AC-002 | System shall return an empty list if no reviews exist | Implemented |
| AC-003 | System shall return HTTP 200 with list of ReviewDto | Implemented |

#### Request Model

```csharp
public class GetReviewsRequest : IRequest<GetReviewsResponse>
{
}
```

#### Response Model

```csharp
public class GetReviewsResponse
{
    public List<ReviewDto> Reviews { get; set; }
}
```

---

### SPEC-RV-003: Get Review By ID

**Description:** Retrieve a specific review by its unique identifier.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall return review matching the provided GUID | Implemented |
| AC-002 | System shall return HTTP 404 if review not found | Implemented |
| AC-003 | System shall return HTTP 200 with ReviewDto on success | Implemented |

#### Request Model

```csharp
public class GetReviewByIdRequest : IRequest<GetReviewByIdResponse>
{
    public Guid ReviewId { get; set; }
}
```

#### Response Model

```csharp
public class GetReviewByIdResponse
{
    public ReviewDto Review { get; set; }
}
```

---

### SPEC-RV-004: Update Review

**Description:** Update an existing review.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall update review with matching GUID | Implemented |
| AC-002 | System shall return HTTP 200 with updated ReviewDto | Implemented |
| AC-003 | System shall validate request data before update | Implemented |

#### Request Model

```csharp
public class UpdateReviewRequest : IRequest<UpdateReviewResponse>
{
    public Guid ReviewId { get; set; }
}
```

#### Response Model

```csharp
public class UpdateReviewResponse
{
    public ReviewDto Review { get; set; }
}
```

#### Validation Rules

```csharp
public class UpdateReviewRequestValidator
    : AbstractValidator<UpdateReviewRequest>
{
    public UpdateReviewRequestValidator()
    {
        // Validation rules to be extended
    }
}
```

---

### SPEC-RV-005: Delete Review

**Description:** Remove a review from the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall delete review with matching GUID | Implemented |
| AC-002 | System shall return HTTP 200 on successful deletion | Implemented |
| AC-003 | System shall handle non-existent review gracefully | Implemented |

#### Request Model

```csharp
public class DeleteReviewRequest : IRequest<DeleteReviewResponse>
{
    public Guid ReviewId { get; set; }
}
```

#### Response Model

```csharp
public class DeleteReviewResponse
{
}
```

#### Validation Rules

```csharp
public class DeleteReviewRequestValidator
    : AbstractValidator<DeleteReviewRequest>
{
    public DeleteReviewRequestValidator()
    {
        // Validation rules to be extended
    }
}
```

---

## File Structure

```
src/HairPop.Models/Review/
├── Review.cs                       # Entity model
├── ReviewDto.cs                    # Data transfer object
├── ReviewExtensions.cs             # ToDto mapping
├── CreateReviewRequest.cs          # Create request
├── CreateReviewResponse.cs         # Create response
├── CreateReviewRequestValidator.cs # Create validation
├── GetReviewsRequest.cs            # Get all request
├── GetReviewsResponse.cs           # Get all response
├── GetReviewByIdRequest.cs         # Get by ID request
├── GetReviewByIdResponse.cs        # Get by ID response
├── UpdateReviewRequest.cs          # Update request
├── UpdateReviewResponse.cs         # Update response
├── UpdateReviewRequestValidator.cs # Update validation
├── DeleteReviewRequest.cs          # Delete request
├── DeleteReviewResponse.cs         # Delete response
└── DeleteReviewRequestValidator.cs # Delete validation
```

---

## API Response Codes

| Code | Description | Scenario |
|------|-------------|----------|
| 200 | OK | Successful operation |
| 400 | Bad Request | Validation failure |
| 404 | Not Found | Review not found by ID |
| 500 | Internal Server Error | Unexpected server error |

---

## Data Flow Diagram

```
Client Request
      |
      v
+------------------+
|  API Controller  |
|  (ReviewsController)
+------------------+
      |
      v
+------------------+
|    MediatR       |
|    (IMediator)   |
+------------------+
      |
      v
+------------------+
|  Request Handler |
|  (IRequestHandler)
+------------------+
      |
      v
+------------------+
|    DbContext     |
+------------------+
      |
      v
+------------------+
|    Database      |
+------------------+
```

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Entity Model | Partial | Only ReviewId field |
| DTO | Partial | Only ReviewId field |
| Request/Response Models | Complete | All CRUD operations |
| Validators | Scaffolded | Rules to be extended |
| Controller | Pending | Not yet implemented |
| Handlers | Pending | Not yet implemented |
| DbContext Mapping | Pending | Not mapped to context |

---

## Planned Entity Enhancement

The Review entity will be extended to include:

```csharp
public class Review
{
    public Guid ReviewId { get; set; }
    public Guid BraiderId { get; set; }     // Foreign key to Braider
    public Guid UserId { get; set; }         // Foreign key to User
    public int Rating { get; set; }          // 1-5 star rating
    public string Content { get; set; }      // Review text
    public DateTime CreatedAt { get; set; }  // Timestamp
    public DateTime? UpdatedAt { get; set; } // Last update

    // Navigation properties
    public virtual Braider Braider { get; set; }
    public virtual User User { get; set; }
}
```

---

## Planned Validation Rules

```csharp
public class CreateReviewRequestValidator
    : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.BraiderId)
            .NotEmpty()
            .WithMessage("BraiderId is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("UserId is required");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(1000)
            .WithMessage("Review content is required (max 1000 chars)");
    }
}
```

---

## Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Rating System | Implement 1-5 star rating | High |
| Review Content | Add text content field | High |
| Braider Link | Foreign key to Braider entity | High |
| User Link | Foreign key to User entity | High |
| Timestamps | Add created/updated timestamps | Medium |
| Moderation | Review approval workflow | Medium |
| Pagination | Add pagination to GetReviews | Medium |
| Filtering | Filter reviews by braider/rating | Medium |
| Aggregation | Calculate average ratings | Low |
