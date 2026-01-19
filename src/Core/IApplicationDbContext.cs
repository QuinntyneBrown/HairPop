// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Core.Braider;
using Core.Review;
using Core.User;
using Microsoft.EntityFrameworkCore;

namespace Core;

public interface IApplicationDbContext
{
    DbSet<Braider.Braider> Braiders { get; }

    DbSet<User.User> Users { get; }

    DbSet<Review.Review> Reviews { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
