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

        public async Task<List<History>> getAllHistory()
        {
            var gettAll = await historyRepository.getAllHistory();

            return gettAll;
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

                // ánh xạ dữ liệu từ updateHistoryVM sang deleteHistoryVM
                var historyId = new deleteHistoryVM 
                {
                    history_id = history.history_id 
                };

                // Tìm bản ghi cũ bằng hàm getHistoryById
                var existingHistory = await historyRepository.getHistoryById(historyId);
                if (existingHistory == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! history_id not found"
                    };
                }

                // Cập nhật dữ liệu mới nhưng giữ nguyên createAt
                existingHistory.total_questions = history.total_questions;
                existingHistory.total_corrects = history.total_corrects;
                existingHistory.updateAt = DateTime.Now;

                // Validate lại dữ liệu sau khi cập nhật
                var validate = validator.Validate(existingHistory);
                if (!validate.IsValid)
                {
                    var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }

                // Thực hiện cập nhật vào database
                var updateResult = await historyRepository.updateHistory(existingHistory);

                if (updateResult <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! Database error"
                    };
                }

                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Update successful!"
                };
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
                if(delete <= 0)
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
