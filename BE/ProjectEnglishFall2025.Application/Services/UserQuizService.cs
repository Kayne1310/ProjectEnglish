﻿using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class UserQuizService : IUserQuizService
    {
        private readonly IUserQuizRepository userQuizRepository;
        private readonly IMapper mapper;
        private readonly IValidator<UserQuiz> validator;

        public UserQuizService(IUserQuizRepository userQuizRepository, IMapper mapper, IValidator<UserQuiz> validator)
        {
            this.userQuizRepository = userQuizRepository;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<List<UserQuiz>> getAllUserQuiz()
        {

            var getAll = await userQuizRepository.getAllUserQuiz();

            return getAll;

        }

        public async Task<UserQuiz> getIdUserQuiz(DeleteUserQuizVM userQuiz)
        {
            try
            {
                var getId = await userQuizRepository.getIdUserQuiz(userQuiz);

                var map = mapper.Map<UserQuiz>(getId);

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> addUserQuiz(CreateUserQuizVM userQuizVM)
        {
            try
            {
                if (userQuizVM == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = ("is_finish is not null")
                    };
                }

                var data = new UserQuiz
                {
                    is_finish = userQuizVM.is_finish,
                    time_start = FormatTime(userQuizVM.time_start),
                    time_end = FormatTime(userQuizVM.time_end),
                    createAt = DateTime.Now,
                    quiz_id = ObjectId.Parse(userQuizVM.quiz_id)
                };

                var validate = await validator.ValidateAsync(data);
                if (!validate.IsValid)
                {
                    var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();

                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }

                var add = await userQuizRepository.addUserQuiz(data);
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Add successful!"
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> updateUserQuiz(UpdateUserQuizVM userQuizVM)
        {
            try
            {
                if (userQuizVM == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = ("is_finish is not null")
                    };
                }

                var data = new DeleteUserQuizVM
                {
                    userQuiz_id = userQuizVM.userQuiz_id,
                };

                var existingUserQuiz = await userQuizRepository.getIdUserQuiz(data);
                if (existingUserQuiz == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! userQuiz_id not found"
                    };
                }
                else
                {
                    existingUserQuiz.is_finish = userQuizVM.is_finish;
                    existingUserQuiz.time_start = FormatTime(userQuizVM.time_start);
                    existingUserQuiz.time_end = FormatTime(userQuizVM.time_end);
                    existingUserQuiz.updateAt = DateTime.Now;
                    existingUserQuiz.quiz_id = ObjectId.Parse(userQuizVM.quiz_id);
                }

                var validate = await validator.ValidateAsync(existingUserQuiz);
                if (!validate.IsValid)
                {
                    var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                else
                {
                    var update = await userQuizRepository.updateUserQuiz(existingUserQuiz);
                    if (update <= 0)
                    {
                        return new ReturnData
                        {
                            ReturnCode = -1,
                            ReturnMessage = "Update failed! database error"
                        };
                    }
                    else
                    {
                        return new ReturnData
                        {
                            ReturnCode = 1,
                            ReturnMessage = "Update successful!"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> deleteUserQuiz(DeleteUserQuizVM userQuizVM)
        {
            try
            {
                var delete = await userQuizRepository.deleteUserQuiz(userQuizVM);
                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! idUserQuiz is not found"
                    };
                }
                else
                {
                    return new ReturnData
                    {
                        ReturnCode = 1,
                        ReturnMessage = "Delete successful!"
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Hàm ép kiểu và kiểm tra định dạng
        private string FormatTime(string time)
        {
            if (TimeOnly.TryParseExact(time, "HH:mm:ss", out TimeOnly parsedTime))
            {
                return parsedTime.ToString("HH:mm:ss");
            }
            throw new ArgumentException("Invalid time format, required HH:mm:ss");
        }
    }
}
