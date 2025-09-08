using IdeaManagement.Domain.ValueObjects;
using IdeaManagement.Domain.Events;

namespace IdeaManagement.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }

    private readonly List<Idea> _submittedIdeas = new();
    public IReadOnlyCollection<Idea> SubmittedIdeas => _submittedIdeas.AsReadOnly();

    private User() { } // EF Core

    public User(string email, string firstName, string lastName, string passwordHash, UserRole role = UserRole.Submitter)
    {
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        PasswordHash = passwordHash;
        Role = role;
        IsActive = true;

        AddDomainEvent(new UserRegisteredEvent(Id, email, firstName, lastName));
    }

    public void UpdateProfile(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}