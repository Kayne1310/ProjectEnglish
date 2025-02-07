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
        private readonly IAcountRepository acountRepository;

        public UserService(IUserRepository repository, IMapper mapper, IValidator<UserViewModel> validator, IAcountRepository acountRepository)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.validator = validator;
            this.acountRepository = acountRepository;
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
                var userexit = await repository.findUserByUsername(userViewModel.Email);

                if (userexit != null)
                {

                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Username already exists."
                    };
                }

                //hash password
                userViewModel.Password = Security.ComputeSha256Hash(userViewModel.Password);
                //map user into userviewmodel
                var userDTO = mapper.Map<User>(userViewModel);

                var res = await repository.addUser(userDTO);
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "User created successfully."
                };
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }

        public async Task<ReturnData> ChangePassword(ChangePasswordRequest changePassword)
        {
            //has old password and checklogin pass
            var checklogin = await acountRepository.AccountLogin(new AccountLoginRequestData
            {
                Email = changePassword.Email,
                Password = Security.ComputeSha256Hash(changePassword.oldPassword)
            });


            if (checklogin == null)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "Email Change Password or OldPassword does not exist",
                };
            }

            //check newpass and renewpass 
            if (changePassword.reNewPassword != changePassword.reNewPassword)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "NewPassword and ReNewPassword are not the same ",
                };

            }

            checklogin.Password = Security.ComputeSha256Hash((string)changePassword.reNewPassword);

            //update
           var res= await repository.ChangePassword(checklogin);
            if (res <= 0)
            {
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Login Failed ",
                };
            }

            return new ReturnData
            {
                ReturnCode = 1,
                ReturnMessage = "Change Password Succesfull! ",
            };

        }

        public async Task<List<UserVM>> getAllUser()
        {
            var user = await repository.getAllUser();

            var listUservm = new List<UserVM>();

            foreach (var item in user)
            {

                listUservm.Add(mapper.Map<UserVM>(item));
            }
            //map

            return listUservm;
        }

        public async Task<ReturnData> RegisterWithFacebook(FacebookUserViewModel model)
        {
            try
            {

                var existingUserWithEmail = await repository.findUserByUsername(model.Email);

                // Kiểm tra xem user đã tồn tại chưa (dựa trên FacebookId hoặc Email)
                var existingUser = await repository.FindUserByFacebookId(model.FacebookId);
                if (existingUser != null || existingUserWithEmail != null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "User already exists."
                    };
                }

                // Nếu chưa tồn tại, tạo tài khoản mới
                var newUser = new User
                {
                    UserName = model.Name,
                    Email = model.Email,
                    FacebookId = model.FacebookId,
                    Password = null,  // Không có mật khẩu
                    role = "User",
                    Exprired = DateTime.Now,
                };

                var result = await repository.addUser(newUser);


                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "User registered successfully."
                };
            }
            catch (Exception ex)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = $"Error: {ex.Message}"
                };
            }
        }

        public async Task<ReturnData> RegisterWithGoogle(GoogleUserViewModel model)
        {
            try
            {
                var existingUserWithEmail = await repository.findUserByUsername(model.Email);
                // Kiểm tra xem user đã tồn tại chưa (dựa trên FacebookId hoặc Email)
                var existingUser = await repository.FindUserByGoogleId(model.GoogleId);
                if (existingUser != null || existingUserWithEmail != null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "User already exists."
                    };
                }

                // Nếu chưa tồn tại, tạo tài khoản mới
                var newUser = new User
                {
                    UserName = model.Name,
                    Email = model.Email,
                    GoogleId = model.GoogleId,
                    Password = null,  // Không có mật khẩu
                    role = "User",
                    Exprired = DateTime.Now,
                };

                var result = await repository.addUser(newUser);


                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "User registered successfully."
                };
            }
            catch (Exception ex)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = $"Error: {ex.Message}"
                };
            }
        }
    }
}
