namespace Reviews.Core.Entities;

public class ReviewResponse
{
    public Guid ReviewResponseId { get; private set; }
    public Guid ReviewId { get; private set; }
    public Guid BraiderId { get; private set; }
    public string ResponseText { get; private set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }

    private ReviewResponse() { }

    public static ReviewResponse Create(Guid reviewId, Guid braiderId, string responseText)
    {
        return new ReviewResponse
        {
            ReviewResponseId = Guid.NewGuid(),
            ReviewId = reviewId,
            BraiderId = braiderId,
            ResponseText = responseText,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void Update(string responseText)
    {
        ResponseText = responseText;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
