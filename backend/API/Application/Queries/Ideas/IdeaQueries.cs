using IdeaManagement.Application.DTOs;
using IdeaManagement.Domain.ValueObjects;
using MediatR;

namespace IdeaManagement.Application.Queries.Ideas;

public record GetIdeasQuery(
    int Page = 1,
    int PageSize = 10,
    IdeaStatus? Status = null,
    IdeaCategory? Category = null,
    Guid? SubmitterId = null
) : IRequest<IdeasListResponse>;

public record GetIdeaByIdQuery(Guid Id) : IRequest<IdeaDto?>;
public record GetMyIdeasQuery(Guid UserId, int Page = 1, int PageSize = 10) : IRequest<IdeasListResponse>;
