using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ProjectFall2025.Application.IServices;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProjectEnglishFall2025.Filter
{
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute(string requiredRole) : base(typeof(AuthorizeActionFilter))
        {
            Arguments = new object[] { requiredRole };
        }
    }

    public class AuthorizeActionFilter : IAsyncAuthorizationFilter
    {
        private readonly string _requiredRole;
        private readonly IRedisService _redisService;

        public AuthorizeActionFilter(string requiredRole, IRedisService redisService)
        {
            _requiredRole = requiredRole;
            _redisService = redisService;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var identity = context.HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                var userId = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.PrimarySid)?.Value;
                var role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
                {
                    DenyAccess(context, "Vui lòng đăng nhập để thực hiện chức năng này");
                    return;
                }

                // Kiểm tra Token từ Redis
                var redisKey = $"user:{userId}:accessToken";
                var redisToken = await _redisService.GetValueAsync(redisKey);
                if (redisToken == null)
                {
                    DenyAccess(context, "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
                    return;
                }

                // Check if the user has the required role
                if (!string.Equals(role, _requiredRole, System.StringComparison.OrdinalIgnoreCase))
                {
                    DenyAccess(context, "Bạn không có quyền truy cập chức năng này");
                    return;
                }
            }
            else
            {
                DenyAccess(context, "Vui lòng đăng nhập để thực hiện chức năng này");
            }

            return;
        }

        private void DenyAccess(AuthorizationFilterContext context, string message)
        {
            context.HttpContext.Response.ContentType = "application/json";
            context.HttpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
            context.Result = new JsonResult(new
            {
                ReturnCode = System.Net.HttpStatusCode.Unauthorized,
                ReturnMessage = message
            });
        }
    }
}
