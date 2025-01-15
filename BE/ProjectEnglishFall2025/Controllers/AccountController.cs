using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProjectFall2025.Application.Services;
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

        public AccountController(IAcountService acountService,IConfiguration configuration)
        {
            this.acountService = acountService;
            this.configuration = configuration;
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
                    new Claim(ClaimTypes.PrimarySid, user.UserID.ToString()), };

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

              //       var res = await acountService.Account_UpdateRefeshToken(req);




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



        private  JwtSecurityToken CreateToken(List<Claim> authClaims)
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
