using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class QuizQuestionService : IQuizQuestionService
    {
        private readonly IQuizQuestionRepository quizQuestionRepository;
        private readonly IMapper mapper;
        private readonly IValidator<QuizQuestion> validator;
        private readonly ICloudinaryService cloudinary;

        public QuizQuestionService(IQuizQuestionRepository quizQuestionRepository, IMapper mapper, IValidator<QuizQuestion> validator, ICloudinaryService cloudinary)
        {
            this.quizQuestionRepository = quizQuestionRepository;
            this.mapper = mapper;
            this.validator = validator;
            this.cloudinary = cloudinary;
        }
        public async Task<List<QuizQuestion>> getAllQuizQuestion()
        {
            var getAll = await quizQuestionRepository.getAllQuizQuestion();

            return getAll;
        }

        public async Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion)
        {
            try
            {
                var getId = await quizQuestionRepository.getQuizQuestionById(quizQuestion);

                var map = mapper.Map<QuizQuestion>(getId);

                return map;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> createQuizQuestion(CreateQuizQuestionVM quizQuestion)
        {
            try
            {
                string image = await cloudinary.UploadImageAsync(quizQuestion.image, "QUIZ QUESTION");

                var data = new QuizQuestion
                {
                    description = quizQuestion.description,
                    image = image,
                    quiz_id = ObjectId.Parse(quizQuestion.quiz_id),
                    createAt = DateTime.Now,
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
                else
                {
                    var create = await quizQuestionRepository.createQuizQuestion(data);
                    return new ReturnData
                    {
                        ReturnCode = 1,
                        ReturnMessage = "Add successful!"
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> updateQuizQuestion(UpdateQuizQuestionVM quizQuestion)
        {
            try
            {
                var data = new DeleteQuizQuestionVM
                {
                    question_id = quizQuestion.question_id,           
                };

                var existingQuizQuestion = await quizQuestionRepository.getQuizQuestionById(data);
                if(existingQuizQuestion == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! question_id is not found"
                    };
                }
                else
                {
                    string image = await cloudinary.UploadImageAsync(quizQuestion.image, "QUIZ QUESTION");

                    existingQuizQuestion.description = quizQuestion.description;
                    existingQuizQuestion.image = image;
                }


                var validate = await validator.ValidateAsync(existingQuizQuestion);
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
                    var update = await quizQuestionRepository.updateQuizQuestion(existingQuizQuestion);
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

        public Task<ReturnData> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion)
        {
            try
            {
                var delete = quizQuestionRepository.deleteQuizQuestion(quizQuestion);
                if (delete.Result <= 0)
                {
                    return Task.FromResult(new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! idQuizQuestion is not found."
                    });
                }
                else
                {
                    return Task.FromResult(new ReturnData
                    {
                        ReturnCode = 1,
                        ReturnMessage = "Delete successful!"
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
