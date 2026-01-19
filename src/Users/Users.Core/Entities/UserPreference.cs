namespace Users.Core.Entities;

public class UserPreference
{
    public Guid Id { get; private set; }
    public Guid UserProfileId { get; private set; }
    public string Key { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; private set; }

    private UserPreference() { }

    public static UserPreference Create(Guid userProfileId, string key, string value)
    {
        return new UserPreference
        {
            Id = Guid.NewGuid(),
            UserProfileId = userProfileId,
            Key = key,
            Value = value,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void UpdateValue(string value)
    {
        Value = value;
    }
}
