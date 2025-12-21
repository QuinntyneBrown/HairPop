// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace HairPop.Core.Review;

public static class ReviewExtensions
{
    public static ReviewDto ToDto(this Review review)
    {
        return new ReviewDto()
        {
            ReviewId = review.ReviewId,
        };

    }

}

