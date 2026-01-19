using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Users.Core.Entities;

namespace Users.Infrastructure.Persistence.Configurations;

public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.ToTable("UserProfiles");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.DisplayName)
            .HasMaxLength(200);

        builder.Property(u => u.FirstName)
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .HasMaxLength(100);

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(u => u.ProfileImageUrl)
            .HasMaxLength(500);

        builder.Property(u => u.Location)
            .HasMaxLength(200);

        builder.HasMany(u => u.Preferences)
            .WithOne()
            .HasForeignKey(p => p.UserProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Favorites)
            .WithOne()
            .HasForeignKey(f => f.UserProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(u => u.Preferences).AutoInclude();
        builder.Navigation(u => u.Favorites).AutoInclude();
    }
}
