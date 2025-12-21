# Braider Management - Backend Specifications

## Overview

The Braider Management feature provides a complete CRUD (Create, Read, Update, Delete) API for managing professional hair braiders in the HairPop platform. This microservice follows the MediatR pattern with FluentValidation for request validation.

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | .NET | 8.0 |
| ORM | Entity Framework Core | 9.0.0 |
| CQRS Pattern | MediatR | 12.4.1 |
| Validation | FluentValidation | 11.11.0 |
| API Documentation | Swagger/OpenAPI | Latest |

## Domain Model

### Entity: Braider

The core entity representing a professional hair braider.

```csharp
public class Braider
{
    public Guid BraiderId { get; set; }
    public string Name { get; set; }
}
```

### Data Transfer Object: BraiderDto

```csharp
public class BraiderDto
{
    public Guid BraiderId { get; set; }
    public string Name { get; set; }
}
```

### Extension Methods

```csharp
public static class BraiderExtensions
{
    public static BraiderDto ToDto(this Braider braider)
    {
        return new BraiderDto
        {
            BraiderId = braider.BraiderId,
            Name = braider.Name
        };
    }
}
```

## Database Context

### Interface: IBraidersDbContext

```csharp
public interface IBraidersDbContext
{
    DbSet<Braider> Braiders { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
```

### Implementation: BraidersDbContext

```csharp
public class BraidersDbContext : DbContext, IBraidersDbContext
{
    private readonly ILogger<BraidersDbContext> _logger;

    public BraidersDbContext(
        ILogger<BraidersDbContext> logger,
        DbContextOptions<BraidersDbContext> options) : base(options)
    {
        _logger = logger;
    }

    public DbSet<Braider> Braiders { get; set; }
}
```

---

## API Endpoints

