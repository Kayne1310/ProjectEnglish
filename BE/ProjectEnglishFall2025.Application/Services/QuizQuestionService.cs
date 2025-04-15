using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
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

        public QuizQuestionService(IUnitofWork unitOfWork, IQuizQuestionRepository quizQuestionRepository, IQuizAnswerRepository quizAnswerRepository, IMapper mapper, IValidator<QuizQuestion> validatorQuestion, IValidator<QuizAnswer> validatorAnswer, ICloudinaryService cloudinary)
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

                var validate = await validatorQuestion.ValidateAsync(data);

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
                // Kiểm tra nếu question_id không hợp lệ
                if (string.IsNullOrEmpty(quizQuestion.question_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Question ID is required."
                    };
                }

                // Tạo object chỉ chứa các trường cần cập nhật
                var updateData = new QuizQuestion
                {
                    question_id = ObjectId.Parse(quizQuestion.question_id), // ID để xác định document
                    description = quizQuestion.description,
                    updateAt = DateTime.Now,
                    quiz_id = ObjectId.Parse(quizQuestion.quiz_id)
                };

                // Nếu có ảnh mới, upload lên Cloudinary và cập nhật image
                if (quizQuestion.image != null && quizQuestion.image.Length > 0)
                {
                    updateData.image = await cloudinary.UploadImageAsync(quizQuestion.image, "QUIZ QUESTION");
                }

                // Gửi dữ liệu cập nhật xuống Repository
                var update = await quizQuestionRepository.updateQuizQuestion(updateData);

                // Kiểm tra kết quả cập nhật và trả về thông báo
                return update > 0
                    ? new ReturnData { ReturnCode = 1, ReturnMessage = "Update successful!" }
                    : new ReturnData { ReturnCode = -1, ReturnMessage = "Update failed! Database error." };
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



                if (request.QuizAnswers == null || !request.QuizAnswers.Any())
                {
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "No QuizAnswers provided." };
                }
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

              
                int trueCount = quizAnswers.Count(a => a.correct_answer == true);
                if (trueCount == 0) 
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be false." };
                }
                if (trueCount == 4) 
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be true." };
                }
                if (trueCount != 1) 
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


        public async Task<ReturnData> HandleUpdate(UpdateQuizQuestionWithAnswerCommand request)
        {
            await _unitOfWork.StartTransactionAsync();

            try
            {
                var session = _unitOfWork.GetSession();

                // Tạo DeleteQuizQuestionVM để tìm QuizQuestion
                var findQuestionById = new DeleteQuizQuestionVM { question_id = request.QuizQuestion.question_id };

                // Tìm QuizQuestion cần cập nhật
                var existingQuestion = await quizQuestionRepository.getQuizQuestionById(findQuestionById, session);
                if (existingQuestion == null)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Question not found." };
                }

                // Cập nhật image nếu có
                string image = existingQuestion.image;
                if (request.QuizQuestion.image != null && request.QuizQuestion.image.Length > 0)
                {
                    image = await cloudinary.UploadImageAsync(request.QuizQuestion.image, "QUIZ QUESTION");
                }

                // Cập nhật thông tin QuizQuestion
                var updatedQuestion = new QuizQuestion
                {
                    question_id = ObjectId.Parse(request.QuizQuestion.question_id),
                    description = request.QuizQuestion.description ?? existingQuestion.description,
                    image = image,
                    //quiz_id = existingQuestion.quiz_id, // Giữ nguyên quiz_id
                    quiz_id = ObjectId.Parse(request.QuizQuestion.quiz_id),
                    createAt = existingQuestion.createAt, // Giữ nguyên createAt
                    updateAt = DateTime.Now
                };

                // Validate QuizQuestion
                var questionValidation = await validatorQuestion.ValidateAsync(updatedQuestion);
                if (!questionValidation.IsValid)
                {
                    var errors = questionValidation.Errors.Select(e => e.ErrorMessage).ToList();
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = string.Join(", ", errors) };
                }

                // Cập nhật QuizQuestion
                await quizQuestionRepository.updateQuizQuestion(updatedQuestion, session);

                // Kiểm tra danh sách QuizAnswers
                if (request.QuizAnswers == null || !request.QuizAnswers.Any())
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "No QuizAnswers provided." };
                }

                // Giả định yêu cầu 4 câu trả lời
                if (request.QuizAnswers.Count != 4)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Exactly 4 answers are required." };
                }

                // Tạo danh sách QuizAnswers để cập nhật
                var quizAnswers = new List<QuizAnswer>();
                foreach (var a in request.QuizAnswers)
                {
                    var quizAnswer = new QuizAnswer
                    {
                        quizAnswer_id = string.IsNullOrEmpty(a.quizAnswer_id) ? ObjectId.GenerateNewId() : ObjectId.Parse(a.quizAnswer_id),
                        description = a.description,
                        correct_answer = a.correct_answer ?? false, // Gán mặc định nếu null
                        question_id = updatedQuestion.question_id,
                        updateAt = DateTime.Now
                    };

                    // Nếu là answer hiện có, lấy createAt từ database
                    if (!string.IsNullOrEmpty(a.quizAnswer_id))
                    {
                        var existingAnswer = await quizAnswerRepository.findQuizAnswerById(
                            new DeleteAnswerQuestionVM { quizAnswer_id = a.quizAnswer_id },
                            session
                        );
                        quizAnswer.createAt = existingAnswer?.createAt ?? DateTime.Now;
                    }
                    else
                    {
                        quizAnswer.createAt = DateTime.Now;
                    }

                    quizAnswers.Add(quizAnswer);
                }

                // Kiểm tra logic correct_answer
                int trueCount = quizAnswers.Count(a => a.correct_answer == true);
                if (trueCount == 0)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be false." };
                }
                if (trueCount == 4)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "All answers cannot be true." };
                }
                if (trueCount != 1)
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
                        await _unitOfWork.AbortTransactionAsync();
                        return new ReturnData { ReturnCode = -1, ReturnMessage = string.Join(", ", errors) };
                    }
                }

                // Xóa các answer cũ và thêm các answer mới
                foreach (var existingAnswer in await quizAnswerRepository.getAllQuizAnswer()) // Giả sử có phương thức này
                {
                    if (existingAnswer.question_id == updatedQuestion.question_id)
                    {
                        await quizAnswerRepository.deleteQuizAnswer(
                            new DeleteAnswerQuestionVM { quizAnswer_id = existingAnswer.quizAnswer_id.ToString() },
                            session
                        );
                    }
                }

                foreach (var answer in quizAnswers)
                {
                    await quizAnswerRepository.createQuizAnswer(answer, session);
                }

                // Commit giao dịch
                await _unitOfWork.CommitTransactionAsync();
                return new ReturnData { ReturnCode = 1, ReturnMessage = "Updated Question and Answers successfully!" };
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

        public async Task<ReturnData> HandleDelete(DeleteQuizQuestionVM request)
        {
            await _unitOfWork.StartTransactionAsync();

            try
            {
                var session = _unitOfWork.GetSession();

                // Tạo DeleteQuizQuestionVM để kiểm tra và xóa QuizQuestion
                var findQuestionbyID = new DeleteQuizQuestionVM { question_id = request.question_id };

                // Kiểm tra xem QuizQuestion có tồn tại không
                var existingQuestion = await quizQuestionRepository.getQuizQuestionById(findQuestionbyID, session);
                if (existingQuestion == null)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Question not found." };
                }

                // Xóa tất cả QuizAnswers liên quan đến question_id
                var answersDeleted = await quizAnswerRepository.DeleteByQuestionIdAsync(existingQuestion.question_id, session);

                // Xóa QuizQuestion
                var questionDeleted = await quizQuestionRepository.deleteQuizQuestion(findQuestionbyID, session);
                if (questionDeleted == 0)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Failed to delete QuizQuestion." };
                }

                // Commit giao dịch
                await _unitOfWork.CommitTransactionAsync();
                return new ReturnData { ReturnCode = 1, ReturnMessage = "Deleted Question and Answers successfully!" };
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
