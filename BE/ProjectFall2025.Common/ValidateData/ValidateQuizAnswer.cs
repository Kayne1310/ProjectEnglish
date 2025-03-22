using FluentValidation;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateQuizAnswer : AbstractValidator<QuizAnswer>
    {
        public ValidateQuizAnswer()
        {
            RuleFor(u => u.description).NotEmpty().WithMessage("answer is not null");
            RuleFor(u => u.correct_answer).NotEmpty().WithMessage("correct_answer is not null");
        }
    }
}
