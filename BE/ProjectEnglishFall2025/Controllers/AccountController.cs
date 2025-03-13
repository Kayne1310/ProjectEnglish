using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.Services;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace ProjectEnglishFall2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAcountService acountService;
        private readonly IConfiguration configuration;
        private readonly IRedisService redisService;
        private readonly IUserSessionService userSessionService;
        private readonly IEmailService emailService;
        private readonly IUserService userService;

        public AccountController(IAcountService acountService, IConfiguration configuration,
            IRedisService redisService, IUserSessionService userSessionService,
            IEmailService emailService, IUserService userService)
        {
            this.acountService = acountService;
            this.configuration = configuration;
            this.redisService = redisService;
            this.userSessionService = userSessionService;
            this.emailService = emailService;
            this.userService = userService;
        }
        [HttpPost]
        public async Task<ActionResult> AccountLogin(AccountLoginRequestData requestData)
        {

            var returnData = new LoginResponseData();
            try
            {
                //buoc 1 goi login de lay thongg tin tai khoan

                var result = await acountService.AccountLogin(requestData);

                if (result.ReturnCode < 0)
                {
                    return Ok(result);
                }

                var user = result.user;
                // buoc 2 neu thanh cong thi tao token
                //2.1 tao Claims de luu thong tin users

                var authClaims = new List<Claim> {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.PrimarySid, user.UserID.ToString()),
                    new Claim(ClaimTypes.Role,user.role),
                    new Claim(ClaimTypes.Email, user.Email),

                };
                var newtoken = CreateToken(authClaims);

                //buoc 2.3 tao refresh token
                var exprired = Convert.ToInt32(configuration["JWT:RefreshTokenValidityInDays"]);
                var refreshtokenExprired = DateTime.Now.AddDays(exprired);

                var refreshtoken = GenerateRefreshToken();

                var req = new Account_UpdateRefeshTokenRequestData
                {
                    Exprired = refreshtokenExprired,
                    RefeshToken = refreshtoken,
                    UserId = user.UserID,

                };

                // luu vao redis

                var redisKeyAccessToken = $"user:{user.UserID}:accessToken";
                var redisKeyRefreshToken = $"user:{user.UserID}:refreshToken";

                // Lưu Access Token vào Redis
                await redisService.SetValueAsync(
                    redisKeyAccessToken,
                    new JwtSecurityTokenHandler().WriteToken(newtoken),
                    TimeSpan.FromMinutes(Convert.ToDouble(configuration["Redis:DefaultExpiryMinutes"]))
                );


                // Lưu Refresh Token vào Redis
                await redisService.SetValueAsync(
                    redisKeyRefreshToken,
                    refreshtoken,
                    TimeSpan.FromDays(exprired)
                );


                //luu vao monogodb userSession


                var userSession = new UserSession
                {
                    token = new JwtSecurityTokenHandler().WriteToken(newtoken),
                    UserId = user.UserID,
                    isSueAt = DateTime.UtcNow, // Set issue date to current time
                    expriresAt = refreshtokenExprired,
                    isRevoked = "false",
                };

                await userSessionService.addUserSession(userSession);


                var res = await acountService.Account_UpdateRefeshToken(req);

                //Gan token vao cookies 
                Response.Cookies.Append("accessToken", new JwtSecurityTokenHandler().WriteToken(newtoken), new CookieOptions
                {
                    HttpOnly = true, // Ngăn chặn truy cập từ JavaScript
                    Secure = true,   // Chỉ hoạt động trên HTTPS
                    SameSite = SameSiteMode.None, // Ngăn chặn CSRF
                    Expires = DateTime.UtcNow.AddDays(exprired),
                });

                //tra ve token 
                returnData.ReturnCode = 1;
                returnData.user=user;
                returnData.ReturnMessage = result.ReturnMessage;
                returnData.token = new JwtSecurityTokenHandler().WriteToken(newtoken);
                returnData.user = user;
                return Ok(returnData);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        
        [HttpPost("Logout")]
        //[Authorize("User")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst(ClaimTypes.PrimarySid)?.Value;
            var response = new LogoutResponse();
            try
            {
                // Redis Keys
                var redisKeyAccessToken = $"user:{userId}:accessToken";
                var redisKeyRefreshToken = $"user:{userId}:refreshToken";

                // Xóa Access Token và Refresh Token khỏi Redis
                await redisService.DeleteKeyAsync(redisKeyAccessToken);
                await redisService.DeleteKeyAsync(redisKeyRefreshToken);

                // (Tùy chọn) Cập nhật trạng thái session trong MongoDB
                if (userId == null)
                {
                    response.ReturnCode = -1;
                    response.ReturnMessage = "Đã xảy ra lỗi khi đăng xuất.";
                    return StatusCode(500, response);

                }
                await userSessionService.removeUserSession(new LogoutRequest { UserId = userId });

                response.ReturnCode = 1;
                response.ReturnMessage = "Đăng xuất thành công.";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.ReturnCode = -1;
                response.ReturnMessage = "Đã xảy ra lỗi khi đăng xuất.";
                return StatusCode(500, response);
            }

        }



        [HttpPost("facebook-login")]
        public async Task<IActionResult> FacebookLogin(FacebookUserViewModel model)
        {

            //check tk fb da duoc tao chua
            var validAcount = await acountService.AccountLoginWithFb(model.FacebookId);
            if (validAcount.ReturnCode < 0)
            {
                return Ok(validAcount);
            }
            // Tạo access token
            var authClaims = new List<Claim> {
            new Claim(ClaimTypes.Name, model.Name),
            new Claim(ClaimTypes.Email, model.Email),
            new Claim(ClaimTypes.NameIdentifier, model.FacebookId),
            new Claim(ClaimTypes.Role,"User"),
            new Claim(ClaimTypes.PrimarySid, validAcount.user.UserID.ToString()),
        };
            var newToken = CreateToken(authClaims);

            //buoc 2.3 tao refresh token
            var exprired = Convert.ToInt32(configuration["JWT:RefreshTokenValidityInDays"]);
            var refreshtokenExprired = DateTime.Now.AddDays(exprired);

            var refreshtoken = GenerateRefreshToken();
            var req = new Account_UpdateRefeshTokenRequestData
            {
                Exprired = refreshtokenExprired,
                RefeshToken = refreshtoken,
                UserId = validAcount.user.UserID,

            };

            // Lưu vào Redis
            var redisKeyAccessToken = $"user:{validAcount.user.UserID}:accessToken";
            var redisKeyRefreshToken = $"user:{validAcount.user.UserID}:refreshToken";

            await redisService.SetValueAsync(redisKeyAccessToken, new JwtSecurityTokenHandler().WriteToken(newToken),
                TimeSpan.FromMinutes(Convert.ToDouble(configuration["Redis:DefaultExpiryMinutes"])));

            await redisService.SetValueAsync(
                  redisKeyRefreshToken,
                  refreshtoken,
                  TimeSpan.FromDays(exprired)
              );



            var userSession = new UserSession
            {

                token = new JwtSecurityTokenHandler().WriteToken(newToken),
                UserId = validAcount.user.UserID,
                isSueAt = DateTime.UtcNow, // Set issue date to current time
                expriresAt = refreshtokenExprired,
                isRevoked = "false",

            };

            await userSessionService.addUserSession(userSession);
            await acountService.Account_UpdateRefeshToken(req);

            Response.Cookies.Append("accessToken", new JwtSecurityTokenHandler().WriteToken(newToken), new CookieOptions
            {
                HttpOnly = true, // Ngăn chặn truy cập từ JavaScript
                Secure = true,   // Chỉ hoạt động trên HTTPS
                SameSite = SameSiteMode.None, // Ngăn chặn CSRF
                Expires = DateTime.UtcNow.AddHours(1)
            });

            var returnData = new LoginResponseData();
            returnData.ReturnMessage = "Login Sucessful";
            returnData.ReturnCode = 1;

            returnData.user = validAcount.user;
            returnData.token = new JwtSecurityTokenHandler().WriteToken(newToken);
            return Ok(returnData);
        }


        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleUserViewModel model)
        {

            try
            {
                //    Kiểm tra tài khoản Google đã được tạo hay chưa
                var validAccount = await acountService.AccountLoginWithGg(model.GoogleId);
                if (validAccount.ReturnCode < 0)
                {
                    return Ok(validAccount);
                }

                var exprired = Convert.ToInt32(configuration["JWT:RefreshTokenValidityInDays"]);
                var refreshtokenExprired = DateTime.Now.AddDays(exprired);

                var refreshtoken = GenerateRefreshToken();
                var req = new Account_UpdateRefeshTokenRequestData
                {
                    Exprired = refreshtokenExprired,
                    RefeshToken = refreshtoken,
                    UserId = validAccount.user.UserID,

                };
                await acountService.Account_UpdateRefeshToken(req);
                // Tạo JWT token
                var authClaims = new List<Claim> {
                new Claim(ClaimTypes.Name, model.Name),
                new Claim(ClaimTypes.Email, model.Email),
                new Claim(ClaimTypes.NameIdentifier, model.GoogleId),
                new Claim(ClaimTypes.Role, "User"),
                new Claim(ClaimTypes.PrimarySid, validAccount.user.UserID.ToString()),
            };

                var newToken = CreateToken(authClaims);

                // Lưu token vào Redis
                var redisKeyAccessToken = $"user:{validAccount.user.UserID}:accessToken";
                var redisKeyRefreshToken = $"user:{validAccount.user.UserID}:refreshToken";
                await redisService.SetValueAsync(redisKeyAccessToken, new JwtSecurityTokenHandler().WriteToken(newToken),
                    TimeSpan.FromMinutes(Convert.ToDouble(configuration["Redis:DefaultExpiryMinutes"])));

                await redisService.SetValueAsync(
                redisKeyRefreshToken,
                refreshtoken,
                TimeSpan.FromDays(exprired)
            );


                var userSession = new UserSession
                {

                    token = new JwtSecurityTokenHandler().WriteToken(newToken),
                    UserId = validAccount.user.UserID,
                    isSueAt = DateTime.UtcNow, // Set issue date to current time
                    expriresAt = refreshtokenExprired,
                    isRevoked = "false",

                };

                await userSessionService.addUserSession(userSession);
                //add cokkie
                Response.Cookies.Append("accessToken", new JwtSecurityTokenHandler().WriteToken(newToken), new CookieOptions
                {
                    HttpOnly = true, // Ngăn chặn truy cập từ JavaScript
                    Secure = true,   // Chỉ hoạt động trên HTTPS
                    SameSite = SameSiteMode.None, // Ngăn chặn CSRF
                    Expires = DateTime.UtcNow.AddHours(1)
                });

                // Tạo phản hồi trả về
                var returnData = new LoginResponseData
                {
                    ReturnMessage = "Login Successful",
                    ReturnCode = 1,
                    token = new JwtSecurityTokenHandler().WriteToken(newToken),
                    user = validAccount.user

                };

                return Ok(returnData);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {

                var user = await userService.FindUserbyEmail(request.Email);
                if (user.ReturnCode == -1)
                    return Ok(new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage="User not exits"
                    });


                var token = GenerateRefreshToken();


                await emailService.SendPasswordResetEmailAsync(request.Email, token);
                await userService.UpdateTokenUser(new ResetPasswordRequest { Email = request.Email, NewPassword = null ,Token=token});

                return Ok(new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Da Send Email"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        // API đặt lại mật khẩu
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var res = await userService.ResetPassword(request);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}");


            }
        }

        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
            _ = int.TryParse(configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }





        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
