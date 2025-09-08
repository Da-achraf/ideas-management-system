using IdeaManagement.Domain.ValueObjects;

namespace IdeaManagement.Application.DTOs;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password, string FirstName, string LastName);
public record AuthResponse(string Token, UserDto User);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    UserRole Role,
    bool IsActive,
    DateTime CreatedAt
);
