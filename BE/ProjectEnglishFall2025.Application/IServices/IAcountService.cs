using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IAcountService
    {
        Task<LoginResponseData> AccountLogin(AccountLoginRequestData requestData);
        Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData);
    }
}
