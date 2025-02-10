using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IQuizUserAnswerRepository
    {
        Task<List<QuizUserAnswer>> getAllQuizUserAnswer();
        Task<QuizUserAnswer> getIdQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer);
        Task<QuizUserAnswer> addQuizUserAnswer(QuizUserAnswer quizUserAnswer);
        Task<int> updateQuizUserAnswer(QuizUserAnswer quizUserAnswer);
        Task<int> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer);
    }
}
