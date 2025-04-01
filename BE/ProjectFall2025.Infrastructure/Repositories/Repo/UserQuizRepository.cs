using AutoMapper;
using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class UserQuizRepository : IUserQuizRepository
    {
        private readonly MongoDbContext context;
        private readonly IMapper mapper;

        public UserQuizRepository(MongoDbContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<List<UserQuiz>> getAllUserQuiz()
        {
            var db = context.GetCollectionUserQuiz();

            var getAll = await db.Find(_ => true).ToListAsync();

            return getAll;
        }

        public async Task<UserQuiz> getIdUserQuiz(DeleteUserQuizVM userQuiz)
        {
            var db = context.GetCollectionUserQuiz();

            var objectId = ObjectId.Parse(userQuiz.userQuiz_id);

            var filter = Builders<UserQuiz>.Filter.Eq(i => i.userQuiz_id, objectId);

            var getId = await db.Find(filter).FirstOrDefaultAsync();

            return getId;
        }

        public async Task<UserQuiz> addUserQuiz(UserQuiz userQuizVM)
        {
            var db = context.GetCollectionUserQuiz();

            var add = mapper.Map<UserQuiz>(userQuizVM);

            await db.InsertOneAsync(add);

            return add;

        }
        public async Task<int> updateUserQuiz(UserQuiz userQuiz)
        {
            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<UserQuiz>.Update
                .Set(q => q.is_finish, userQuiz.is_finish)
                .Set(q => q.time_start, userQuiz.time_start)
                .Set(q => q.time_end, userQuiz.time_end)
                .Set(q => q.updateAt, DateTime.Now)
                //.Set(q => q.quiz_id, userQuiz.quiz_id)
                .Set(q => q.UserID, userQuiz.UserID);

            // Thực hiện cập nhật trong MongoDB
            var updateResult = await context.GetCollectionUserQuiz()
                .UpdateOneAsync(q => q.userQuiz_id == userQuiz.userQuiz_id, updateDefinition);

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }


        public async Task<int> deleteUserQuiz(DeleteUserQuizVM userQuizVM)
        {
            var db = context.GetCollectionUserQuiz();

            var objectId = ObjectId.Parse(userQuizVM.userQuiz_id);

            var filter = Builders<UserQuiz>.Filter.Eq(i => i.userQuiz_id, objectId);

            var delete = await db.DeleteOneAsync(filter);

            return (int)delete.DeletedCount;
        }
    }
}
