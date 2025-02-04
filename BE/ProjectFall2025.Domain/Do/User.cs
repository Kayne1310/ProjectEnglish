using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class User
    {
        [BsonId]
        public ObjectId UserID { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? FacebookId { get; set; }
        public string? Refeshtoken { get; set; }
        public DateTime Exprired { get; set; }

        public string role { get; set; } = "User";



    }
}
