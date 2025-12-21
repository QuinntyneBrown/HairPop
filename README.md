# HairPop

A platform for connecting users with professional hair braiders. Users can discover braiders, view their profiles, and leave reviews.

## Tech Stack

### Backend
- **.NET 8.0** - Target framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9** - Data access and ORM
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Request validation
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 18** - Frontend framework
- **Angular Material** - UI component library
- **RxJS** - Reactive state management
- **SignalR** - Real-time communication
- **Jest** - Unit testing
- **Playwright** - E2E testing

## Project Structure

```
HairPop/
├── src/
│   ├── HairPop.Api/           # ASP.NET Core Web API
│   │   ├── Controllers/       # API endpoints
│   │   ├── BraidersDbContext  # EF Core database context
│   │   └── ConfigureServices  # DI configuration
│   │
│   ├── HairPop.Models/        # Domain models and business logic
│   │   ├── Braider/           # Braider entity, DTOs, validators, handlers
│   │   ├── User/              # User entity, DTOs, validators, handlers
│   │   └── Review/            # Review entity, DTOs, validators, handlers
│   │
│   └── HairPop.App/           # Angular frontend workspace
│       └── projects/app/      # Main Angular application
│
├── test/
│   ├── HairPop.Api.Tests/     # API integration tests
│   └── HairPop.Models.Tests/  # Unit tests for models
│
└── docs/                      # Architecture documentation
    ├── specs/                 # Implementation specifications
    ├── *.puml                 # PlantUML diagrams
    └── *.drawio               # C4 architecture diagrams
```

## Domain Entities

| Entity | Description |
|--------|-------------|
| **Braider** | Professional hair braiders with profile information |
| **User** | Platform users who can search and review braiders |
| **Review** | User reviews and ratings for braiders |

## API Endpoints

### Braiders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/braiders` | Get all braiders |
| GET | `/api/braiders/{braiderId}` | Get braider by ID |
| POST | `/api/braiders` | Create a new braider |
| PUT | `/api/braiders` | Update a braider |
| DELETE | `/api/braiders/{braiderId}` | Delete a braider |

## Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS version)
- SQL Server Express (default) or SQL Server

### Backend
```bash
# Navigate to the API project
cd src/HairPop.Api

# Run the API
dotnet run
```

The API will be available at `https://localhost:5001` with Swagger UI at `/swagger`.

### Frontend
```bash
# Navigate to the Angular app
cd src/HairPop.App

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:4200`.

## Architecture

The solution follows a clean architecture pattern with CQRS using MediatR:

- **Controllers** receive HTTP requests and dispatch commands/queries
- **MediatR Handlers** process business logic
- **FluentValidation** validates incoming requests
- **Entity Framework Core** handles data persistence

See the [docs](./docs) folder for detailed architecture diagrams and specifications.

## Documentation

- [Architecture Overview](./docs/architecture-overview.puml)
- [Domain Model](./docs/domain-model.puml)
- [Implementation Specs](./docs/specs/implementation-specs.md)
- [Backend Specs](./docs/braider-backend-specs.md)
- [Frontend Specs](./docs/specs/)

## License

MIT License - Copyright (c) Quinntyne Brown