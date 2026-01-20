using Reviews.Core.Entities;

namespace Reviews.Core.DTOs;

public record ReviewDto(
    Guid ReviewId,
    Guid BraiderId,
    Guid UserProfileId,
    int Rating,
    string Comment,
    ReviewStatus Status,
    int HelpfulCount,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt,
    IReadOnlyCollection<ReviewResponseDto> Responses
);

public record ReviewResponseDto(
    Guid ReviewResponseId,
    Guid ReviewId,
    Guid BraiderId,
    string ResponseText,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt
);

public record BraiderStatsDto(
    Guid BraiderId,
    double AverageRating,
    int TotalReviews
);
