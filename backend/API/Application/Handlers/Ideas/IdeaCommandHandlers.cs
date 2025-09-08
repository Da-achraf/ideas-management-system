using IdeaManagement.Application.Commands.Ideas;
using IdeaManagement.Application.DTOs;
using IdeaManagement.Application.Interfaces;
using IdeaManagement.Domain.ValueObjects;
using IdeaManagement.Domain.Entities;
using IdeaManagement.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IdeaManagement.Application.Handlers.Ideas;

public class CreateIdeaCommandHandler : IRequestHandler<CreateIdeaCommand, IdeaDto>
{
    private readonly IApplicationDbContext _context;

    public CreateIdeaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeaDto> Handle(CreateIdeaCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users.FindAsync(request.UserId);
        if (user == null)
        {
            throw new UserNotFoundException(request.UserId);
        }

        var idea = new Idea(request.Title, request.Description, request.Category, request.UserId);

        _context.Ideas.Add(idea);
        await _context.SaveChangesAsync(cancellationToken);

        return new IdeaDto(
            idea.Id,
            idea.Title,
            idea.Description,
            idea.Category,
            idea.Status,
            idea.SubmitterId,
            $"{user.FirstName} {user.LastName}",
            idea.SubmissionDate,
            idea.ReviewComments,
            idea.CreatedAt,
            idea.UpdatedAt
        );
    }
}

public class UpdateIdeaCommandHandler : IRequestHandler<UpdateIdeaCommand, IdeaDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateIdeaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeaDto> Handle(UpdateIdeaCommand request, CancellationToken cancellationToken)
    {
        var idea = await _context.Ideas
            .Include(i => i.Submitter)
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (idea == null)
        {
            throw new IdeaNotFoundException(request.Id);
        }

        if (idea.SubmitterId != request.UserId)
        {
            throw new UnauthorizedActionException("update idea");
        }

        if (idea.Status != IdeaStatus.Submitted)
        {
            throw new DomainException("Only submitted ideas can be updated");
        }

        idea.UpdateDetails(request.Title, request.Description, request.Category);
        await _context.SaveChangesAsync(cancellationToken);

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

public class ReviewIdeaCommandHandler : IRequestHandler<ReviewIdeaCommand, IdeaDto>
{
    private readonly IApplicationDbContext _context;

    public ReviewIdeaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IdeaDto> Handle(ReviewIdeaCommand request, CancellationToken cancellationToken)
    {
        var reviewer = await _context.Users.FindAsync(request.UserId);
        if (reviewer == null || reviewer.Role == UserRole.Submitter)
        {
            throw new UnauthorizedActionException("review ideas");
        }

        var idea = await _context.Ideas
            .Include(i => i.Submitter)
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (idea == null)
        {
            throw new IdeaNotFoundException(request.Id);
        }

        idea.Review(request.Status, request.Comments);
        await _context.SaveChangesAsync(cancellationToken);

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

public class DeleteIdeaCommandHandler : IRequestHandler<DeleteIdeaCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteIdeaCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteIdeaCommand request, CancellationToken cancellationToken)
    {
        var idea = await _context.Ideas.FindAsync(request.Id);
        if (idea == null)
        {
            return false;
        }

        if (idea.SubmitterId != request.UserId)
        {
            throw new UnauthorizedActionException("delete idea");
        }

        _context.Ideas.Remove(idea);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}