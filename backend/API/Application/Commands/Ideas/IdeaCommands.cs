using FluentValidation;
using IdeaManagement.Application.DTOs;
using IdeaManagement.Domain.ValueObjects;
using MediatR;

namespace IdeaManagement.Application.Commands.Ideas;

public record CreateIdeaCommand(string Title, string Description, IdeaCategory Category, Guid UserId) : IRequest<IdeaDto>;
public record UpdateIdeaCommand(Guid Id, string Title, string Description, IdeaCategory Category, Guid UserId) : IRequest<IdeaDto>;
public record ReviewIdeaCommand(Guid Id, IdeaStatus Status, string? Comments, Guid UserId) : IRequest<IdeaDto>;
public record DeleteIdeaCommand(Guid Id, Guid UserId) : IRequest<bool>;

public class CreateIdeaCommandValidator : AbstractValidator<CreateIdeaCommand>
{
    public CreateIdeaCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Category).IsInEnum();
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public class UpdateIdeaCommandValidator : AbstractValidator<UpdateIdeaCommand>
{
    public UpdateIdeaCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Category).IsInEnum();
        RuleFor(x => x.UserId).NotEmpty();
    }
}

public class ReviewIdeaCommandValidator : AbstractValidator<ReviewIdeaCommand>
{
    public ReviewIdeaCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Status).IsInEnum();
        RuleFor(x => x.Comments).MaximumLength(1000);
        RuleFor(x => x.UserId).NotEmpty();
    }
}
