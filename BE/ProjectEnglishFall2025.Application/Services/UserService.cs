using AutoMapper;
using FluentValidation;
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
        private readonly IValidator<UserViewModel> validator;

        public UserService(IUserRepository repository, IMapper mapper,IValidator<UserViewModel> validator)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.validator = validator;
        }
        public async Task<ReturnData> addUserService(UserViewModel userViewModel)
        {
            try
            {
                //valid data
                var validationResult = await validator.ValidateAsync(userViewModel);
                if (!validationResult.IsValid)
                {
                    var errorMessages = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMessages)
                    };
                }
                //check user exit
                var userexit=await repository.findUserByUsername(userViewModel.Email);

                if (userexit != null)
                {

                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Username already exists."
                    };
                }

                //hash password
                userViewModel.Password=Security.ComputeSha256Hash(userViewModel.Password);
                //map user into userviewmodel
                var userDTO = mapper.Map<User>(userViewModel);

                var res = await repository.addUser(userDTO);
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "User created successfully."
                };
            }
            catch (Exception ex) {

                throw new Exception(ex.Message);
            }

        }


        public async Task<List<UserVM>> getAllUser()
        {
           var user=await repository.getAllUser();

            var listUservm=new List<UserVM>();

            foreach (var item in user)
            {

                listUservm.Add(mapper.Map<UserVM>(item));
            }
            //map
         
            return listUservm;
        }
    }
}
