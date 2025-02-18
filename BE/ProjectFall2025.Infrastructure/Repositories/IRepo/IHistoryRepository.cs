using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IHistoryRepository
    {
        Task<List<History>> getAllHistory();
        Task<History> getHistoryById(deleteHistoryVM history);
        Task<History> addHistory(History history);
        Task<int> updateHistory(History history);
        Task<int> deleteHistory(deleteHistoryVM history);
    }
}
