using Microsoft.EntityFrameworkCore;
using Reviews.Core.Entities;

namespace Reviews.Infrastructure.Persistence;

public class ReviewsDbContext : DbContext
{
    public ReviewsDbContext(DbContextOptions<ReviewsDbContext> options) : base(options)
    {
    }

    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ReviewResponse> ReviewResponses => Set<ReviewResponse>();
    public DbSet<HelpfulVote> HelpfulVotes => Set<HelpfulVote>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ReviewsDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
