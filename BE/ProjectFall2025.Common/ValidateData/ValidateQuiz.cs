using FluentValidation;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateQuiz : AbstractValidator<Quiz>
    {
        public ValidateQuiz()
        {
            RuleFor(u => u.name).NotEmpty().WithMessage("Name is not null").MaximumLength(15).WithMessage("Name must be less than 15 characters");
            RuleFor(u => u.difficutly).NotEmpty().WithMessage("Difficutly is not null");
            RuleFor(u => u.image).NotEmpty().WithMessage("Image is not null");
        }

    }
}
