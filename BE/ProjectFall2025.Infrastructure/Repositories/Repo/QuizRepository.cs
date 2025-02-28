using AutoMapper;
using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class QuizRepository : IQuizRepository
    {
        private readonly MongoDbContext dbContext;

        public QuizRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<Quiz>> GetAllQuizs()
        {
            var collection = dbContext.GetCollectionQuiz();

            var getAllQuizs = await collection
                .Find(_ => true)
                .ToListAsync(); // Find(_ => true): tìm tất cả

            return getAllQuizs;
        }

        public async Task<Quiz> GetQuizById(DeleteQuizVM quiz)
        {
            var collection = dbContext.GetCollectionQuiz();

            var objectId = ObjectId.Parse(quiz.quiz_id);

            // Tạo bộ lọc dựa trên quiz_id
            var filter = Builders<Quiz>.Filter.Eq(x => x.quiz_id, objectId);

            // Tìm tài liệu phù hợp
            var result = await collection.Find(filter).FirstOrDefaultAsync();

            return result;
        }

        public async Task<Quiz> AddQuiz(Quiz quiz)
        {
            var collection = dbContext.GetCollectionQuiz();

            await collection.InsertOneAsync(quiz); // Chèn vào database

            return quiz; // Trả về đối tượng vừa thêm
        }

        public async Task<int> UpdateQuiz(Quiz quiz)
        {
            var updateQuiz = await dbContext.GetCollectionQuiz()
                .ReplaceOneAsync(x => x.quiz_id == quiz.quiz_id, quiz); // ReplaceOneAsync: thay thế hoàn toàn 1 document

            return (int)updateQuiz.ModifiedCount; // Trả về số lượng bản ghi đã sửa
        }

        public async Task<int> DeleteQuiz(DeleteQuizVM quiz)
        {
            var collection = dbContext.GetCollectionQuiz();

            var objectId = ObjectId.Parse(quiz.quiz_id);

            var filter = Builders<Quiz>.Filter.Eq(x => x.quiz_id, objectId);

            var res = await collection.DeleteOneAsync(filter);

            return (int)res.DeletedCount; // Trả về số lượng bản ghi đã xóa
        }


        //get all Count Quetion in Quiz
        public async Task<List<BsonDocument>> getCountQuestionbyQuiz()
        {
            var res = await dbContext.GetCollectionQuiz()
                .Aggregate()
                .Lookup("QuizQuestion", "_id", "quiz_id", "QuestionInfor")
                .AppendStage<BsonDocument>(new BsonDocument("$set", new BsonDocument("countQuestion", new BsonDocument("$size", "$QuestionInfor"))))
                .ToListAsync();  // Lấy dữ liệu dưới dạng BsonDocument

       
            return res;

       
        }

        public async Task<List<BsonDocument>> GetQuestionByQuizId(ObjectId quizId)
        {
            var pipeline = new[]
         {
        new BsonDocument("$match", new BsonDocument("_id", quizId)),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "QuizQuestion" },
            { "localField", "_id" },
            { "foreignField", "quiz_id" },
            { "as", "QuestionInfor" }
        }),
         new BsonDocument("$unwind", new BsonDocument
        {
            { "path", "$QuestionInfor" },
            { "preserveNullAndEmptyArrays", true } // Giữ quiz ngay cả khi không có câu hỏi
        }),

        new BsonDocument("$lookup", new BsonDocument
        {
            { "from", "QuizAnswer" },
            { "localField", "QuestionInfor._id" },
            { "foreignField", "question_id" },
            { "as", "QuestionInfor.QuestionAnswer" }
        }),

          new BsonDocument("$group", new BsonDocument
         {
            { "_id", "$_id" },
            { "name", new BsonDocument("$first", "$name") },
            { "description", new BsonDocument("$first", "$description") },
            { "image", new BsonDocument("$first", "$image") },
            { "difficutly", new BsonDocument("$first", "$difficutly") },
            { "createAt", new BsonDocument("$first", "$createAt") },
            { "updateAt", new BsonDocument("$first", "$updateAt") },
            { "QuestionInfor", new BsonDocument("$push", "$QuestionInfor") }
              })
              };

            var result = await dbContext.GetCollectionQuiz()
                .Aggregate<BsonDocument>(pipeline)
                .ToListAsync();

            return result;
        }
    }
}
