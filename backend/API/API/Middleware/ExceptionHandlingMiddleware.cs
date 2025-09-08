using System.Net;
using System.Text.Json;
using FluentValidation;
using IdeaManagement.Domain.Exceptions;

namespace IdeaManagement.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        // Set status code first
        response.StatusCode = exception switch
        {
            ValidationException => (int)HttpStatusCode.BadRequest,
            DomainException => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            _ => (int)HttpStatusCode.InternalServerError
        };

        // Create error response object
        object errorResponse = exception switch
        {
            ValidationException ex => new
            {
                message = "Validation failed",
                errors = ex.Errors.Select(e => new
                {
                    field = e.PropertyName,
                    message = e.ErrorMessage
                }).ToArray()
            },
            DomainException ex => new { message = ex.Message },
            UnauthorizedAccessException => new { message = "Unauthorized access" },
            _ => new { message = "An error occurred while processing your request" }
        };

        var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await response.WriteAsync(jsonResponse);
    }
}