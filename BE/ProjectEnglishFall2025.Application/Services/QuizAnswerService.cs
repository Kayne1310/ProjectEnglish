using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using MongoDB.Bson;
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
                    description = answerQuestionVM.description,
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
                // Kiểm tra nếu quizAnswer_id không hợp lệ
                if (string.IsNullOrEmpty(answerQuestionVM.quizAnswer_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Quiz Answer ID is required."
                    };
                }

                // Tạo object chỉ chứa các trường cần cập nhật
                var updateData = new QuizAnswer
                {
                    quizAnswer_id = ObjectId.Parse(answerQuestionVM.quizAnswer_id),
                    description = answerQuestionVM.description,
                    correct_answer = answerQuestionVM.correct_answer,
                    updateAt = DateTime.Now
                };

                // Gửi dữ liệu cập nhật xuống Repository
                var updateRepo = await answerRepository.updateQuizAnswer(updateData);

                // Kiểm tra kết quả cập nhật và trả về thông báo
                return updateRepo > 0
                    ? new ReturnData { ReturnCode = 1, ReturnMessage = "Update quizAnswer successful!" }
                    : new ReturnData { ReturnCode = -1, ReturnMessage = "Update failed! Database error." };
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

        public async Task<List<QuizAnswerDto>> GetCorrectQuizAnswersAsync(DeleteQuizVM quizId)
        {
            var bsonResults = await answerRepository.GetCorrectQuizAnswersAsync(quizId);

            return bsonResults.Select(bson => new QuizAnswerDto
            {
                quizAnswer_id = bson["_id"].ToString(),
                description = bson["description"].AsString,
                correctAnswer = bson["correct_answer"].AsBoolean,
                questionInfo = new List<QuizQuestionDto>
                {
                    new QuizQuestionDto
                    {
                        question_id = bson["question_info"]["_id"].ToString(),
                        description = bson["question_info"]["description"].AsString,
                        quizInfo = new List<QuizDto>
                        {
                            new QuizDto
                            {
                                quiz_id = bson["question_info"]["quiz_info"]["_id"].ToString(),
                                name = bson["question_info"]["quiz_info"]["name"].AsString,
                                description = bson["question_info"]["quiz_info"]["description"].AsString,
                                image = bson["question_info"]["quiz_info"]["image"].AsString,
                                difficulty = bson["question_info"]["quiz_info"]["difficutlty"].AsString,
                                countryName = bson["question_info"]["quiz_info"]["countryName"].AsString,
                                countryImg = bson["question_info"]["quiz_info"]["countryImg"].AsString
                            }
                        }
                    }
                }
            }).ToList();
        }
    }
}


