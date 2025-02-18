using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class QuizUserAnswer
    {
        [BsonId]
        public ObjectId quizUserAnswer_id { get; set; }
        public string? user_answers { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get; set; }
        public ObjectId UserID { get; set; }
        public ObjectId quiz_id { get; set; }
        public ObjectId question_id { get; set; }
    }
}
