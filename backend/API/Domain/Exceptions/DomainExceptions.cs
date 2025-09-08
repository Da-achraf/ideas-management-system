namespace IdeaManagement.Domain.Exceptions;

public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
    public DomainException(string message, Exception innerException) : base(message, innerException) { }
}

public class UserNotFoundException : DomainException
{
    public UserNotFoundException(Guid userId) : base($"User with ID {userId} was not found.") { }
}

public class IdeaNotFoundException : DomainException
{
    public IdeaNotFoundException(Guid ideaId) : base($"Idea with ID {ideaId} was not found.") { }
}

public class UnauthorizedActionException : DomainException
{
    public UnauthorizedActionException(string action) : base($"Unauthorized to perform action: {action}") { }
}
