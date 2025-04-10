using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.Services;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Pagination;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Domain.ViewModel.ViewModel_SubmitQuiz;
using System.Security.Claims;
using AuthorizeAttribute = ProjectEnglishFall2025.Filter.AuthorizeAttribute;

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

        //[HttpGet("get_all_quiz")]
        //public async Task<IActionResult> GetAllQuizs()
        //{
        //    try
        //    {
        //        var getAllQuizs = await quizService.GetAllQuizs();
        //        return Ok(getAllQuizs);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        [HttpGet("get_all_quiz")]
        //[Authorize("Admin")]
        public async Task<ActionResult> GetAllUser(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? sortBy = "name",
        [FromQuery] bool sortAscending = true)
        {
            try
            {
                var request = new PaginationRequest
                {
                    Page = Math.Max(1, page),
                    PageSize = Math.Max(1, Math.Min(pageSize, 100)),
                    SortBy = sortBy,
                    SortAscending = sortAscending
                };

                var response = await quizService.GetAllQuizsAsync(request);
                return Ok(response);
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

        public async Task<IActionResult> AddQuizs([FromForm] CreateQuizVM quiz)
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
        public async Task<IActionResult> UpdateQuizs([FromForm] UpdateQuizVM quiz)
        {
            try
            {
                var updateQuizs = await quizService.UpdateQuiz(quiz);
                return Ok(updateQuizs);
            }
            catch (Exception ex)
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
            }
            catch (Exception ex)
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetQuestionByQuizId/{quizId}")]
        public async Task<ActionResult> GetQuestionByQuizId(
                [FromRoute] string quizId,
                [FromQuery] int page = 1,
                [FromQuery] int pageSize = 3,
                [FromQuery] string? sortBy = "description",
                [FromQuery] bool sortAscending = true)
        {
            try
            {
                var request = new PaginationRequest
                {
                    QuizId = quizId,
                    Page = Math.Max(1, page),
                    PageSize = Math.Max(1, Math.Min(pageSize, 100)),
                    SortBy = sortBy,
                    SortAscending = sortAscending
                };

                var res = await quizService.GetQuestionsAndAnswersByQuizIdAsync(request);
                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpDelete("delete_quiz_question_answers")]
        public async Task<IActionResult> DeleteQuizQuestionWithAnswers([FromForm] DeleteQuizVM command)
        {
            try
            {
                var result = await quizService.HandleDelete(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("submit")]
        [Authorize("User","Admin")]
        public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizRequest request)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.PrimarySid);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID not found in token.");
                }

                var response = await quizService.SubmitQuizAsync(request, userId);
                return Ok(response);
            }
            catch (ArgumentException e)
            {
                return BadRequest($"Invalid request: {e.Message}");
            }
            catch (Exception e)
            {
                return BadRequest($"An error occurred: {e.Message}");
            }
        }
    }
}
