using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class HistoryService : IHistoryService
    {
        private readonly IHistoryRepository historyRepository;
        private readonly IMapper mapper;
        private readonly IValidator<History> validator;

        public HistoryService(IHistoryRepository historyRepository, IMapper mapper, IValidator<History> validator)
        {
            this.historyRepository = historyRepository;
            this.mapper = mapper;
            this.validator = validator;
        }



        public async Task<List<HistoryDTO>> getAllHistory()
        {

            try
            {
                var getAll = await historyRepository.getAllHistory();
                var list = new List<HistoryDTO>();

                foreach (var item in getAll)
                {
                    //map do to dto
                    var dto = mapper.Map<HistoryDTO>(item);
                    list.Add(dto);
                }
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<History> getHistoryById(deleteHistoryVM history)
        {
            try
            {
                var data = await historyRepository.getHistoryById(history);

                var getIdMap = mapper.Map<History>(data);

                return getIdMap;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> addHistory(createHistoryVM history)
        {
            try
            {
                var data = new History
                {
                    total_questions = history.total_questions,
                    total_corrects = history.total_corrects,
                    UserID = ObjectId.Parse(history.UserID),
                    quiz_id = ObjectId.Parse(history.quiz_id),
                    createAt = DateTime.Now,
                };

                var validate = validator.Validate(data);
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
                    var addHistory = await historyRepository.addHistory(data);
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

        public async Task<ReturnData> updateHistory(updateHistoryVM history)
        {
            try
            {
                // Kiểm tra nếu history_id không hợp lệ
                if (string.IsNullOrEmpty(history.history_id))
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "History ID is required."
                    };
                }

                // Tạo object chỉ chứa các trường cần cập nhật
                var updateData = new History
                {
                    history_id = ObjectId.Parse(history.history_id),
                    total_questions = history.total_questions,
                    total_corrects = history.total_corrects,
                    updateAt = DateTime.Now
                };

                // Gửi dữ liệu cập nhật xuống Repository
                var updateResult = await historyRepository.updateHistory(updateData);

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


        public async Task<ReturnData> deleteHistory(deleteHistoryVM history)
        {
            try
            {
                var delete = await historyRepository.deleteHistory(history);
                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! history_id is not found"
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
