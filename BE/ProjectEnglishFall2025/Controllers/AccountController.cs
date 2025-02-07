using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Common.Security;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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
                if(request.UserId==null)
                {
                    response.ReturnCode = -1;
                    response.ReturnMessage = "Đã xảy ra lỗi khi đăng xuất.";
                    return StatusCode(500, response);

                }
                    await userSessionService.removeUserSession(new LogoutRequest { UserId=request.UserId});

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
