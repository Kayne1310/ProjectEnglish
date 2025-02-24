using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Common.ImgCountry;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Infrastructure.Repositories.IRepo;


namespace ProjectFall2025.Application.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository quizRepository;
        private readonly IMapper mapper;
        private readonly IValidator<Quiz> validator;
        private readonly ICloudinaryService cloudinary;

        public QuizService(IQuizRepository quizRepository, IMapper mapper, IValidator<Quiz> validator, ICloudinaryService cloudinary)
        {
            this.quizRepository = quizRepository;
            this.mapper = mapper;
            this.validator = validator;
            this.cloudinary = cloudinary;
       
        }

        public async Task<List<Quiz>> GetAllQuizs()
        {

            var getAll = await quizRepository.GetAllQuizs();

            return getAll;
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
                    difficutly = quiz.difficutly,
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
                // Kiểm tra xem quiz có tồn tại không
                var existingQuiz = await quizRepository.GetQuizById(new DeleteQuizVM { quiz_id = quiz.quiz_id });
                if (existingQuiz == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! Quiz not found."
                    };
                }

                // Nếu có ảnh mới, upload lên Cloudinary
                if (quiz.image != null && quiz.image.Length > 0)
                {
                    existingQuiz.image = await cloudinary.UploadImageAsync(quiz.image, "QUIZ");
                }

                // Validate country name và cập nhật ảnh quốc gia
                if (!string.IsNullOrEmpty(quiz.countryName) && quiz.countryName != existingQuiz.countryName)
                {
                    try
                    {
                        existingQuiz.countryName = quiz.countryName;
                        existingQuiz.countryImg = Country.GetImageCountry(quiz.countryName);
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
                }

                // Cập nhật các thông tin khác
                existingQuiz.name = quiz.name;
                existingQuiz.description = quiz.description;
                existingQuiz.difficutly = quiz.difficutly;
                existingQuiz.updateAt = DateTime.Now;

                // Validate dữ liệu đầu vào
                var validate = await validator.ValidateAsync(existingQuiz);
                if (!validate.IsValid)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", validate.Errors.Select(e => e.ErrorMessage))
                    };
                }

                // Cập nhật vào database
                var update = await quizRepository.UpdateQuiz(existingQuiz);
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
    }
}
