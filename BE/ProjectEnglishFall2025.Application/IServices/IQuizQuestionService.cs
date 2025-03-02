using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IQuizQuestionService
    {
        Task<List<QuizQuestion>> getAllQuizQuestion();
        Task<QuizQuestion> getQuizQuestionById(DeleteQuizQuestionVM quizQuestion);
        //Task<ReturnData> createQuizQuestion(CreateQuizQuestionVM quizQuestion);
        Task<ReturnData> updateQuizQuestion(UpdateQuizQuestionVM quizQuestion);
        Task<ReturnData> deleteQuizQuestion(DeleteQuizQuestionVM quizQuestion);
        Task<ReturnData> Handle(CreateQuizQuestionWithAnswersCommand command);
    }
}
