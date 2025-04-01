using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Common.ImgCountry;
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
    public class StudiSetRepository : IStudiSetRepository
    {
        private readonly MongoDbContext dbContext;

        public StudiSetRepository(MongoDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<StudySet> CreateStudySet(StudySet studySet)
        {
            await dbContext.GetCollectionStudySet().InsertOneAsync(studySet);
            return studySet;

        }

        public async Task<int> DeleteStudySet(DeleteStudySetVM deleteStudySetVM)
        {
            var filter = Builders<StudySet>.Filter.Eq(x => x.Id, deleteStudySetVM.Id);

            var res = await dbContext.GetCollectionStudySet().DeleteOneAsync(filter);
            return (int)res.DeletedCount;
        }

        public async Task<List<StudySetWithCountVM>> getListStudySetbyUserId(string userId)
        {
            var studySetTask = dbContext.GetCollectionStudySet()
            .Find(s => s.UserId == userId)
            .ToListAsync();

            var flashcardCountTask = dbContext.GetCollectionFlashcard()
                .Aggregate()
                .Group(f => f.StudySetId, g => new { StudySetId = g.Key, Count = g.Count() })
                .ToListAsync();

            var userTask = dbContext.GetCollectionUser()
                .Find(u => u.UserID.ToString() == userId)
                .Project(u => new { u.UserID, u.UserName, u.Picture })
                .FirstOrDefaultAsync();

            // Đợi tất cả tác vụ hoàn thành
            await Task.WhenAll(studySetTask, flashcardCountTask, userTask);
            var studySets = studySetTask.Result;
            var flashcardCounts = flashcardCountTask.Result.ToDictionary(fc => fc.StudySetId, fc => fc.Count);
            var user = userTask.Result;

            // Tạo danh sách kết quả
            var result = studySets.Select(set => new StudySetWithCountVM
            {
                StudySet = set,
                FlashcardCount = flashcardCounts.GetValueOrDefault(set.Id, 0),
                UserName = user?.UserName ?? "Unknown",
                Picture = user?.Picture ?? "default.png"
            }).ToList();
            return result;
        }

        public async Task<List<StudySetWithCountVM>> GetPublicStudySetsWithFlashcardCountAsync()
        {
            var studySetTask = dbContext.GetCollectionStudySet().Find(x => x.Public == true).ToListAsync();

            var flashcardCountTask = dbContext.GetCollectionFlashcard().Aggregate()
                                              .Group(f => f.StudySetId, g => new { StudySetId = g.Key, Count = g.Count() }) // Chỉ lấy số lượng
                                              .ToListAsync();

            var userIds = (await studySetTask).Select(s => s.UserId).Distinct().ToList();
            var userTask = dbContext.GetCollectionUser()
                                    .Find(u => userIds.Contains(u.UserID.ToString()))
                                    .Project(u => new { u.UserID, u.UserName, u.Picture })
                                    .ToListAsync();
            await Task.WhenAll(studySetTask, flashcardCountTask, userTask);
            var studySets = studySetTask.Result;
            var flashcardCounts = flashcardCountTask.Result;
            var users = (await userTask).ToDictionary(u => u.UserID.ToString(), u => u);
            // Gộp dữ liệu
            var result = studySets.Select(set => new StudySetWithCountVM
            {
                StudySet = set,
                FlashcardCount = flashcardCounts.FirstOrDefault(fc => fc.StudySetId == set.Id)?.Count ?? 0,
                UserName = users.GetValueOrDefault(set.UserId.ToString())?.UserName ?? "Unknown",
                Picture = users.GetValueOrDefault(set.UserId.ToString())?.Picture ?? "default.png"

            }).ToList();

            return result;

        }

        public async Task<StudySet> getStudySetById(string id)

        {
            var filter = Builders<StudySet>.Filter.Eq(x => x.Id, id);
            var res = await dbContext.GetCollectionStudySet().Find(filter).FirstOrDefaultAsync();
            return res;
        }

        public async Task<int> UpdateStudySet(StudySet studySet)

        {
            var filter = Builders<StudySet>.Filter.Eq(x => x.Id, studySet.Id);
            var updateBuilder = Builders<StudySet>.Update;
            var updates = new List<UpdateDefinition<StudySet>>();
            //  Chỉ update nếu có giá trị mới
            if (!string.IsNullOrEmpty(studySet.Title))
                updates.Add(updateBuilder.Set(x => x.Title, studySet.Title));
            if (!string.IsNullOrEmpty(studySet.Language))
            {

                updates.Add(updateBuilder.Set(x => x.Language, studySet.Language));
                updates.Add(updateBuilder.Set(x => x.imageCountry, Country.GetImageCountry(studySet.Language)));

            }

            if (!string.IsNullOrEmpty(studySet.Desc))
            {

                updates.Add(updateBuilder.Set(x => x.Desc, studySet.Desc));
            }
            updates.Add(updateBuilder.Set(x => x.Public, studySet.Public));


            if (!updates.Any()) return 0; // Không có gì thay đổi -> Không cần update

            var updateDefinition = updateBuilder.Combine(updates);
            var result = await dbContext.GetCollectionStudySet().UpdateOneAsync(filter, updateDefinition);
            return (int)result.ModifiedCount;

        }
    }
}
