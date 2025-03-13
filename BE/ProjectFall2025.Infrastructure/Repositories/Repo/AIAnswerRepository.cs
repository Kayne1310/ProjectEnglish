using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class AIAnswerRepository : IAIAnswerRepository
    {
        private readonly MongoDbContext mongoDbContext;

        public AIAnswerRepository(MongoDbContext mongoDbContext)
        {
            this.mongoDbContext = mongoDbContext;
        }

        public async Task<List<AIAnswer>> getAllAIAnswer()
        {
            var db = mongoDbContext.GetCollectionAIAnswer();

            var getAll = await db.Find(_ => true).ToListAsync();

            return getAll;
        }

        public Task<AIAnswer> getIdAIAnswer(deleteAIAnswerVM aIAnswer)
        {
            var db = mongoDbContext.GetCollectionAIAnswer();

            var objectId = ObjectId.Parse(aIAnswer.aiAnswer_id);

            var filter = Builders<AIAnswer>.Filter.Eq(i => i.aiAnswer_id, objectId);

            var getId = db.Find(filter).FirstOrDefaultAsync();

            return getId;
        }

        public async Task<AIAnswer> addAIAnswer(AIAnswer aIAnswer)
        {
            var db = mongoDbContext.GetCollectionAIAnswer();

            await db.InsertOneAsync(aIAnswer);

            return aIAnswer;
        }

        public async Task<int> updateAIAnswer(AIAnswer aIAnswer)
        {
            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<AIAnswer>.Update
                .Set(a => a.responseAI, aIAnswer.responseAI)
                .Set(a => a.generatedAt, DateTime.Now);
                //.Set(a => a.question_id, aIAnswer.question_id);

            // Thực hiện cập nhật trong MongoDB
            var updateResult = await mongoDbContext.GetCollectionAIAnswer()
                .UpdateOneAsync(a => a.aiAnswer_id == aIAnswer.aiAnswer_id, updateDefinition);

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }


        public async Task<int> deleteAIAnswer(deleteAIAnswerVM aIAnswer)
        {
            var db = mongoDbContext.GetCollectionAIAnswer();

            var objectId = ObjectId.Parse(aIAnswer.aiAnswer_id);

            var filter = Builders<AIAnswer>.Filter.Eq(i => i.aiAnswer_id, objectId);

            var delete = await db.DeleteOneAsync(filter);

            return (int)delete.DeletedCount;
        }
    }
}
