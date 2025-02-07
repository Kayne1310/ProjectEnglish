using Microsoft.VisualBasic;
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

        public async Task<int> ChangePassword(User user)
        {    
            var update = Builders<User>.Update.Set(x => x.Password, user.Password);
            var res=await dbContext.GetCollectionUser().UpdateOneAsync(x=>x.Email==user.Email,update);
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

        public async Task<User> findUserByUsername(string email)
        {
         var usercollection=dbContext.GetCollectionUser();

            var res= await usercollection.Find(x=>x.Email == email).FirstOrDefaultAsync();
            return res;
            //check user exit

        }

        public async Task<List<User>> getAllUser()
        {
            var userCollection =  dbContext.GetCollectionUser();
            return await userCollection.Find(_ => true).ToListAsync(); 
        }


    }
}
