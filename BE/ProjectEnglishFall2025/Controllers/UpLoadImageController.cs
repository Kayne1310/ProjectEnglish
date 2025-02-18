using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel.ImageVM;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpLoadImageController : ControllerBase
    {
        private readonly ICloudinaryService cloudinaryService;

        public UpLoadImageController(ICloudinaryService cloudinaryService)
        {
            this.cloudinaryService = cloudinaryService;
        }

        [HttpPost("UploadImage")]
        public async Task<ActionResult> uploadImage(IFormFile file)
        {
            try
            {

                var res = await cloudinaryService.UploadImageAsync(file);
                var returndata = new ImageVM
                {
                    ReturnCode = 1,
                    ReturnMessage = "update load successful ",
                    url = res

                };
                return Ok(returndata);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }
    }
}
