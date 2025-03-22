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
            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<QuizUserAnswer>.Update
                .Set(q => q.user_answers, quizUserAnswer.user_answers)
                .Set(q => q.updateAt, DateTime.Now)
                .Set(q => q.UserID, quizUserAnswer.UserID)
                //.Set(q => q.quiz_id, quizUserAnswer.quiz_id)
                .Set(q => q.question_id, quizUserAnswer.question_id);

            // Thực hiện cập nhật trong MongoDB
            var updateResult = await mongoDbContext.GetCollectionQuizUserAnswer()
                .UpdateOneAsync(q => q.quizUserAnswer_id == quizUserAnswer.quizUserAnswer_id, updateDefinition);

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }


        public async Task<int> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer)
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            var objectId = ObjectId.Parse(quizUserAnswer.quizUserAnswer_id);

            var filter = Builders<QuizUserAnswer>.Filter.Eq(i => i.quizUserAnswer_id, objectId);

            var delete = await db.DeleteOneAsync(filter);

            return (int)delete.DeletedCount;
        }

        public async Task InsertManyAsync(List<QuizUserAnswer> userAnswers)
        {
            var db = mongoDbContext.GetCollectionQuizUserAnswer();

            await db.InsertManyAsync(userAnswers);
        }
    }
}
