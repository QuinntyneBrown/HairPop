// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Core.Braider;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.EntityConfigurations;

public class BraiderConfiguration : IEntityTypeConfiguration<Braider>
{
    public void Configure(EntityTypeBuilder<Braider> builder)
    {
        builder.HasKey(x => x.BraiderId);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(256);
    }
}
