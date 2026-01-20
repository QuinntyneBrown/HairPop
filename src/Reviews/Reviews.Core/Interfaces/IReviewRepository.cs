using Reviews.Core.Entities;

namespace Reviews.Core.Interfaces;

public interface IReviewRepository
{
    Task<Review?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Review>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Review>> GetByBraiderIdAsync(Guid braiderId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Review>> GetApprovedByBraiderIdAsync(Guid braiderId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Review>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Review>> GetByStatusAsync(ReviewStatus status, CancellationToken cancellationToken = default);
    Task<Review> AddAsync(Review review, CancellationToken cancellationToken = default);
    Task UpdateAsync(Review review, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(double AverageRating, int TotalReviews)> GetBraiderStatsAsync(Guid braiderId, CancellationToken cancellationToken = default);
}
