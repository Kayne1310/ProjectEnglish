using Microsoft.AspNetCore.Http;
using ProjectFall2025.Application.IServices;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary cloudinary;

        public CloudinaryService(Cloudinary cloudinary)
        {
            this.cloudinary = cloudinary;
        }
        public async Task<string> UploadImageAsync(IFormFile file, string folder = "default")
        {
            // kiểm tra file
            if (file == null || file.Length == 0) throw new Exception("File is not provided!");

            // đọc file
            using var stream = file.OpenReadStream();

            // tạo tham số upload
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder, // chỉ định folder
                PublicId = Guid.NewGuid().ToString(), // chỉ định Id file riêng trên cloudinary
                Overwrite = true // nếu file đã tồn tại thì ghi đè
            };

            // upload file
            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            // kiểm tra kết quả upload
            if (uploadResult?.StatusCode != System.Net.HttpStatusCode.OK) throw new Exception("Upload image failed!");

            // trả về đường dẫn file
            return uploadResult.SecureUrl.ToString();
        }
    }
}
