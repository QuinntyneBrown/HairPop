// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace HairPop.Models.Review;

public class GetReviewByIdRequest: IRequest<GetReviewByIdResponse>
{
    public Guid ReviewId { get; set; }
}

