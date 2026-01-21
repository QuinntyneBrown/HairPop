# .NET Aspire Integration Guide

This document explains the .NET Aspire integration in HairPop and how to use it for development and deployment.

## Overview

HairPop now uses .NET Aspire for cloud-native orchestration, providing:

- **Service Orchestration**: Single command to run all microservices
- **Service Discovery**: Automatic service-to-service communication
- **Observability**: Built-in OpenTelemetry for tracing, metrics, and logs
- **Azure Deployment**: Simplified deployment to Azure Container Apps
- **Development Dashboard**: Visual monitoring and debugging tools

## Architecture

### HairPop.ServiceDefaults
Shared library that provides:
- OpenTelemetry configuration (traces, metrics, logs)
- Service discovery setup
- HTTP client resilience (retry, circuit breaker)
- Health check endpoints (/health, /alive)

All API services reference this project and call:
```csharp
builder.AddServiceDefaults();
app.MapDefaultEndpoints();
```

### HairPop.AppHost
Orchestration host that:
- Defines all services and their relationships
- Configures service discovery
- Launches the Aspire Dashboard
- Manages service lifecycle

## Running with Aspire

### Prerequisites
1. Install .NET 8 SDK
2. Install Aspire workload:
   ```bash
   dotnet workload install aspire
   ```

### Start All Services
```bash
dotnet run --project src/HairPop.AppHost/HairPop.AppHost.csproj
```

This launches:
- All API services (Identity, Braiders, Users, Reviews)
- API Gateway
- Aspire Dashboard (typically at http://localhost:15888)

### Aspire Dashboard Features
Access the dashboard to:
- View running services and their status
- Browse structured logs from all services
- Explore distributed traces across services
- Monitor metrics and resource usage
- Test service endpoints

## Service Discovery

Services can reference each other using service names instead of hardcoded URLs:

```csharp
// Instead of: http://localhost:5200/api/users
// Use service discovery: http://identity/api/users
```

The Aspire runtime automatically resolves service names to actual endpoints.

## Deployment to Azure

### Using Azure Developer CLI (azd)

1. Install azd:
   ```bash
   # Windows
   winget install microsoft.azd
   
   # macOS/Linux
   curl -fsSL https://aka.ms/install-azd.sh | bash
   ```

2. Initialize and deploy:
   ```bash
   azd init
   azd up
   ```

The `azd up` command will:
- Provision Azure resources (Container Apps, Container Registry, etc.)
- Build and push container images
- Deploy all services to Azure Container Apps
- Configure networking and service discovery
- Set up monitoring and logging

### Azure Resources Created
- Azure Container Apps Environment
- Azure Container Registry
- Log Analytics Workspace
- Application Insights
- Container Apps for each service

### Environment Variables
Configure connection strings and secrets using:
- Azure App Configuration
- Azure Key Vault
- Container Apps secrets

## Configuration

### Development
Services use in-memory databases and local configuration by default.

### Production
Use environment variables or Azure App Configuration:
- `ConnectionStrings__IdentityDb`: Identity database
- `ConnectionStrings__BraidersDb`: Braiders database
- `ConnectionStrings__UsersDb`: Users database
- `ConnectionStrings__ReviewsDb`: Reviews database
- `Jwt__SecretKey`: JWT signing key
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OpenTelemetry endpoint

## Monitoring

### OpenTelemetry
All services emit:
- **Traces**: Request flows across services
- **Metrics**: Performance counters, request rates, error rates
- **Logs**: Structured logging with correlation

### Viewing Telemetry
- **Local Development**: Aspire Dashboard
- **Azure**: Application Insights and Azure Monitor

## Troubleshooting

### Aspire Dashboard Not Opening
Check that no other process is using ports 15888, 16686, or 17255.

### Service Discovery Not Working
Ensure all services reference HairPop.ServiceDefaults and call `builder.AddServiceDefaults()`.

### Build Errors
Make sure the Aspire workload is installed:
```bash
dotnet workload list
# Should show: aspire
```

### Port Conflicts
Aspire assigns random ports by default. You can specify ports in AppHost/Program.cs if needed.

## Additional Resources

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/)
- [OpenTelemetry .NET](https://opentelemetry.io/docs/languages/net/)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
