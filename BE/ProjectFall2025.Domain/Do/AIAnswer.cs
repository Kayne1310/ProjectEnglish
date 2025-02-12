using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class AIAnswer
    {
        [BsonId]
        public ObjectId aiAnswer_id { get; set; }
        public string responseAI {  get; set; }
        public DateTime generatedAt { get; set; }
        public ObjectId question_id { get; set; }
    }
}
