using IdeaManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace IdeaManagement.Application.Interfaces;

public interface IApplicationDbContext
{
    ChangeTracker ChangeTracker { get; }

    DbSet<User> Users { get; }
    DbSet<Idea> Ideas { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}