// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Core;
using Infrastructure;
using Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddInfrastructureServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ISeedService, SeedService>();
    }
}
