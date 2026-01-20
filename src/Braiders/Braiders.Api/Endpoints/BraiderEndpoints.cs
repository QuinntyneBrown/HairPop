using Braiders.Core.Entities;
using Braiders.Core.Interfaces;

namespace Braiders.Api.Endpoints;

public static class BraiderEndpoints
{
    public static void MapBraiderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/braiders").WithTags("Braiders");

        // Braider CRUD
        group.MapGet("/", GetAll)
            .WithName("GetAllBraiders")
            .Produces<IEnumerable<Braider>>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}", GetById)
            .WithName("GetBraiderById")
            .Produces<Braider>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/available", GetAvailable)
            .WithName("GetAvailableBraiders")
            .Produces<IEnumerable<Braider>>(StatusCodes.Status200OK);

        group.MapGet("/location/{location}", GetByLocation)
            .WithName("GetBraidersByLocation")
            .Produces<IEnumerable<Braider>>(StatusCodes.Status200OK);

        group.MapPost("/", Create)
            .WithName("CreateBraider")
            .Produces<Braider>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id:guid}", Update)
            .WithName("UpdateBraider")
            .Produces<Braider>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}", Delete)
            .WithName("DeleteBraider")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}/availability-status", SetAvailabilityStatus)
            .WithName("SetBraiderAvailabilityStatus")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}/profile-image", SetProfileImage)
            .WithName("SetBraiderProfileImage")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        // Service management
        group.MapPost("/{id:guid}/services", AddService)
            .WithName("AddBraiderService")
            .Produces<BraiderService>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}/services/{serviceId:guid}", RemoveService)
            .WithName("RemoveBraiderService")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/{id:guid}/services", GetServices)
            .WithName("GetBraiderServices")
            .Produces<IEnumerable<BraiderService>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        // Availability management
        group.MapGet("/{id:guid}/availabilities", GetAvailabilities)
            .WithName("GetBraiderAvailabilities")
            .Produces<IEnumerable<AvailabilityResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/{id:guid}/availabilities", AddAvailability)
            .WithName("AddBraiderAvailability")
            .Produces<AvailabilityResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id:guid}/availabilities", SetAvailabilities)
            .WithName("SetBraiderAvailabilities")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}/availabilities", ClearAvailabilities)
            .WithName("ClearBraiderAvailabilities")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }

    // Braider CRUD handlers
    private static async Task<IResult> GetAll(IUnitOfWork unitOfWork)
    {
        var braiders = await unitOfWork.Braiders.GetAllAsync();
        return Results.Ok(braiders);
    }

    private static async Task<IResult> GetById(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        return braider is null
            ? Results.NotFound(new { Message = $"Braider with ID {id} not found" })
            : Results.Ok(braider);
    }

    private static async Task<IResult> GetAvailable(IUnitOfWork unitOfWork)
    {
        var braiders = await unitOfWork.Braiders.GetAvailableAsync();
        return Results.Ok(braiders);
    }

    private static async Task<IResult> GetByLocation(string location, IUnitOfWork unitOfWork)
    {
        var braiders = await unitOfWork.Braiders.GetByLocationAsync(location);
        return Results.Ok(braiders);
    }

    private static async Task<IResult> Create(CreateBraiderRequest request, IUnitOfWork unitOfWork)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest(new { Message = "Name is required" });
        }

        var braider = Braider.Create(request.Name, request.Bio, request.Location, request.HourlyRate);
        await unitOfWork.Braiders.AddAsync(braider);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/braiders/{braider.Id}", braider);
    }

    private static async Task<IResult> Update(Guid id, UpdateBraiderRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.Update(request.Name, request.Bio, request.Location, request.HourlyRate);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(braider);
    }

    private static async Task<IResult> Delete(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        await unitOfWork.Braiders.DeleteAsync(id);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> SetAvailabilityStatus(Guid id, SetAvailabilityStatusRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.SetAvailability(request.IsAvailable);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> SetProfileImage(Guid id, SetProfileImageRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.SetProfileImage(request.ImageUrl);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    // Service handlers
    private static async Task<IResult> AddService(Guid id, AddServiceRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest(new { Message = "Service name is required" });
        }

        var service = BraiderService.Create(id, request.Name, request.Price, request.DurationMinutes, request.Description);
        braider.AddService(service);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/braiders/{id}/services/{service.Id}", service);
    }

    private static async Task<IResult> RemoveService(Guid id, Guid serviceId, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.RemoveService(serviceId);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> GetServices(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        return Results.Ok(braider.Services);
    }

    // Availability handlers
    private static async Task<IResult> GetAvailabilities(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        var availabilities = braider.Availabilities.Select(a => new AvailabilityResponse(
            a.Id,
            a.DayOfWeek,
            a.StartTime.ToString("HH:mm"),
            a.EndTime.ToString("HH:mm"),
            a.IsActive));

        return Results.Ok(availabilities);
    }

    private static async Task<IResult> AddAvailability(Guid id, AddAvailabilityRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        if (!TimeOnly.TryParse(request.StartTime, out var startTime))
        {
            return Results.BadRequest(new { Message = "Invalid start time format. Use HH:mm" });
        }

        if (!TimeOnly.TryParse(request.EndTime, out var endTime))
        {
            return Results.BadRequest(new { Message = "Invalid end time format. Use HH:mm" });
        }

        if (startTime >= endTime)
        {
            return Results.BadRequest(new { Message = "Start time must be before end time" });
        }

        var availability = Availability.Create(id, request.DayOfWeek, startTime, endTime);
        braider.AddAvailability(availability);
        await unitOfWork.SaveChangesAsync();

        var response = new AvailabilityResponse(
            availability.Id,
            availability.DayOfWeek,
            availability.StartTime.ToString("HH:mm"),
            availability.EndTime.ToString("HH:mm"),
            availability.IsActive);

        return Results.Created($"/api/braiders/{id}/availabilities", response);
    }

    private static async Task<IResult> SetAvailabilities(Guid id, SetAvailabilitiesRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.ClearAvailabilities();

        foreach (var slot in request.Availabilities)
        {
            if (!TimeOnly.TryParse(slot.StartTime, out var startTime) ||
                !TimeOnly.TryParse(slot.EndTime, out var endTime))
            {
                continue;
            }

            if (startTime < endTime)
            {
                var availability = Availability.Create(id, slot.DayOfWeek, startTime, endTime);
                braider.AddAvailability(availability);
            }
        }

        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> ClearAvailabilities(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null)
        {
            return Results.NotFound(new { Message = $"Braider with ID {id} not found" });
        }

        braider.ClearAvailabilities();
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }
}

// Request DTOs
public record CreateBraiderRequest(string Name, string? Bio, string? Location, decimal? HourlyRate);
public record UpdateBraiderRequest(string Name, string? Bio, string? Location, decimal? HourlyRate);
public record AddServiceRequest(string Name, decimal Price, int DurationMinutes, string? Description);
public record SetAvailabilityStatusRequest(bool IsAvailable);
public record SetProfileImageRequest(string ImageUrl);
public record AddAvailabilityRequest(DayOfWeek DayOfWeek, string StartTime, string EndTime);
public record AvailabilitySlot(DayOfWeek DayOfWeek, string StartTime, string EndTime);
public record SetAvailabilitiesRequest(List<AvailabilitySlot> Availabilities);

// Response DTOs
public record AvailabilityResponse(Guid Id, DayOfWeek DayOfWeek, string StartTime, string EndTime, bool IsActive);
