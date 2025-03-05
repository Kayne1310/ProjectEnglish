using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.FlashCard;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlashCardController : ControllerBase
    {
        private readonly IFlashCardService service;

        public FlashCardController(IFlashCardService service)
        {
            this.service = service;
        }
        [HttpPost("CreateFlashCardWithStudySet")]
        [Authorize("User", "Admin")]
        public async Task<ActionResult> CreateFlashCard(CreateFlashcardVM createFlashcardVM)
        {
            try
            {
                var res = await service.createFlashCardInStudySet(createFlashcardVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateFlashCardWithStudySet")]
        public async Task<ActionResult> UpdateFlashCard(UpdateFlashcardVM updateFlashcardVM)
        {

            try
            {
                var res=await service.updateFlashCardInStudySet(updateFlashcardVM);
                return Ok(res); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetFlashCardById/{id}")]
        public async Task<ActionResult> getFlashCardbyId(string id)
        {
            try
            {
                var res=await service.getFlashCardById(id);
                return Ok(res);
            }
            catch(Exception ex)
            {
                return BadRequest($"{ex.Message}");
            }
        }

        [HttpGet("GetListFlashCardByStudySetId/{studySetId}")]
        public async Task<ActionResult> getListFlashCard([FromRoute] string studySetId)
        {
            try
            {
                var res=await service.getListFlashCardByStudySet(studySetId);
                return Ok(res);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
         
    }
}
