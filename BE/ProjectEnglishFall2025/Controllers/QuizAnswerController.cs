using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Infrastructure.Repositories.IRepo;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizAnswerController : ControllerBase
    {
        private readonly IQuizAnswerService quizAnswerService;

        public QuizAnswerController(IQuizAnswerService quizAnswerService)
        {
            this.quizAnswerService = quizAnswerService;
        }

        [HttpGet("get_all_quizAnswer")]
        public async Task<IActionResult> getAllQuizAnswer()
        {
            try
            {
                var res = await quizAnswerService.getAllQuizAnswer();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get_id_quizAnswer")]
        public async Task<IActionResult> getIdAnswer([FromQuery] DeleteAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var res = await quizAnswerService.getIdQuizAnswer(answerQuestionVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create_quizAnswer")]
        public async Task<IActionResult> createQuizAnswer([FromBody] CreateAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var res = await quizAnswerService.addQuizAnswer(answerQuestionVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("update_quizAnswer")]
        public async Task<IActionResult> updateQuizAnswer([FromBody] UpdateAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var res = await quizAnswerService.updateQuizAnswer(answerQuestionVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete_quizAnswer")]
        public async Task<IActionResult> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionVM)
        {
            try
            {
                var res = await quizAnswerService.deleteQuizAnswer(answerQuestionVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("correct-answers")]
        public async Task<IActionResult> GetCorrectQuizAnswers(string quizId)
        {
            try
            {
                var results = await quizAnswerService.GetCorrectQuizAnswersAsync(quizId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
