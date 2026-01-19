using Braiders.Core.Entities;
using Braiders.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Braiders.Infrastructure.Persistence.Repositories;

public class BraiderRepository : IBraiderRepository
{
    private readonly BraidersDbContext _context;

    public BraiderRepository(BraidersDbContext context)
    {
        _context = context;
    }

    public async Task<Braider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Braiders.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Braider>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Braiders.ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Braider>> GetByLocationAsync(string location, CancellationToken cancellationToken = default)
    {
        return await _context.Braiders
            .Where(b => b.Location != null && b.Location.Contains(location))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Braider>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Braiders
            .Where(b => b.IsAvailable)
            .ToListAsync(cancellationToken);
    }

    public async Task<Braider> AddAsync(Braider braider, CancellationToken cancellationToken = default)
    {
        await _context.Braiders.AddAsync(braider, cancellationToken);
        return braider;
    }

    public Task UpdateAsync(Braider braider, CancellationToken cancellationToken = default)
    {
        _context.Braiders.Update(braider);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var braider = await GetByIdAsync(id, cancellationToken);
        if (braider != null)
        {
            _context.Braiders.Remove(braider);
        }
    }
}
