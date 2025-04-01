using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ChatMessageVM
{
    public class ChatMessageVM 
    {
        public string userID { get; set; }
        public string message { get; set; }
        
    }

    public class DataResponseChatVM  :ReturnData
    {
    
          public ChatMessage chatMessage { get; set; }
    }
}
