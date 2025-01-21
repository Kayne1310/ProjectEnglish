using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.IServices
{
    public interface IRedisService
    {

        /// <summary>
        /// Lưu trữ giá trị vào Redis với thời gian sống (TTL).
        /// </summary>
        /// <param name="key">Key để lưu trữ.</param>
        /// <param name="value">Giá trị cần lưu.</param>
        /// <param name="expiry">Thời gian sống (TTL) của key.</param>
        /// <returns>Task không trả về kết quả.</returns>
        Task SetValueAsync(string key, string value, TimeSpan expiry);

        /// <summary>
        /// Lấy giá trị từ Redis theo key.
        /// </summary>
        /// <param name="key">Key để lấy giá trị.</param>
        /// <returns>Task trả về giá trị dạng chuỗi.</returns>
        Task<string> GetValueAsync(string key);

        /// <summary>
        /// Xóa một key khỏi Redis.
        /// </summary>
        /// <param name="key">Key cần xóa.</param>
        /// <returns>Task không trả về kết quả.</returns>
        Task DeleteKeyAsync(string key);

        /// <summary>
        /// Kiểm tra xem một key có tồn tại trong Redis hay không.
        /// </summary>
        /// <param name="key">Key cần kiểm tra.</param>
        /// <returns>Task trả về giá trị boolean.</returns>
        Task<bool> KeyExistsAsync(string key);
    }
}
