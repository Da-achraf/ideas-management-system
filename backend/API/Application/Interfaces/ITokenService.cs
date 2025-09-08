using IdeaManagement.Domain.Entities;

namespace IdeaManagement.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    bool ValidateToken(string token);
    Guid GetUserIdFromToken(string token);
}