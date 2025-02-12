using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IQuizAnswerRepository
    {
        Task<List<QuizAnswer>> getAllQuizAnswer();
        Task<QuizAnswer> findQuizAnswerById(DeleteAnswerQuestionVM answerQuestionId);
        Task<QuizAnswer> createQuizAnswer(QuizAnswer quiz);
        Task<int> updateQuizAnswer(QuizAnswer quiz);
        Task<int> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionId);
    }
}
