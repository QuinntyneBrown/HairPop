using Braiders.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Braiders.Infrastructure.Persistence.Configurations;

public class AvailabilityConfiguration : IEntityTypeConfiguration<Availability>
{
    public void Configure(EntityTypeBuilder<Availability> builder)
    {
        builder.ToTable("Availabilities");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.DayOfWeek)
            .IsRequired();

        builder.Property(a => a.StartTime)
            .IsRequired();

        builder.Property(a => a.EndTime)
            .IsRequired();
    }
}
