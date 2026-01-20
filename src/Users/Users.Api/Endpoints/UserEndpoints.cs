using Users.Core.Entities;
using Users.Core.Interfaces;

namespace Users.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users");

        group.MapGet("/", GetAllUsers)
            .WithName("GetAllUsers")
            .Produces<IEnumerable<UserProfileResponse>>(StatusCodes.Status200OK);

        group.MapGet("/{id:guid}", GetUserById)
            .WithName("GetUserById")
            .Produces<UserProfileResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/email/{email}", GetUserByEmail)
            .WithName("GetUserByEmail")
            .Produces<UserProfileResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/", CreateUser)
            .WithName("CreateUser")
            .Produces<UserProfileResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id:guid}", UpdateUser)
            .WithName("UpdateUser")
            .Produces<UserProfileResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}", DeleteUser)
            .WithName("DeleteUser")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/{id:guid}/favorites/{braiderId:guid}", AddFavorite)
            .WithName("AddFavorite")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}/favorites/{braiderId:guid}", RemoveFavorite)
            .WithName("RemoveFavorite")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/{id:guid}/favorites", GetFavorites)
            .WithName("GetFavorites")
            .Produces<IEnumerable<FavoriteResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/{id:guid}/preferences", AddPreference)
            .WithName("AddPreference")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}/preferences/{key}", RemovePreference)
            .WithName("RemovePreference")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("/{id:guid}/preferences", GetPreferences)
            .WithName("GetPreferences")
            .Produces<IEnumerable<PreferenceResponse>>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}/profile-image", UpdateProfileImage)
            .WithName("UpdateProfileImage")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> GetAllUsers(IUnitOfWork unitOfWork)
    {
        var users = await unitOfWork.UserProfiles.GetAllAsync();
        return Results.Ok(users.Select(MapToResponse));
    }

    private static async Task<IResult> GetUserById(Guid id, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        return user is null
            ? Results.NotFound(new { Message = $"User with ID {id} not found" })
            : Results.Ok(MapToResponse(user));
    }

    private static async Task<IResult> GetUserByEmail(string email, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByEmailAsync(email);
        return user is null
            ? Results.NotFound(new { Message = $"User with email {email} not found" })
            : Results.Ok(MapToResponse(user));
    }

    private static async Task<IResult> CreateUser(CreateUserRequest request, IUnitOfWork unitOfWork)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Results.BadRequest(new { Message = "Email is required" });
        }

        var existing = await unitOfWork.UserProfiles.GetByEmailAsync(request.Email);
        if (existing is not null)
        {
            return Results.BadRequest(new { Message = "A user with this email already exists" });
        }

        var user = UserProfile.Create(request.Email, request.DisplayName);
        user.UpdateProfile(
            request.DisplayName,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.Location);

        await unitOfWork.UserProfiles.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.Created($"/api/users/{user.Id}", MapToResponse(user));
    }

    private static async Task<IResult> UpdateUser(Guid id, UpdateUserRequest request, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        user.UpdateProfile(
            request.DisplayName,
            request.FirstName,
            request.LastName,
            request.PhoneNumber,
            request.Location);

        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.Ok(MapToResponse(user));
    }

    private static async Task<IResult> DeleteUser(Guid id, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        await unitOfWork.UserProfiles.DeleteAsync(id);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> AddFavorite(Guid id, Guid braiderId, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        user.AddFavorite(braiderId);
        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> RemoveFavorite(Guid id, Guid braiderId, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        user.RemoveFavorite(braiderId);
        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> GetFavorites(Guid id, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        var favorites = user.Favorites.Select(f => new FavoriteResponse(f.Id, f.BraiderId, f.AddedAt));
        return Results.Ok(favorites);
    }

    private static async Task<IResult> AddPreference(Guid id, AddPreferenceRequest request, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        var preference = UserPreference.Create(id, request.Key, request.Value);
        user.AddPreference(preference);
        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> RemovePreference(Guid id, string key, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        user.RemovePreference(key);
        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> GetPreferences(Guid id, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        var preferences = user.Preferences.Select(p => new PreferenceResponse(p.Id, p.Key, p.Value, p.CreatedAt));
        return Results.Ok(preferences);
    }

    private static async Task<IResult> UpdateProfileImage(Guid id, UpdateProfileImageRequest request, IUnitOfWork unitOfWork)
    {
        var user = await unitOfWork.UserProfiles.GetByIdAsync(id);
        if (user is null)
        {
            return Results.NotFound(new { Message = $"User with ID {id} not found" });
        }

        user.SetProfileImage(request.ImageUrl);
        await unitOfWork.UserProfiles.UpdateAsync(user);
        await unitOfWork.SaveChangesAsync();

        return Results.NoContent();
    }

    private static UserProfileResponse MapToResponse(UserProfile user) => new(
        user.Id,
        user.Email,
        user.DisplayName,
        user.FirstName,
        user.LastName,
        user.PhoneNumber,
        user.ProfileImageUrl,
        user.Location,
        user.CreatedAt,
        user.UpdatedAt,
        user.Favorites.Count,
        user.Preferences.Count);
}

// Request DTOs
public record CreateUserRequest(
    string Email,
    string? DisplayName,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Location);

public record UpdateUserRequest(
    string? DisplayName,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Location);

public record AddPreferenceRequest(string Key, string Value);

public record UpdateProfileImageRequest(string ImageUrl);

// Response DTOs
public record UserProfileResponse(
    Guid Id,
    string Email,
    string? DisplayName,
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? ProfileImageUrl,
    string? Location,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    int FavoritesCount,
    int PreferencesCount);

public record FavoriteResponse(Guid Id, Guid BraiderId, DateTimeOffset AddedAt);

public record PreferenceResponse(Guid Id, string Key, string Value, DateTimeOffset CreatedAt);
