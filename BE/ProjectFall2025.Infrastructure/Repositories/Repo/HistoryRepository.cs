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
            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<History>.Update
                .Set(h => h.total_questions, history.total_questions)
                .Set(h => h.total_corrects, history.total_corrects)
                .Set(h => h.updateAt, DateTime.Now);

            // Thực hiện cập nhật trong MongoDB
            var updateResult = await dbContext.GetCollectionHistory()
                .UpdateOneAsync(h => h.history_id == history.history_id, updateDefinition);

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }


        public async Task<int> deleteHistory(deleteHistoryVM history)
        {
            var delete = dbContext.GetCollectionHistory();

            var objectId = ObjectId.Parse(history.history_id);

            var filter = Builders<History>.Filter.Eq(x => x.history_id, objectId);

            var res = await delete.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }

        public async Task InsertAsync(History history)
        {
            var db = dbContext.GetCollectionHistory();

            await db.InsertOneAsync(history);
        }
    }
}
