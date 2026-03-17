using Clinic_Project.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Clinic_Project.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosisController : ControllerBase
    {
        private readonly IAIService _aiService;

        public DiagnosisController(IAIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("predict")]
        public async Task<IActionResult> Predict(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var result = await _aiService.GetPredictionAsync(file);

            if (!result.Success)
                return StatusCode(500, result.ErrorMessage);

            return Ok(result.Data);
        }
    }
}
