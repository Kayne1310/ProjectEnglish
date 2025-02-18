using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService historyService;

        public HistoryController(IHistoryService historyService)
        {
            this.historyService = historyService;
        }

        [HttpGet("get_all_history")]
        public async Task<IActionResult> GetAllHistory()
        {
            try
            {
                var data = await historyService.getAllHistory();
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("get_id_history")]
        public async Task<IActionResult> GetIdHistory([FromBody] deleteHistoryVM history)
        {
            try
            {
                var data = await historyService.getHistoryById(history);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("add_history")]
        public async Task<IActionResult> AddHistory([FromBody] createHistoryVM history)
        {
            try
            {
                var data = await historyService.addHistory(history);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("update_history")]
        public async Task<IActionResult> UpdateHistory([FromBody] updateHistoryVM history)
        {
            try
            {
                var data = await historyService.updateHistory(history);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("delete_history")]
        public async Task<IActionResult> DeleteHistory([FromBody] deleteHistoryVM history)
        {
            try
            {
                var data = await historyService.deleteHistory(history);
                return Ok(data);
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
