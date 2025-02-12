using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer
{
    public class createQuizUserAnswerVM
    {
        public string? user_answers { get; set; }
        public string UserID { get; set; }
        public string quiz_id { get; set; }
        public string question_id { get; set; }
    }
    public class updateQuizUserAnswerVM
    {
        public string quizUserAnswer_id { get; set; }
        public string? user_answers { get; set; }
        public string UserID { get; set; }
        public string quiz_id { get; set; }
        public string question_id { get; set; }
    }

    public class deleteQuizUserAnswerVM
    {
        public string quizUserAnswer_id { get; set; }
    }
}
