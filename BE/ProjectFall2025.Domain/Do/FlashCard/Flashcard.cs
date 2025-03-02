using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do.FlashCard
{
    public class Flashcard
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // ID của flashcard

        public string Title { get; set; } // Tiêu đề từ vựng
        public string Define { get; set; } // Định nghĩa từ vựng
        public string TypeOfWord { get; set; } // Loại từ (danh từ, động từ...)
        public string Transcription { get; set; } // Phiên âm từ vựng

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> ExampleIds { get; set; } // Danh sách ID câu ví dụ

        public string Note { get; set; } // Ghi chú về từ vựng
        public string Status { get; set; } // Trạng thái học tập (đang học, đã nhớ...)
        public List<string> History { get; set; } // Lịch sử học tập
        [BsonRepresentation(BsonType.ObjectId)]
        public string StudySetId { get; set; } // ID của StudySet chứa nó

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } // Ngày tạo flashcard
    }
}
