// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace Core.Braider;

public class DeleteBraiderRequest: IRequest<DeleteBraiderResponse>
{
    public Guid BraiderId { get; set; }
}

