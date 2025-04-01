using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ChatMessageVM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.IRepo
{
    public interface IChatRepository
    {
        Task<DataResponseChatVM> SaveMessage(ChatMessageVM message);
        Task<List<ChatMessage>> GetRecentMessages(int limit);
        Task<List<ChatMessage>> GetOlderMessages(DateTime lastMessageTime, int limit);
       

    }
}
