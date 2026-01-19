using Braiders.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Braiders.Infrastructure.Persistence.Configurations;

public class BraiderServiceConfiguration : IEntityTypeConfiguration<BraiderService>
{
    public void Configure(EntityTypeBuilder<BraiderService> builder)
    {
        builder.ToTable("BraiderServices");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(s => s.Description)
            .HasMaxLength(1000);

        builder.Property(s => s.Price)
            .HasPrecision(18, 2);
    }
}
