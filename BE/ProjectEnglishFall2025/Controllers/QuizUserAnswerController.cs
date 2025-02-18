using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizUserAnswerController : ControllerBase
    {
        private readonly IQuizUserAnswerService quizUserAnswerService;

        public QuizUserAnswerController(IQuizUserAnswerService quizUserAnswerService)
        {
            this.quizUserAnswerService = quizUserAnswerService;
        }

        [HttpGet("get_all_quizUserAnswer")]
        public async Task<IActionResult> GetAllQuizUserAnswer()
        {
            try
            {
                var data = await quizUserAnswerService.getAllQuizUserAnswer();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("get_id_quizUserAnswer")]
        public async Task<IActionResult> GetIdQuizUserAnswer([FromQuery] deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = await quizUserAnswerService.getQuizUserAnswerById(quizUserAnswer);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("add_quizUserAnswer")]
        public async Task<IActionResult> AddQuizUserAnswer([FromBody] createQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = await quizUserAnswerService.addQuizUserAnswer(quizUserAnswer);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("update_quizUserAnswer")]
        public async Task<IActionResult> UpdateQuizUserAnswer([FromBody] updateQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = await quizUserAnswerService.updateQuizUserAnswer(quizUserAnswer);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("delete_quizUserAnswer")]
        public async Task<IActionResult> DeleteQuizUserAnswer([FromQuery] deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = await quizUserAnswerService.deleteQuizUserAnswer(quizUserAnswer);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
