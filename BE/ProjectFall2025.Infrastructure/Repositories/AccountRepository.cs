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

            var allUser=await userCollection.Find(_=>true).ToListAsync();

            var user= await userCollection
                .Find(u => u.UserName == requestData.UserName && u.Password == requestData.Password)
                .FirstOrDefaultAsync();
            return user;

        }

        public Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData)
        {
            throw new NotImplementedException();
        }
    }
}
