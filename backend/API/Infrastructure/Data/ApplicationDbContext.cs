using IdeaManagement.Infrastructure.Data.Configurations;
using IdeaManagement.Application.Interfaces;
using IdeaManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IdeaManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Idea> Ideas => Set<Idea>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new IdeaConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}
