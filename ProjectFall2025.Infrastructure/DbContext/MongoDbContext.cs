using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.DbContext
{
    public class MongoDbContext
    {
        
            private readonly IMongoDatabase _database;

            public MongoDbContext(IOptions<MongoDbSettings> settings)
            {
                if (settings == null || settings.Value == null)
                    throw new ArgumentNullException(nameof(settings), "MongoDbSettings cannot be null.");

                if (string.IsNullOrEmpty(settings.Value.ConnectionString))
                    throw new ArgumentException("MongoDb connection string cannot be null or empty.", nameof(settings.Value.ConnectionString));

                if (string.IsNullOrEmpty(settings.Value.DatabaseName))
                    throw new ArgumentException("Database name cannot be null or empty.", nameof(settings.Value.DatabaseName));

                var client = new MongoClient(settings.Value.ConnectionString);
                _database = client.GetDatabase(settings.Value.DatabaseName);
            }


          public IMongoCollection<User> GetCollectionUser()
         {
            return _database.GetCollection<User>("User");
         }

    }
    
}
