using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.Do.FlashCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.FlashCardVM
{
    public class ResponseListFlashCardVM :ReturnData
    {
        public StudySet StudySet { get; set; }
        public string Username { get; set; }
        public string PictureUrl { get; set; }
        public List<Flashcard> ListFlashcards { get; set; }
       
    }
}
