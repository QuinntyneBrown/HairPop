using Reviews.Core.DTOs;
using Reviews.Core.Entities;

namespace Reviews.Core.Extensions;

public static class ReviewExtensions
{
    public static ReviewDto ToDto(this Review review)
    {
        return new ReviewDto(
            review.ReviewId,
            review.BraiderId,
            review.UserProfileId,
            review.Rating,
            review.Comment,
            review.Status,
            review.HelpfulCount,
            review.CreatedAt,
            review.UpdatedAt,
            review.Responses.Select(r => r.ToDto()).ToList().AsReadOnly()
        );
    }

    public static ReviewResponseDto ToDto(this ReviewResponse response)
    {
        return new ReviewResponseDto(
            response.ReviewResponseId,
            response.ReviewId,
            response.BraiderId,
            response.ResponseText,
            response.CreatedAt,
            response.UpdatedAt
        );
    }
}
