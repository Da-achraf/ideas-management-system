using IdeaManagement.Application.Commands.Auth;
using IdeaManagement.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IdeaManagement.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator) => _mediator = mediator;

    /// <summary>
    /// Login user
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Register new user
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand(request.Email, request.Password, request.FirstName, request.LastName);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Get user with generated token
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<AuthResponse>> GetUser([FromRoute] Guid userId)
    {
        var command = new GetUserCommand(userId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}