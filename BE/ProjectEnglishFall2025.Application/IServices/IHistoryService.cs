﻿using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IHistoryService
    {
        Task<List<HistoryDTO>> getAllHistory();
        Task<History> getHistoryById(deleteHistoryVM history);
        Task<ReturnData> addHistory(createHistoryVM history);
        Task<ReturnData> updateHistory(updateHistoryVM history);
        Task<ReturnData> deleteHistory(deleteHistoryVM history);
    }
}
