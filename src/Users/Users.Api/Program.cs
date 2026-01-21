using Microsoft.OpenApi.Models;
using Users.Api.Endpoints;
using Users.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var connectionString = builder.Configuration.GetConnectionString("UsersDb")
    ?? "Server=localhost;Database=HairPop_Users;Trusted_Connection=True;TrustServerCertificate=True";

var useInMemoryDb = builder.Configuration.GetValue<bool>("UseInMemoryDatabase")
    || Environment.GetEnvironmentVariable("USE_INMEMORY_DB") == "true";

builder.Services.AddUsersInfrastructure(connectionString, useInMemoryDatabase: useInMemoryDb);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Users API",
        Version = "v1",
        Description = "User profiles and preferences management"
    });
});

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.Services.EnsureUsersDatabaseCreatedAsync();
}

app.UseHttpsRedirection();

// Map endpoints
app.MapUserEndpoints();

app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Service = "Users" }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.Run();
