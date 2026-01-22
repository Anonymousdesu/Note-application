using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Web.Note_application.API.Data
{
    public class Queries
    {
        public const string CreateUser = @"
            INSERT INTO Users 
                (UserName, Password, CreatedAt)
            VALUES (@UserName, @Password, @CreatedAt)";

        public const string GetLoginUser = @"SELECT * FROM Users WHERE UserName = @UserName";

        public const string CreateNote = @"
            INSERT INTO 
                Notes (Title, Content, CreatedAt, UserId)
            VALUES (@Title, @Content, @CreatedAt, @UserId)";
        public const string UpdateNote = @"
            UPDATE Notes SET 
                Title = @Title, Content = @Content, UpdatedAt = @UpdatedAt
            WHERE NoteId = @NoteId AND UserId = @UserId";

        public const string GetNotes = @"SELECT * FROM Notes WHERE UserId = @UserId";

        public const string DeleteNote = "DELETE FROM Notes WHERE NoteId = @NoteId AND UserId = @UserId";
    }
}
