// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using FluentValidation;

namespace HairPop.Core.AggregatesModel.HairStylistAggregate.Commands;

public class CreateHairStylistRequest : IRequest<CreateHairStylistRequest>
{
    public string Name { get; set; }
}


public class CreateHairStylistValidator { }

public class CreateHairStylistResponse { }

public class CreateHairStylistHandler { }


