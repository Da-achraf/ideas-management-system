using IdeaManagement.Application.DTOs;
using IdeaManagement.Application.Interfaces;
using IdeaManagement.Application.Queries.Ideas;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdeaManagement.Application.Handlers.Ideas;

public class GetIdeasQueryHandler : IRequestHandler<GetIdeasQuery, IdeasListResponse>
{
    private readonly IApplicationDbContext _context;

    public GetIdeasQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeasListResponse> Handle(GetIdeasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Ideas.Include(i => i.Submitter).AsQueryable();

        if (request.Status.HasValue)
            query = query.Where(i => i.Status == request.Status.Value);

        if (request.Category.HasValue)
            query = query.Where(i => i.Category == request.Category.Value);

        if (request.SubmitterId.HasValue)
            query = query.Where(i => i.SubmitterId == request.SubmitterId.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var ideas = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new IdeaDto(
                i.Id,
                i.Title,
                i.Description,
                i.Category,
                i.Status,
                i.SubmitterId,
                $"{i.Submitter.FirstName} {i.Submitter.LastName}",
                i.SubmissionDate,
                i.ReviewComments,
                i.CreatedAt,
                i.UpdatedAt
            ))
            .ToListAsync(cancellationToken);

        return new IdeasListResponse(ideas, totalCount, request.Page, request.PageSize);
    }
}

public class GetIdeaByIdQueryHandler : IRequestHandler<GetIdeaByIdQuery, IdeaDto?>
{
    private readonly IApplicationDbContext _context;

    public GetIdeaByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeaDto?> Handle(GetIdeaByIdQuery request, CancellationToken cancellationToken)
    {
        var idea = await _context.Ideas
            .Include(i => i.Submitter)
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (idea == null)
            return null;

        return new IdeaDto(
            idea.Id,
            idea.Title,
            idea.Description,
            idea.Category,
            idea.Status,
            idea.SubmitterId,
            $"{idea.Submitter.FirstName} {idea.Submitter.LastName}",
            idea.SubmissionDate,
            idea.ReviewComments,
            idea.CreatedAt,
            idea.UpdatedAt
        );
    }
}

public class GetMyIdeasQueryHandler : IRequestHandler<GetMyIdeasQuery, IdeasListResponse>
{
    private readonly IApplicationDbContext _context;

    public GetMyIdeasQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeasListResponse> Handle(GetMyIdeasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Ideas
            .Include(i => i.Submitter)
            .Where(i => i.SubmitterId == request.UserId);

        var totalCount = await query.CountAsync(cancellationToken);

        var ideas = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new IdeaDto(
                i.Id,
                i.Title,
                i.Description,
                i.Category,
                i.Status,
                i.SubmitterId,
                $"{i.Submitter.FirstName} {i.Submitter.LastName}",
                i.SubmissionDate,
                i.ReviewComments,
                i.CreatedAt,
                i.UpdatedAt
            ))
            .ToListAsync(cancellationToken);

        return new IdeasListResponse(ideas, totalCount, request.Page, request.PageSize);
    }
}
