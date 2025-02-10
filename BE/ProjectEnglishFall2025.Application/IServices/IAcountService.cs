using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
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
        Task<LoginResponseData> AccountLoginWithFb(string  facebookId);
        Task<LoginResponseData> AccountLoginWithGg(string googleId);
        Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData);

        Task<ReturnData> UpdateTokenReset();




    }
}
