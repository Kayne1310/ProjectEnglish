using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class ChatMessage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }  // Liên kết với User

        public string UserName { get; set; }  // Để hiển thị nhanh mà không cần truy vấn User riêng

        public string Message { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? Picture { get; set; }  // Avatar của người dùng để h
    }
}
