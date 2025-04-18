﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Domain.ViewModel.ViewModel_History
{
    public class HistoryDTO
    {
        public string history_id { get; set; }
        public string? total_questions { get; set; }
        public string? total_corrects { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get; set; }
        public string UserID { get; set; }
        public string quiz_id { get; set; }
    }

    public class createHistoryVM
    {
        public string? total_questions { get; set; }
        public string? total_corrects { get; set; }
        public string UserID { get; set; }
        public string quiz_id { get; set; }
    }

    public class updateHistoryVM
    {
        public string history_id { get; set; }
        public string? total_questions { get; set; }
        public string? total_corrects { get; set; }
        //public string UserID { get; set; }
        //public string quiz_id { get; set; }
    }

    public class deleteHistoryVM
    {
        public string history_id { get; set; }
    }
}
