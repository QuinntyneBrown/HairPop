using Microsoft.OpenApi.Models;
using Reviews.Api.Endpoints;
using Reviews.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

var connectionString = builder.Configuration.GetConnectionString("ReviewsDb")
    ?? "Server=localhost;Database=HairPop_Reviews;Trusted_Connection=True;TrustServerCertificate=True";

var useInMemoryDb = builder.Configuration.GetValue<bool>("UseInMemoryDatabase")
    || Environment.GetEnvironmentVariable("USE_INMEMORY_DB") == "true";

builder.Services.AddReviewsInfrastructure(connectionString, useInMemoryDatabase: useInMemoryDb);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Reviews API",
        Version = "v1",
        Description = "Review management for braiders and services"
    });
});

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.Services.EnsureReviewsDatabaseCreatedAsync();
}

app.UseHttpsRedirection();

app.MapReviewEndpoints();

app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Service = "Reviews" }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.Run();
