using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using ProjectFall2025.Domain.ViewModel;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;

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
                return NotFound(ex.Message);
            }

        }


        [HttpGet]
        [Authorize("User")]
        public async Task<ActionResult> getAllUser()
        {

            try
            {
                var res = await userService.getAllUser();
                return Ok(res);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpPost("GoogleRegister")]
        public async Task<IActionResult> GoogleRegisterCallback(GoogleUserViewModel googleUserViewModel)
        {
            try
            {

                var result = await userService.RegisterWithGoogle(googleUserViewModel);

                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [HttpPost("FacebookRegister")]
        public async Task<IActionResult> FacebookRegister(FacebookUserViewModel facebookUserViewModel)
        {
            try
            {

                var result = await userService.RegisterWithFacebook(facebookUserViewModel);

                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var res = await userService.ChangePassword(request);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getUser")]
        [Authorize("User")]
        public async Task<ActionResult> getUser()
        {
            try
            {

                var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                var user = await userService.getUserById(userId);
               
                return Ok(new getUserDAtaResponseData
                {
                    ReturnCode = -1,
                    ReturnMessage = "data user",
                    user = user,

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
    }
}