using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_Account
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

    public class Account_UpdateRefeshTokenRequestData
    {
        public ObjectId UserId { get; set; }
        public string RefeshToken { get; set; }
        public DateTime Expired { get; set; }
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
}
