using Users.Core.Interfaces;
using Users.Infrastructure.Persistence.Repositories;

namespace Users.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly UsersDbContext _context;
    private IUserProfileRepository? _userProfileRepository;

    public UnitOfWork(UsersDbContext context)
    {
        _context = context;
    }

    public IUserProfileRepository UserProfiles => _userProfileRepository ??= new UserProfileRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
