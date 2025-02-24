using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // Added

namespace ProjectFall2025.Domain.ViewModel.ViewModel_Quiz
{
    public class CreateQuizVM
    {
        public string name { get; set; }
        public string? description { get; set; }
        public IFormFile image { get; set; }
        public string? difficutly { get; set; }
        public string countryName { get; set; }
    }

    public class UpdateQuizVM
    {
        public string quiz_id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public IFormFile image { get; set; }
        public string? difficutly { get; set; }
        public string countryName { get; set; }
    }

    public class DeleteQuizVM
    {
        public string quiz_id { get; set; }
    }

    public class QuizDto
    {
        public string quiz_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string imageQuiz { get; set; }
        public string difficutly { get; set; }
        public string countryName { get; set; }
        public string countryImg { get; set; }

    }

}
