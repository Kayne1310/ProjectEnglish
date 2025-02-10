using FluentValidation;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateUserQuiz : AbstractValidator<UserQuiz>
    {
        public ValidateUserQuiz()
        {
            RuleFor(u => u.is_finish).NotEmpty().WithMessage("is_finish is not null");
            RuleFor(u => u.time_start).NotEmpty().WithMessage("time_start is not null");
            RuleFor(u => u.time_end).NotEmpty().WithMessage("time_end is not null");
        }
    }
}
