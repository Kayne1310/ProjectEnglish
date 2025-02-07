
﻿using Microsoft.AspNetCore.Authorization;

﻿using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.Services;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;

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

        public AccountController(IAcountService acountService, IConfiguration configuration, IRedisService redisService, IUserSessionService userSessionService)
        {
            this.acountService = acountService;
            this.configuration = configuration;
            this.redisService = redisService;
            this.userSessionService = userSessionService;
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

                //tra ve token 
                returnData.ReturnCode = 1;
                returnData.ReturnMessage = result.ReturnMessage;
                returnData.token = new JwtSecurityTokenHandler().WriteToken(newtoken);

                return Ok(returnData);

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest request)
        {
            var response = new LogoutResponse();
            try
            {
                // Redis Keys
                var redisKeyAccessToken = $"user:{request.UserId}:accessToken";
                var redisKeyRefreshToken = $"user:{request.UserId}:refreshToken";

                // Xóa Access Token và Refresh Token khỏi Redis
                await redisService.DeleteKeyAsync(redisKeyAccessToken);
                await redisService.DeleteKeyAsync(redisKeyRefreshToken);

                // (Tùy chọn) Cập nhật trạng thái session trong MongoDB
                if (request.UserId == null)
                {
                    response.ReturnCode = -1;
                    response.ReturnMessage = "Đã xảy ra lỗi khi đăng xuất.";
                    return StatusCode(500, response);

                }
                await userSessionService.removeUserSession(new LogoutRequest { UserId = request.UserId });

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

        [HttpGet("login-facebook")]
        public IActionResult LoginWithFacebook()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/api/account/facebook-callback" };
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("facebook-callback")]
        public async Task<IActionResult> FacebookCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Facebook authentication failed.");


            var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            var facebookId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            //check tk fb da duoc tao chua
            var validAcount = await acountService.AccountLoginWithFb(facebookId);
            if (validAcount.ReturnCode < 0)
            {
                return Ok(validAcount);
            }

            if (string.IsNullOrEmpty(email))
                return BadRequest("Unable to get email from Facebook");

            // Tạo access token
            var authClaims = new List<Claim> {
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, facebookId),
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

            var returnData = new LoginResponseData();
            returnData.ReturnMessage = "Login Sucessful";
            returnData.ReturnCode = 1;
            returnData.token = new JwtSecurityTokenHandler().WriteToken(newToken);
            return Ok(returnData);
        }


        //login gooogle 

        [HttpGet("login-google")]
        public IActionResult LoginWithGoogle()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/api/account/google-callback" };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Google authentication failed.");

            var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(email))
                return BadRequest("Unable to get email from Google");

            //    Kiểm tra tài khoản Google đã được tạo hay chưa
            var validAccount = await acountService.AccountLoginWithGg(googleId);
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
                new Claim(ClaimTypes.Name, name),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, googleId),
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

            // Tạo phản hồi trả về
            var returnData = new LoginResponseData
            {
                ReturnMessage = "Login Successful",
                ReturnCode = 1,
                token = new JwtSecurityTokenHandler().WriteToken(newToken)
            };

            return Ok(returnData);
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
