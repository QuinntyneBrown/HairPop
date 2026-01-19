using Braiders.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Braiders.Infrastructure.Persistence.Configurations;

public class BraiderConfiguration : IEntityTypeConfiguration<Braider>
{
    public void Configure(EntityTypeBuilder<Braider> builder)
    {
        builder.ToTable("Braiders");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.Bio)
            .HasMaxLength(2000);

        builder.Property(b => b.ProfileImageUrl)
            .HasMaxLength(500);

        builder.Property(b => b.Location)
            .HasMaxLength(200);

        builder.Property(b => b.HourlyRate)
            .HasPrecision(18, 2);

        builder.HasMany(b => b.Services)
            .WithOne()
            .HasForeignKey(s => s.BraiderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(b => b.Availabilities)
            .WithOne()
            .HasForeignKey(a => a.BraiderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(b => b.Services).AutoInclude();
        builder.Navigation(b => b.Availabilities).AutoInclude();
    }
}
