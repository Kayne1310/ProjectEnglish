using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class QuizAnswerRepository : IQuizAnswerRepository
    {
        private readonly MongoDbContext dbContext;

        public QuizAnswerRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<List<QuizAnswer>> getAllQuizAnswer()
        {
            var res = await dbContext.GetCollectionQuizAnswer()
                .Find(_ => true)
                .ToListAsync();

            return res;
        }

        public async Task<QuizAnswer> findQuizAnswerById(DeleteAnswerQuestionVM answerQuestionId)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);

            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            var res = await connection.Find(filter).FirstOrDefaultAsync();

            return res;
        }

        public async Task<QuizAnswer> createQuizAnswer(QuizAnswer quiz)
        {
            var collection = dbContext.GetCollectionQuizAnswer();

            await collection.InsertOneAsync(quiz);

            return quiz;
        }

        public async Task<int> updateQuizAnswer(QuizAnswer quiz)
        {
            var updateAnswer = await dbContext.GetCollectionQuizAnswer()
                .ReplaceOneAsync(f => f.quizAnswer_id == quiz.quizAnswer_id, quiz);

            return (int)updateAnswer.ModifiedCount;
        }

        public async Task<int> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionId)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);

            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            var res = await connection.DeleteOneAsync(filter);

            return (int)res.DeletedCount;
        }


 


        public async Task<List<QuizAnswerDto>> GetCorrectQuizAnswersAsync(string quizId)
        {
            var db = dbContext.GetCollectionQuizAnswer();

            // Tạo pipeline $lookup để kết hợp dữ liệu từ bảng QuizQuestion
            var lookupQuestion = new BsonDocument("$lookup", new BsonDocument
            {
                {"from", "QuizQuestion"}, // Kết hợp với bảng QuizQuestion
                {"let", new BsonDocument("questionId", "$question_id")}, // Biến local questionId lấy từ trường question_id của QuizAnswer
                {"pipeline", new BsonArray
                    {
                        // Lọc để chỉ lấy những câu hỏi có _id trùng với question_id của QuizAnswer
                        new BsonDocument("$match", new BsonDocument
                        {
                            {"$expr", new BsonDocument("$eq", new BsonArray { "$_id", "$$questionId" })}
                        }),

                        // Tiếp tục lookup từ QuizQuestion -> Quiz để lấy thông tin Quiz
                        new BsonDocument("$lookup", new BsonDocument
                        {
                            {"from", "Quiz"}, // Kết hợp với bảng Quiz
                            {"let", new BsonDocument("quizId", "$quiz_id")}, // Biến local quizId lấy từ trường quiz_id của QuizQuestion
                            {"pipeline", new BsonArray
                                {
                                    // Lọc để chỉ lấy quiz có _id trùng với quizId và có giá trị trùng với quizId truyền vào hàm
                                    new BsonDocument("$match", new BsonDocument
                                    {
                                        {"$expr", new BsonDocument("$eq", new BsonArray { "$_id", "$$quizId" })},
                                        {"_id", new ObjectId(quizId)} // Lọc theo quizId truyền vào
                                    })
                                }
                            },
                            {"as", "quiz_info"} // Kết quả lookup sẽ được lưu vào mảng quiz_info
                        }),

                        // Giải nén quiz_info để dễ truy cập dữ liệu
                        new BsonDocument("$unwind", "$quiz_info")
                    }
                },
                {"as", "question_info"} // Kết quả lookup sẽ được lưu vào mảng question_info
            });

            // Giải nén question_info để dễ truy cập dữ liệu
            var unwindQuestion = new BsonDocument("$unwind", "$question_info");

            // Lọc để chỉ lấy những câu trả lời đúng (correct_answer = 1)
            var matchCorrectAnswer = new BsonDocument("$match", new BsonDocument
            {
                {"correct_answer", 1}
            });

            // Tạo pipeline để thực thi truy vấn
            var pipeline = new[] { lookupQuestion, unwindQuestion, matchCorrectAnswer };

            // Thực hiện truy vấn Aggregate trên MongoDB
            var res = await db.Aggregate<BsonDocument>(pipeline).ToListAsync();

            // Chuyển đổi kết quả từ BsonDocument sang danh sách QuizAnswerDto
            var dtoRes = res.Select(bson => new QuizAnswerDto
            {
                quizAnswer_id = bson["_id"].ToString(), // ID của câu trả lời
                description = bson["description"].AsString, // Nội dung câu trả lời
                correctAnswer = bson["correct_answer"].AsInt32 == 1, // Xác định câu trả lời đúng hay sai

                // Danh sách thông tin câu hỏi liên quan
                questionInfo = new List<QuizQuestionDto>
                {
                    new QuizQuestionDto
                    {
                        question_id = bson["question_info"]["_id"].ToString(), // ID của câu hỏi
                        description = bson["question_info"]["description"].AsString, // Nội dung câu hỏi

                        // Danh sách thông tin quiz liên quan
                        quizInfo = new List<QuizDto>
                        {
                            new QuizDto
                            {
                                quiz_id = bson["question_info"]["quiz_info"]["_id"].ToString(), // ID của quiz
                                name = bson["question_info"]["quiz_info"]["name"].AsString, // Tên quiz
                                description = bson["question_info"]["quiz_info"]["description"].AsString, // Mô tả quiz
                                imageQuiz = bson["question_info"]["quiz_info"]["image"].AsString, // Ảnh của quiz
                                difficutly = bson["question_info"]["quiz_info"]["difficutly"].AsString,// Độ khó của quiz
                                countryName = bson["question_info"]["quiz_info"]["countryName"].AsString, // Tên quốc gia
                                countryImg = bson["question_info"]["quiz_info"]["countryImg"].AsString // Ảnh quốc gia
                            }
                        }
                    }
                }
            }).ToList();

            return dtoRes; // Trả về danh sách kết quả
        }
    }
}
