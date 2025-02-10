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
            var db = await mongoDbContext.GetCollectionAIAnswer()
                .ReplaceOneAsync(i => i.aiAnswer_id == aIAnswer.aiAnswer_id, aIAnswer);

            return (int)db.ModifiedCount;
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
