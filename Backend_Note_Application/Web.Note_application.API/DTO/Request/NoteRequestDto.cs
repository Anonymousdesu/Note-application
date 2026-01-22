namespace Web.Note_application.API.DTO.Request
{
    public class NoteRequestDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int UserId { get; set; }
    }
}