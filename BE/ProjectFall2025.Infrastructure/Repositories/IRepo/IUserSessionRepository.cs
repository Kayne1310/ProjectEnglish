using MongoDB.Bson;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IUserSessionRepository
    {

        Task<int> addUserSession(UserSession userSession);
        Task<UserSession> GetUserSessionByUserId(ObjectId userId);
        Task<int> UpdateUserSession(UserSession userSession);
        Task<int> RevokeUserSessionByUserId(ObjectId userId);

        Task<int> DeleteUserSession(LogoutRequest token);


    }
}
