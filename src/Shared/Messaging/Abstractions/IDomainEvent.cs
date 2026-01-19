namespace Shared.Messaging.Abstractions;

/// <summary>
/// Represents a domain event that occurred within an aggregate.
/// </summary>
public interface IDomainEvent : IMessage
{
    /// <summary>
    /// Gets the identifier of the aggregate that raised this event.
    /// </summary>
    string AggregateId { get; }

    /// <summary>
    /// Gets the type name of the aggregate that raised this event.
    /// </summary>
    string AggregateType { get; }
}
