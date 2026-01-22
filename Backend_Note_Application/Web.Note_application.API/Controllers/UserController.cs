using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Web.Note_application.API.Data;
using Web.Note_application.API.DTO.Request;
using Web.Note_application.API.Model;

namespace Web.Note_application.API.Controllers
{
    [ApiController]
    [Route("auth/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private DateTime GetCambodiaTime()
        {
            var khTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, khTimeZone);
        }
        [HttpPost("SignUp")]
        public IActionResult CreateUser([FromBody] SignUpRequestDto user)
        {
            var newUser = new UserModel
            {
                UserName = user.UserName,
                Password = PasswordHasher.HashPassword(user.Password),
                CreatedAt = GetCambodiaTime()
            };

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                connection.Execute(
                    Queries.CreateUser,
                    new
                    {
                        UserName = newUser.UserName,
                        Password = newUser.Password,
                        CreatedAt = newUser.CreatedAt
                    }
                );
            }

            return Ok(new { message = "User created successfully" });
        }

        [HttpPost("LogIn")]
        public IActionResult LogIn([FromBody] LoginRequestDto user)
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var dbUser = connection.QuerySingleOrDefault<UserModel>(
                    Queries.GetLoginUser,
                    new { UserName = user.UserName }
                );

                if (dbUser == null || !PasswordHasher.VerifyPassword(user.Password, dbUser.Password))
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                var token = JwtTokenHelper.GenerateToken(dbUser.UserName, dbUser.UserId, _configuration);

                return Ok(new { token, userName = dbUser.UserName, userId = dbUser.UserId });
            }
        }
    }
}
    