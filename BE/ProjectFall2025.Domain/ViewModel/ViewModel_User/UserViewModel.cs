using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_User
{
    public class UserViewModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserChatViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Picture { get; set; }
    }
}
