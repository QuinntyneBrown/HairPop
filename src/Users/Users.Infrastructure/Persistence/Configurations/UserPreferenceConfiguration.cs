using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Users.Core.Entities;

namespace Users.Infrastructure.Persistence.Configurations;

public class UserPreferenceConfiguration : IEntityTypeConfiguration<UserPreference>
{
    public void Configure(EntityTypeBuilder<UserPreference> builder)
    {
        builder.ToTable("UserPreferences");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Key)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Value)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasIndex(p => new { p.UserProfileId, p.Key })
            .IsUnique();
    }
}
