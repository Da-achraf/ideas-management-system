using IdeaManagement.Domain.ValueObjects;
using IdeaManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IdeaManagement.Infrastructure.Data.Configurations;

public class IdeaConfiguration : IEntityTypeConfiguration<Idea>
{
    public void Configure(EntityTypeBuilder<Idea> builder)
    {
        builder.ToTable("Ideas");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(i => i.Description)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(i => i.Category)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(i => i.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(i => i.SubmitterId)
            .IsRequired();

        builder.Property(i => i.SubmissionDate)
            .IsRequired();

        builder.Property(i => i.ReviewComments)
            .HasMaxLength(1000);

        builder.Property(i => i.CreatedAt)
            .IsRequired();

        builder.Property(i => i.UpdatedAt)
            .IsRequired();

        builder.HasOne(i => i.Submitter)
            .WithMany(u => u.SubmittedIdeas)
            .HasForeignKey(i => i.SubmitterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(i => i.Status);
        builder.HasIndex(i => i.Category);
        builder.HasIndex(i => i.SubmitterId);

        // Ignore domain events navigation
        builder.Ignore(i => i.DomainEvents);
    }
}