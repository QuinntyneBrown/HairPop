// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using HairPop.Core;
using HairPop.Infrastructure;
using HairPop.Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddInfrastructureServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<HairPopContext>(options =>
        {
            options.UseSqlServer(connectionString);
        });

        services.AddScoped<IHairPopContext>(provider => provider.GetRequiredService<HairPopContext>());

        services.AddScoped<ISeedService, SeedService>();
    }
}
