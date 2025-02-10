using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IUserSessionService
    {

        Task<int> addUserSession(UserSession userSession);

        Task<int> removeUserSession(LogoutRequest logoutRequest);
    }
}
