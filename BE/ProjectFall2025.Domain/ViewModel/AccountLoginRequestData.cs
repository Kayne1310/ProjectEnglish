using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel
{
    public class AccountLoginRequestData
    {

        public string Email { get; set; }

        public string Password { get; set; }
    }

    public class AccountLogOutRequestData
    {
        public string Token { get; set; }

    }


    public class FacebookUserViewModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string FacebookId { get; set; }
        public DateTime Exprired { get; set; }
    }


    public class GoogleUserViewModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string GoogleId { get; set; }
        public DateTime Exprired { get; set; }
    }


    public class Account_UpdateRefeshTokenRequestData
    {
        public ObjectId UserId { get; set; }
        public string RefeshToken { get; set; }
        public DateTime Exprired { get; set; }
    }

    public class LogoutRequest
    {
        public string UserId { get; set; }
    }

    public class LogoutResponse
    {
        public int ReturnCode { get; set; }
        public string ReturnMessage { get; set; }

    }

    public class ChangePasswordRequest
    {
        public string Email { get; set; }

        public string oldPassword { get; set; }
        public string newPassword { get; set; }
        public string reNewPassword { get; set; }
    }
}
