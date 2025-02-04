
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.Mapping;
using ProjectFall2025.Application.Services;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories;
using StackExchange.Redis;
using FluentValidation;
using FluentValidation.AspNetCore;


using System.Text;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Common.ValidateData;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;

namespace ProjectEnglishFall2025
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbConfiguration"));


            builder.Services.AddSingleton<MongoDbContext>();//dung singleton thi khoi tao di 1 lan den khi api dung

            //JWT
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = false,
                    ValidIssuer = builder.Configuration["Jwt:ValidIssuer"],
                    ValidAudience = builder.Configuration["Jwt:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
                };
            });

            //login with facebook and gooogle
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = FacebookDefaults.AuthenticationScheme;
            })
               .AddCookie()
               .AddFacebook(facebookOptions =>
               {
                   facebookOptions.AppId = builder.Configuration["Facebook:AppId"];
                   facebookOptions.AppSecret = builder.Configuration["Facebook:AppSecret"];
                   facebookOptions.SaveTokens = true;
                   facebookOptions.Scope.Add("email");
                   facebookOptions.Scope.Add("public_profile");
                   facebookOptions.Fields.Add("email");
                   facebookOptions.Fields.Add("name");
                   facebookOptions.CallbackPath = "/api/LoginWithFb";
               });

            //redis
            builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
             ConnectionMultiplexer.Connect(builder.Configuration["Redis:ConnectionString"]));

            builder.Services.AddTransient<IRedisService, RedisService>();



            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAcountRepository, AccountRepository>();
            builder.Services.AddScoped<IAcountService, AccountService>();
            builder.Services.AddScoped<IUserSessionRepository, UserSessionRepository>();
            builder.Services.AddScoped<IUserSessionService, UserSessionService>();

            //res validator

            builder.Services.AddFluentValidationAutoValidation();
            // Đăng ký tất cả Validators trong Assembly
            builder.Services.AddValidatorsFromAssemblyContaining<ValidateUser>();

            //cors
            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:5173") // Đúng địa chỉ FE
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                                  });
            });



            var app = builder.Build();
            app.UseCors(MyAllowSpecificOrigins);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
