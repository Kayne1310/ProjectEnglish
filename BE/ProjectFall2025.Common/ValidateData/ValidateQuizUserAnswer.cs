using FluentValidation;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateQuizUserAnswer : AbstractValidator<QuizUserAnswer>
    {
        public ValidateQuizUserAnswer()
        {
            RuleFor(x => x.user_answers).NotEmpty().WithMessage("user_answers is required");
        }
    }
}
