using IdeaManagement.Domain.Events;

namespace IdeaManagement.Domain.Interfaces;

public interface IDomainEventContainer
{
    IReadOnlyCollection<IDomainEvent> DomainEvents { get; }
    void ClearDomainEvents();
}