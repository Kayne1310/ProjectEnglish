using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIAnswerController : ControllerBase
    {
        private readonly IAIAnswerService aIAnswerService;

        public AIAnswerController(IAIAnswerService aIAnswerService)
        {
            this.aIAnswerService = aIAnswerService;
        }

        [HttpGet("get_all_AI_answer")]
        public async Task<IActionResult> GetAllAIAnswer()
        {
            try
            {
                var data = await aIAnswerService.getAllAIAnswer();
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("get_id_AI_answer")]
        public async Task<IActionResult> GetIdAIAnswer([FromQuery] deleteAIAnswerVM aIAnswer)
        {
            try
            {
                var data = await aIAnswerService.getAIAnswerById(aIAnswer);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("add_AI_answer")]
        public async Task<IActionResult> AddAIAnswer([FromBody] createAIAnswerVM aIAnswer)
        {
            try
            {
                var data = await aIAnswerService.addAIAnswer(aIAnswer);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("update_AI_answer")]
        public async Task<IActionResult> UpdateAIAnswer([FromBody] updateAIAnswerVM aIAnswer)
        {
            try
            {
                var data = await aIAnswerService.updateAIAnswer(aIAnswer);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("delete_AI_answer")]
        public async Task<IActionResult> DeleteAIAnswer([FromQuery] deleteAIAnswerVM aIAnswer)
        {
            try
            {
                var data = await aIAnswerService.deleteAIAnswer(aIAnswer);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
