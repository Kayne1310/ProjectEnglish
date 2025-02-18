using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion
{
    public class CreateQuizQuestionVM
    {
        public string? description { get; set; }
        public string? image { get; set; }
        public string quiz_id { get; set; }
    }

    public class UpdateQuizQuestionVM
    {
        public string question_id { get; set; }
        public string? description { get; set; }
        public string? image { get; set; }
        public string quiz_id { get; set; }
    }

    public class DeleteQuizQuestionVM
    {
        public string question_id { get; set; }
    }
}
