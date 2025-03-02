using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;
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
        private readonly IValidator<QuizQuestion> validatorQuestion;
        private readonly IValidator<QuizAnswer> validatorAnswer;
        private readonly IQuizQuestionRepository quizQuestionRepository;
        private readonly IQuizAnswerRepository quizAnswerRepository;
        private readonly IMapper mapper;
        private readonly ICloudinaryService cloudinary;
        private readonly IUnitofWork _unitOfWork;

        public QuizQuestionService(IUnitofWork unitOfWork, IQuizQuestionRepository quizQuestionRepository,IQuizAnswerRepository quizAnswerRepository , IMapper mapper, IValidator<QuizQuestion> validatorQuestion, IValidator<QuizAnswer> validatorAnswer, ICloudinaryService cloudinary)
        {
            this._unitOfWork = unitOfWork;
            this.quizQuestionRepository = quizQuestionRepository;
            this.quizAnswerRepository = quizAnswerRepository;
            this.mapper = mapper;
            this.validatorQuestion = validatorQuestion;
            this.validatorAnswer = validatorAnswer;
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

        //public async Task<ReturnData> createQuizQuestion(CreateQuizQuestionVM quizQuestion)
        //{
        //    try
        //    {
        //        string image = await cloudinary.UploadImageAsync(quizQuestion.image, "QUIZ QUESTION");

        //        var data = new QuizQuestion
        //        {
        //            description = quizQuestion.description,
        //            image = image,
        //            quiz_id = ObjectId.Parse(quizQuestion.quiz_id),
        //            createAt = DateTime.Now,
        //        };

        //        var validate = await validator.ValidateAsync(data);
        //        if (!validate.IsValid)
        //        {
        //            var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();
        //            return new ReturnData
        //            {
        //                ReturnCode = -1,
        //                ReturnMessage = string.Join(", ", errorMess)
        //            };
        //        }
        //        else
        //        {
        //            var create = await quizQuestionRepository.createQuizQuestion(data);
        //            return new ReturnData
        //            {
        //                ReturnCode = 1,
        //                ReturnMessage = "Add successful!"
        //            };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //}

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


                var validate = await validatorQuestion.ValidateAsync(existingQuizQuestion);
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



        public async Task<ReturnData> Handle(CreateQuizQuestionWithAnswersCommand request)
        {
            await _unitOfWork.StartTransactionAsync();

            try
            {
                var session = _unitOfWork.GetSession();

                // Upload image và tạo QuizQuestion
                string image = await cloudinary.UploadImageAsync(request.QuizQuestion.image, "QUIZ QUESTION");

                var quizQuestion = new QuizQuestion
                {
                    description = request.QuizQuestion.description,
                    image = image,
                    quiz_id = ObjectId.Parse(request.QuizQuestion.quiz_id),
                    createAt = DateTime.Now,
                };

                // Validate QuizQuestion
                var questionValidation = await validatorQuestion.ValidateAsync(quizQuestion);
                if (!questionValidation.IsValid)
                {
                    var errors = questionValidation.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = string.Join(", ", errors) };
                }

                var createdQuestion = await quizQuestionRepository.createQuizQuestion(quizQuestion, session);


                // Kiểm tra danh sách QuizAnswers
                if (request.QuizAnswers == null || !request.QuizAnswers.Any())
                {
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "No QuizAnswers provided." };
                }

                // Giả định yêu cầu 4 câu trả lời
                if (request.QuizAnswers.Count != 4)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Exactly 4 answers are required." };
                }

                // Tạo danh sách QuizAnswers
                var quizAnswers = request.QuizAnswers.Select(a => new QuizAnswer
                {
                    description = a.description,
                    correct_answer = a.correct_answer,
                    question_id = createdQuestion.question_id,
                    createAt = DateTime.Now,
                }).ToList();

                // Kiểm tra logic correct_answer
                int trueCount = quizAnswers.Count(a => a.correct_answer == true);
                if (trueCount == 0) // Tất cả false
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be false." };
                }
                if (trueCount == 4) // Tất cả true
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be true." };
                }
                if (trueCount != 1) // Không có duy nhất 1 true
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Exactly one answer must be true." };
                }

                // Validate từng QuizAnswer
                foreach (var answer in quizAnswers)
                {
                    var answerValidation = await validatorAnswer.ValidateAsync(answer);
                    if (!answerValidation.IsValid)
                    {
                        var errors = answerValidation.Errors.Select(e => e.ErrorMessage).ToList();
                        return new ReturnData { ReturnCode = -1, ReturnMessage = string.Join(", ", errors) };
                    }
                }

                // Thêm QuizAnswers vào database
                foreach (var answer in quizAnswers)
                {
                    await quizAnswerRepository.createQuizAnswer(answer, session);
                }

                // Commit giao dịch
                await _unitOfWork.CommitTransactionAsync();
                return new ReturnData { ReturnCode = 1, ReturnMessage = "Created Question and Answers successfully!" };
            }
            catch (Exception ex)
            {
                await _unitOfWork.AbortTransactionAsync();
                return new ReturnData { ReturnCode = -1, ReturnMessage = $"Error: {ex.Message}" };
            }
            finally
            {
                _unitOfWork.DisposeTransaction();
            }
        }


    }
}
