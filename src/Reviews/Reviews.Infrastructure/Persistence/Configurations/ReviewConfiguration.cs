using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reviews.Core.Entities;

namespace Reviews.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");

        builder.HasKey(r => r.ReviewId);

        builder.Property(r => r.BraiderId)
            .IsRequired();

        builder.Property(r => r.UserProfileId)
            .IsRequired();

        builder.Property(r => r.Rating)
            .IsRequired();

        builder.Property(r => r.Comment)
            .HasMaxLength(2000);

        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(r => r.HelpfulCount)
            .HasDefaultValue(0);

        builder.HasMany(r => r.Responses)
            .WithOne()
            .HasForeignKey(rr => rr.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.HelpfulVotes)
            .WithOne()
            .HasForeignKey(hv => hv.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(r => r.Responses).AutoInclude();
        builder.Navigation(r => r.HelpfulVotes).AutoInclude();

        builder.HasIndex(r => r.BraiderId);
        builder.HasIndex(r => r.UserProfileId);
        builder.HasIndex(r => r.Status);
    }
}
