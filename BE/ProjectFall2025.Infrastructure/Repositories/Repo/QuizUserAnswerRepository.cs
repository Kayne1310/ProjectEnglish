using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class QuizUserAnswerRepository : IQuizUserAnswerRepository
    {
        private readonly MongoDbContext mongoDbContext;

        public QuizUserAnswerRepository(MongoDbContext mongoDbContext)
        {
            this.mongoDbContext = mongoDbContext;
        }

        public async Task<List<QuizUserAnswer>> getAllQuizUserAnswer()
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            var getAll = await db.Find(_ => true).ToListAsync();

            return getAll;
        }

        public Task<QuizUserAnswer> getIdQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer)
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            var objectId = ObjectId.Parse(quizUserAnswer.quizUserAnswer_id);

            var filter = Builders<QuizUserAnswer>.Filter.Eq(i => i.quizUserAnswer_id, objectId);

            var getId = db.Find(filter).FirstOrDefaultAsync();

            return getId;
        }

        public async Task<QuizUserAnswer> addQuizUserAnswer(QuizUserAnswer quizUserAnswer)
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            await db.InsertOneAsync(quizUserAnswer);

            return quizUserAnswer;
        }

        public async Task<int> updateQuizUserAnswer(QuizUserAnswer quizUserAnswer)
        {
            var update = await mongoDbContext.GetCollectionQuizUserAnswer()
                .ReplaceOneAsync(x => x.quizUserAnswer_id == quizUserAnswer.quizUserAnswer_id, quizUserAnswer);

            return (int)update.ModifiedCount;
        }

        public async Task<int> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer)
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            var objectId = ObjectId.Parse(quizUserAnswer.quizUserAnswer_id);

            var filter = Builders<QuizUserAnswer>.Filter.Eq(i => i.quizUserAnswer_id, objectId);

            var delete = await db.DeleteOneAsync(filter);

            return (int)delete.DeletedCount;
        }
    }
}
