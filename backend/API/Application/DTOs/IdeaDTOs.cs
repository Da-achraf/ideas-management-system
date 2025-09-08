using IdeaManagement.Domain.ValueObjects;

namespace IdeaManagement.Application.DTOs;

public record CreateIdeaRequest(string Title, string Description, IdeaCategory Category, Guid SubmitterId);
public record UpdateIdeaRequest(string Title, string Description, IdeaCategory Category);
public record ReviewIdeaRequest(IdeaStatus Status, string? Comments = null);

public record IdeaDto(
    Guid Id,
    string Title,
    string Description,
    IdeaCategory Category,
    IdeaStatus Status,
    Guid SubmitterId,
    string SubmitterName,
    DateTime SubmissionDate,
    string? ReviewComments,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record IdeasListResponse(IList<IdeaDto> content, int Total, int Page, int PageSize);
