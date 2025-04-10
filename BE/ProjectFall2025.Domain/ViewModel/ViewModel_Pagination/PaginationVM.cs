using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_Pagination
{
    public class PaginationRequest
    {
        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 2;
        public string? SortBy { get; set; }
        public bool SortAscending { get; set; } = true;  // Mặc định tăng dần
        public string QuizId { get; set; } // ID của quiz để lọc câu hỏi
    }

    public class PaginatedResponse<T>
    {
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public List<T> Items { get; set; }
    }
}
