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
var apiGateway = builder.AddProject("apigateway", "../ApiGateway/ApiGateway.csproj")
    .WithReference(identity)
    .WithReference(braiders)
    .WithReference(users)
    .WithReference(reviews);

// Add Angular apps
var customerApp = builder.AddNpmApp("app", "../WebApp", "start")
    .WithHttpEndpoint(port: 4200, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(apiGateway)
    .PublishAsDockerFile();

var adminApp = builder.AddNpmApp("app-admin", "../WebApp", "start:admin")
    .WithHttpEndpoint(port: 4201, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(apiGateway)
    .PublishAsDockerFile();

builder.Build().Run();
