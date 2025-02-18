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
    }
}
