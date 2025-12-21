<div align="center">
  <img src="assets/logo.png" alt="HairPop Logo" width="300"/>

  # HairPop

  A platform for connecting users with professional hair braiders. Users can discover braiders, view their profiles, and leave reviews.
</div>

## Tech Stack

### Backend
- **.NET 8.0** - Target framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9** - Data access and ORM
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Request validation
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 21** - Frontend framework
- **NgRx Component Store** - State management
- **RxJS** - Reactive programming
- **SignalR** - Real-time communication
- **Jest** - Unit testing
- **Playwright** - E2E testing

## Project Structure

```
HairPop/
├── src/
│   ├── HairPop.Api/              # ASP.NET Core Web API
│   │   ├── Controllers/          # API endpoints
│   │   ├── BraidersDbContext     # EF Core database context
│   │   └── ConfigureServices     # DI configuration
│   │
│   ├── HairPop.Models/           # Domain models and business logic
│   │   ├── Braider/              # Braider entity, DTOs, validators, handlers
│   │   ├── User/                 # User entity, DTOs, validators, handlers
│   │   └── Review/               # Review entity, DTOs, validators, handlers
│   │
│   └── HairPop.App/              # Angular workspace
│       └── projects/
│           ├── hairpop/          # Main user-facing application
│           │   ├── e2e/          # Playwright E2E tests
│           │   └── src/
│           └── hairpop-admin/    # Admin dashboard application
│               ├── e2e/          # Playwright E2E tests
│               └── src/
│
├── test/
│   ├── HairPop.Api.Tests/        # API integration tests
│   └── HairPop.Models.Tests/     # Unit tests for models
│
├── assets/                       # Shared assets
│   └── logo.png                  # HairPop logo
│
└── docs/                         # Architecture documentation
    └── specs/                    # Implementation specifications
        ├── *.puml                # PlantUML diagrams
        └── *.drawio              # C4 architecture diagrams
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
# Navigate to the Angular workspace
cd src/HairPop.App

# Install dependencies
npm install

# Start main application
npm start

# Or start admin dashboard
npm run start:admin
```

The main app will be available at `http://localhost:4200`.
The admin dashboard will be available at `http://localhost:4201`.

### Running Tests
```bash
# Backend tests
dotnet test

# Frontend unit tests
cd src/HairPop.App
npm test              # Test hairpop
npm run test:admin    # Test hairpop-admin
npm run test:all      # Test all projects

# E2E tests
npm run e2e           # Test hairpop
npm run e2e:admin     # Test hairpop-admin
npm run e2e:all       # Test all projects
```

## Architecture

The solution follows a clean architecture pattern with CQRS using MediatR:

- **Controllers** receive HTTP requests and dispatch commands/queries
- **MediatR Handlers** process business logic
- **FluentValidation** validates incoming requests
- **Entity Framework Core** handles data persistence

See the [docs](./docs) folder for detailed architecture diagrams and specifications.

## Documentation

- [Implementation Specs](./docs/specs/implementation-specs.md)
- [Braider Backend Specs](./docs/specs/braider-backend-specs.md)
- [Review Backend Specs](./docs/specs/review-backend-specs.md)
- [Architecture Overview](./docs/specs/architecture-overview.puml)
- [Domain Model](./docs/specs/domain-model.puml)
- [C4 Diagrams](./docs/specs/) - System context, container, and component diagrams

## License

MIT License - Copyright (c) Quinntyne Brown