using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IUserQuizService
    {
        Task<List<UserQuiz>> getAllUserQuiz();
        Task<UserQuiz> getIdUserQuiz(DeleteUserQuizVM userQuiz);
        Task<ReturnData> addUserQuiz(CreateUserQuizVM userQuizVM);
        Task<ReturnData> updateUserQuiz(UpdateUserQuizVM userQuizVM);
        Task<ReturnData> deleteUserQuiz(DeleteUserQuizVM userQuizVM);
    }
}
