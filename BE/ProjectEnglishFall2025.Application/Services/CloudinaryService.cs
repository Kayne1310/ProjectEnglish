
﻿using Microsoft.AspNetCore.Http;
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
            try
            {

            // kiểm tra file
            if (file == null || file.Length == 0) throw new Exception("File is not provided!");

            // đọc file
            using var stream = file.OpenReadStream();

            // tạo tham số upload
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,  // Chỉ định folder thay vì gán trong PublicId
                PublicId = Guid.NewGuid().ToString(), // Chỉ định ID file riêng biệt
                Overwrite = true
            };  


            // upload file
            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            // kiểm tra kết quả upload
            if (uploadResult?.StatusCode != System.Net.HttpStatusCode.OK) throw new Exception("Upload image failed!");

            // trả về đường dẫn file
            return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
