using Braiders.Core.Entities;

namespace Braiders.Core.Tests;

public class BraiderTests
{
    [Fact]
    public void Create_ShouldCreateBraider_WithValidData()
    {
        var braider = Braider.Create("Test Braider", "Bio", "New York", 50.00m);

        Assert.NotEqual(Guid.Empty, braider.Id);
        Assert.Equal("Test Braider", braider.Name);
        Assert.Equal("Bio", braider.Bio);
        Assert.Equal("New York", braider.Location);
        Assert.Equal(50.00m, braider.HourlyRate);
        Assert.True(braider.IsAvailable);
    }

    [Fact]
    public void AddService_ShouldAddService_ToBraider()
    {
        var braider = Braider.Create("Test Braider");
        var service = BraiderService.Create(braider.Id, "Braiding", 100.00m, 120);

        braider.AddService(service);

        Assert.Single(braider.Services);
        Assert.Equal("Braiding", braider.Services.First().Name);
    }

    [Fact]
    public void SetAvailability_ShouldUpdateAvailability()
    {
        var braider = Braider.Create("Test Braider");

        braider.SetAvailability(false);

        Assert.False(braider.IsAvailable);
    }
}
