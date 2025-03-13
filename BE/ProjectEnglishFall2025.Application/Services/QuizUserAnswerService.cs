using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class QuizUserAnswerService : IQuizUserAnswerService
    {
        private readonly IQuizUserAnswerRepository quizUserAnswerRepository;
        private readonly IMapper mapper;
        private readonly IValidator<QuizUserAnswer> validator;

        public QuizUserAnswerService(IQuizUserAnswerRepository quizUserAnswerRepository, IMapper mapper, IValidator<QuizUserAnswer> validator)
        {
            this.quizUserAnswerRepository = quizUserAnswerRepository;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<List<QuizUserAnswer>> getAllQuizUserAnswer()
        {
            var getAll = await quizUserAnswerRepository.getAllQuizUserAnswer();

            return getAll;
        }

        public async Task<QuizUserAnswer> getQuizUserAnswerById(deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var getId = await quizUserAnswerRepository.getIdQuizUserAnswer(quizUserAnswer);

                var map = mapper.Map<QuizUserAnswer>(getId);

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> addQuizUserAnswer(createQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = new QuizUserAnswer
                {
                    user_answers = quizUserAnswer.user_answers,
                    createAt = DateTime.Now,
                    UserID = ObjectId.Parse(quizUserAnswer.UserID),
                    quiz_id = ObjectId.Parse(quizUserAnswer.quiz_id),
                    question_id = ObjectId.Parse(quizUserAnswer.question_id),
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
                    var create = await quizUserAnswerRepository.addQuizUserAnswer(data);
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

        public async Task<ReturnData> updateQuizUserAnswer(updateQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                // Kiểm tra nếu quizUserAnswer_id không hợp lệ
                if (string.IsNullOrEmpty(quizUserAnswer.quizUserAnswer_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "QuizUserAnswer ID is required."
                    };
                }

                // Tạo object chỉ chứa các trường cần cập nhật
                var updateData = new QuizUserAnswer
                {
                    quizUserAnswer_id = ObjectId.Parse(quizUserAnswer.quizUserAnswer_id),
                    user_answers = quizUserAnswer.user_answers,
                    updateAt = DateTime.Now,
                    UserID = ObjectId.Parse(quizUserAnswer.UserID),
                    //quiz_id = ObjectId.Parse(quizUserAnswer.quiz_id),
                    //question_id = ObjectId.Parse(quizUserAnswer.question_id)
                };

                // Gửi dữ liệu cập nhật xuống Repository
                var updateResult = await quizUserAnswerRepository.updateQuizUserAnswer(updateData);

                // Kiểm tra kết quả cập nhật và trả về thông báo
                return updateResult > 0
                    ? new ReturnData { ReturnCode = 1, ReturnMessage = "Update successful!" }
                    : new ReturnData { ReturnCode = -1, ReturnMessage = "Update failed! Database error." };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<ReturnData> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var delete = await quizUserAnswerRepository.deleteQuizUserAnswer(quizUserAnswer);
                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! database error"
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
