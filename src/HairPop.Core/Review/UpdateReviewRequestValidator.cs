// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;

namespace HairPop.Core.Review;

public class UpdateReviewRequestValidator: AbstractValidator<UpdateReviewRequest>
{
    public UpdateReviewRequestValidator(){
        RuleFor(x => x.ReviewId).NotNull();

    }

}

