namespace Reviews.Core.Entities;

public class Review
{
    public Guid ReviewId { get; private set; }
    public Guid BraiderId { get; private set; }
    public Guid UserProfileId { get; private set; }
    public int Rating { get; private set; }
    public string Comment { get; private set; } = string.Empty;
    public ReviewStatus Status { get; private set; }
    public int HelpfulCount { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }

    private readonly List<ReviewResponse> _responses = new();
    public IReadOnlyCollection<ReviewResponse> Responses => _responses.AsReadOnly();

    private readonly List<HelpfulVote> _helpfulVotes = new();
    public IReadOnlyCollection<HelpfulVote> HelpfulVotes => _helpfulVotes.AsReadOnly();

    private Review() { }

    public static Review Create(Guid braiderId, Guid userProfileId, int rating, string comment)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5");

        return new Review
        {
            ReviewId = Guid.NewGuid(),
            BraiderId = braiderId,
            UserProfileId = userProfileId,
            Rating = rating,
            Comment = comment,
            Status = ReviewStatus.Pending,
            HelpfulCount = 0,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void Update(int rating, string comment)
    {
        if (rating < 1 || rating > 5)
            throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5");

        Rating = rating;
        Comment = comment;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetStatus(ReviewStatus status)
    {
        Status = status;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddResponse(ReviewResponse response)
    {
        _responses.Add(response);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddHelpfulVote(HelpfulVote vote)
    {
        _helpfulVotes.Add(vote);
        HelpfulCount = _helpfulVotes.Count;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RemoveHelpfulVote(Guid userProfileId)
    {
        var vote = _helpfulVotes.FirstOrDefault(v => v.UserProfileId == userProfileId);
        if (vote != null)
        {
            _helpfulVotes.Remove(vote);
            HelpfulCount = _helpfulVotes.Count;
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }

    public bool HasUserVoted(Guid userProfileId)
    {
        return _helpfulVotes.Any(v => v.UserProfileId == userProfileId);
    }
}
