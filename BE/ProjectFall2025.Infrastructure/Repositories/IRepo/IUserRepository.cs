using MongoDB.Bson;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IUserRepository
    {
        //Task<List<User>> getAllUser();
        Task<int> GetUserCountAsync();
        Task<List<User>> GetAllUsersAsync(int skip, int pageSize, string sortBy, bool sortAscending);
        Task<User> addUser(User user);
        Task<User> findUserByUsername(string username);
        Task<User> FindUserByFacebookId(string facebookId);
        Task<User> FindUserByGoogleId(string googleId);
        Task<int> ChangePassword(User user);
        Task<int> UpdateTokenResetPassword(User user);
        Task<User> findUserById(ObjectId id);
        Task<int > UpdateUser(User user);

	}
}
