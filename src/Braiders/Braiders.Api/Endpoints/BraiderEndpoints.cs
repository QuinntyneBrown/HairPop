using Braiders.Core.Entities;
using Braiders.Core.Interfaces;

namespace Braiders.Api.Endpoints;

public static class BraiderEndpoints
{
    public static void MapBraiderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/braiders").WithTags("Braiders");

        group.MapGet("/", GetAll);
        group.MapGet("/{id:guid}", GetById);
        group.MapGet("/available", GetAvailable);
        group.MapGet("/location/{location}", GetByLocation);
        group.MapPost("/", Create);
        group.MapPut("/{id:guid}", Update);
        group.MapDelete("/{id:guid}", Delete);
        group.MapPost("/{id:guid}/services", AddService);
        group.MapDelete("/{id:guid}/services/{serviceId:guid}", RemoveService);
    }

    private static async Task<IResult> GetAll(IUnitOfWork unitOfWork)
    {
        var braiders = await unitOfWork.Braiders.GetAllAsync();
        return Results.Ok(braiders);
    }

    private static async Task<IResult> GetById(Guid id, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        return braider is null ? Results.NotFound() : Results.Ok(braider);
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
        var braider = Braider.Create(request.Name, request.Bio, request.Location, request.HourlyRate);
        await unitOfWork.Braiders.AddAsync(braider);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/braiders/{braider.Id}", braider);
    }

    private static async Task<IResult> Update(Guid id, UpdateBraiderRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null) return Results.NotFound();

        braider.Update(request.Name, request.Bio, request.Location, request.HourlyRate);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(braider);
    }

    private static async Task<IResult> Delete(Guid id, IUnitOfWork unitOfWork)
    {
        await unitOfWork.Braiders.DeleteAsync(id);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> AddService(Guid id, AddServiceRequest request, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null) return Results.NotFound();

        var service = BraiderService.Create(id, request.Name, request.Price, request.DurationMinutes, request.Description);
        braider.AddService(service);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/braiders/{id}/services/{service.Id}", service);
    }

    private static async Task<IResult> RemoveService(Guid id, Guid serviceId, IUnitOfWork unitOfWork)
    {
        var braider = await unitOfWork.Braiders.GetByIdAsync(id);
        if (braider is null) return Results.NotFound();

        braider.RemoveService(serviceId);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }
}

public record CreateBraiderRequest(string Name, string? Bio, string? Location, decimal? HourlyRate);
public record UpdateBraiderRequest(string Name, string? Bio, string? Location, decimal? HourlyRate);
public record AddServiceRequest(string Name, decimal Price, int DurationMinutes, string? Description);
