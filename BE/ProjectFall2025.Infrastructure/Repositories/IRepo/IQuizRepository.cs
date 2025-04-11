using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IQuizRepository
    {
        Task<List<Quiz>> GetAllQuizs();
        Task<int> GetQuizCountAsync();
        Task<List<Quiz>> GetAllQuizsAsync(int skip, int pageSize, string sortBy, bool sortAscending);
        Task<Quiz> GetQuizById(DeleteQuizVM quiz, IClientSessionHandle session = null);
        Task<Quiz> AddQuiz(Quiz quiz);
        Task<int> UpdateQuiz(Quiz quiz);
        Task<int> DeleteQuiz(DeleteQuizVM quiz, IClientSessionHandle session = null);
        Task<List<BsonDocument>> getCountQuestionbyQuiz();
        Task<(int totalItems, List<BsonDocument> questions)> GetQuestionsByQuizIdAsync(
        ObjectId quizId,
        int skip,
        int limit,
        string sortBy,
        bool sortAscending);

        Task<List<BsonDocument>> GetQuestionByQuizId(ObjectId quizId);

    }
}
