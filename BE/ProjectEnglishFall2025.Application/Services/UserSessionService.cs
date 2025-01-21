using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class UserSessionService : IUserSessionService
    {
        private readonly IUserSessionRepository repository;

        public UserSessionService(IUserSessionRepository repository)
        {
            this.repository = repository;
        }

        public async Task<int> addUserSession(UserSession userSession)
        {
            // Kiểm tra xem người dùng đã có session hợp lệ chưa
            var existingSession = await repository.GetUserSessionByUserId(userSession.UserId);

            if (existingSession != null && existingSession.isRevoked == "false" )
            {
                // Nếu đã có session hợp lệ, bạn có thể cập nhật session cũ
                var updatedSession = new UserSession
                {
                    id = existingSession.id,
                    UserId = userSession.UserId,
                    token = userSession.token,
                    isSueAt = DateTime.UtcNow,
                    expriresAt = userSession.expriresAt,
                    isRevoked = "false", // Không thay đổi trạng thái revoked
                 
                };

                var res = await repository.UpdateUserSession(updatedSession);
                if (res <= 0)
                {
                    return 0;
                }
                return res;
            }
            else
            {
                // Nếu không có session hợp lệ, hủy tất cả session cũ của người dùng
                await repository.RevokeUserSessionByUserId(userSession.UserId);

                // Tạo mới session cho người dùng
                var res = await repository.addUserSession(userSession);
                if (res <= 0)
                {
                    return 0;
                }
                return res;
            }
        }

        public async Task<int> removeUserSession(LogoutRequest logoutRequest)
        {
            if(logoutRequest == null)
            {
                return 0;
            }
            try
            {
                var res = await repository.DeleteUserSession(logoutRequest);

                return res;
            }
            catch
            {
                return 0;
            }


        }
    }
}
