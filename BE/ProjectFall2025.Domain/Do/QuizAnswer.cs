using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class QuizAnswer
    {
        [BsonId]
        public ObjectId quizAnswer_id { get; set; }
        public string? desciption { get; set; }
        public int? correct_answer { get; set; }
        public DateTime? createAt { get; set; }
        public DateTime? updateAt { get; set; }
        public ObjectId question_id { get; set; }
    }
}
