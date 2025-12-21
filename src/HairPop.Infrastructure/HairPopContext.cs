// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using HairPop.Core;
using HairPop.Core.Braider;
using HairPop.Core.Review;
using HairPop.Core.User;
using Microsoft.EntityFrameworkCore;

namespace HairPop.Infrastructure;

public class HairPopContext : DbContext, IHairPopContext
{
    public HairPopContext(DbContextOptions<HairPopContext> options)
        : base(options)
    {
    }

    public DbSet<Braider> Braiders { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HairPopContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
