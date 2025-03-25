using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ChatMessageVM;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class ChatRepository : IChatRepository
    {
        private readonly IMongoCollection<ChatMessage> _chatCollection;
        private readonly IMongoCollection<User> _userCollection;

        public ChatRepository(MongoDbContext dbContext)
        {
            _chatCollection = dbContext.GetCollectionChatMessage();
            _userCollection = dbContext.GetCollectionUser();
        }

        public async Task<List<ChatMessage>> GetRecentMessages(int limit)
        {
            var res = await _chatCollection
             .Find(_ => true)
             .SortByDescending(msg => msg.Timestamp) // Sắp xếp theo thời gian giảm dần
             .Limit(limit)
             .ToListAsync();
            return res;
        }

        public async Task<List<ChatMessage>> GetOlderMessages(DateTime lastMessageTime, int limit)
        {
            
            var res = await _chatCollection
                .Find(msg => msg.Timestamp < lastMessageTime) // Trực tiếp tìm theo CreatedAt
                .SortByDescending(msg => msg.Timestamp)
                .Limit(limit)
                .ToListAsync();

            return res;
        }

        public async Task<DataResponseChatVM> SaveMessage(ChatMessageVM message)
        {
            try
            {

                var user = await _userCollection.Find(u => u.UserID.ToString() == message.userID).FirstOrDefaultAsync();
                if (user == null) throw new Exception("User not found");

                var chatMessage = new ChatMessage
                {
                    UserId = message.userID,
                    UserName = user.UserName,
                    Message = message.message,
                    Picture = user.Picture,
                    Timestamp = DateTime.UtcNow
                };

                await _chatCollection.InsertOneAsync(chatMessage);
                return new DataResponseChatVM
                {
                    ReturnCode = 1,
                    ReturnMessage = "Send MEssage Sucessul",
                    chatMessage=chatMessage
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


    }
}
