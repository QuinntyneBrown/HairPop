namespace Reviews.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IReviewRepository Reviews { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
