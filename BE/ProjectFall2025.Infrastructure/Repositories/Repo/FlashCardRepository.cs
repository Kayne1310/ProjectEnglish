using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Infrastructure.Repositories.Repo
{
    public class FlashCardRepository : IFlashCardRepository
    {
        private readonly MongoDbContext dbContext;

        public FlashCardRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Flashcard> addFlashCardofStudyList(Flashcard flashcard)
        {
            await dbContext.GetCollectionFlashcard().InsertOneAsync(flashcard);
            return flashcard;
        }

        public async Task<int> deleteFlashCard(DeleteFlashcardVM deleteFlashcardVM)
        {
            var filter = Builders<Flashcard>.Filter.Eq(x => x.Id, deleteFlashcardVM.Id);
            var res = await dbContext.GetCollectionFlashcard().DeleteOneAsync(filter);
            return (int)res.DeletedCount;
        }

        public async Task<Flashcard> GetFlashcardById(string flashCardId)
        {
            var filter = Builders<Flashcard>.Filter.Eq(x => x.Id, flashCardId);
            var res = await dbContext.GetCollectionFlashcard().Find(filter).FirstOrDefaultAsync();
            return res;
        }

        public async Task<BsonDocument> getListFlashCardByStudySetId(string studySetId)
        {
            //collect list id Flashcard in StudySet
            var pipeline = new[]
            {
                new BsonDocument("$match",new BsonDocument("_id",new ObjectId(studySetId))),


                //lookup 
                new BsonDocument("$lookup", new BsonDocument
                        {
                            { "from", "Flashcard" },  // Tên collection chứa Flashcard
                            { "localField", "_id" },  // ID của StudySet
                            { "foreignField", "StudySetId" },  // ID của StudySet trong Flashcard
                            { "as", "FlashcardInfor" }  // Tên field chứa kết quả join
                        }),

                 // Bước 3: Lookup lấy thông tin User dựa trên userId
                        new BsonDocument("$lookup", new BsonDocument
                        {
                            { "from", "User" },  // Collection User
                            { "localField", "UserId" },  // userId trong StudySet
                            { "foreignField", "_id" },  // _id trong User
                            { "as", "userInfo" }  // Gán kết quả vào userInfo
                        }),

                        // Bước 4: Unwind userInfo để dễ lấy dữ liệu
                        new BsonDocument("$unwind", new BsonDocument
                        {
                            { "path", "$userInfo" },
                            { "preserveNullAndEmptyArrays", true } // Nếu user không tồn tại thì không bị lỗi
                        }),     
             };


            var result = await dbContext.GetCollectionStudySet().Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();

            return result;

        }
        public async Task<int> updateFlashCard(Flashcard flashcard)
        {
            var filter = Builders<Flashcard>.Filter.Eq(x => x.Id, flashcard.Id);
            var updateBuilder = Builders<Flashcard>.Update;
            var updates = new List<UpdateDefinition<Flashcard>>();
            //  Chỉ update nếu có giá trị mới
            updates.Add(updateBuilder.Set(x => x.Title, flashcard.Title));
            updates.Add(updateBuilder.Set(x => x.Define, flashcard.Define));
            updates.Add(updateBuilder.Set(x => x.TypeOfWord, flashcard.TypeOfWord));
            updates.Add(updateBuilder.Set(x => x.Transcription, flashcard.Transcription));

            if (flashcard.ExampleVM != null)
                updates.Add(updateBuilder.Set(x => x.ExampleVM, flashcard.ExampleVM));
            updates.Add(updateBuilder.Set(x => x.Status, flashcard.Status));

            if (!updates.Any()) return 0; // Không có gì thay đổi -> Không cần update

            var updateDefinition = updateBuilder.Combine(updates);
            var result = await dbContext.GetCollectionFlashcard().UpdateOneAsync(filter, updateDefinition);

            return (int)result.ModifiedCount;


        }
    }
}
