using System.Security.Claims;
using IdeaManagement.Application.Commands.Ideas;
using IdeaManagement.Application.Queries.Ideas;
using IdeaManagement.Application.DTOs;
using IdeaManagement.Domain.ValueObjects;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdeaManagement.API.Controllers;

[ApiController]
[Route("api/ideas")]
[Authorize]
public class IdeasController : ControllerBase
{
    private readonly IMediator _mediator;

    public IdeasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get all ideas with optional filtering
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IdeasListResponse>> GetIdeas(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] IdeaStatus? status = null,
        [FromQuery] IdeaCategory? category = null,
        [FromQuery] Guid? submitterId = null)
    {
        var query = new GetIdeasQuery(page, pageSize, status, category, submitterId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Get idea by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<IdeaDto>> GetIdeaById(Guid id)
    {
        var query = new GetIdeaByIdQuery(id);
        var result = await _mediator.Send(query);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    /// <summary>
    /// Get current user's ideas
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<IdeasListResponse>> GetMyIdeas(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = GetCurrentUserId();
        var query = new GetMyIdeasQuery(userId, page, pageSize);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Create new idea
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<IdeaDto>> CreateIdea([FromBody] CreateIdeaRequest request)
    {
        var userId = GetCurrentUserId();
        var command = new CreateIdeaCommand(request.Title, request.Description, request.Category, userId);
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetIdeaById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update idea (only by submitter, only if status is Submitted)
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<IdeaDto>> UpdateIdea(Guid id, [FromBody] UpdateIdeaRequest request)
    {
        var userId = GetCurrentUserId();
        var command = new UpdateIdeaCommand(id, request.Title, request.Description, request.Category, userId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Review idea (only by reviewers/admins)
    /// </summary>
    [HttpPatch("{id}/review")]
    [Authorize(Roles = "Reviewer,Admin")]
    public async Task<ActionResult<IdeaDto>> ReviewIdea(Guid id, [FromBody] ReviewIdeaRequest request)
    {
        var userId = GetCurrentUserId();
        var command = new ReviewIdeaCommand(id, request.Status, request.Comments, userId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Delete idea (only by submitter)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteIdea(Guid id)
    {
        var userId = GetCurrentUserId();
        var command = new DeleteIdeaCommand(id, userId);
        var result = await _mediator.Send(command);

        if (!result)
            return NotFound();

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim != null && Guid.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }
        throw new UnauthorizedAccessException("User ID not found in token");
    }
}