using AutoMapper;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class AccountService : IAcountService
    {
        private readonly IAcountRepository acountRepository;
        private readonly IMapper mapper;
        private readonly IUserRepository userRepository;

        public AccountService(IAcountRepository acountRepository,IMapper mapper,IUserRepository userRepository)
        {
            this.acountRepository = acountRepository;
            this.mapper = mapper;
            this.userRepository = userRepository;
        }

        public async Task<LoginResponseData> AccountLogin(AccountLoginRequestData requestData)
        {
            var returnData = new LoginResponseData();
            try
            {
                if (requestData == null
                    || string.IsNullOrEmpty(requestData.Email)
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

        public async Task<ReturnData> AccountLoginWithFb(string facebookId)
        {
            //find user by facebookId
            var user = await userRepository.FindUserByFacebookId(facebookId);
            if (user == null)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "User chua duoc dang ki."
                };
            }
            return new ReturnData
            {
                ReturnCode = 1,
                ReturnMessage = "Dang nhap thanh cong."
            };
        }

        public async Task<int> Account_UpdateRefeshToken(Account_UpdateRefeshTokenRequestData requestData)
        {       var user=await acountRepository.getUserById(requestData.UserId);
            if(user == null)
            {
                return -1;
            }

             user.Refeshtoken=requestData.RefeshToken;
             user.Exprired=requestData.Exprired;

            //map user to Account RefreshToken

            var acRef=mapper.Map<Account_UpdateRefeshTokenRequestData>(user);

            var update=await acountRepository.Account_UpdateRefeshToken(acRef);

            return 1;

         
        }
    }
}
