using MongoDB.Bson;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IFlashCardRepository
    {
        Task<Flashcard> addFlashCardofStudyList(Flashcard flashcard);
        Task<Flashcard> GetFlashcardById(string flashCardId);
        Task<int> updateFlashCard(Flashcard flashcard);
        Task<int> deleteFlashCard(DeleteFlashcardVM deleteFlashcardVM);
        Task<BsonDocument> getListFlashCardByStudySetId(string studySetId);

    }
}
