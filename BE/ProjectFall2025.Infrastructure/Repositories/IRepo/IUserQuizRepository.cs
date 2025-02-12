using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IUserQuizRepository
    {
        Task<List<UserQuiz>> getAllUserQuiz();
        Task<UserQuiz> getIdUserQuiz(DeleteUserQuizVM userQuiz);
        Task<UserQuiz> addUserQuiz(UserQuiz userQuiz);
        Task<int> updateUserQuiz(UserQuiz userQuiz);
        Task<int> deleteUserQuiz(DeleteUserQuizVM userQuiz);
    }
}
