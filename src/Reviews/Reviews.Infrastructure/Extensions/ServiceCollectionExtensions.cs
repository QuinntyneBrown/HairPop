using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Reviews.Core.Interfaces;
using Reviews.Infrastructure.Persistence;

namespace Reviews.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddReviewsInfrastructure(
        this IServiceCollection services,
        string connectionString,
        bool useInMemoryDatabase = false)
    {
        if (useInMemoryDatabase)
        {
            services.AddDbContext<ReviewsDbContext>(options =>
                options.UseInMemoryDatabase("Reviews_InMemory"));
        }
        else
        {
            services.AddDbContext<ReviewsDbContext>(options =>
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

    public static async Task EnsureReviewsDatabaseCreatedAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ReviewsDbContext>();
        await context.Database.EnsureCreatedAsync();
    }
}
