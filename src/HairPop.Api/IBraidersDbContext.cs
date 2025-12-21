// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace HairPop.Api;

public interface IBraidersDbContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

