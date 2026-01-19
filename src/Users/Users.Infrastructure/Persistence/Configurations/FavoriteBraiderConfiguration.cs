using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Users.Core.Entities;

namespace Users.Infrastructure.Persistence.Configurations;

public class FavoriteBraiderConfiguration : IEntityTypeConfiguration<FavoriteBraider>
{
    public void Configure(EntityTypeBuilder<FavoriteBraider> builder)
    {
        builder.ToTable("FavoriteBraiders");

        builder.HasKey(f => f.Id);

        builder.HasIndex(f => new { f.UserProfileId, f.BraiderId })
            .IsUnique();
    }
}
