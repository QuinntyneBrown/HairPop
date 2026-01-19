using Microsoft.EntityFrameworkCore;
using Users.Core.Entities;

namespace Users.Infrastructure.Persistence;

public class UsersDbContext : DbContext
{
    public UsersDbContext(DbContextOptions<UsersDbContext> options) : base(options)
    {
    }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<UserPreference> UserPreferences => Set<UserPreference>();
    public DbSet<FavoriteBraider> FavoriteBraiders => Set<FavoriteBraider>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(UsersDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
