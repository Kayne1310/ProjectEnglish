﻿using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IUserService
    {
        Task<ReturnData> addUserService(UserViewModel userViewModel);
        Task<List<UserVM>> getAllUser();
        Task<ReturnData> RegisterWithFacebook(FacebookUserViewModel model);
        Task<ReturnData> RegisterWithGoogle(GoogleUserViewModel model);

        Task<ReturnData> ChangePassword(ChangePasswordRequest changePassword);
        Task<ReturnData> ResetPassword(ResetPasswordRequest resetPassword);
        Task<User> getUserById(string id);

        Task<ReturnData> FindUserbyEmail(string email);


        Task<ReturnData> UpdateTokenUser(ResetPasswordRequest resetPassword);


	}
}
