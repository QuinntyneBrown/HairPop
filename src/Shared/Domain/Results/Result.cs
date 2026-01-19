namespace Shared.Domain.Results;

/// <summary>
/// Represents the result of an operation that can succeed or fail.
/// </summary>
public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }

    protected Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, null!);

    public static Result Failure(Error error) => new(false, error);

    public static implicit operator Result(Error error) => Failure(error);
}

/// <summary>
/// Represents the result of an operation that can succeed with a value or fail.
/// </summary>
/// <typeparam name="T">The type of the value.</typeparam>
public class Result<T> : Result
{
    private readonly T _value;

    public T Value => IsSuccess
        ? _value
        : throw new InvalidOperationException("Cannot access value of a failed result.");

    private Result(T value) : base(true, null!)
    {
        _value = value;
    }

    private Result(Error error) : base(false, error)
    {
        _value = default!;
    }

    public static Result<T> Success(T value) => new(value);

    public new static Result<T> Failure(Error error) => new(error);

    public static implicit operator Result<T>(T value) => Success(value);

    public static implicit operator Result<T>(Error error) => Failure(error);
}
