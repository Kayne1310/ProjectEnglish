using FluentValidation;
using ProjectFall2025.Domain.Do.FlashCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateStudySet :AbstractValidator<StudySet>
        
    {
        public ValidateStudySet()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title not null");
            RuleFor(x => x.Desc).NotEmpty().WithMessage("Description not null");
            RuleFor(x => x.Language).NotEmpty().WithMessage("Language not null");
        }
    }
}
