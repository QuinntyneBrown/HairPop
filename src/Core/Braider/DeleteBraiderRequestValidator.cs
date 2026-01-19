// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;

namespace Core.Braider;

public class DeleteBraiderRequestValidator: AbstractValidator<DeleteBraiderRequest>
{
    public DeleteBraiderRequestValidator(){
        RuleFor(x => x.BraiderId).NotNull();

    }

}

