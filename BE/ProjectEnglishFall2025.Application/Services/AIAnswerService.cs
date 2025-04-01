using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class AIAnswerService : IAIAnswerService
    {
        private readonly IAIAnswerRepository aIAnswerRepository;
        private readonly IMapper mapper;
        private readonly IValidator<AIAnswer> validator;

        public AIAnswerService(IAIAnswerRepository aIAnswerRepository, IMapper mapper, IValidator<AIAnswer> validator)
        {
            this.aIAnswerRepository = aIAnswerRepository;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<List<AIAnswer>> getAllAIAnswer()
        {
            var getAll = await aIAnswerRepository.getAllAIAnswer();

            return getAll;
        }

        public async Task<AIAnswer> getAIAnswerById(deleteAIAnswerVM aIAnswer)
        {
            try
            {
                var getId = await aIAnswerRepository.getIdAIAnswer(aIAnswer);

                var map = mapper.Map<AIAnswer>(getId);

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> addAIAnswer(createAIAnswerVM aIAnswer)
        {
            try
            {
                var data = new AIAnswer
                {
                    responseAI = aIAnswer.responseAI,
                    generatedAt = DateTime.Now,
                    question_id = ObjectId.Parse(aIAnswer.question_id)
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
                    var create = await aIAnswerRepository.addAIAnswer(data);
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

        public async Task<ReturnData> updateAIAnswer(updateAIAnswerVM aIAnswer)
        {
            try
            {
                // Kiểm tra nếu aiAnswer_id không hợp lệ
                if (string.IsNullOrEmpty(aIAnswer.aiAnswer_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "AI Answer ID is required."
                    };
                }

                // Tạo object chỉ chứa các trường cần cập nhật
                var updateData = new AIAnswer
                {
                    aiAnswer_id = ObjectId.Parse(aIAnswer.aiAnswer_id),
                    responseAI = aIAnswer.responseAI,
                    generatedAt = DateTime.Now,
                    //question_id = ObjectId.Parse(aIAnswer.question_id)
                };

                // Gửi dữ liệu cập nhật xuống Repository
                var updateResult = await aIAnswerRepository.updateAIAnswer(updateData);

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


        public async Task<ReturnData> deleteAIAnswer(deleteAIAnswerVM aIAnswer)
        {
            try
            {
                var delete = await aIAnswerRepository.deleteAIAnswer(aIAnswer);
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
