// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Core.Braider;

public static class BraiderExtensions
{
    public static BraiderDto ToDto(this Braider braider)
    {
        return new BraiderDto()
        {
            BraiderId = braider.BraiderId,
            Name = braider.Name,
        };
    }
}

