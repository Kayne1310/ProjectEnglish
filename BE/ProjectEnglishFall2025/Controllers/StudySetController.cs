using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using System.Security.Claims;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudySetController : ControllerBase
    {
        private readonly IStudySetService service;

        public StudySetController(IStudySetService service)
        {
            this.service = service;
        }

        [HttpPost("CreateStudySet")]
        [Authorize("User","Admin")]
        public async Task<ActionResult> create([FromBody] CreateStudySetVM createStudySetVM)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
                createStudySetVM.UserId = userId;
                var res=await service.createStudySet(createStudySetVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("UpdateStudySet")]
        [Authorize("User", "Admin")]
        public async Task<ActionResult> updateStudySet([FromBody]EditStudySetVM updateStudySetVM)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
                updateStudySetVM.UserId = userId;
                var res=await service.updateStudySet(updateStudySetVM);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteStudySet/{id}")]
        [Authorize("User", "Admin")]
        public async Task<ActionResult> deleteStudySet( [FromRoute]string id)
        {
            try
            {
                var res=await service.deleteStudySet(new DeleteStudySetVM { Id=id});
                return Ok(res);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
