using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do.FlashCard
{
    public class Example
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // ID của câu ví dụ

        public string En { get; set; } // Câu ví dụ bằng tiếng Anh
        public string Trans { get; set; } // Phiên âm câu ví dụ
        public string Vi { get; set; } // Bản dịch tiếng Việt
        [BsonRepresentation(BsonType.ObjectId)]
        public string FlashcardId { get; set; } // ID của flashcard chứa nó
    }

}
