namespace ProjectEnglishFall2025.Filter
{
    public class JwtFromCookieMiddleware
    {
        private readonly RequestDelegate _next;



        public JwtFromCookieMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Cookies.TryGetValue("accessToken", out var token))
            {
                context.Request.Headers.Append("Authorization", $"Bearer {token}");
            }
            await _next(context);
        }
    }
}
