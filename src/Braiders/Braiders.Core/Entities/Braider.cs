namespace Braiders.Core.Entities;

public class Braider
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Bio { get; private set; }
    public string? ProfileImageUrl { get; private set; }
    public string? Location { get; private set; }
    public decimal? HourlyRate { get; private set; }
    public bool IsAvailable { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? UpdatedAt { get; private set; }

    private readonly List<BraiderService> _services = new();
    public IReadOnlyCollection<BraiderService> Services => _services.AsReadOnly();

    private readonly List<Availability> _availabilities = new();
    public IReadOnlyCollection<Availability> Availabilities => _availabilities.AsReadOnly();

    private Braider() { }

    public static Braider Create(string name, string? bio = null, string? location = null, decimal? hourlyRate = null)
    {
        return new Braider
        {
            Id = Guid.NewGuid(),
            Name = name,
            Bio = bio,
            Location = location,
            HourlyRate = hourlyRate,
            IsAvailable = true,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void Update(string name, string? bio, string? location, decimal? hourlyRate)
    {
        Name = name;
        Bio = bio;
        Location = location;
        HourlyRate = hourlyRate;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetProfileImage(string imageUrl)
    {
        ProfileImageUrl = imageUrl;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetAvailability(bool isAvailable)
    {
        IsAvailable = isAvailable;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddService(BraiderService service)
    {
        _services.Add(service);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void RemoveService(Guid serviceId)
    {
        var service = _services.FirstOrDefault(s => s.Id == serviceId);
        if (service != null)
        {
            _services.Remove(service);
            UpdatedAt = DateTimeOffset.UtcNow;
        }
    }

    public void AddAvailability(Availability availability)
    {
        _availabilities.Add(availability);
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void ClearAvailabilities()
    {
        _availabilities.Clear();
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
