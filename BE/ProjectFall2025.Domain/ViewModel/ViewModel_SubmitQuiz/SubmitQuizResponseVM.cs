using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_SubmitQuiz
{
    public class SubmitQuizResponse
    {
        public string QuizId { get; set; } // ID của Quiz
        public string QuizTitle { get; set; }
        public string QuizDescription { get; set; }
        public List<QuizResult> QuizData { get; set; } = new List<QuizResult>();
        public int CountCorrect { get; set; }
        public int CountTotal { get; set; }
    }

    public class QuizResult
    {
        public string QuestionId { get; set; }
        public string QuestionDescription { get; set; }
        public bool IsCorrect { get; set; }
        public string UserAnswerId { get; set; } // ID của đáp án người dùng chọn
        public string UserAnswerDescription { get; set; } 
        public List<AnswerDto> SystemAnswers { get; set; } = new List<AnswerDto>();
    }

    public class AnswerDto
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public bool CorrectAnswer { get; set; }
    }
}
