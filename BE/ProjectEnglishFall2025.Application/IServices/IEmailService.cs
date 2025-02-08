using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string token);
    }
}
