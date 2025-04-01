using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.Services;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizQuestionController : ControllerBase
    {
        private readonly IQuizQuestionService quizQuestionService;

        public QuizQuestionController(IQuizQuestionService quizQuestionService)
        {
            this.quizQuestionService = quizQuestionService;
        }

        [HttpGet("get_allQuizQuestion")]
        public async Task<IActionResult> getAllQuizQuestion()
        {
            try
            {
                var result = await quizQuestionService.getAllQuizQuestion();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("get_idQuizQuestion")]
        public async Task<IActionResult> getQuizQuestionById([FromQuery] DeleteQuizQuestionVM quizQuestion)
        {
            try
            {
                var result = await quizQuestionService.getQuizQuestionById(quizQuestion);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //[HttpPost("create_QuizQuestion")]
        //public async Task<IActionResult> createQuizQuestion([FromForm] CreateQuizQuestionVM quizQuestion)
        //{
        //    try
        //    {
        //        var result = await quizQuestionService.createQuizQuestion(quizQuestion);
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //    }
        //}

        [HttpPut("update_QuizQuestion")]
        public async Task<IActionResult> updateQuizQuestion([FromForm] UpdateQuizQuestionVM quizQuestion)
        {
            try
            {
                var result = await quizQuestionService.updateQuizQuestion(quizQuestion);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("delete_QuizQuestion")]
        public async Task<IActionResult> deleteQuizQuestion([FromQuery] DeleteQuizQuestionVM quizQuestion)
        {
            try
            {
                var result = await quizQuestionService.deleteQuizQuestion(quizQuestion);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create_quizquestion_with_answers")]
        public async Task<IActionResult> CreateQuizQuestionWithAnswers([FromForm] CreateQuizQuestionWithAnswersCommand command)
        {
            try
            {
                var result = await quizQuestionService.Handle(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("update_quizquestion_with_answers")]
        public async Task<IActionResult> UpdateQuizQuestionWithAnswers([FromForm] UpdateQuizQuestionWithAnswerCommand command)
        {
            try
            {
                var result = await quizQuestionService.HandleUpdate(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpDelete("delete_quizquestion_with_answers")]
        public async Task<IActionResult> DeleteQuizQuestionWithAnswers([FromForm] DeleteQuizQuestionVM command)
        {
            try
            {
                var result = await quizQuestionService.HandleDelete(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
