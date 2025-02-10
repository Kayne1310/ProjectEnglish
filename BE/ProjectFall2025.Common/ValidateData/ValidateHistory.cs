using FluentValidation;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateHistory :AbstractValidator<History>
    {
        public ValidateHistory()
        {
            RuleFor(x => x.total_questions).NotEmpty().WithMessage("total_questions is required");
            RuleFor(x => x.total_corrects).NotEmpty().WithMessage("total_corrects is required");
        }
    }
}
