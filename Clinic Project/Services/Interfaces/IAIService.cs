using Clinic_Project.Helpers;

namespace Clinic_Project.Services.Interfaces
{
    public interface IAIService
    {
        Task<Result<object>> GetPredictionAsync(IFormFile file);
    }
}
