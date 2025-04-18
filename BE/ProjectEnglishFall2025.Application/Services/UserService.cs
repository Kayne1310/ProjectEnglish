﻿using AutoMapper;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using Org.BouncyCastle.Asn1.Ocsp;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProjectFall2025.Infrastructure.Repositories.Repo;
using ProjectFall2025.Common.ImgCountry;
using ProjectFall2025.Domain.ViewModel.ViewModel_Pagination;

namespace ProjectFall2025.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;
        private readonly IValidator<UserViewModel> validator;
        private readonly IAcountRepository acountRepository;
        private readonly ICloudinaryService cloudinaryService;


        public UserService(IUserRepository repository, IMapper mapper,
            IValidator<UserViewModel> validator, IAcountRepository acountRepository, ICloudinaryService cloudinaryService)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.validator = validator;
            this.acountRepository = acountRepository;
            this.cloudinaryService = cloudinaryService;

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
                userDTO.Picture = "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1742971409/USER/kc5y9fcj4temgsvkhe3t.jpg"; // add picture default

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

        public async Task<ReturnData> ChangePassword(ChangePasswordResponse changePassword)
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
            if (changePassword.newPassword != changePassword.reNewPassword)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "NewPassword and ReNewPassword are not the same",
                };

            }

            checklogin.Password = Security.ComputeSha256Hash((string)changePassword.reNewPassword);

            //update
            var res = await repository.ChangePassword(checklogin);
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

        public async Task<ReturnData> FindUserbyEmail(string email)
        {

            var res = await repository.findUserByUsername(email);

            if (res == null)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "email not found"
                };
            }
            return new ReturnData
            {
                ReturnCode = 1,
                ReturnMessage = "email exist"
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

        public async Task<PaginatedResponse<User>> GetAllUsersAsync(PaginationRequest request)
        {
            var totalItems = await repository.GetUserCountAsync();
            var skip = (request.Page - 1) * request.PageSize;

            // Validate SortBy field
            var validSortFields = new[] { "UserName", "Email", "createAt" }; // Các field cho phép sort
            var sortBy = validSortFields.Contains(request.SortBy) ? request.SortBy : "UserName";

            var users = await repository.GetAllUsersAsync(
                skip,
                request.PageSize,
                sortBy,
                request.SortAscending
            );

            var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);

            return new PaginatedResponse<User>
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = request.Page,
                PageSize = request.PageSize,
                Items = users
            };
        }

        public async Task<UserVM> getUserById(string id)
        {
            try
            {

                var acb = ObjectId.Parse(id);
                var userExit = await repository.findUserById(acb);
                //maping
                if (userExit == null)
                {
                    return new UserVM();
                }
                //mapping
                var datamap = mapper.Map<UserVM>(userExit);
                datamap.UserID = id;
                return datamap;
            }
            catch (Exception ex)
            {
                throw;
            }
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
                    Picture = model.PictureUrl,
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
                    Picture = model.PictureUrl,

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

        public async Task<ReturnData> ResetPassword(ResetPasswordRequest resetPassword)
        {
            var user = await repository.findUserByUsername(resetPassword.Email);
            if (user == null)
                return new ReturnData { ReturnCode = -1, ReturnMessage = "Người dùng không tồn tại" };

            // Kiểm tra token reset mật khẩu có hợp lệ không

            var dateiabc = DateTime.UtcNow;
            if (user.ResetPasswordToken != resetPassword.Token || user.ResetTokenExpiry < DateTime.UtcNow)

                return new ReturnData { ReturnCode = -1, ReturnMessage = "Token không hợp lệ hoặc đã hết hạn" };

            // Hash mật khẩu mới
            user.Password = Security.ComputeSha256Hash(resetPassword.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetTokenExpiry = null;// Xóa token sau khi reset

            var isUpdated = await repository.ChangePassword(user);
            if (isUpdated <= 0)
            {

                return new ReturnData { ReturnCode = -1, ReturnMessage = "Lỗi khi cập nhật mật khẩu" };
            }

            return new ReturnData { ReturnCode = 1, ReturnMessage = "Mật khẩu đã được đặt lại thành công" };
        }



        public async Task<ReturnData> UpdateTokenUser(ResetPasswordRequest resetPassword)
        {
            //check email co ton tai ko
            var user = await repository.findUserByUsername(resetPassword.Email);
            if (user == null)
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "User not exist"
                };
            user.ResetPasswordToken = resetPassword.Token;
            var updateTokenResetPassword = await repository.UpdateTokenResetPassword(user);
            if (updateTokenResetPassword <= 0)
            {
                return new ReturnData
                {
                    ReturnCode = -1,
                    ReturnMessage = "User not exist"
                };

            }

            return new ReturnData
            {
                ReturnCode = 1,
                ReturnMessage = "Update token successful"
            };

        }

        //upload anh luu vao cloudinary
        public async Task<string> UploadProfilePictureAsync(string userId, IFormFile file)
        {
            try
            {
                var imageUrl = await cloudinaryService.UploadImageAsync(file, "users");

                // Lấy thông tin user từ DB
                var user = await repository.findUserById(ObjectId.Parse(userId));
                if (user == null) throw new ArgumentException("User not found!");

                // Cập nhật URL ảnh vào user
                user.Picture = imageUrl;
                var res = await repository.UpdateUser(user);
                if (res <= 0)
                {
                    throw new ArgumentException("Error ");
                }

                return imageUrl;

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<ReturnData> UpdateUser(UpdateUserVM userVM)
        {
            try
            {
                if (string.IsNullOrEmpty(userVM.UserID))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "UserID is required."
                    };
                }

                // Tạo object chứa các trường cần cập nhật
                var updateData = new User
                {
                    UserID = ObjectId.Parse(userVM.UserID),
                    UserName = userVM.UserName,
                    Address = userVM.Address,
                    Age = userVM.Age,
                    Phone = userVM.Phone,
                    Gender = userVM.Gender,
                    updateAt = DateTime.Now
                };


                // Nếu có ảnh mới, upload lên Cloudinary và cập nhật image
                if (userVM.Picture != null && userVM.Picture.Length > 0)
                {
                    updateData.Picture = await cloudinaryService.UploadImageAsync(userVM.Picture, "USER");
                }

                // Gửi dữ liệu cập nhật xuống Repository
                var update = await repository.UpdateUser(updateData);

                // Kiểm tra kết quả cập nhật và trả về thông báo
                return update > 0
                    ? new ReturnData { ReturnCode = 1, ReturnMessage = "Update user successful!" }
                    : new ReturnData { ReturnCode = -1, ReturnMessage = "Update user failed! Database error." };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
