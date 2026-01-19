using Braiders.Core.Entities;

namespace Braiders.Core.Interfaces;

public interface IBraiderRepository
{
    Task<Braider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Braider>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Braider>> GetByLocationAsync(string location, CancellationToken cancellationToken = default);
    Task<IEnumerable<Braider>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task<Braider> AddAsync(Braider braider, CancellationToken cancellationToken = default);
    Task UpdateAsync(Braider braider, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
