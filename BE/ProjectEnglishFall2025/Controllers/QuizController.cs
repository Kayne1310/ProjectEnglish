using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService quizService;
        private readonly IMapper mapper;

        public QuizController(IQuizService quizService, IMapper mapper)
        {
            this.quizService = quizService;
            this.mapper = mapper;
        }

        [HttpGet("get_all_quiz")]
        public async Task<IActionResult> GetAllQuizs()
        {
            try
            {
                var getAllQuizs = await quizService.GetAllQuizs();
                return Ok(getAllQuizs);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("get_quiz_by_id")]
        public async Task<IActionResult> GetIdQuizs([FromQuery] DeleteQuizVM quiz)
        {
            try
            {
                var getId = await quizService.GetIdQuiz(quiz);
                return Ok(getId);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("add_quiz")]

        public async Task<IActionResult> AddQuizs([FromForm]CreateQuizVM quiz)
        {
            try
            {
                var addQuizs = await quizService.AddQuiz(quiz);
                return Ok(addQuizs);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("update_quiz")]
        public async Task<IActionResult> UpdateQuizs([FromBody] UpdateQuizVM quiz)
        {
            try
            {
                var updateQuizs = await quizService.UpdateQuiz(quiz);
                return Ok(updateQuizs);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete_quiz")]
        public async Task<IActionResult> DeleteQuizs([FromBody] DeleteQuizVM quiz)
        {
            try
            {
                var deleteQuizs = await quizService.DeleteQuiz(quiz);
                return Ok(deleteQuizs);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetCountQuestionbyQuiz")]
        public async Task<ActionResult> GetCountQuestionbyQuiz()
        {
            try
            {
                var res = await quizService.getCountQuestionInQuiz();
                return Ok(res);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetQuestionByQuizId/{questionId}")]   
        public async Task<ActionResult> GetQuestionByQuizId([FromRoute]string questionId)
        {
            try
            {
                var res=await quizService.GetQuestionsAndAnswersByQuizIdAsync(questionId);
                return Ok(res);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
