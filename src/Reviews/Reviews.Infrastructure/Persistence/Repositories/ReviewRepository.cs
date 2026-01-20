using Microsoft.EntityFrameworkCore;
using Reviews.Core.Entities;
using Reviews.Core.Interfaces;

namespace Reviews.Infrastructure.Persistence.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly ReviewsDbContext _context;

    public ReviewRepository(ReviewsDbContext context)
    {
        _context = context;
    }

    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews.FirstOrDefaultAsync(r => r.ReviewId == id, cancellationToken);
    }

    public async Task<IEnumerable<Review>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Reviews.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Review>> GetByBraiderIdAsync(Guid braiderId, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .Where(r => r.BraiderId == braiderId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Review>> GetApprovedByBraiderIdAsync(Guid braiderId, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .Where(r => r.BraiderId == braiderId && r.Status == ReviewStatus.Approved)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Review>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .Where(r => r.UserProfileId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Review>> GetByStatusAsync(ReviewStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Review> AddAsync(Review review, CancellationToken cancellationToken = default)
    {
        await _context.Reviews.AddAsync(review, cancellationToken);
        return review;
    }

    public Task UpdateAsync(Review review, CancellationToken cancellationToken = default)
    {
        _context.Reviews.Update(review);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var review = await GetByIdAsync(id, cancellationToken);
        if (review != null)
        {
            _context.Reviews.Remove(review);
        }
    }

    public async Task<(double AverageRating, int TotalReviews)> GetBraiderStatsAsync(Guid braiderId, CancellationToken cancellationToken = default)
    {
        var reviews = await _context.Reviews
            .Where(r => r.BraiderId == braiderId && r.Status == ReviewStatus.Approved)
            .ToListAsync(cancellationToken);

        if (reviews.Count == 0)
            return (0, 0);

        var averageRating = reviews.Average(r => r.Rating);
        return (Math.Round(averageRating, 1), reviews.Count);
    }
}
