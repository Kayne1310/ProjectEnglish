using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class UserSession
    {
        [BsonId]
        public ObjectId id {  get; set; }

        public ObjectId UserId { get; set; }
        public  string token { get; set; }

        public DateTime? isSueAt { get; set; }
        public DateTime? expriresAt { get; set; }

        public string isRevoked {  get; set; }





    }
}
