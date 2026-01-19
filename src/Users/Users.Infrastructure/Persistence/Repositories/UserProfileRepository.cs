using Microsoft.EntityFrameworkCore;
using Users.Core.Entities;
using Users.Core.Interfaces;

namespace Users.Infrastructure.Persistence.Repositories;

public class UserProfileRepository : IUserProfileRepository
{
    private readonly UsersDbContext _context;

    public UserProfileRepository(UsersDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.UserProfiles.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<UserProfile?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.UserProfiles.FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant(), cancellationToken);
    }

    public async Task<IEnumerable<UserProfile>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.UserProfiles.ToListAsync(cancellationToken);
    }

    public async Task<UserProfile> AddAsync(UserProfile profile, CancellationToken cancellationToken = default)
    {
        await _context.UserProfiles.AddAsync(profile, cancellationToken);
        return profile;
    }

    public Task UpdateAsync(UserProfile profile, CancellationToken cancellationToken = default)
    {
        _context.UserProfiles.Update(profile);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var profile = await GetByIdAsync(id, cancellationToken);
        if (profile != null)
        {
            _context.UserProfiles.Remove(profile);
        }
    }
}
