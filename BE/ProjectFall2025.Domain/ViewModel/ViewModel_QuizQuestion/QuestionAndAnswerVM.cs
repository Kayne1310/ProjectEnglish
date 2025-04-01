using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion
{
    public class QuestionAndAnswerVM
    {

        public string question_id { get; set; }
        public string? description { get; set; }
        public string? image { get; set; }
        public string quiz_id { get; set; }
        public QuizInforVM QuizInforVM { get; set; }
        public List<AnswerVM> answers { get; set; }
    }

    public class AnswerVM
    {
        public string idAnswered { get; set; }
        public string description { get; set; }
        public bool correct_answer { get; set; }
    }

    public class QuizInforVM
    {
        public string name { get; set; }
        public string? description { get; set; }
        public string image { get; set; }
        public string? difficulty { get; set; }
    }
}