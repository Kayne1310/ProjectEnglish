using FluentValidation;
using ProjectFall2025.Domain.Do.FlashCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ValidateData
{
    public class FlashCardValidate :AbstractValidator<Flashcard>

    {
        public FlashCardValidate()
        {
            RuleFor(x=>x.Title).NotEmpty().WithMessage("Title Not Null");
            RuleFor(x=>x.Define).NotEmpty().WithMessage("Define Not Null");

            RuleFor(x => x.Note).NotEmpty().WithMessage("Note Not Null");
            RuleFor(x=>x.Transcription).NotEmpty().WithMessage("Transcription Not Null");
            RuleFor(x => x.TypeOfWord).NotEmpty().WithMessage("TypeOfWord Not Null");
        }
    }
}
