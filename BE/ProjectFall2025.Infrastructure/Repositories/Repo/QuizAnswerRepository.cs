using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class QuizAnswerRepository : IQuizAnswerRepository
    {
        private readonly MongoDbContext dbContext;

        public QuizAnswerRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<QuizAnswer>> getAllQuizAnswer()
        {
            var res = await dbContext.GetCollectionQuizAnswer()
                .Find(_ => true)
                .ToListAsync();

            return res;
        }

        public async Task<QuizAnswer> findQuizAnswerById(DeleteAnswerQuestionVM answerQuestionId)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);

            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            var res = await connection.Find(filter).FirstOrDefaultAsync();

            return res;
        }

        public async Task<QuizAnswer> createQuizAnswer(QuizAnswer quiz)
        {
            var collection = dbContext.GetCollectionQuizAnswer();

            await collection.InsertOneAsync(quiz);

            return quiz;
        }

        public async Task<int> updateQuizAnswer(QuizAnswer quiz)
        {
            var updateAnswer = await dbContext.GetCollectionQuizAnswer()
                .ReplaceOneAsync(f => f.quizAnswer_id == quiz.quizAnswer_id, quiz);

            return (int)updateAnswer.ModifiedCount;
        }

        public async Task<int> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionId)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);

            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            var res = await connection.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }
    }
}
