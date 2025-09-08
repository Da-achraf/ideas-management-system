using IdeaManagement.Application.Interfaces;
using IdeaManagement.Domain.Interfaces;
using MediatR;

namespace IdeaManagement.Application.Behaviors;

public class DomainEventsBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : class, IRequest<TResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IPublisher _publisher;
    private readonly ILogger<DomainEventsBehavior<TRequest, TResponse>> _logger;

    public DomainEventsBehavior(IApplicationDbContext context, IPublisher publisher, ILogger<DomainEventsBehavior<TRequest, TResponse>> logger)
    {
        _context = context;
        _publisher = publisher;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var response = await next();

        var entitiesWithEvents = _context.ChangeTracker
            .Entries<IDomainEventContainer>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = entitiesWithEvents
            .SelectMany(e => e.DomainEvents)
            .ToList();

        foreach (var entity in entitiesWithEvents)
        {
            entity.ClearDomainEvents();
        }

        foreach (var domainEvent in domainEvents)
        {
            _logger.LogInformation("Publishing domain event: {EventType}", domainEvent.GetType().Name);
            await _publisher.Publish(domainEvent, cancellationToken);
        }

        return response;
    }
}