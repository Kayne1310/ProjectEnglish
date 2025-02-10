using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IAIAnswerRepository
    {
        Task<List<AIAnswer>> getAllAIAnswer();
        Task<AIAnswer> getIdAIAnswer(deleteAIAnswerVM aIAnswer);
        Task<AIAnswer> addAIAnswer(AIAnswer aIAnswer);
        Task<int> updateAIAnswer(AIAnswer aIAnswer);
        Task<int> deleteAIAnswer(deleteAIAnswerVM aIAnswer);
    }
}
