var builder = DistributedApplication.CreateBuilder(args);

// Add the Identity service
var identity = builder.AddProject("identity", "../Identity/Identity.Api/Identity.Api.csproj");

// Add the Braiders service
var braiders = builder.AddProject("braiders", "../Braiders/Braiders.Api/Braiders.Api.csproj");

// Add the Users service
var users = builder.AddProject("users", "../Users/Users.Api/Users.Api.csproj");

// Add the Reviews service
var reviews = builder.AddProject("reviews", "../Reviews/Reviews.Api/Reviews.Api.csproj");

// Add the API Gateway with references to all services
builder.AddProject("apigateway", "../ApiGateway/ApiGateway.csproj")
    .WithReference(identity)
    .WithReference(braiders)
    .WithReference(users)
    .WithReference(reviews);

builder.Build().Run();
