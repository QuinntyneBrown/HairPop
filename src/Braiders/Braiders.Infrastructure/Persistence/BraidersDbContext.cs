using Braiders.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Braiders.Infrastructure.Persistence;

public class BraidersDbContext : DbContext
{
    public BraidersDbContext(DbContextOptions<BraidersDbContext> options) : base(options)
    {
    }

    public DbSet<Braider> Braiders => Set<Braider>();
    public DbSet<BraiderService> BraiderServices => Set<BraiderService>();
    public DbSet<Availability> Availabilities => Set<Availability>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BraidersDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
