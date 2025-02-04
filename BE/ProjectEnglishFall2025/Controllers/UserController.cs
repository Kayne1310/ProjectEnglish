using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectEnglishFall2025.Filter;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using Microsoft.AspNetCore.Authentication.Cookies;

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
        [HttpGet("RegisterWithFacebook")]
        public IActionResult RegisterWithFacebook()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/api/User/FacebookRegisterCallback"
             
            };
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("FacebookRegisterCallback")]
        public async Task<IActionResult> FacebookRegisterCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!authenticateResult.Succeeded)
            {
                return BadRequest("Facebook authentication failed.");
            }

            var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var facebookId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(facebookId))
            {
                return BadRequest("Unable to get user information from Facebook.");
            }

        
            var userModel = new FacebookUserViewModel
            {
                Name = name,
                Email = email,
                FacebookId = facebookId,
                
            };

            var result = await userService.RegisterWithFacebook(userModel);
            return Ok(result);
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
    }
}
