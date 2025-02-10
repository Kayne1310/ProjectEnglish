using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer
{
    public class createAIAnswerVM
    {
        public string responseAI { get; set; }
        public string question_id { get; set; }
    }

    public class updateAIAnswerVM
    {
        public string aiAnswer_id { get; set; }
        public string responseAI { get; set; }
        public string question_id { get; set; }
    }

    public class deleteAIAnswerVM
    {
        public string aiAnswer_id { get; set; }
    }
}
