// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;

namespace Core.Review;

public class DeleteReviewRequestValidator: AbstractValidator<DeleteReviewRequest>
{
    public DeleteReviewRequestValidator(){
        RuleFor(x => x.ReviewId).NotNull();

    }

}

