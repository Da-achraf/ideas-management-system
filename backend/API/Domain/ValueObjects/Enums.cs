namespace IdeaManagement.Domain.ValueObjects;

public enum UserRole
{
    Submitter = 0,
    Reviewer = 1,
    Admin = 2
}

public enum IdeaCategory
{
    ProductImprovement = 0,
    ProcessOptimization = 1,
    Innovation = 2,
    CostReduction = 3,
    CustomerExperience = 4
}

public enum IdeaStatus
{
    Submitted = 0,
    UnderReview = 1,
    Approved = 2,
    Rejected = 3,
    Implemented = 4
}