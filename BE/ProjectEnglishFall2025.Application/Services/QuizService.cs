
using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using Org.BouncyCastle.Asn1.Ocsp;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Common.ImgCountry;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Domain.ViewModel.ViewModel_SubmitQuiz;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;


namespace ProjectFall2025.Application.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository quizRepository;
        private readonly IMapper mapper;
        private readonly IValidator<Quiz> validator;
        private readonly ICloudinaryService cloudinary;
        private readonly IUnitofWork _unitOfWork;
        private readonly IQuizQuestionRepository quizQuestionRepository;
        private readonly IQuizAnswerRepository quizAnswerRepository;
        private readonly IQuizUserAnswerRepository userAnswerRepository;
        private readonly IHistoryRepository historyRepository;
        private readonly IValidator<QuizQuestion> validatorQuestion;
        private readonly IValidator<QuizAnswer> validatorAnswer;

        public QuizService(
            IQuizRepository quizRepository,
            IMapper mapper,
            ICloudinaryService cloudinary,
            IUnitofWork unitOfWork,
            IQuizQuestionRepository quizQuestionRepository,
            IQuizAnswerRepository quizAnswerRepository,
            IQuizUserAnswerRepository userAnswerRepository,
            IHistoryRepository historyRepository,
            IValidator<QuizQuestion> validatorQuestion,
            IValidator<QuizAnswer> validatorAnswer,
            IValidator<Quiz> validator)
        {
            this.quizRepository = quizRepository;
            this.mapper = mapper;
            this.cloudinary = cloudinary;
            this._unitOfWork = unitOfWork;
            this.quizQuestionRepository = quizQuestionRepository;
            this.quizAnswerRepository = quizAnswerRepository;
            this.userAnswerRepository = userAnswerRepository;
            this.historyRepository = historyRepository;
            this.validator = validator;
            this.validatorQuestion = validatorQuestion;
            this.validatorAnswer = validatorAnswer;
        }

        public async Task<List<QuizDto>> GetAllQuizs()
        {
            try
            {
                var getAll = await quizRepository.GetAllQuizs();
                var list = new List<QuizDto>();

                foreach (var item in getAll)
                {
                    //map do to dto
                    var dto = mapper.Map<QuizDto>(item);
                    list.Add(dto);
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Quiz> GetIdQuiz(DeleteQuizVM quiz)
        {
            try
            {
                var getName = await quizRepository.GetQuizById(quiz);

                var getNameMap = mapper.Map<Quiz>(getName);

                return getNameMap;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> AddQuiz(CreateQuizVM quiz)
        {
            try
            {
                // Upload ảnh quiz lên Cloudinary
                string image = await cloudinary.UploadImageAsync(quiz.image, "QUIZ");

                // Validate country name và lấy ảnh quốc gia
                string countryImg;
                try
                {
                    countryImg = Country.GetImageCountry(quiz.countryName);
                }
                catch (ArgumentException ex)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = $"Error: {ex.Message}"
                    };
                }
                catch (KeyNotFoundException)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Invalid country name. Please enter in the following format: Vietnam, UK, Japan, Korea, China."
                    };
                }

                var data = new Quiz
                {
                    name = quiz.name,
                    description = quiz.description,
                    image = image,
                    difficulty = quiz.difficulty,
                    countryName = quiz.countryName,
                    countryImg = countryImg,
                    createAt = DateTime.Now
                };

                // Validate dữ liệu đầu vào
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

                // Thêm vào database
                var addQuiz = await quizRepository.AddQuiz(data);
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


        public async Task<ReturnData> UpdateQuiz(UpdateQuizVM quiz)
        {
            try
            {
                // Kiểm tra nếu quiz_id không hợp lệ
                if (string.IsNullOrEmpty(quiz.quiz_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Quiz ID is required."
                    };
                }

                // Tạo object chứa các trường cần cập nhật
                var updateData = new Quiz
                {
                    quiz_id = ObjectId.Parse(quiz.quiz_id), // Chuyển đổi string sang ObjectId
                    name = quiz.name,
                    description = quiz.description,
                    difficulty = quiz.difficulty,
                    updateAt = DateTime.Now // Ghi nhận thời gian cập nhật
                };

                // Nếu có ảnh mới, upload lên Cloudinary và cập nhật image
                if (quiz.image != null && quiz.image.Length > 0)
                {
                    updateData.image = await cloudinary.UploadImageAsync(quiz.image, "QUIZ");
                }

                // Nếu có countryName, cập nhật countryImg tương ứng
                if (!string.IsNullOrEmpty(quiz.countryName))
                {
                    try
                    {
                        updateData.countryName = quiz.countryName;
                        updateData.countryImg = Country.GetImageCountry(quiz.countryName);
                    }
                    catch (ArgumentException ex)
                    {
                        return new ReturnData { ReturnCode = -1, ReturnMessage = $"Error: {ex.Message}" };
                    }
                    catch (KeyNotFoundException)
                    {
                        return new ReturnData
                        {
                            ReturnCode = -1,
                            ReturnMessage = "Invalid country name. Please enter in the following format: Vietnam, UK, Japan, Korea, China."
                        };
                    }
                }

                // Gửi dữ liệu cập nhật xuống Repository
                var update = await quizRepository.UpdateQuiz(updateData);

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


        public async Task<ReturnData> DeleteQuiz(DeleteQuizVM quiz)
        {
            try
            {
                var delete = await quizRepository.DeleteQuiz(quiz);

                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! quizId is not exist"
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


        public async Task<ReturnData> HandleDelete(DeleteQuizVM request)
        {
            await _unitOfWork.StartTransactionAsync();

            try
            {
                var session = _unitOfWork.GetSession();

                // Kiểm tra xem Quiz có tồn tại không
                var existingQuiz = await quizRepository.GetQuizById(request, session);
                if (existingQuiz == null)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Quiz not found." };
                }

                // Lấy tất cả QuizQuestion liên quan đến quiz_id qua repository
                var questions = await quizQuestionRepository.getAllQuizQuestion()
                    .ContinueWith(task => task.Result.Where(q => q.quiz_id == existingQuiz.quiz_id).ToList());

                // Xóa tất cả QuizAnswer liên quan đến các QuizQuestion
                foreach (var question in questions)
                {
                    var answersDeleted = await quizAnswerRepository.DeleteByQuestionIdAsync(question.question_id, session);
                    if (answersDeleted == 0)
                    {
                        // Không có answer nào bị xóa, có thể ghi log nếu cần
                    }
                }

                // Xóa tất cả QuizQuestion liên quan đến quiz_id
                var questionsDeleted = await quizQuestionRepository.DeleteByQuizIdAsync(existingQuiz.quiz_id, session);
                if (questionsDeleted == 0 && questions.Any())
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Failed to delete QuizQuestions." };
                }

                // Xóa Quiz
                var quizDeleted = await quizRepository.DeleteQuiz(request, session);
                if (quizDeleted == 0)
                {
                    await _unitOfWork.AbortTransactionAsync();
                    return new ReturnData { ReturnCode = -1, ReturnMessage = "Failed to delete Quiz." };
                }

                // Commit giao dịch
                await _unitOfWork.CommitTransactionAsync();
                return new ReturnData { ReturnCode = 1, ReturnMessage = "Deleted Quiz, Questions, and Answers successfully!" };
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


        public async Task<List<QuizzAndQuestionVM>> getCountQuestionInQuiz()
        {
            try
            {
                var bsonList = await quizRepository.getCountQuestionbyQuiz();

                var res = bsonList.Select(q => new QuizzAndQuestionVM
                {
                    quiz_id = q["_id"].ToString(),
                    name = q["name"].ToString(),
                    countQuestion = q.Contains("countQuestion") && q["countQuestion"].BsonType == BsonType.Int32
                            ? q["countQuestion"].AsInt32
                            : 0,  //  Chuyển đổi sau khi lấy dữ liệu
                    image = q["image"].ToString(),
                    description = q["description"].ToString(),
                    difficulty = q["" +
                    "difficulty"].ToString(),
                    createAt= q["createAt"].ToString(),

                }).ToList();

                return res;
            }
            catch (Exception ex)
            {

                throw new NotImplementedException();
            }
        }

        public async Task<List<QuestionAndAnswerVM>> GetQuestionsAndAnswersByQuizIdAsync(string id)
        {
            ObjectId Quizid = ObjectId.Parse(id);
            var data = await quizRepository.GetQuestionByQuizId(Quizid);
            return data
             .Where(doc => doc.Contains("QuestionInfor") && doc["QuestionInfor"].BsonType == BsonType.Array)
             .SelectMany(doc => doc["QuestionInfor"].AsBsonArray.Select(q => new QuestionAndAnswerVM
             {
                 question_id = q["_id"].ToString(),
                 description = q["description"].ToString(),
                 image = q["image"].ToString(),
                 quiz_id = doc["_id"].ToString(),

                 // Thông tin Quiz
                 QuizInforVM = new QuizInforVM
                 {
                     name = doc.Contains("name") ? doc["name"].ToString() : null,
                     description = doc.Contains("description") ? doc["description"].AsString : null,
                     image = doc.Contains("image") ? doc["image"].ToString() : null,
                     difficulty = doc.Contains("difficulty") ? doc["difficulty"].AsString : null
                 },

                 // Lấy tất cả câu trả lời của câu hỏi
                 answers = q["QuestionAnswer"].BsonType == BsonType.Array
                     ? q["QuestionAnswer"].AsBsonArray.Select(a => new AnswerVM
                     {
                         idAnswered = a["_id"].ToString(),
                         description = a["description"].ToString(),
                         correct_answer = a["correct_answer"].ToBoolean(),
                     }).ToList()
                     : new List<AnswerVM>()
             })).ToList();
        }

		public async Task<SubmitQuizResponse> SubmitQuizAsync(SubmitQuizRequest request, string userId)
		{
			try
			{
				if (request == null)
					throw new ArgumentException("Request body is null.");
				if (string.IsNullOrEmpty(request.QuizId))
					throw new ArgumentException("QuizId is null or empty.");

				var quizQuestions = await GetQuestionsAndAnswersByQuizIdAsync(request.QuizId);
				if (!quizQuestions.Any()) throw new Exception($"No questions found for QuizId: {request.QuizId}");

				var response = new SubmitQuizResponse
				{
					QuizId = request.QuizId,
					QuizTitle = quizQuestions.FirstOrDefault()?.QuizInforVM?.name ?? "No tital available",
					QuizDescription = quizQuestions.FirstOrDefault()?.QuizInforVM?.description ?? "No description available",
					CountTotal = quizQuestions.Count,
					CountCorrect = 0
				};

				if (request.Answers == null || !request.Answers.Any())
				{
					return response;
				}

				var userAnswersToSave = new List<QuizUserAnswer>();

				foreach (var userAnswer in request.Answers)
				{
					if (userAnswer == null || string.IsNullOrEmpty(userAnswer.QuestionId) || string.IsNullOrEmpty(userAnswer.UserAnswerId))
						continue;

					var question = quizQuestions.FirstOrDefault(q => q.question_id == userAnswer.QuestionId);
					if (question == null) continue;

					var correctAnswerId = question.answers.FirstOrDefault(a => a.correct_answer)?.idAnswered;
					if (correctAnswerId == null) continue;

					var userAnswerDescription = question.answers.FirstOrDefault(a => a.idAnswered == userAnswer.UserAnswerId)?.description ?? "Unknown";
					bool isCorrect = userAnswer.UserAnswerId == correctAnswerId;
					if (isCorrect) response.CountCorrect++;

					response.QuizData.Add(new QuizResult
					{
						QuestionId = userAnswer.QuestionId,
						QuestionDescription = question.description,
						IsCorrect = isCorrect,
						UserAnswerId = userAnswer.UserAnswerId,
						UserAnswerDescription = userAnswerDescription,
						SystemAnswers = question.answers.Select(a => new AnswerDto
						{
							Id = a.idAnswered,
							Description = a.description,
							CorrectAnswer = a.correct_answer
						}).ToList()
					});

					userAnswersToSave.Add(new QuizUserAnswer
					{
						quizUserAnswer_id = ObjectId.GenerateNewId(),
						user_answers = new ObjectId( userAnswer.UserAnswerId),
						createAt = DateTime.UtcNow,
						updateAt = DateTime.UtcNow,
						UserID = new ObjectId(userId),
						quiz_id = new ObjectId(request.QuizId),
						question_id = new ObjectId(userAnswer.QuestionId)
					});
				}

				var history = new History
				{
					history_id = ObjectId.GenerateNewId(),
					total_questions = response.CountTotal.ToString(),
					total_corrects = response.CountCorrect.ToString(),
					createAt = DateTime.UtcNow,
					updateAt = DateTime.UtcNow,
					UserID = new ObjectId(userId),
					quiz_id = new ObjectId(request.QuizId)
				};

				await userAnswerRepository.InsertManyAsync(userAnswersToSave);
				await historyRepository.InsertAsync(history);

				return response;
			}
			catch (FormatException ex)
			{
				throw new ArgumentException($"Invalid ID format: {ex.Message}", ex);
			}
			catch (MongoException ex)
			{
				throw new Exception($"Database error: {ex.Message}", ex);
			}
			catch (ArgumentException ex)
			{
				throw; // Ném lại ArgumentException đã được định nghĩa
			}
			catch (Exception ex)
			{
				throw new Exception($"An unexpected error occurred: {ex.Message}", ex);
			}
		}
	}
}
