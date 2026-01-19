using Braiders.Api.Endpoints;
using Braiders.Infrastructure.Extensions;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("BraidersDb")
    ?? "Server=localhost;Database=HairPop_Braiders;Trusted_Connection=True;TrustServerCertificate=True";

var useInMemoryDb = builder.Configuration.GetValue<bool>("UseInMemoryDatabase")
    || Environment.GetEnvironmentVariable("USE_INMEMORY_DB") == "true";

builder.Services.AddBraidersInfrastructure(connectionString, useInMemoryDatabase: useInMemoryDb);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Braiders API",
        Version = "v1",
        Description = "Braider profiles, services, and availability management"
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await app.Services.EnsureBraidersDatabaseCreatedAsync();
}

app.UseHttpsRedirection();

app.MapBraiderEndpoints();

app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Service = "Braiders" }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.Run();
