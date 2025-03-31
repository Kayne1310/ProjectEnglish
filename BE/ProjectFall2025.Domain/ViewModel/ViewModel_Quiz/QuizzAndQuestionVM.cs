using ProjectFall2025.Domain.Do;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_Quiz
{
    public class QuizzAndQuestionVM 
    {

        public string quiz_id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public string? image { get; set; }
        public string? difficulty { get; set; }
        public int countQuestion { get; set; }
       
        public string? createAt { get; set; }


    }

 

    
}
