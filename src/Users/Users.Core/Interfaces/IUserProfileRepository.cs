using Users.Core.Entities;

namespace Users.Core.Interfaces;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserProfile?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserProfile>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<UserProfile> AddAsync(UserProfile profile, CancellationToken cancellationToken = default);
    Task UpdateAsync(UserProfile profile, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
