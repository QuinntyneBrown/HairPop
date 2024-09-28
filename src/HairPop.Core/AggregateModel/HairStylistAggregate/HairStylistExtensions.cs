// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace HairPop.Core.AggregateModel.HairStylistAggregate;

public static class HairStylistExtensions
{
    public static HairStylistDto ToDto(this HairStylist hairStylist)
    {
        return new HairStylistDto
        {
            HairStylistId = hairStylist.HairStylistId,
            Name = hairStylist.Name,
        };


    }

    public async static Task<List<HairStylistDto>> ToDtosAsync(this IQueryable<HairStylist> hairStylists, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
        //return await hairStylists.Select(x => x.ToDto()).ToListAsync(cancellationToken);

    }

}

