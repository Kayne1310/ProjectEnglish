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
        Task<Quiz> GetQuizById(DeleteQuizVM quiz, IClientSessionHandle session = null);
        Task<Quiz> AddQuiz(Quiz quiz);
        Task<int> UpdateQuiz(Quiz quiz);
        Task<int> DeleteQuiz(DeleteQuizVM quiz, IClientSessionHandle session = null);

        Task<List<BsonDocument>> getCountQuestionbyQuiz();

        Task<List<BsonDocument>> GetQuestionByQuizId(ObjectId quizId);

    }
}
