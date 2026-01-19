// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.Logging;

namespace Infrastructure.Seeding;

public class SeedService : ISeedService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SeedService> _logger;

    public SeedService(ApplicationDbContext context, ILogger<SeedService> logger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(logger);

        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting database seeding");

        await _context.Database.EnsureCreatedAsync(cancellationToken);

        _logger.LogInformation("Database seeding completed");
    }
}
