// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace HairPop.Core.Review;

public class UpdateReviewRequest: IRequest<UpdateReviewResponse>
{
    public Guid ReviewId { get; set; }
}

