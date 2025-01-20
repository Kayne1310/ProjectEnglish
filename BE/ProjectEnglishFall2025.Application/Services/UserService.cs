using AutoMapper;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;

        public UserService(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public Task<User> addUserService(UserViewModel userViewModel)
        {
            try
            {
                //hash password
                userViewModel.Password=Security.ComputeSha256Hash(userViewModel.Password);
                //map user into userviewmodel
                var userDTO = mapper.Map<User>(userViewModel);

                var res = repository.addUser(userDTO);
                return res;
            }
            catch (Exception ex) {

                throw new Exception(ex.Message);
            }

        }


        public async Task<List<User>> getAllUser()
        {
           var user=await repository.getAllUser();

            return user;
        }
    }
}
