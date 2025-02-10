using FluentValidation;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateQuizQuestion : AbstractValidator<QuizQuestion>
    {
        public ValidateQuizQuestion()
        {
            RuleFor(u => u.description).NotEmpty().WithMessage("desciption is not null");
            RuleFor(u => u.image).NotEmpty().WithMessage("image is not null");
        }
    }
}
