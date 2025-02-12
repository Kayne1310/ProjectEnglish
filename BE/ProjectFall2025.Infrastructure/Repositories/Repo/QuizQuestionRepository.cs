using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class QuizQuestionRepository : IQuizQuestionRepository
    {
        private readonly MongoDbContext dbcontext;

        public QuizQuestionRepository(MongoDbContext dbcontext)
        {
            this.dbcontext = dbcontext;
        }

        public async Task<List<QuizQuestion>> getAllQuizQuestion()
        {
            var getAll = await dbcontext.GetCollectionQuizQuestion()
                .Find(_ => true)
                .ToListAsync();

            return getAll;
        }

        public async Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion)
        {
            var db = dbcontext.GetCollectionQuizQuestion();

            var objectId = ObjectId.Parse(quizQuestion.question_id);

            var filter = Builders<QuizQuestion>.Filter.Eq(x => x.question_id, objectId);

            var res = await db.Find(filter).FirstOrDefaultAsync();

            return res;
        }

        public async Task<QuizQuestion> createQuizQuestion(QuizQuestion quizQuestion)
        {
            var db = dbcontext.GetCollectionQuizQuestion();

            await db.InsertOneAsync(quizQuestion);

            return quizQuestion;
        }

        public async Task<int> updateQuizQuestion(QuizQuestion quizQuestion)
        {
            var update = await dbcontext.GetCollectionQuizQuestion()
                .ReplaceOneAsync(x => x.question_id == quizQuestion.question_id, quizQuestion);

            return (int)update.ModifiedCount;
        }

        public async Task<int> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion)
        {
            var db = dbcontext.GetCollectionQuizQuestion();

            var objectId = ObjectId.Parse(quizQuestion.question_id);

            var filter = Builders<QuizQuestion>.Filter.Eq(i => i.question_id, objectId);

            var res = await db.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }
    }
}
