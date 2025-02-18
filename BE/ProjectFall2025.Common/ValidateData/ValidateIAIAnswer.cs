using FluentValidation;
using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateIAIAnswer : AbstractValidator<AIAnswer>
    {
        public ValidateIAIAnswer()
        {
            RuleFor(x => x.responseAI).NotEmpty().WithMessage("responseAI is required");
        }
    }
}
