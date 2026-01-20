using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Reviews.Core.Entities;

namespace Reviews.Infrastructure.Persistence.Configurations;

public class HelpfulVoteConfiguration : IEntityTypeConfiguration<HelpfulVote>
{
    public void Configure(EntityTypeBuilder<HelpfulVote> builder)
    {
        builder.ToTable("HelpfulVotes");

        builder.HasKey(hv => hv.HelpfulVoteId);

        builder.Property(hv => hv.ReviewId)
            .IsRequired();

        builder.Property(hv => hv.UserProfileId)
            .IsRequired();

        builder.HasIndex(hv => new { hv.ReviewId, hv.UserProfileId })
            .IsUnique();

        builder.HasIndex(hv => hv.ReviewId);
        builder.HasIndex(hv => hv.UserProfileId);
    }
}
