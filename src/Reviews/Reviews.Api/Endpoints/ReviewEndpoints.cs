using Reviews.Core.DTOs;
using Reviews.Core.Entities;
using Reviews.Core.Extensions;
using Reviews.Core.Interfaces;

namespace Reviews.Api.Endpoints;

public static class ReviewEndpoints
{
    public static void MapReviewEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/reviews").WithTags("Reviews");

        group.MapGet("/", GetAll);
        group.MapGet("/{id:guid}", GetById);
        group.MapPost("/", Create);
        group.MapPut("/{id:guid}", Update);
        group.MapDelete("/{id:guid}", Delete);
        group.MapGet("/braider/{braiderId:guid}", GetByBraider);
        group.MapGet("/user/{userId:guid}", GetByUser);
        group.MapGet("/braider/{braiderId:guid}/stats", GetBraiderStats);
        group.MapGet("/status/{status}", GetByStatus);
        group.MapPost("/{id:guid}/helpful", MarkHelpful);
        group.MapDelete("/{id:guid}/helpful", RemoveHelpful);
        group.MapPost("/{id:guid}/response", AddResponse);
        group.MapPut("/{id:guid}/status", UpdateStatus);
    }

    private static async Task<IResult> GetAll(IUnitOfWork unitOfWork)
    {
        var reviews = await unitOfWork.Reviews.GetAllAsync();
        return Results.Ok(reviews.Select(r => r.ToDto()));
    }

    private static async Task<IResult> GetById(Guid id, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        return review is null ? Results.NotFound() : Results.Ok(review.ToDto());
    }

    private static async Task<IResult> Create(CreateReviewRequest request, IUnitOfWork unitOfWork)
    {
        var review = Review.Create(request.BraiderId, request.UserProfileId, request.Rating, request.Comment);
        await unitOfWork.Reviews.AddAsync(review);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/reviews/{review.ReviewId}", review.ToDto());
    }

    private static async Task<IResult> Update(Guid id, UpdateReviewRequest request, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null) return Results.NotFound();

        review.Update(request.Rating, request.Comment);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(review.ToDto());
    }

    private static async Task<IResult> Delete(Guid id, IUnitOfWork unitOfWork)
    {
        await unitOfWork.Reviews.DeleteAsync(id);
        await unitOfWork.SaveChangesAsync();
        return Results.NoContent();
    }

    private static async Task<IResult> GetByBraider(Guid braiderId, IUnitOfWork unitOfWork)
    {
        var reviews = await unitOfWork.Reviews.GetApprovedByBraiderIdAsync(braiderId);
        return Results.Ok(reviews.Select(r => r.ToDto()));
    }

    private static async Task<IResult> GetByUser(Guid userId, IUnitOfWork unitOfWork)
    {
        var reviews = await unitOfWork.Reviews.GetByUserIdAsync(userId);
        return Results.Ok(reviews.Select(r => r.ToDto()));
    }

    private static async Task<IResult> GetBraiderStats(Guid braiderId, IUnitOfWork unitOfWork)
    {
        var stats = await unitOfWork.Reviews.GetBraiderStatsAsync(braiderId);
        return Results.Ok(new BraiderStatsDto(braiderId, stats.AverageRating, stats.TotalReviews));
    }

    private static async Task<IResult> GetByStatus(ReviewStatus status, IUnitOfWork unitOfWork)
    {
        var reviews = await unitOfWork.Reviews.GetByStatusAsync(status);
        return Results.Ok(reviews.Select(r => r.ToDto()));
    }

    private static async Task<IResult> MarkHelpful(Guid id, MarkHelpfulRequest request, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null) return Results.NotFound();

        if (review.HasUserVoted(request.UserProfileId))
            return Results.Conflict(new { Message = "User has already voted for this review" });

        var vote = HelpfulVote.Create(id, request.UserProfileId);
        review.AddHelpfulVote(vote);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(review.ToDto());
    }

    private static async Task<IResult> RemoveHelpful(Guid id, RemoveHelpfulRequest request, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null) return Results.NotFound();

        review.RemoveHelpfulVote(request.UserProfileId);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(review.ToDto());
    }

    private static async Task<IResult> AddResponse(Guid id, AddResponseRequest request, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null) return Results.NotFound();

        var response = ReviewResponse.Create(id, request.BraiderId, request.ResponseText);
        review.AddResponse(response);
        await unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/reviews/{id}/response/{response.ReviewResponseId}", review.ToDto());
    }

    private static async Task<IResult> UpdateStatus(Guid id, UpdateStatusRequest request, IUnitOfWork unitOfWork)
    {
        var review = await unitOfWork.Reviews.GetByIdAsync(id);
        if (review is null) return Results.NotFound();

        review.SetStatus(request.Status);
        await unitOfWork.SaveChangesAsync();
        return Results.Ok(review.ToDto());
    }
}

public record CreateReviewRequest(Guid BraiderId, Guid UserProfileId, int Rating, string Comment);
public record UpdateReviewRequest(int Rating, string Comment);
public record MarkHelpfulRequest(Guid UserProfileId);
public record RemoveHelpfulRequest(Guid UserProfileId);
public record AddResponseRequest(Guid BraiderId, string ResponseText);
public record UpdateStatusRequest(ReviewStatus Status);
