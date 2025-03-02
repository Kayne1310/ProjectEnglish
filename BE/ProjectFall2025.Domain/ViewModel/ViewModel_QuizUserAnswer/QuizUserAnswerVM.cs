using MongoDB.Bson;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

    public class ExamQuizAnswerByUserVM
    {
        public string UserID { get; set; }
        public string quiz_id { get; set; }
        public List<UserAnswerVM> listUserAnswerVM { get; set; }
    }
    public class ResponsExamQuizAnswerByUserVM
    {
        public ReturnData returnData { get; set; }
        public List<listResponsExamQuizAnswerByUserVM> listResponsExamQuizAnswerByUserVMs { get; set; }
        // Constructor khởi tạo mặc định
        public ResponsExamQuizAnswerByUserVM()
        {
            returnData = new ReturnData();  // Tạo đối tượng ReturnData mặc định
        }


    }
    public class SystemAnswers
    {
        public string systemAssessId { get; set; }
        public string description { get; set; }
    }
    public class UserAnswerVM
    {
        public string questionId { get; set; }
        public string userAnswerId { get; set; }
    }

    public class listResponsExamQuizAnswerByUserVM
    {
        public string questionId { get; set; }
        public bool isCorrect { get; set; }
        public SystemAnswers systemAnswers { get; set; }
    }

}
