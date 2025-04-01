using ProjectFall2025.Domain.Do;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using Microsoft.AspNetCore.Http;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Domain.ViewModel.ViewModel_SubmitQuiz;

namespace ProjectFall2025.Application.IServices
{
    public interface IQuizService
    {
        Task<List<QuizDto>> GetAllQuizs();
        Task<Quiz> GetIdQuiz(DeleteQuizVM quiz);
        Task<ReturnData> AddQuiz(CreateQuizVM quiz);
        Task<ReturnData> UpdateQuiz(UpdateQuizVM quiz);
        Task<ReturnData> DeleteQuiz(DeleteQuizVM quiz);
        Task<ReturnData> HandleDelete(DeleteQuizVM request); // Xóa quiz và các question và answer liên quan
        Task<List<QuizzAndQuestionVM> > getCountQuestionInQuiz();
        Task<List<QuestionAndAnswerVM> > GetQuestionsAndAnswersByQuizIdAsync(string id);
        Task<SubmitQuizResponse> SubmitQuizAsync(SubmitQuizRequest request, string userId);
    }
}
