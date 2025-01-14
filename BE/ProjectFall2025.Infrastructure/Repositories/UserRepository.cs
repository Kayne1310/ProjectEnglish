using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Infrastructure.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext dbContext;

        public UserRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<User> addUser(User user)
        {
               var userCollection = dbContext.GetCollectionUser();
             await userCollection.InsertOneAsync(user);

            return user;
        }

       

        public async Task<List<User>> getAllUser()
        {
            var userCollection =  dbContext.GetCollectionUser();
            return await userCollection.Find(_ => true).ToListAsync(); 
        }
    }
}
