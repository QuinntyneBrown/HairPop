using Braiders.Core.Interfaces;
using Braiders.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Braiders.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBraidersInfrastructure(
        this IServiceCollection services,
        string connectionString,
        bool useInMemoryDatabase = false)
    {
        if (useInMemoryDatabase)
        {
            services.AddDbContext<BraidersDbContext>(options =>
                options.UseInMemoryDatabase("Braiders_InMemory"));
        }
        else
        {
            services.AddDbContext<BraidersDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorNumbersToAdd: null);
                }));
        }

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }

    public static async Task EnsureBraidersDatabaseCreatedAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BraidersDbContext>();
        await context.Database.EnsureCreatedAsync();
    }
}
