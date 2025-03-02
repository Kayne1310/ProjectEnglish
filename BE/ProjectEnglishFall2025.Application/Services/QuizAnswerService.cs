﻿using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class QuizAnswerService : IQuizAnswerService
    {
        private readonly IQuizAnswerRepository answerRepository;
        private readonly IValidator<QuizAnswer> validator;
        private readonly IMapper mapper;

        public QuizAnswerService(IQuizAnswerRepository answerRepository, IValidator<QuizAnswer> validator, IMapper mapper)
        {
            this.answerRepository = answerRepository;
            this.validator = validator;
            this.mapper = mapper;
        }

        public async Task<List<QuizAnswer>> getAllQuizAnswer()
        {
            var getAll = await answerRepository.getAllQuizAnswer();

            return getAll;
        }

        public async Task<QuizAnswer> getIdQuizAnswer(DeleteAnswerQuestionVM answerQuestionVM)
        {
            var getId = await answerRepository.findQuizAnswerById(answerQuestionVM);

            var getIdMap = mapper.Map<QuizAnswer>(getId);

            return getIdMap;
        }

        public async Task<ReturnData> addQuizAnswer(CreateAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var newData = new QuizAnswer
                {
                    correct_answer = answerQuestionVM.correct_answer,
                    description = answerQuestionVM.desciption,
                    createAt = DateTime.Now,
                    question_id = ObjectId.Parse(answerQuestionVM.question_id),
                };

                // validate data
                var validatedata = await validator.ValidateAsync(newData);

                if (!validatedata.IsValid)
                {
                    var errorMessages = validatedata.Errors.Select(e => e.ErrorMessage).ToList();

                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMessages)
                    };
                }

                var res = await answerRepository.createQuizAnswer(newData);

                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Create QuizAnswer Successful!"
                };

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<ReturnData> updateQuizAnswer(UpdateAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var quizAnswerData = new DeleteAnswerQuestionVM
                {
                    quizAnswer_id = answerQuestionVM.quizAnswer_id
                };

                var existingQuizAnswer = await answerRepository.findQuizAnswerById(quizAnswerData);
                if (existingQuizAnswer == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! quizAnswer_id is not found"
                    };
                }
                else
                {
                    existingQuizAnswer.description = answerQuestionVM.desciption;
                    existingQuizAnswer.correct_answer = answerQuestionVM.correct_answer;
                    existingQuizAnswer.updateAt = DateTime.Now;
                }


                var validateData = await validator.ValidateAsync(existingQuizAnswer);
                if (!validateData.IsValid)
                {
                    var errorMessage = validateData.Errors.Select(e => e.ErrorMessage).ToList();

                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMessage)
                    };
                }
                else
                {
                    var updateRepo = await answerRepository.updateQuizAnswer(existingQuizAnswer);

                    if (updateRepo <= 0)
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
                            ReturnMessage = "Update quizAnswer successful!"
                        };
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var deleteRepo = await answerRepository.deleteQuizAnswer(answerQuestionVM);

                if (deleteRepo <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! Cannot find idQuizAnswer"
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
    }

}
