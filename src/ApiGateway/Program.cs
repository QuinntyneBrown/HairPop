using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularAdmin", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://localhost:4201",
                "http://localhost:4202"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseCors("AllowAngularAdmin");

// If running behind a proxy / container ingress, these help preserve scheme + client IP.
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.MapHealthChecks("/health");

app.MapReverseProxy();

app.Run();
