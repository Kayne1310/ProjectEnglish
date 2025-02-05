using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories
{
    public interface IUserRepository
    {

        Task<List<User>> getAllUser();

        Task<User> addUser(User user);

        Task<User> findUserByUsername(string username);

        Task<User> FindUserByFacebookId(string facebookId);
        Task<User> FindUserByGoogleId(string googleId);

    }
}
