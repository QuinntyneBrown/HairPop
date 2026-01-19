using Braiders.Core.Interfaces;
using Braiders.Infrastructure.Persistence.Repositories;

namespace Braiders.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly BraidersDbContext _context;
    private IBraiderRepository? _braiderRepository;

    public UnitOfWork(BraidersDbContext context)
    {
        _context = context;
    }

    public IBraiderRepository Braiders => _braiderRepository ??= new BraiderRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
