// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;

namespace HairPop.HairPop.AggregatesModel.HairStylistAggregate.Commands;

public class UpdateHairStylistValidator { }

public class UpdateHairStylistRequest : IRequest<UpdateHairStylistRequest>
{
    public Guid HairStylistId { get; set; }
    public string Name { get; set; }
}


public class UpdateHairStylistResponse { }

public class UpdateHairStylistHandler { }


