using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.Do
{
   
        public class ReturnData
        {
            public int ReturnCode { get; set; }
            public string ReturnMessage { get; set; }
        }

        public class LoginResponseData : ReturnData
        {
            public User user { get; set; }
            public string token { get; set; }
        }

    public class getUserDAtaResponseData : ReturnData
    {
        public UserVM user { get; set; }
        public string token { get; set; }

    }
    
}
