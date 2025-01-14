using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IUserService
    {
        Task<User> addUserService(UserViewModel userViewModel);
        Task<List<User>> getAllUser();

    }
}
