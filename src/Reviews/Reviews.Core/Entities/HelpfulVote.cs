namespace Reviews.Core.Entities;

public class HelpfulVote
{
    public Guid HelpfulVoteId { get; private set; }
    public Guid ReviewId { get; private set; }
    public Guid UserProfileId { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    private HelpfulVote() { }

    public static HelpfulVote Create(Guid reviewId, Guid userProfileId)
    {
        return new HelpfulVote
        {
            HelpfulVoteId = Guid.NewGuid(),
            ReviewId = reviewId,
            UserProfileId = userProfileId,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }
}
