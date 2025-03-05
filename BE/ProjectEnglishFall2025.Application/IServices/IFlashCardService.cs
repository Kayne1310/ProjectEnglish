using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCardVM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IFlashCardService
    {
        Task<ReturnData> createFlashCardInStudySet(CreateFlashcardVM createFlashcardVM);
        Task<ReturnData> updateFlashCardInStudySet(UpdateFlashcardVM updateFlashcardVM);
        Task<ReturnData> deleteFlashCardinStudySet(DeleteFlashcardVM deleteFlashcardVM);
        Task<RenposeFlashCard> getFlashCardById(string id);
        Task<ResponseListFlashCardVM> getListFlashCardByStudySet(string studySetId);

     


    }
}
