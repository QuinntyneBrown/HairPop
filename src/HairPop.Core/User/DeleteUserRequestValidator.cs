// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;

namespace HairPop.Core.User;

public class DeleteUserRequestValidator: AbstractValidator<DeleteUserRequest>
{
    public DeleteUserRequestValidator(){
        RuleFor(x => x.UserId).NotNull();

    }

}

