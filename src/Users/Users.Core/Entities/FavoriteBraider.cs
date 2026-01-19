namespace Users.Core.Entities;

public class FavoriteBraider
{
    public Guid Id { get; private set; }
    public Guid UserProfileId { get; private set; }
    public Guid BraiderId { get; private set; }
    public DateTimeOffset AddedAt { get; private set; }

    private FavoriteBraider() { }

    public static FavoriteBraider Create(Guid userProfileId, Guid braiderId)
    {
        return new FavoriteBraider
        {
            Id = Guid.NewGuid(),
            UserProfileId = userProfileId,
            BraiderId = braiderId,
            AddedAt = DateTimeOffset.UtcNow
        };
    }
}
