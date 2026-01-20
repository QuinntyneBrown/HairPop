using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reviews.Core.Entities;

namespace Reviews.Infrastructure.Persistence.Configurations;

public class ReviewResponseConfiguration : IEntityTypeConfiguration<ReviewResponse>
{
    public void Configure(EntityTypeBuilder<ReviewResponse> builder)
    {
        builder.ToTable("ReviewResponses");

        builder.HasKey(rr => rr.ReviewResponseId);

        builder.Property(rr => rr.ReviewId)
            .IsRequired();

        builder.Property(rr => rr.BraiderId)
            .IsRequired();

        builder.Property(rr => rr.ResponseText)
            .IsRequired()
            .HasMaxLength(2000);

        builder.HasIndex(rr => rr.ReviewId);
        builder.HasIndex(rr => rr.BraiderId);
    }
}
