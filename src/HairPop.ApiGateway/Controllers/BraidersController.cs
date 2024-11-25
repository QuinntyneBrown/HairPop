// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Mvc;

namespace HairPop.ApiGateway.Controllers;

[ApiController]
[Route("api/braiders")]
public class BraidersController : ControllerBase
{
    private readonly ILogger<BraidersController> _logger;
    private static readonly HttpClient _httpClient = new HttpClient();
    public BraidersController(ILogger<BraidersController> logger)
    {
        ArgumentNullException.ThrowIfNull(logger);

        _logger = logger;
    }
}
