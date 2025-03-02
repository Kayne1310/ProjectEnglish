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
            var filter= Builders<StudySet>.Filter.Eq(x=>x.Id,deleteStudySetVM.Id);

            var res= await dbContext.GetCollectionStudySet().DeleteOneAsync(filter);
            return (int)res.DeletedCount;
        }

        public async Task<StudySet> getStudySetById(string id)

        {
            var filter=Builders<StudySet>.Filter.Eq(x=>x.Id,id);
            var res = await dbContext.GetCollectionStudySet().Find(filter).FirstOrDefaultAsync() ;
            return res;
        }

        public async Task<int> UpdateStudySet(StudySet studySet)
            
        {
            var fitler=Builders<StudySet>.Filter.Eq(x=>x.Id, studySet.Id);
            var update = await dbContext.GetCollectionStudySet().ReplaceOneAsync(fitler, studySet);
            return (int)update.ModifiedCount;
   
        }
    }
}
