using Microsoft.VisualBasic;
using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext dbContext;

        public UserRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        public async Task<List<User>> getAllUser()
        {
            var userCollection = dbContext.GetCollectionUser();
            return await userCollection.Find(_ => true).ToListAsync();
        }

        public async Task<int> GetUserCountAsync()
        {
            var usercollection = dbContext.GetCollectionUser();
            return (int)await usercollection.CountDocumentsAsync(FilterDefinition<User>.Empty);
        }

        public async Task<List<User>> GetAllUsersAsync(int skip, int pageSize, string sortBy, bool sortAscending)
        {
            var usercollection = dbContext.GetCollectionUser();
            var sortDefinition = sortAscending
                ? Builders<User>.Sort.Ascending(sortBy)
                : Builders<User>.Sort.Descending(sortBy);

            return await usercollection.Find(FilterDefinition<User>.Empty)
                .Sort(sortDefinition)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<User> addUser(User user)
        {
            var userCollection = dbContext.GetCollectionUser();
            await userCollection.InsertOneAsync(user);
            return user;
        }

        public async Task<int> ChangePassword(User user)
        {
            var update = Builders<User>.Update.Set(x => x.Password, user.Password);
            var res = await dbContext.GetCollectionUser().UpdateOneAsync(x => x.Email == user.Email, update);
            return (int)res.ModifiedCount;

        }

        public async Task<User> FindUserByFacebookId(string facebookId)
        {
            var usercollection = dbContext.GetCollectionUser();

            var res = await usercollection.Find(x => x.FacebookId == facebookId).FirstOrDefaultAsync();
            return res;
        }

        public async Task<User> FindUserByGoogleId(string googleId)
        {
            return await dbContext.GetCollectionUser().Find(x => x.GoogleId == googleId).FirstOrDefaultAsync();

        }

        public async Task<User> findUserById(ObjectId id)
        {
            var usercollection = dbContext.GetCollectionUser();

            var res = await usercollection.Find(x => x.UserID == id).FirstOrDefaultAsync();
            return res;
        }

        public async Task<User> findUserByUsername(string email)
        {
            var usercollection = dbContext.GetCollectionUser();

            var res = await usercollection.Find(x => x.Email == email).FirstOrDefaultAsync();
            return res;
            //check user exit

        }

        public async Task<int> UpdateTokenResetPassword(User user)
        {
            var update = Builders<User>.Update.Set(x => x.ResetPasswordToken, user.ResetPasswordToken)
                                              .Set(x => x.ResetTokenExpiry, DateTime.Now.AddMinutes(15));

            var res = await dbContext.GetCollectionUser().UpdateManyAsync(e => e.Email == user.Email, update);

            return (int)res.ModifiedCount;

        }

        public async Task<int> UpdateUser(User user)
        {
            var updateDefinition = Builders<User>.Update
                .Set(a => a.UserName, user.UserName)
                .Set(a => a.Address, user.Address)
                .Set(a => a.Age, user.Age)
                .Set(a => a.Phone, user.Phone)
                .Set(a => a.Gender, user.Gender)
                .Set(a => a.updateAt, DateTime.Now);

            // Nếu có ảnh mới, cập nhật trường image
            if (!string.IsNullOrEmpty(user.Picture))
            {
                updateDefinition = updateDefinition.Set(q => q.Picture, user.Picture);
            }

            var updateResult = await dbContext.GetCollectionUser()
                .UpdateOneAsync(a => a.UserID == user.UserID, updateDefinition);

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }

    }
}
