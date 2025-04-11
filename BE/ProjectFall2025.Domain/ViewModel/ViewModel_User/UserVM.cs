using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_User
{
    public class UserVM
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public string? Age { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? Password { get; set; }
        public string? Picture { get; set; }
        public string? Refeshtoken { get; set; }
        public DateTime? Expired { get; set; }
        public string? role { get; set; }
        public string? FacebookId { get; set; }
        public string? GoogleId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? updateAt { get; set; }

    }

    public class UpdateUserVM
    {
        public string UserID { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public string? Age { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public IFormFile? Picture { get; set; }

    }
}
