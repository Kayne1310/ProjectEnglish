using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz
{
    public class CreateUserQuizVM
    {
        public int is_finish { get; set; }
        public string time_start { get; set; }
        public string time_end { get; set; }
        public string quiz_id { get; set; }
    }

    public class UpdateUserQuizVM
    {
        public string userQuiz_id { get; set; }
        public int is_finish { get; set; }
        public string time_start { get; set; }
        public string time_end { get; set; }
        public string quiz_id { get; set; }
    }

    public class DeleteUserQuizVM
    {
        public string userQuiz_id { get; set; }
    }
}
