using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer
{
    public class CreateAnswerQuestionVM
    {
        public string? desciption { get; set; }
        public int? correct_answer { get; set; }
        public string question_id { get; set; }
    }

    public class UpdateAnswerQuestionVM
    {
        public string quizAnswer_id { get; set; }
        public string? desciption { get; set; }
        public int? correct_answer { get; set; }
        public string question_id { get; set; }
    }

    public class DeleteAnswerQuestionVM
    {
        public string quizAnswer_id { get; set; }
    }
}
