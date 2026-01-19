namespace Braiders.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IBraiderRepository Braiders { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
