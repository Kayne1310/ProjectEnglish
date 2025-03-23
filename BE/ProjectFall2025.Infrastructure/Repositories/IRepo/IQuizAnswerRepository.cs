using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
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
        Task<QuizAnswer> findQuizAnswerById(DeleteAnswerQuestionVM answerQuestionId, IClientSessionHandle session = null);
        Task<QuizAnswer> createQuizAnswer(QuizAnswer quiz, IClientSessionHandle session = null);
        Task<int> updateQuizAnswer(QuizAnswer quiz, IClientSessionHandle session = null);
        Task<int> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionId, IClientSessionHandle session = null);
        Task<int> DeleteByQuestionIdAsync(ObjectId questionId, IClientSessionHandle session = null); // Phương thức tối ưu dành cho delete question with annswer

        // lookup QuizAnswer -> QuizQuestion -> Quiz
        Task<List<BsonDocument>> GetCorrectQuizAnswersAsync(string quizId);
    }
}
