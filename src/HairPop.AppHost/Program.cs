var builder = DistributedApplication.CreateBuilder(args);

// Add the Identity service
var identity = builder.AddProject("identity", "../Identity/Identity.Api/Identity.Api.csproj")
    .WithHttpEndpoint(port: 5200, name: "http");

// Add the Braiders service
var braiders = builder.AddProject("braiders", "../Braiders/Braiders.Api/Braiders.Api.csproj")
    .WithHttpEndpoint(port: 5201, name: "http");

// Add the Users service
var users = builder.AddProject("users", "../Users/Users.Api/Users.Api.csproj")
    .WithHttpEndpoint(port: 5202, name: "http");

// Add the Reviews service
var reviews = builder.AddProject("reviews", "../Reviews/Reviews.Api/Reviews.Api.csproj")
    .WithHttpEndpoint(port: 5203, name: "http");

// Add the API Gateway with references to all services
builder.AddProject("apigateway", "../ApiGateway/ApiGateway.csproj")
    .WithHttpEndpoint(port: 5100, name: "http")
    .WithReference(identity)
    .WithReference(braiders)
    .WithReference(users)
    .WithReference(reviews);

builder.Build().Run();
