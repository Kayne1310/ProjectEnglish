using ProjectFall2025.Application.Services;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public class AccountService:IAcountService
    {
        private readonly IAcountRepository acountRepository;

        public AccountService(IAcountRepository acountRepository)
        {
            this.acountRepository = acountRepository;
        }

        public async Task<LoginResponseData> AccountLogin(AccountLoginRequestData requestData)
        {
            var returnData = new LoginResponseData();
            try
            {
                if (requestData == null
                    || string.IsNullOrEmpty(requestData.UserName)
                    || string.IsNullOrEmpty(requestData.Password))
                {
                    returnData.ReturnCode = -1;
                    returnData.ReturnMessage = "Dữ liệu không hợp lệ";
                    return returnData;
                }

                //hash pass
                requestData.Password = Security.ComputeSha256Hash(requestData.Password);

                var user = await acountRepository.AccountLogin(requestData);

                if (user == null)
                {
                    returnData.ReturnCode = -1;
                    returnData.ReturnMessage = "Tài khoản hoặc mật khẩu không đúng!";
                    return returnData;
                }

                returnData.ReturnCode = 1;
                returnData.ReturnMessage = "Đăng nhập thành công!";
                returnData.user = user;
                return returnData;
            }
            catch (Exception ex)
            {
                throw new Exception("Đã xảy ra lỗi khi đăng nhập.", ex);
            }
        }

        public Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData)
        {
            throw new NotImplementedException();
        }
    }
}
