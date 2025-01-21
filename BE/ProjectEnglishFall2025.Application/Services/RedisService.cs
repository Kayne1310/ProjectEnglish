using ProjectFall2025.Application.IServices;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class RedisService : IRedisService
    {
        private readonly IConnectionMultiplexer redis;

        public RedisService(IConnectionMultiplexer redis)
        {
            this.redis = redis;
        }
        public async Task DeleteKeyAsync(string key)
        {
            var db = redis.GetDatabase();
            await db.KeyDeleteAsync(key);
        }

        public async Task<string> GetValueAsync(string key)
        {
            var db = redis.GetDatabase();
            return await db.StringGetAsync(key);
        }

        public Task<bool> KeyExistsAsync(string key)
        {
            throw new NotImplementedException();
        }

        public async Task SetValueAsync(string key, string value, TimeSpan expiry)
        {
            var db = redis.GetDatabase();
            await db.StringSetAsync(key, value, expiry);

        }
    }
}
