// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace HairPop.HairPop.AggregatesModel.HairStylistAggregate.Commands;

public class DeleteHairStylistValidator { }

public class DeleteHairStylistRequest : IRequest<DeleteHairStylistRequest>
{
    public Guid HairStylistId { get; set; }
}


public class DeleteHairStylistResponse { }

public class DeleteHairStylistHandler { }


