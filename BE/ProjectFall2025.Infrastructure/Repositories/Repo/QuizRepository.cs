using AutoMapper;
using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
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

        public async Task<int> GetQuizCountAsync()
        {
            var collection = dbContext.GetCollectionQuiz();
            return (int)await collection.CountDocumentsAsync(FilterDefinition<Quiz>.Empty);
        }

        public async Task<List<Quiz>> GetAllQuizsAsync(int skip, int pageSize, string sortBy, bool sortAscending)
        {
            var collection = dbContext.GetCollectionQuiz();
            var sortDefinition = sortAscending
                ? Builders<Quiz>.Sort.Ascending(sortBy)
                : Builders<Quiz>.Sort.Descending(sortBy);

            return await collection.Find(FilterDefinition<Quiz>.Empty)
                .Sort(sortDefinition)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<Quiz> GetQuizById(DeleteQuizVM quiz, IClientSessionHandle session = null)
        {
            var collection = dbContext.GetCollectionQuiz();

            var objectId = ObjectId.Parse(quiz.quiz_id);

            // Tạo bộ lọc dựa trên quiz_id
            var filter = Builders<Quiz>.Filter.Eq(x => x.quiz_id, objectId);

            if (session != null)
            {
                return await collection.Find(session, filter).FirstOrDefaultAsync();
            }
            else
            {
                return await collection.Find(filter).FirstOrDefaultAsync();
            }

        }

        public async Task<Quiz> AddQuiz(Quiz quiz)
        {
            var collection = dbContext.GetCollectionQuiz();

            await collection.InsertOneAsync(quiz); // Chèn vào database

            return quiz; // Trả về đối tượng vừa thêm
        }

        public async Task<int> UpdateQuiz(Quiz quiz)
        {
            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<Quiz>.Update
                .Set(q => q.name, quiz.name)
                .Set(q => q.description, quiz.description)
                .Set(q => q.difficulty, quiz.difficulty)
                .Set(q => q.updateAt, DateTime.Now);

            // Nếu có ảnh mới, cập nhật trường image
            if (!string.IsNullOrEmpty(quiz.image))
            {
                updateDefinition = updateDefinition.Set(q => q.image, quiz.image);
            }

            // Nếu có countryName, cập nhật cả countryName và countryImg
            if (!string.IsNullOrEmpty(quiz.countryName))
            {
                updateDefinition = updateDefinition
                    .Set(q => q.countryName, quiz.countryName)
                    .Set(q => q.countryImg, quiz.countryImg);
            }

            // Thực hiện cập nhật trong MongoDB
            var updateResult = await dbContext.GetCollectionQuiz()
                .UpdateOneAsync(x => x.quiz_id == quiz.quiz_id, updateDefinition);

            // Trả về số lượng bản ghi đã được cập nhật
            return (int)updateResult.ModifiedCount;
        }
        public async Task<int> deleteHistory(deleteHistoryVM history)
        {
            var delete = dbContext.GetCollectionHistory();

            var objectId = ObjectId.Parse(history.history_id);

            var filter = Builders<History>.Filter.Eq(x => x.history_id, objectId);

            var res = await delete.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }

        public async Task<int> DeleteQuiz(DeleteQuizVM quiz, IClientSessionHandle session = null)
        {
            var db = dbContext.GetCollectionQuiz();
            var filter = Builders<Quiz>.Filter.Eq(q => q.quiz_id, ObjectId.Parse(quiz.quiz_id));
            DeleteResult result = session != null
                ? await db.DeleteOneAsync(session, filter)
                : await db.DeleteOneAsync(filter);
            return (int)result.DeletedCount;
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

        public async Task<(int totalItems, List<BsonDocument> questions)> GetQuestionsByQuizIdAsync(
                ObjectId quizId,
                int skip,
                int limit,
                string sortBy,
                bool sortAscending)
        {
            // Pipeline để đếm tổng số câu hỏi
            var countPipeline = new[]
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
                    { "preserveNullAndEmptyArrays", true }
                }),
                new BsonDocument("$count", "total")
            };

            var countResult = await dbContext.GetCollectionQuiz()
                .Aggregate<BsonDocument>(countPipeline)
                .FirstOrDefaultAsync();
            int totalItems = countResult != null && countResult.Contains("total") ? countResult["total"].AsInt32 : 0;

            // Pipeline chính với pagination và sorting
            var pipeline = new List<BsonDocument>
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
                    { "preserveNullAndEmptyArrays", true }
                }),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "QuizAnswer" },
                    { "localField", "QuestionInfor._id" },
                    { "foreignField", "question_id" },
                    { "as", "QuestionInfor.QuestionAnswer" }
                }),
                new BsonDocument("$sort", new BsonDocument
                {
                    { $"QuestionInfor.{sortBy}", sortAscending ? 1 : -1 }
                }),
                new BsonDocument("$skip", skip),
                new BsonDocument("$limit", limit),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$_id" },
                    { "name", new BsonDocument("$first", "$name") },
                    { "description", new BsonDocument("$first", "$description") },
                    { "image", new BsonDocument("$first", "$image") },
                    { "difficulty", new BsonDocument("$first", "$difficulty") },
                    { "createAt", new BsonDocument("$first", "$createAt") },
                    { "updateAt", new BsonDocument("$first", "$updateAt") },
                    { "QuestionInfor", new BsonDocument("$push", "$QuestionInfor") }
                })
            };

            var result = await dbContext.GetCollectionQuiz()
                  .Aggregate<BsonDocument>(pipeline)
                  .ToListAsync();

            return (totalItems, result);
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
                    { "difficulty", new BsonDocument("$first", "$difficulty") },
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
