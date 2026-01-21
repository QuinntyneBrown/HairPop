<div align="center">
  <img src="assets/logo.png" alt="HairPop Logo" width="300"/>

  # HairPop

  A platform for connecting customers with professional hair braiders.
</div>

HairPop is organized as a set of bounded-context services (microservices) behind an API Gateway, with an Angular web application.

## Quick Links

- Requirements: [docs/requirements.md](docs/requirements.md)
- Microservices overview: [docs/microservices.md](docs/microservices.md)
- Coding guidelines: [docs/coding-guidelines.md](docs/coding-guidelines.md)

## Architecture

- **API Gateway**: [src/ApiGateway](src/ApiGateway) uses **YARP** (reverse proxy) and routes requests like `/identity/*` → Identity service.
- **Services**: each bounded context lives under [src](src) and typically contains `*.Api`, `*.Core`, and `*.Infrastructure` projects.
- **Shared**: cross-cutting primitives live in [src/Shared](src/Shared).
- **Web**: the Angular workspace lives in [src/WebApp](src/WebApp).

### Implemented Services

| Service | Project | Default URL | Swagger |
|---|---|---|---|
| API Gateway | `src/ApiGateway/ApiGateway.csproj` | `http://localhost:5100` | (gateway itself has no Swagger) |
| Identity | `src/Identity/Identity.Api/Identity.Api.csproj` | `http://localhost:5200` | `http://localhost:5200/swagger` |
| Braiders | `src/Braiders/Braiders.Api/Braiders.Api.csproj` | `http://localhost:5201` | `http://localhost:5201/swagger` |
| Users | `src/Users/Users.Api/Users.Api.csproj` | `http://localhost:5202` | `http://localhost:5202/swagger` |
| Reviews | `src/Reviews/Reviews.Api/Reviews.Api.csproj` | `http://localhost:5203` | `http://localhost:5203/swagger` |

Through the gateway (when the target service is running):

- `http://localhost:5100/identity/swagger`
- `http://localhost:5100/braiders/swagger`
- `http://localhost:5100/users/swagger`
- `http://localhost:5100/reviews/swagger`

## Tech Stack

### Backend
- **.NET 8** - target framework
- **ASP.NET Core Web API** - REST APIs
- **Entity Framework Core 8** - data access (SqlServer + InMemory)
- **YARP** - API Gateway / reverse proxy
- **Swagger/OpenAPI** - API documentation

### Frontend
- **Angular 21** - frontend framework
- **NgRx Component Store** + **RxJS** - state + reactive flows
- **@microsoft/signalr** - real-time communication
- **Jest** - unit tests
- **Playwright** - E2E tests
- **Storybook** - component development

## Project Structure

```
HairPop/
├── src/
│   ├── ApiGateway/               # YARP reverse proxy
│   ├── Identity/                 # Identity bounded context
│   │   ├── Identity.Api/
│   │   ├── Identity.Core/
│   │   └── Identity.Infrastructure/
│   ├── Braiders/                 # Braiders bounded context
│   │   ├── Braiders.Api/
│   │   ├── Braiders.Core/
│   │   └── Braiders.Infrastructure/
│   ├── Users/                    # Users bounded context
│   │   ├── Users.Api/
│   │   ├── Users.Core/
│   │   └── Users.Infrastructure/
│   ├── Reviews/                  # Reviews bounded context
│   │   ├── Reviews.Api/
│   │   ├── Reviews.Core/
│   │   └── Reviews.Infrastructure/
│   ├── Shared/                   # Shared contracts + domain primitives
│   └── WebApp/                   # Angular workspace (app + admin)
├── tests/                        # Service-level unit/integration tests
├── designs/                      # HTML mockups + admin UI prototypes
├── docs/                         # Requirements + architecture docs
└── assets/                       # Shared assets
```

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (LTS)

### Build
```bash
dotnet build HairPop.sln
```

### Backend (run services)
Run any combination of services + the gateway. Each service exposes Swagger at `/swagger`.

```bash
dotnet run --project src/Identity/Identity.Api/Identity.Api.csproj
dotnet run --project src/Braiders/Braiders.Api/Braiders.Api.csproj
dotnet run --project src/Users/Users.Api/Users.Api.csproj
dotnet run --project src/Reviews/Reviews.Api/Reviews.Api.csproj

# Run the gateway (routes /identity, /braiders, /users, /reviews, ...)
dotnet run --project src/ApiGateway/ApiGateway.csproj
```

Gateway health check: `http://localhost:5100/health`.

### Frontend
```bash
cd src/WebApp

# Install dependencies
npm install

# Start customer app
npm start

# Start admin app (if 4200 is in use, Angular CLI will prompt for another port)
npm run start:admin
```

### Running Tests
```bash
# Backend tests (all .NET tests in the solution)
dotnet test HairPop.sln

# Or run the current Braiders test suite only
dotnet test tests/Braiders/Braiders.Api.Tests/Braiders.Api.Tests.csproj

# Frontend unit tests
cd src/WebApp
npm test              # Test hairpop
npm run test:admin    # Test hairpop-admin
npm run test:all      # Test all projects

# E2E tests
npm run e2e           # Test hairpop
npm run e2e:admin     # Test hairpop-admin
npm run e2e:all       # Test all projects
```

## Documentation

- [Requirements](docs/requirements.md)
- [Microservices Architecture Notes](docs/microservices.md)
- [Coding Guidelines](docs/coding-guidelines.md)
- [Coding Violations](docs/coding-violations.md)
- UI mockups: [designs/README.md](designs/README.md)

## License
No license file is currently included in this repository.