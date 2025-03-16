using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IQuizQuestionRepository
    {
        Task<List<QuizQuestion>> getAllQuizQuestion();
        Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion);
        Task<QuizQuestion> createQuizQuestion(QuizQuestion quizQuestion, IClientSessionHandle session = null);
        Task<int> updateQuizQuestion(QuizQuestion quizQuestion);
        Task<int> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion);
    }
}
