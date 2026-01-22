using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Web.Note_application.API.Data;
using Web.Note_application.API.Model;
using Web.Note_application.API.DTO.Request;

namespace Web.Note_application.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public NotesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        private DateTime GetCambodiaTime()
        {
            var khTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, khTimeZone);
        }

        [HttpPost("CreateNote")]
        public IActionResult CreateNote([FromBody] NoteRequestDto payload)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
                return Unauthorized(new { message = "User ID not found in token." });

            var note = new NoteModel
            {
                UserId = parsedUserId,
                Title = payload.Title,
                Content = payload.Content,
                CreatedAt = GetCambodiaTime(),
                UpdatedAt = null
            };

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                connection.Execute(Queries.CreateNote, note);
            }
            return Ok(note);
        }
        [HttpGet("GetNotes")]
        public IActionResult GetNotes()
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
                return Unauthorized(new { message = "User ID not found in token." });

            IEnumerable<NoteModel> notes;
            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                notes = connection.Query<NoteModel>(
                    Queries.GetNotes,
                    new { UserId = parsedUserId }
                );
            }
            return Ok(notes);
        }
        [HttpPut("UpdateNote/{id}")]
        public IActionResult UpdateNote(int id, [FromBody] NoteModel payload)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
                return Unauthorized(new { message = "User ID not found in token." });

            var updatedAt = GetCambodiaTime();
            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var affected = connection.Execute(
                    Queries.UpdateNote,
                    new
                    {
                        NoteId = id,
                        Title = payload.Title,
                        Content = payload.Content,
                        UserId = parsedUserId,
                        UpdatedAt = updatedAt
                    }
                );
                if (affected == 0)
                    return NotFound(new { message = "Note not found or not owned by user." });
            }
            return Ok(new { message = "Note updated successfully" });
        }

        [HttpDelete("DeleteNote/{id}")]
        public IActionResult DeleteNote(int id)
        {
            var userId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
                return Unauthorized(new { message = "User ID not found in token." });

            using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                var affected = connection.Execute(
                    Queries.DeleteNote,
                    new
                    {
                        NoteId = id,
                        UserId = parsedUserId
                    }
                );
                if (affected == 0)
                    return NotFound(new { message = "Note not found or not owned by user." });
            }

            return Ok(new { message = "Note deleted successfully" });
        }

    }
}
