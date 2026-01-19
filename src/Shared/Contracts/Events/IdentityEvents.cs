using Shared.Messaging.Abstractions;

namespace Shared.Contracts.Events;

/// <summary>
/// Event raised when a new user is created.
/// </summary>
public sealed class UserCreated : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? DisplayName { get; init; }
    public string? CreatedBy { get; init; }
}

/// <summary>
/// Event raised when a user logs in.
/// </summary>
public sealed class UserLoggedIn : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? LoginMethod { get; init; }
    public string? IpAddress { get; init; }
}

/// <summary>
/// Event raised when a user logs out.
/// </summary>
public sealed class UserLoggedOut : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string? LogoutReason { get; init; }
}

/// <summary>
/// Event raised when a token is refreshed.
/// </summary>
public sealed class TokenRefreshed : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public DateTimeOffset NewExpiration { get; init; }
    public string? IpAddress { get; init; }
}

/// <summary>
/// Event raised when a user's email is verified.
/// </summary>
public sealed class UserEmailVerified : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}

/// <summary>
/// Event raised when a user's password is changed.
/// </summary>
public sealed class UserPasswordChanged : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}

/// <summary>
/// Event raised when MFA is enabled for a user.
/// </summary>
public sealed class MfaEnabled : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}

/// <summary>
/// Event raised when MFA is disabled for a user.
/// </summary>
public sealed class MfaDisabled : IMessage
{
    public string UserIdentifier { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}
