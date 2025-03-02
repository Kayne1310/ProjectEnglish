using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IStudySetService
    {
         Task<ReturnData> createStudySet(CreateStudySetVM createStudySetVM);
         Task<ReturnData> updateStudySet(EditStudySetVM editStudySetVM);
        Task<ReturnData> deleteStudySet(DeleteStudySetVM deleteStudySetVM);

    }
}
