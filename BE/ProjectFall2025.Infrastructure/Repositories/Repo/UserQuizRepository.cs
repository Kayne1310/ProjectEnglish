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
        public async Task<int> updateUserQuiz(UserQuiz userQuizVM)
        {
            var update = await context.GetCollectionUserQuiz()
                .ReplaceOneAsync(i => i.userQuiz_id == userQuizVM.userQuiz_id, userQuizVM);

            return (int)update.ModifiedCount;
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
