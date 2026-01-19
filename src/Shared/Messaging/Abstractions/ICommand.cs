namespace Shared.Messaging.Abstractions;

/// <summary>
/// Represents a command that targets a specific entity or aggregate.
/// </summary>
public interface ICommand : IMessage
{
    /// <summary>
    /// Gets the identifier of the target entity or aggregate.
    /// </summary>
    string TargetId { get; }
}
