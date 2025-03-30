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

        public async Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion, IClientSessionHandle session = null)
        {
            var db = dbcontext.GetCollectionQuizQuestion();
            var objectId = ObjectId.Parse(quizQuestion.question_id);
            var filter = Builders<QuizQuestion>.Filter.Eq(x => x.question_id, objectId);

            if (session != null)
            {
                return await db.Find(session, filter).FirstOrDefaultAsync();
            }
            return await db.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<QuizQuestion> createQuizQuestion(QuizQuestion quizQuestion, IClientSessionHandle session = null)
        {
            var db = dbcontext.GetCollectionQuizQuestion();

            if (session != null)
            {         
                await db.InsertOneAsync(session, quizQuestion);            
            }
            else
            {
                await db.InsertOneAsync(quizQuestion);
            }
            return quizQuestion;
        }

        public async Task<int> updateQuizQuestion(QuizQuestion quizQuestion, IClientSessionHandle session = null)
        {
            var db = dbcontext.GetCollectionQuizQuestion();

            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<QuizQuestion>.Update
                .Set(q => q.quiz_id, quizQuestion.quiz_id)
                .Set(q => q.description, quizQuestion.description)
                .Set(q => q.updateAt, DateTime.Now);

            // Nếu có ảnh mới, cập nhật trường image
            if (!string.IsNullOrEmpty(quizQuestion.image))
            {
                updateDefinition = updateDefinition.Set(q => q.image, quizQuestion.image);
            }

            // Thực hiện cập nhật trong MongoDB
            UpdateResult updateResult;
            if (session != null)
            {
                updateResult = await db.UpdateOneAsync(
                    session,
                    Builders<QuizQuestion>.Filter.Eq(x => x.question_id, quizQuestion.question_id),
                    updateDefinition
                );
            }
            else
            {
                updateResult = await db.UpdateOneAsync(
                    Builders<QuizQuestion>.Filter.Eq(x => x.question_id, quizQuestion.question_id),
                    updateDefinition
                );
            }

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }


        public async Task<int> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion, IClientSessionHandle session = null)
        {
            var db = dbcontext.GetCollectionQuizQuestion();
            var objectId = ObjectId.Parse(quizQuestion.question_id);
            var filter = Builders<QuizQuestion>.Filter.Eq(i => i.question_id, objectId);

            DeleteResult res;
            if (session != null)
            {
                res = await db.DeleteOneAsync(session, filter);
            }
            else
            {
                res = await db.DeleteOneAsync(filter);
            }

            return (int)res.DeletedCount;
        }

        public async Task<int> DeleteByQuizIdAsync(ObjectId quizId, IClientSessionHandle session = null)
        {
            var db = dbcontext.GetCollectionQuizQuestion();
            var filter = Builders<QuizQuestion>.Filter.Eq(q => q.quiz_id, quizId);
            DeleteResult result = session != null
                ? await db.DeleteManyAsync(session, filter)
                : await db.DeleteManyAsync(filter);
            return (int)result.DeletedCount;
        }
    }
}
