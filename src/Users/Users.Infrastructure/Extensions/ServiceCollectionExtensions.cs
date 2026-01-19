using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Users.Core.Interfaces;
using Users.Infrastructure.Persistence;

namespace Users.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddUsersInfrastructure(
        this IServiceCollection services,
        string connectionString,
        bool useInMemoryDatabase = false)
    {
        if (useInMemoryDatabase)
        {
            services.AddDbContext<UsersDbContext>(options =>
                options.UseInMemoryDatabase("Users_InMemory"));
        }
        else
        {
            services.AddDbContext<UsersDbContext>(options =>
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

    public static async Task EnsureUsersDatabaseCreatedAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<UsersDbContext>();
        await context.Database.EnsureCreatedAsync();
    }
}
