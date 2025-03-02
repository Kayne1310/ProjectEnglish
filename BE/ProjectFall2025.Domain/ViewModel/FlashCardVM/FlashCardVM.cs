using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.FlashCard
{
    public class CreateStudySetVM
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }
        public string Title { get; set; } // Tiêu đề bộ học tập
        public string Language { get; set; } // Ngôn ngữ của bộ học tập
        public string Desc { get; set; } // Mô tả bộ học tập
        public bool Public { get; set; } // Trạng thái công khai

    }

    public class EditStudySetVM
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserId { get;set; }   
        public string Title { get; set; } // Tiêu đề bộ học tập
        public string Language { get; set; } // Ngôn ngữ của bộ học tập
        public string Desc { get; set; } // Mô tả bộ học tập
        public bool Public { get; set; } // Trạng thái công khai

    }
    public class DeleteStudySetVM
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

    }



}
