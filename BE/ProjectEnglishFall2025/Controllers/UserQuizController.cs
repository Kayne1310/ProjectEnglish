using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserQuizController : ControllerBase
    {
        private readonly IUserQuizService userQuizService;

        public UserQuizController(IUserQuizService userQuizService)
        {
            this.userQuizService = userQuizService;
        }

        [HttpGet("get_all_userQuiz")]
        public async Task<IActionResult> getAllUserQuiz()
        {
            try
            {
                var getall = await userQuizService.getAllUserQuiz();
                return Ok(getall);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get_id_userQuiz")]
        public async Task<IActionResult> getIdUserQuiz([FromQuery] DeleteUserQuizVM userQuiz)
        {
            try
            {
                var getId = await userQuizService.getIdUserQuiz(userQuiz);
                return Ok(getId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create_userQuiz")]
        public async Task<IActionResult> addUserQuiz([FromBody] CreateUserQuizVM userQuizVM)
        {
            try
            {
                var add = await userQuizService.addUserQuiz(userQuizVM);
                return Ok(add);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update_userQuiz")]
        public async Task<IActionResult> updateUserQuiz([FromBody] UpdateUserQuizVM userQuizVM)
        {
            try
            {
                var update = await userQuizService.updateUserQuiz(userQuizVM);
                return Ok(update);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete_userQuiz")]
        public async Task<IActionResult> deleteUserQuiz([FromBody] DeleteUserQuizVM userQuiz)
        {
            try
            {
                var delete = await userQuizService.deleteUserQuiz(userQuiz);
                return Ok(delete);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
