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
    public interface IStudiSetRepository
    {
        Task<StudySet> CreateStudySet(StudySet studySet);
        Task<int> DeleteStudySet(DeleteStudySetVM deleteStudySetVM);
        Task<int> UpdateStudySet(StudySet studySet);
        Task<StudySet> getStudySetById(string id);


    }
}