### Base Route: `/api/braiders`

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/braiders` | Create a new braider | CreateBraiderRequest | CreateBraiderResponse |
| GET | `/api/braiders` | Get all braiders | None | GetBraidersResponse |
| GET | `/api/braiders/{braiderId}` | Get braider by ID | braiderId (GUID) | GetBraiderByIdResponse |
| PUT | `/api/braiders` | Update a braider | UpdateBraiderRequest | UpdateBraiderResponse |
| DELETE | `/api/braiders/{braiderId}` | Delete a braider | braiderId (GUID) | DeleteBraiderResponse |

---

## Feature Specifications

### SPEC-BR-001: Create Braider

**Description:** Create a new professional braider profile in the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall accept a braider name and generate a unique GUID | Implemented |
| AC-002 | System shall validate that name is not null or empty | Implemented |
| AC-003 | System shall return HTTP 200 with created braider on success | Implemented |
| AC-004 | System shall return HTTP 400 on validation failure | Implemented |

#### Request Model

```csharp
public class CreateBraiderRequest : IRequest<CreateBraiderResponse>
{
    public string Name { get; set; }
}
```

#### Response Model

```csharp
public class CreateBraiderResponse
{
    public BraiderDto Braider { get; set; }
}
```

#### Validation Rules

```csharp
public class CreateBraiderRequestValidator
    : AbstractValidator<CreateBraiderRequest>
{
    public CreateBraiderRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
    }
}
```

#### Controller Implementation

```csharp
[HttpPost]
public async Task<ActionResult<CreateBraiderResponse>> Create(
    [FromBody] CreateBraiderRequest request)
{
    return await _mediator.Send(request);
}
```

---

### SPEC-BR-002: Get All Braiders

**Description:** Retrieve a list of all registered braiders in the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall return all braiders in the database | Implemented |
| AC-002 | System shall return an empty list if no braiders exist | Implemented |
| AC-003 | System shall return HTTP 200 with list of BraiderDto | Implemented |

#### Request Model

```csharp
public class GetBraidersRequest : IRequest<GetBraidersResponse>
{
}
```

#### Response Model

```csharp
public class GetBraidersResponse
{
    public List<BraiderDto> Braiders { get; set; }
}
```

#### Controller Implementation

```csharp
[HttpGet]
public async Task<ActionResult<GetBraidersResponse>> Get()
{
    return await _mediator.Send(new GetBraidersRequest());
}
```

---

### SPEC-BR-003: Get Braider By ID

**Description:** Retrieve a specific braider by their unique identifier.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall return braider matching the provided GUID | Implemented |
| AC-002 | System shall return HTTP 404 if braider not found | Implemented |
| AC-003 | System shall return HTTP 200 with BraiderDto on success | Implemented |

#### Request Model

```csharp
public class GetBraiderByIdRequest : IRequest<GetBraiderByIdResponse>
{
    public Guid BraiderId { get; set; }
}
```

#### Response Model

```csharp
public class GetBraiderByIdResponse
{
    public BraiderDto Braider { get; set; }
}
```

#### Controller Implementation

```csharp
[HttpGet("{braiderId}")]
public async Task<ActionResult<GetBraiderByIdResponse>> GetById(
    [FromRoute] Guid braiderId)
{
    var response = await _mediator.Send(
        new GetBraiderByIdRequest { BraiderId = braiderId });

    if (response.Braider == null)
    {
        return NotFound();
    }

    return response;
}
```

---

### SPEC-BR-004: Update Braider

**Description:** Update an existing braider profile.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall update braider with matching GUID | Implemented |
| AC-002 | System shall validate that name is not null or empty | Implemented |
| AC-003 | System shall return HTTP 200 with updated BraiderDto | Implemented |
| AC-004 | System shall return HTTP 400 on validation failure | Implemented |

#### Request Model

```csharp
public class UpdateBraiderRequest : IRequest<UpdateBraiderResponse>
{
    public Guid BraiderId { get; set; }
    public string Name { get; set; }
}
```

#### Response Model

```csharp
public class UpdateBraiderResponse
{
    public BraiderDto Braider { get; set; }
}
```

#### Validation Rules

```csharp
public class UpdateBraiderRequestValidator
    : AbstractValidator<UpdateBraiderRequest>
{
    public UpdateBraiderRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
    }
}
```

#### Controller Implementation

```csharp
[HttpPut]
public async Task<ActionResult<UpdateBraiderResponse>> Update(
    [FromBody] UpdateBraiderRequest request)
{
    return await _mediator.Send(request);
}
```

---

### SPEC-BR-005: Delete Braider

**Description:** Remove a braider from the system.

#### Acceptance Criteria

| ID | Criteria | Status |
|----|----------|--------|
| AC-001 | System shall delete braider with matching GUID | Implemented |
| AC-002 | System shall return HTTP 200 on successful deletion | Implemented |
| AC-003 | System shall handle non-existent braider gracefully | Implemented |

#### Request Model

```csharp
public class DeleteBraiderRequest : IRequest<DeleteBraiderResponse>
{
    public Guid BraiderId { get; set; }
}
```

#### Response Model

```csharp
public class DeleteBraiderResponse
{
}
```

#### Validation Rules

```csharp
public class DeleteBraiderRequestValidator
    : AbstractValidator<DeleteBraiderRequest>
{
    public DeleteBraiderRequestValidator()
    {
        RuleFor(x => x.BraiderId)
            .NotEmpty();
    }
}
```

#### Controller Implementation

```csharp
[HttpDelete("{braiderId}")]
public async Task<ActionResult<DeleteBraiderResponse>> Delete(
    [FromRoute] Guid braiderId)
{
    return await _mediator.Send(
        new DeleteBraiderRequest { BraiderId = braiderId });
}
```

---

## Controller Overview

### BraidersController

```csharp
[ApiController]
[Route("api/[controller]")]
public class BraidersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BraidersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Endpoints implemented as shown above
}
```

---

## Service Registration

### ConfigureServices Extension

```csharp
public static class ConfigureServices
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton<IBraidersDbContext, BraidersDbContext>();
    }
}
```

---

## API Response Codes

| Code | Description | Scenario |
|------|-------------|----------|
| 200 | OK | Successful operation |
| 400 | Bad Request | Validation failure |
| 404 | Not Found | Braider not found by ID |
| 500 | Internal Server Error | Unexpected server error |

---

## Data Flow Diagram

```
Client Request
      |
      v
+------------------+
|  API Controller  |
|  (BraidersController)
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
|  (IBraidersDbContext)
+------------------+
      |
      v
+------------------+
|    Database      |
+------------------+
```

---

## Testing Considerations

### Unit Test Structure

Tests are located in `test/HairPop.Braiders.Api.Tests/`

| Test Category | Description |
|--------------|-------------|
| Controller Tests | Verify HTTP responses and routing |
| Handler Tests | Verify business logic in MediatR handlers |
| Validator Tests | Verify FluentValidation rules |
| Integration Tests | End-to-end API testing |

---

## Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Pagination | Add pagination to GetBraiders endpoint | High |
| Search/Filter | Add search capability by name | Medium |
| Sorting | Add sorting options | Medium |
| Extended Profile | Add additional braider profile fields | High |
| Image Upload | Support profile image uploads | High |
