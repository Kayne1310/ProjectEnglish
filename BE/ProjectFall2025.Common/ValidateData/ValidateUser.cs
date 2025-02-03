using FluentValidation;
using ProjectFall2025.Domain.ViewModel;

namespace ProjectFall2025.Common.ValidateData
{
    public class ValidateUser : AbstractValidator<UserViewModel>
    {
        public ValidateUser()
        {

            RuleFor(user => user.Email).NotEmpty().WithMessage("Email not null")
                    .EmailAddress().WithMessage("Email Invalid").WithErrorCode("200");


            RuleFor(u => u.UserName).NotEmpty().WithMessage("Username Not Null");

            RuleFor(u => u.Password).NotEmpty().WithMessage("Password Not Null")
                .MinimumLength(6).WithMessage("Password must be greater than 6 ");

        }
    }
}
