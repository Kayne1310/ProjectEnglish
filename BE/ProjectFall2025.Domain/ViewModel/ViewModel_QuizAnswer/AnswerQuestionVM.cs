using MongoDB.Bson;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer
{
    public class CreateAnswerQuestionVM
    {
        public string? description { get; set; }
        public int? correct_answer { get; set; }
        public string question_id { get; set; }
    }

    public class UpdateAnswerQuestionVM
    {
        public string quizAnswer_id { get; set; }
        public string? description { get; set; }
        public int? correct_answer { get; set; }
        public string question_id { get; set; }
    }

    public class DeleteAnswerQuestionVM
    {
        public string quizAnswer_id { get; set; }
    }

    public class QuizAnswerDto
    {
        public string quizAnswer_id { get; set; }
        public string description { get; set; }
        public bool correctAnswer { get; set; }
        public List<QuizQuestionDto> questionInfo { get; set; }
    }

}
