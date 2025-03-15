using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ProjectFall2025.Common.ImgCountry
{
    public class Country
    {
        private static readonly Dictionary<string, string> CountryImages = new()
        {
            { "Vietnam", "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740303925/COUNTRY/l5jaiobfznxhb7poxc8i.png" },
            { "UK", "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305084/COUNTRY/e17iowqr2ipaqe0aympq.png" },
            { "Japan", "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305058/COUNTRY/wtbrfljoh73gffepv3jc.png" },
            { "Korea", "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305276/COUNTRY/vszrzpe6amyvnjy4fti1.png" },
            { "China", "https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740305215/COUNTRY/zduntbvenfyewpkondef.jpg" }
        };

        public static string GetImageCountry(string countryName)
        {
            // Kiểm tra nếu chuỗi null hoặc rỗng
            if (string.IsNullOrWhiteSpace(countryName))
            {
                throw new ArgumentException("Country name cannot be left blank.");
            }

            // Chuẩn hóa chuỗi (loại bỏ khoảng trắng thừa)
            countryName = countryName.Trim();

            // Kiểm tra định dạng hợp lệ: chỉ chứa chữ cái và khoảng trắng (có thể mở rộng nếu cần)
            if (!Regex.IsMatch(countryName, @"^[A-Za-z\s-]+$"))
            {
                throw new ArgumentException("Incorrect format");
            }

            // Kiểm tra nếu có trong danh sách
            return CountryImages.TryGetValue(countryName, out string imageUrl)
                ? imageUrl
                : throw new KeyNotFoundException("No photos found for this country.");
        }
    }
}
