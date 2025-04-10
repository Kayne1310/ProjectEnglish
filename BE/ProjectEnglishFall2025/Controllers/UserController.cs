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
using ProjectFall2025.Application.Services;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_Pagination;

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


        //[HttpGet("Get_All_User")]
        //[Authorize("Admin")]
        //public async Task<ActionResult> getAllUser()
        //{

        //    try
        //    {
        //        var res = await userService.getAllUser();
        //        return Ok(res);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        [HttpGet("Get_All_User")]
        [Authorize("Admin")]
        public async Task<ActionResult> GetAllUser(
                [FromQuery] int page = 1,
                [FromQuery] int pageSize = 10,
                [FromQuery] string? sortBy = "UserName",
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

                var response = await userService.GetAllUsersAsync(request);
                return Ok(response);
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
        [Authorize("User")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
                var user = await userService.getUserById(userId);

                var res = await userService.ChangePassword(new ChangePasswordResponse
                {
                    Email = user.Email,
                    newPassword = request.newPassword,
                    oldPassword = request.oldPassword,
                    reNewPassword = request.reNewPassword
                });
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getUser")]
        [Authorize("User","Admin")]
        public async Task<ActionResult> getUser()
        {
            try
            {

                var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
                var user = await userService.getUserById(userId);

                return Ok(new getUserDAtaResponseData
                {
                    ReturnCode = 1,
                    ReturnMessage = "data user",
                    user = user,

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        [HttpPut("update_user")]
        public async Task<IActionResult> UpdateUsers([FromForm] UpdateUserVM userVM)
        {
            try
            {
                var updateUsers = await userService.UpdateUser(userVM);
                return Ok(updateUsers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}