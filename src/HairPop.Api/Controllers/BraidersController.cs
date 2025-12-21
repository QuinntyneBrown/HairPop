// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using HairPop.Models.Braider;

namespace HairPop.Api.Controllers;

[ApiController]
[Route("api/braiders")]
public class BraidersController: Controller
{
    private readonly ILogger<BraidersController> _logger;

    private readonly IMediator _mediator;

    public BraidersController(ILogger<BraidersController> logger,IMediator mediator){
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(mediator);

        _logger = logger;
        _mediator = mediator;

    }

    [HttpPost(Name = "Create")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody]CreateBraiderRequest request)
    {
        var response = await _mediator.Send(request);

        return Ok(response);

    }

    [HttpPut(Name = "Update")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAsync([FromBody]UpdateBraiderRequest request)
    {
        var response = await _mediator.Send(request);

        return Ok(response);

    }

    [HttpDelete("{braiderId}", Name = "Delete")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteAsync([FromRoute]DeleteBraiderRequest request)
    {
        var response = await _mediator.Send(request);

        return Ok(response);

    }

    [HttpGet(Name = "Get")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAsync([FromRoute]GetBraidersRequest request)
    {
        var response = await _mediator.Send(request);

        return Ok(response);

    }

    [HttpGet("{braiderId}", Name = "GetById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetByIdAsync([FromRoute]GetBraiderByIdRequest request)
    {
        var response = await _mediator.Send(request);

        if(response.Braider == null)
        {
            return NotFound(request.BraiderId);
        }

        return Ok(response);

    }

}

