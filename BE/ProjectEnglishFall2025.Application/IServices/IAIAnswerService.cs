using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IAIAnswerService
    {
        Task<List<AIAnswer>> getAllAIAnswer();
        Task<AIAnswer> getAIAnswerById(deleteAIAnswerVM aIAnswer);
        Task<ReturnData> addAIAnswer(createAIAnswerVM aIAnswer);
        Task<ReturnData> updateAIAnswer(updateAIAnswerVM aIAnswer);
        Task<ReturnData> deleteAIAnswer(deleteAIAnswerVM aIAnswer);
    }
}
