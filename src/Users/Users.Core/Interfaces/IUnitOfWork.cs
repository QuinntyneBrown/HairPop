namespace Users.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserProfileRepository UserProfiles { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
