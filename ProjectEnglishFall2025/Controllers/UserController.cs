using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.ViewModel;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult> addUser(UserViewModel user)
        {
            try
            {
                var res = await userService.addUserService(user);

                return Ok(res);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
