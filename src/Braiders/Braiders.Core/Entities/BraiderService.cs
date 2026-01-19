namespace Braiders.Core.Entities;

public class BraiderService
{
    public Guid Id { get; private set; }
    public Guid BraiderId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public int DurationMinutes { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    private BraiderService() { }

    public static BraiderService Create(Guid braiderId, string name, decimal price, int durationMinutes, string? description = null)
    {
        return new BraiderService
        {
            Id = Guid.NewGuid(),
            BraiderId = braiderId,
            Name = name,
            Description = description,
            Price = price,
            DurationMinutes = durationMinutes,
            CreatedAt = DateTimeOffset.UtcNow
        };
    }

    public void Update(string name, decimal price, int durationMinutes, string? description)
    {
        Name = name;
        Price = price;
        DurationMinutes = durationMinutes;
        Description = description;
    }
}
