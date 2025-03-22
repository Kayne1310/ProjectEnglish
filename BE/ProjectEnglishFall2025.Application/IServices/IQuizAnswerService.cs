using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IQuizAnswerService
    {
        Task<List<QuizAnswer>> getAllQuizAnswer();
        Task<QuizAnswer> getIdQuizAnswer(DeleteAnswerQuestionVM answerQuestionVM);
        Task<ReturnData> addQuizAnswer(CreateAnswerQuestionVM answerQuestionVM);
        Task<ReturnData> updateQuizAnswer(UpdateAnswerQuestionVM answerQuestionVM);
        Task<ReturnData> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionVM);

        // correct answers
        Task<List<QuizAnswerDto>> GetCorrectQuizAnswersAsync(DeleteQuizVM quizId);
    }
}
