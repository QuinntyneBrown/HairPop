namespace Shared.Domain.Results;

/// <summary>
/// Represents an error with a code and message.
/// </summary>
public sealed class Error
{
    public string Code { get; }
    public string Message { get; }
    public ErrorType Type { get; }

    private Error(string code, string message, ErrorType type)
    {
        Code = code;
        Message = message;
        Type = type;
    }

    public static Error Validation(string message) =>
        new("Validation", message, ErrorType.Validation);

    public static Error NotFound(string entity, string identifier) =>
        new("NotFound", $"{entity} with identifier '{identifier}' was not found.", ErrorType.NotFound);

    public static Error Conflict(string message) =>
        new("Conflict", message, ErrorType.Conflict);

    public static Error Unauthorized(string message) =>
        new("Unauthorized", message, ErrorType.Unauthorized);

    public static Error Forbidden(string message) =>
        new("Forbidden", message, ErrorType.Forbidden);

    public static Error Failure(string message) =>
        new("Failure", message, ErrorType.Failure);

    public static Error Failure(string code, string message) =>
        new(code, message, ErrorType.Failure);

    public static implicit operator string(Error error) => error.Message;

    public override string ToString() => $"{Code}: {Message}";
}
