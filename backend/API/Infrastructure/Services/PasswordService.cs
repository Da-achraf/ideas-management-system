using IdeaManagement.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace IdeaManagement.Infrastructure.Services;

public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<object> _passwordHasher = new();

    public string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(new object(), password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        var result = _passwordHasher.VerifyHashedPassword(new object(), hash, password);
        return result == PasswordVerificationResult.Success;
    }
}
