// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add application services
builder.Services.AddApiServices();

// Add infrastructure services
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.\\SQLExpress;Database=HairPop;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddInfrastructureServices(connectionString);

// Add CORS policy
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? new[] { "http://localhost:4200" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program
{
}
