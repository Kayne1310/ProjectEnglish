using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_SubmitQuiz
{
    public class SubmitQuizRequest
    {
        public string QuizId { get; set; }
        public List<UserAnswer> Answers { get; set; } = new List<UserAnswer>();
    }

    public class UserAnswer
    {
        public string QuestionId { get; set; }
        public string UserAnswerId { get; set; } // ID của đáp án người dùng chọn
    }
}
