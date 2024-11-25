// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace HairPop.Models.Braider;

public class GetBraiderByIdRequest: IRequest<GetBraiderByIdResponse>
{
    public Guid BraiderId { get; set; }
}

