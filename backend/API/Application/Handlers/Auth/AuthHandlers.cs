using IdeaManagement.Application.Interfaces;


using MediatR;
using Microsoft.EntityFrameworkCore;

using IdeaManagement.Application.Commands.Auth;
using IdeaManagement.Application.DTOs;
using IdeaManagement.Domain.Entities;
using IdeaManagement.Domain.Exceptions;
using Microsoft.AspNetCore.Http.HttpResults;

namespace IdeaManagement.Application.Handlers.Auth;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IApplicationDbContext context, IPasswordService passwordService, ITokenService tokenService)
    {
        _context = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive, cancellationToken);

        if (user == null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedActionException("Invalid credentials");
        }

        var token = _tokenService.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.IsActive, user.CreatedAt);

        return new AuthResponse(token, userDto);
    }
}

public class GetUserCommandHandler : IRequestHandler<GetUserCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public GetUserCommandHandler(
        IApplicationDbContext context,
        IPasswordService passwordService,
        ITokenService tokenService)
    {
        _context = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(GetUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.userId, cancellationToken);

        if (user == null)
        {
            throw new UserNotFoundException(request.userId);
        }

        var token = _tokenService.GenerateToken(user);
        var userDto = new UserDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role,
            user.IsActive,
            user.CreatedAt
        );

        return new AuthResponse(token, userDto);
    }
}



public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public RegisterCommandHandler(IApplicationDbContext context, IPasswordService passwordService, ITokenService tokenService)
    {
        _context = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser != null)
        {
            throw new DomainException("User with this email already exists");
        }

        var passwordHash = _passwordService.HashPassword(request.Password);
        var user = new User(request.Email, request.FirstName, request.LastName, passwordHash);

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _tokenService.GenerateToken(user);
        var userDto = new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.IsActive, user.CreatedAt);

        return new AuthResponse(token, userDto);
    }
}