// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using HairPop.Core.Braider;
using HairPop.Core.Review;
using HairPop.Core.User;
using Microsoft.EntityFrameworkCore;

namespace HairPop.Core;

public interface IHairPopContext
{
    DbSet<Braider.Braider> Braiders { get; }

    DbSet<User.User> Users { get; }

    DbSet<Review.Review> Reviews { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
