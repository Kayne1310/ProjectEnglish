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
    //STUDYSET
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
        public string UserId { get; set; }
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
    public class StudySetWithCountVM 
    {
        public StudySet StudySet { get; set; }
         public  int FlashcardCount  {  get; set; }
        public string UserName { get; set; }  // Thông tin user nằm ngoài
        public string Picture { get; set; }  // Thông tin user nằm ngoài
    }
    public class ResStudySetWithCountVM : ReturnData
    {
      public List<StudySetWithCountVM> listStudySetWithCount { get; set; }
    }

    //  FLASHCARD

    public class CreateFlashcardVM
    {

        public string Title { get; set; } // Tiêu đề từ vựng
        public string Define { get; set; } // Định nghĩa từ vựng
        public string TypeOfWord { get; set; } // Loại từ (danh từ, động từ...)
        public string Transcription { get; set; } // Phiên âm từ vựng
        public string Note { get; set; } // Ghi chú về từ vựng
        public string Status { get; set; } // Trạng thái học tập (đang học, đã nhớ...)
        public List<ExampleVM>? ExampleVM { get; set; } // Danh sách ID câu ví dụ

        [BsonRepresentation(BsonType.ObjectId)]
        public string StudySetId { get; set; } // ID của StudySet chứa nó
    }

    public class UpdateFlashcardVM
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // ID của flashcard
        public string Title { get; set; } // Tiêu đề từ vựng
        public string Define { get; set; } // Định nghĩa từ vựng
        public string TypeOfWord { get; set; } // Loại từ (danh từ, động từ...)
        public string Transcription { get; set; } // Phiên âm từ vựng
        public string Note { get; set; } // Ghi chú về từ vựng
        public string Status { get; set; } // Trạng thái học tập (đang học, đã nhớ...)
        public List<ExampleVM>? ExampleVM { get; set; } // Danh sách ID câu ví dụ
    }
    public class DeleteFlashcardVM
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // ID của flashcard

    }
    public class RenposeFlashCard :ReturnData 
    {
      public Flashcard Flashcard { get; set; }
    }


//EXMAPLE

public class ExampleVM
{

    public string En { get; set; } // Câu ví dụ bằng tiếng Anh
    public string Trans { get; set; } // Phiên âm câu ví dụ
    public string Vi { get; set; } // Bản dịch tiếng Việt

}
  

}
