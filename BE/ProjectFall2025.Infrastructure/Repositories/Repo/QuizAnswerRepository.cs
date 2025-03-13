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

        public async Task<QuizAnswer> findQuizAnswerById(DeleteAnswerQuestionVM answerQuestionId, IClientSessionHandle session = null)
        {
            var connection = dbContext.GetCollectionQuizAnswer();
            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);
            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            if (session != null)
            {
                return await connection.Find(session, filter).FirstOrDefaultAsync();
            }
            return await connection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<QuizAnswer> createQuizAnswer(QuizAnswer quiz, IClientSessionHandle session = null)
        {
            var collection = dbContext.GetCollectionQuizAnswer();

            if (session != null)
            {
                await collection.InsertOneAsync(session, quiz);
            }
            else
            {
                await collection.InsertOneAsync(quiz);
            }

            return quiz;
        }

        public async Task<int> updateQuizAnswer(QuizAnswer quiz, IClientSessionHandle session = null)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            // Tạo đối tượng update chỉ chứa các trường cần cập nhật
            var updateDefinition = Builders<QuizAnswer>.Update
                .Set(a => a.description, quiz.description)
                .Set(a => a.correct_answer, quiz.correct_answer)
                .Set(a => a.updateAt, DateTime.Now);

            // Thực hiện cập nhật trong MongoDB
            UpdateResult updateResult;
            if (session != null)
            {
                updateResult = await connection.UpdateOneAsync(
                    session,
                    Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, quiz.quizAnswer_id),
                    updateDefinition
                );
            }
            else
            {
                updateResult = await connection.UpdateOneAsync(
                    Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, quiz.quizAnswer_id),
                    updateDefinition
                );
            }

            // Trả về số lượng bản ghi đã cập nhật
            return (int)updateResult.ModifiedCount;
        }

        // Delete answer
        public async Task<int> deleteQuizAnswer(DeleteAnswerQuestionVM answerQuestionId, IClientSessionHandle session = null)
        {
            var connection = dbContext.GetCollectionQuizAnswer();
            var objectId = ObjectId.Parse(answerQuestionId.quizAnswer_id);
            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.quizAnswer_id, objectId);

            DeleteResult res;
            if (session != null)
            {
                res = await connection.DeleteOneAsync(session, filter);
            }
            else
            {
                res = await connection.DeleteOneAsync(filter);
            }

            return (int)res.DeletedCount;
        }

        // Delete question with answer
        public async Task<int> DeleteByQuestionIdAsync(ObjectId questionId, IClientSessionHandle session = null)
        {
            var connection = dbContext.GetCollectionQuizAnswer();

            var filter = Builders<QuizAnswer>.Filter.Eq(f => f.question_id,questionId);
            DeleteResult deleteResult;
            if (session != null)
            {
                deleteResult = await connection.DeleteManyAsync(session, filter);
            }
            else
            {
                deleteResult = await connection.DeleteManyAsync(filter);
            }
            return (int)deleteResult.DeletedCount;
        }

        public async Task<List<BsonDocument>> GetCorrectQuizAnswersAsync(DeleteQuizVM quizId)
        {
            var db = dbContext.GetCollectionQuizAnswer();

            var lookupQuestion = new BsonDocument("$lookup", new BsonDocument
            {
                { "from", "QuizQuestion" },
                { "let", new BsonDocument("questionId", "$question_id") },
                { "pipeline", new BsonArray
                    {
                        new BsonDocument("$match", new BsonDocument
                        {
                            { "$expr", new BsonDocument("$eq", new BsonArray { "$_id", "$$questionId" }) }
                        }),
                        new BsonDocument("$lookup", new BsonDocument
                        {
                            { "from", "Quiz" },
                            { "let", new BsonDocument("quizId", "$quiz_id") },
                            { "pipeline", new BsonArray
                                {
                                    new BsonDocument("$match", new BsonDocument
                                    {
                                        { "$expr", new BsonDocument("$eq", new BsonArray { "$_id", "$$quizId" }) },
                                        { "_id", new ObjectId(quizId.quiz_id) }
                                    })
                                }
                            },
                            { "as", "quiz_info" }
                        }),
                        new BsonDocument("$unwind", "$quiz_info")
                    }
                },
                { "as", "question_info" }
            });

            var unwindQuestion = new BsonDocument("$unwind", "$question_info");

            var matchCorrectAnswer = new BsonDocument("$match", new BsonDocument
            {
                { "correct_answer", true }
            });

            var pipeline = new[] { lookupQuestion, unwindQuestion, matchCorrectAnswer };

            return await db.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }
    }
}
