using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_User
{
    public class UserVM
    {

        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Picture { get; set; }
        public string? Refeshtoken { get; set; }
        public DateTime Expired { get; set; }
        public string role { get; set; }
        public string? FacebookId { get; set; }
        public string? GoogleId { get; set; }



    }
}
