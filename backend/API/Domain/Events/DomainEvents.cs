using IdeaManagement.Domain.ValueObjects;

namespace IdeaManagement.Domain.Events;

public interface IDomainEvent
{
    Guid Id { get; }
    DateTime OccurredAt { get; }
}

public record UserRegisteredEvent(Guid UserId, string Email, string FirstName, string LastName)
    : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record IdeaSubmittedEvent(Guid IdeaId, string Title, Guid SubmitterId) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record IdeaUpdatedEvent(Guid IdeaId, string Title) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}

public record IdeaReviewedEvent(Guid IdeaId, IdeaStatus Status, Guid SubmitterId) : IDomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
}