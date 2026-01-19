namespace Braiders.Core.Entities;

public class Availability
{
    public Guid Id { get; private set; }
    public Guid BraiderId { get; private set; }
    public DayOfWeek DayOfWeek { get; private set; }
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public bool IsActive { get; private set; }

    private Availability() { }

    public static Availability Create(Guid braiderId, DayOfWeek dayOfWeek, TimeOnly startTime, TimeOnly endTime)
    {
        return new Availability
        {
            Id = Guid.NewGuid(),
            BraiderId = braiderId,
            DayOfWeek = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
            IsActive = true
        };
    }

    public void SetActive(bool isActive)
    {
        IsActive = isActive;
    }

    public void UpdateTimes(TimeOnly startTime, TimeOnly endTime)
    {
        StartTime = startTime;
        EndTime = endTime;
    }
}
