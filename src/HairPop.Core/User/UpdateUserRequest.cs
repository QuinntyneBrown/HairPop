// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace HairPop.Core.User;

public class UpdateUserRequest: IRequest<UpdateUserResponse>
{
    public Guid UserId { get; set; }
}

