using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using ProjectFall2025.Application.IServices;

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
            if (file == null || file.Length == 0)
                 throw new ArgumentException("File is not provided!");

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folder,  // Chỉ định folder thay vì gán trong PublicId
                PublicId = Guid.NewGuid().ToString(), // Chỉ định ID file riêng biệt
                Overwrite = true
            };  

            var uploadResult = await cloudinary.UploadAsync(uploadParams);

            if (uploadResult?.StatusCode != System.Net.HttpStatusCode.OK)
                throw new Exception("Error uploading image to Cloudinary");

            return uploadResult.SecureUrl.ToString();
        }
    }
}
