// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using HairPop.Models.Braider;
using Microsoft.EntityFrameworkCore;

namespace HairPop.Api;

public class BraidersDbContext: DbContext, IBraidersDbContext
{
    private readonly ILogger<BraidersDbContext> _logger;

    public BraidersDbContext(ILogger<BraidersDbContext> logger, DbContextOptions<BraidersDbContext> options)
        :base(options)
    {
        ArgumentNullException.ThrowIfNull(logger);

        _logger = logger;
    }

    public DbSet<Braider> Braiders { get; set; }
}

