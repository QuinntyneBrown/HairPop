using Reviews.Core.Interfaces;
using Reviews.Infrastructure.Persistence.Repositories;

namespace Reviews.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ReviewsDbContext _context;
    private IReviewRepository? _reviewRepository;

    public UnitOfWork(ReviewsDbContext context)
    {
        _context = context;
    }

    public IReviewRepository Reviews => _reviewRepository ??= new ReviewRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
