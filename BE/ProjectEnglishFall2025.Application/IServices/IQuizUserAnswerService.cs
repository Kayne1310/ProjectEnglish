using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IQuizUserAnswerService
    {
        Task<List<QuizUserAnswer>> getAllQuizUserAnswer();
        Task<QuizUserAnswer> getQuizUserAnswerById(deleteQuizUserAnswerVM quizUserAnswer);
        Task<ReturnData> addQuizUserAnswer(createQuizUserAnswerVM quizUserAnswer);
        Task<ReturnData> updateQuizUserAnswer(updateQuizUserAnswerVM quizUserAnswer);
        Task<ReturnData> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer);
    }
}
