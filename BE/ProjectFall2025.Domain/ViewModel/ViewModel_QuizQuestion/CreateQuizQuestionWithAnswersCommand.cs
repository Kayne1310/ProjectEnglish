using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion
{
    public class CreateQuizQuestionWithAnswersCommand
    {
        public CreateQuizQuestionVM QuizQuestion { get; set; }
        public List<CreateAnswerQuestionVM> QuizAnswers { get; set; }
    }
}
