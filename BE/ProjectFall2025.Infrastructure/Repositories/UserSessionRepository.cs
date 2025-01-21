using MongoDB.Bson;
using MongoDB.Driver;
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
    public class UserSessionRepository : IUserSessionRepository
    {
        private readonly MongoDbContext dbContext;

        public UserSessionRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<int> addUserSession(UserSession userSession)
        {
            var collection = dbContext.GetCollectionUserSession();

            //add vao db
            await collection.InsertOneAsync(userSession);

            return 1;

        }

        public async Task<UserSession> GetUserSessionByUserId(ObjectId userId)
        {
            var collection = dbContext.GetCollectionUserSession();

            var res=await collection.Find(x=>x.UserId == userId && x.isRevoked=="false").FirstOrDefaultAsync(); 

            return res;
        }

        public async Task<int> UpdateUserSession(UserSession userSession)
        {
            var result = await dbContext.GetCollectionUserSession().ReplaceOneAsync(x => x.id == userSession.id, userSession);
            return (int)result.ModifiedCount;
        }

        public async Task<int> RevokeUserSessionByUserId(ObjectId userId)
        {
            var update = Builders<UserSession>.Update.Set(x => x.isRevoked, "true");

            var result = await dbContext.GetCollectionUserSession().UpdateManyAsync(x => x.UserId == userId && x.isRevoked == "false", update);
            return (int)result.ModifiedCount;
        }

        public async Task<int> DeleteUserSession(LogoutRequest token)
        {
           var collection=dbContext.GetCollectionUserSession();

            try
            {

                var objectId = ObjectId.Parse(token.UserId.ToString());
                var filter= Builders<UserSession>.Filter.Eq(x=>x.UserId, objectId);

            var res = await collection.DeleteOneAsync(filter);
            return 1;
            }

            catch (Exception ex)
            {
                throw;
            }
            

        }
    }

}
