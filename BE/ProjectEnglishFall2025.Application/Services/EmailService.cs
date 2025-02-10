using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using Microsoft.Extensions.Options;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Application.IServices;


public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendPasswordResetEmailAsync(string email, string token)
    {
        var resetLink = $"{_emailSettings.FrontendBaseUrl}/reset-password?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";

        var subject = "Đặt lại mật khẩu";
        var body = $"<p>Nhấn vào link dưới đây để đặt lại mật khẩu của bạn:</p>" +
                   $"<p><a href='{resetLink}'>Đặt lại mật khẩu</a></p>";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Quizz App", _emailSettings.SenderEmail));
        email.To.Add(new MailboxAddress("", to));
        email.Subject = subject;
        email.Body = new TextPart(TextFormat.Html) { Text = body };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
