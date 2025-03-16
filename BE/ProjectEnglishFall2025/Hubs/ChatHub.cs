using ProjectFall2025.Infrastructure.Repositories.Repo;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using ProjectFall2025.Domain.ViewModel.ChatMessageVM;
using System.Security.Claims;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Domain.Do;
using MongoDB.Bson;
using System.Collections.Concurrent;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;

namespace ProjectEnglishFall2025.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatRepository repository;
        private readonly IUserRepository userRepository;
        private static readonly ConcurrentDictionary<string, UserChatViewModel> OnlineUsers = new();

        public ChatHub(IChatRepository repository,IUserRepository userRepository)
        {
            this.repository = repository;
            this.userRepository = userRepository;
        }

        public async override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.PrimarySid)?.Value;


            if (userId == null)
            {
                await Clients.Caller.SendAsync("ReceiveMessage Join ");
                return;
            }
            var user=await userRepository.findUserById(ObjectId.Parse(userId));
            // Thêm user vào dictionary
            OnlineUsers.TryAdd(userId, new UserChatViewModel
            {
                UserId = user.UserID.ToString(),
                UserName = user.UserName,
                Picture = user.Picture
            });

            await Clients.All.SendAsync("ReceiveMessage Join", userId,  user.Picture, user.UserName);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.PrimarySid)?.Value;

            if (userId != null)
            {
                var user = await userRepository.findUserById(ObjectId.Parse(userId));
                if (user != null)
                {
                    OnlineUsers.TryRemove(userId, out _);
                    // Thông báo cho tất cả client biết user này đã disconnect
                    await Clients.All.SendAsync("UserDisconnected", user.UserID.ToString());
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            try
            {
                
                var userId = Context.User?.FindFirst(ClaimTypes.PrimarySid)?.Value;

              
                if (userId == null)
                {
                    await Clients.Caller.SendAsync("ReceiveMessageError User Not Found");
                    return;
                }
                 var data=   await repository.SaveMessage(new ChatMessageVM
                {
                    message = message,
                    userID = userId
                });
                await Clients.All.SendAsync("ReceiveMessage", userId, message,data.chatMessage.Picture,data.chatMessage.UserName,data.chatMessage.Timestamp);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("ReceiveMessageError", ex.Message);
            }
        }
 

        public async Task GetOnlineUsers()
        {
            var users = OnlineUsers.Values.ToList();
            await Clients.Caller.SendAsync("ReceiveMessage AllUser", users);
        }



    }
}
