// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace HairPop.Models.Braider;

public class UpdateBraiderRequest: IRequest<UpdateBraiderResponse>
{
    public Guid BraiderId { get; set; }
    public string Name { get; set; }
}

