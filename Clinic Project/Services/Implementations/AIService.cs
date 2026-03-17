using Clinic_Project.Helpers;
using Clinic_Project.Services.Interfaces;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Clinic_Project.Services.Implementations
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AIService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<Result<object>> GetPredictionAsync(IFormFile file)
        {
            try
            {
                var aiUrl = _configuration["AIService:Url"] ?? "http://localhost:8000/predict";
                
                using var content = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                var fileContent = new StreamContent(fileStream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
                
                content.Add(fileContent, "file", file.FileName);

                var response = await _httpClient.PostAsync(aiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    return new Result<object>
                    {
                        Success = false,
                        ErrorMessage = $"AI Service Error: {response.ReasonPhrase}",
                        ErrorType = enErrorType.BadRequest
                    };
                }

                var responseString = await response.Content.ReadAsStringAsync();
                var resultData = JsonConvert.DeserializeObject<object>(responseString);

                return new Result<object>
                {
                    Success = true,
                    Data = resultData
                };
            }
            catch (Exception ex)
            {
                return new Result<object>
                {
                    Success = false,
                    ErrorMessage = $"Internal error connecting to AI Service: {ex.Message}",
                    ErrorType = enErrorType.InternalServerError
                };
            }
        }
    }
}
