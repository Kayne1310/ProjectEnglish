using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class History
    {
        [BsonId]
        public ObjectId history_id {  get; set; }
        public string? total_questions { get; set; }
        public string? total_corrects { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get; set; }
        public ObjectId UserID {  get; set; }
        public ObjectId quiz_id { get; set; }
    }
}
