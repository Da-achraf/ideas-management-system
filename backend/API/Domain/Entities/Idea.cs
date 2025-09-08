using IdeaManagement.Domain.ValueObjects;
using IdeaManagement.Domain.Events;

namespace IdeaManagement.Domain.Entities;

public class Idea : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public IdeaCategory Category { get; private set; }
    public IdeaStatus Status { get; private set; }
    public Guid SubmitterId { get; private set; }
    public User Submitter { get; private set; } = null!;
    public DateTime SubmissionDate { get; private set; }
    public string? ReviewComments { get; private set; }

    private Idea() { } // EF Core

    public Idea(string title, string description, IdeaCategory category, Guid submitterId)
    {
        Title = title;
        Description = description;
        Category = category;
        Status = IdeaStatus.Submitted;
        SubmitterId = submitterId;
        SubmissionDate = DateTime.UtcNow;

        AddDomainEvent(new IdeaSubmittedEvent(Id, title, submitterId));
    }

    public void UpdateDetails(string title, string description, IdeaCategory category)
    {
        Title = title;
        Description = description;
        Category = category;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new IdeaUpdatedEvent(Id, title));
    }

    public void Review(IdeaStatus newStatus, string? comments = null)
    {
        if (Status == IdeaStatus.Submitted)
        {
            Status = newStatus;
            ReviewComments = comments;
            UpdatedAt = DateTime.UtcNow;

            AddDomainEvent(new IdeaReviewedEvent(Id, newStatus, SubmitterId));
        }
    }
}