using MongoDB.Bson;
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
        Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion, IClientSessionHandle session = null);
        Task<QuizQuestion> createQuizQuestion(QuizQuestion quizQuestion, IClientSessionHandle session = null);
        Task<int> updateQuizQuestion(QuizQuestion quizQuestion, IClientSessionHandle session = null);
        Task<int> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion, IClientSessionHandle session = null);
        Task<int> DeleteByQuizIdAsync(ObjectId quizId, IClientSessionHandle session = null); // Phương thức tối ưu dành cho delete quiz with question
    }
}
