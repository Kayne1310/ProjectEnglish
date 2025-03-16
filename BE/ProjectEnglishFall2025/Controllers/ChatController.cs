using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProjectEnglishFall2025.Filter;
using ProjectEnglishFall2025.Hubs;
using ProjectFall2025.Domain.ViewModel.ChatMessageVM;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System.Security.Claims;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> hubContext;
        private readonly IChatRepository chatRepository;

        public ChatController(IHubContext<ChatHub> hubContext,IChatRepository chatRepository)
        {
            this.hubContext = hubContext;
            this.chatRepository = chatRepository;
        }




        [HttpGet("GetListMessage")]
        public async Task<ActionResult> GetListAllMessage()
        {
            try
            {
                var res = await chatRepository.GetRecentMessages(25);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetMoreMessages")]
        public async Task<ActionResult> GetMoreMessages(DateTime lastMessageTime)
        {
            try
            {
                var res = await chatRepository.GetOlderMessages(lastMessageTime, 25);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
