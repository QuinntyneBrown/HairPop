namespace Users.Core.Entities;

public class UserProfile
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string? DisplayName { get; private set; }
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? ProfileImageUrl { get; private set; }
    public string? Location { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }

    private readonly List<UserPreference> _preferences = new();
    public IReadOnlyCollection<UserPreference> Preferences => _preferences.AsReadOnly();

    private readonly List<FavoriteBraider> _favorites = new();
    public IReadOnlyCollection<FavoriteBraider> Favorites => _favorites.AsReadOnly();

    private UserProfile() { }

    public static UserProfile Create(string email, string? displayName = null)
    {
        return new UserProfile
        {
            Id = Guid.NewGuid(),
            Email = email.ToLowerInvariant(),
            DisplayName = displayName,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void UpdateProfile(string? displayName, string? firstName, string? lastName, string? phoneNumber, string? location)
    {
        DisplayName = displayName;
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        Location = location;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetProfileImage(string imageUrl)
    {
        ProfileImageUrl = imageUrl;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddPreference(UserPreference preference)
    {
        var existing = _preferences.FirstOrDefault(p => p.Key == preference.Key);
        if (existing != null)
        {
            _preferences.Remove(existing);
        }
        _preferences.Add(preference);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RemovePreference(string key)
    {
        var preference = _preferences.FirstOrDefault(p => p.Key == key);
        if (preference != null)
        {
            _preferences.Remove(preference);
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }

    public void AddFavorite(Guid braiderId)
    {
        if (!_favorites.Any(f => f.BraiderId == braiderId))
        {
            _favorites.Add(FavoriteBraider.Create(Id, braiderId));
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }

    public void RemoveFavorite(Guid braiderId)
    {
        var favorite = _favorites.FirstOrDefault(f => f.BraiderId == braiderId);
        if (favorite != null)
        {
            _favorites.Remove(favorite);
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }
}
