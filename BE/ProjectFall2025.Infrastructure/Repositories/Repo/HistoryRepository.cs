using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class HistoryRepository : IHistoryRepository
    {
        private readonly MongoDbContext dbContext;

        public HistoryRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<History>> getAllHistory()
        {
            var db = dbContext.GetCollectionHistory();

            var getAll = await db.Find(_ => true).ToListAsync();

            return getAll;
        }

        public async Task<History> getHistoryById(deleteHistoryVM history)
        {
            var db = dbContext.GetCollectionHistory();

            var objectId = ObjectId.Parse(history.history_id);

            var filter = Builders<History>.Filter.Eq(x => x.history_id, objectId);
            
            var res = await db.Find(filter).FirstOrDefaultAsync();

            return res;
        }

        public async Task<History> addHistory(History history)
        {
            var add = dbContext.GetCollectionHistory();

            await add.InsertOneAsync(history);

            return history; 
        }

        public async Task<int> updateHistory(History history)
        {
            var update = await dbContext.GetCollectionHistory()
                .ReplaceOneAsync(x => x.history_id == history.history_id, history);

            return (int)update.ModifiedCount;
        }

        public async Task<int> deleteHistory(deleteHistoryVM history)
        {
            var delete = dbContext.GetCollectionHistory();

            var objectId = ObjectId.Parse(history.history_id);

            var filter = Builders<History>.Filter.Eq(x => x.history_id, objectId);

            var res = await delete.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }
    }
}
