// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Core.User;

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto()
        {
            UserId = user.UserId,

            Username = user.Username,
        };
    }
}