using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
    public class Quiz
    {
        [BsonId]
        public ObjectId quiz_id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }
        public string image {  get; set; }
        public string difficutly { get; set; }
        public DateTime? createAt { get; set; }
        public DateTime? updateAt { get; set; }

    }
}
