using MongoDB.Driver;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Infrastructure.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories
{
    public class AccountRepository : IAcountRepository
    {
        private readonly MongoDbContext dbContext;

        public AccountRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<User> AccountLogin(AccountLoginRequestData requestData)
        {
            var userCollection = dbContext.GetCollectionUser();

            var user= await userCollection
                .Find(u => u.UserName == requestData.UserName && u.Password == requestData.Password)
                .FirstOrDefaultAsync();
            return user;

        }

        public async Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData)
        {
            var userCollection = dbContext.GetCollectionUser();
            var filter = Builders<User>.Filter.Eq(x => x.UserID, requestData.UserId);
            var update = Builders<User>.Update
                .Set(x => x.Refeshtoken, requestData.RefeshToken)
                .Set(x => x.Exprired, requestData.Exprired);

            var result = await userCollection.UpdateOneAsync(filter, update);
            return 1;
        }

        public async Task<User> getUserById(object userId)
        {
          var userCollection= dbContext.GetCollectionUser();
           var filter = Builders<User>.Filter.Eq(x => x.UserID, userId);
           return await userCollection.Find(filter).FirstOrDefaultAsync();
        }
    }
}
