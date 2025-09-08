using FluentValidation;
using IdeaManagement.Application.DTOs;
using MediatR;

namespace IdeaManagement.Application.Commands.Auth;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;
public record GetUserCommand(Guid userId) : IRequest<AuthResponse>;
public record RegisterCommand(string Email, string Password, string FirstName, string LastName) : IRequest<AuthResponse>;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class GetUserCommandValidator : AbstractValidator<LoginCommand>
{
    public GetUserCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
    }
}