using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class UserQuiz
    {
        [BsonId]
        public ObjectId userQuiz_id { get; set; }
        public int is_finish { get; set; }
        public string? time_start { get; set; }
        public string? time_end { get; set; }
        public DateTime? createAt { get; set; }
        public DateTime? updateAt { get; set; }
        public ObjectId quiz_id { get; set; }
        public ObjectId UserID { get; set; }
    }
}
