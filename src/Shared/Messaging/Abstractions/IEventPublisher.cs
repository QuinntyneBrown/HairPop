namespace Shared.Messaging.Abstractions;

/// <summary>
/// Interface for publishing domain events.
/// </summary>
public interface IEventPublisher
{
    /// <summary>
    /// Publishes an event asynchronously.
    /// </summary>
    /// <typeparam name="TEvent">The type of event to publish.</typeparam>
    /// <param name="event">The event to publish.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : class, IMessage;

    /// <summary>
    /// Publishes multiple events asynchronously.
    /// </summary>
    /// <typeparam name="TEvent">The type of events to publish.</typeparam>
    /// <param name="events">The events to publish.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task PublishManyAsync<TEvent>(IEnumerable<TEvent> events, CancellationToken cancellationToken = default)
        where TEvent : class, IMessage;
}
