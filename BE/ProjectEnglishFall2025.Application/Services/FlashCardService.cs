using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Application.UnitOfWork;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCardVM;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class FlashCardService : IFlashCardService
    {
        private readonly IFlashCardRepository repository;
        private readonly IMapper mapper;
        private readonly IValidator<Flashcard> validator;
        private readonly IUnitofWork unitofWork;
        private readonly IStudiSetRepository studiSetRepository;

        public FlashCardService(IFlashCardRepository repository, IMapper mapper, IValidator<Flashcard> validator, IUnitofWork unitofWork, IStudiSetRepository studiSetRepository)
        {
            this.repository = repository;
            this.mapper = mapper;
            this.validator = validator;
            this.unitofWork = unitofWork;
            this.studiSetRepository = studiSetRepository;
        }
        public async Task<ReturnData> createFlashCardInStudySet(CreateFlashcardVM createFlashcardVM)
        {
            await unitofWork.StartTransactionAsync();
            try
            {
                //map dto to do

                var datado = mapper.Map<Flashcard>(createFlashcardVM);
                //check validate data
                var checkvalidData = validator.Validate(datado);
                if (!checkvalidData.IsValid)
                {
                    await unitofWork.AbortTransactionAsync();
                    var errorMess = checkvalidData.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                //check studyset is exits
                var checkstudysetId = await studiSetRepository.getStudySetById(datado.StudySetId);
                if (checkstudysetId == null)
                {
                    await unitofWork.AbortTransactionAsync();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Failed becase not exit checkstudyId not Found"
                    };

                }
                //Create start trasaction
                datado.CreatedAt = DateTime.UtcNow;

                //call create data
                var res = await repository.addFlashCardofStudyList(datado);

                //commit 
                await unitofWork.CommitTransactionAsync();
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Create FlashCard succesulFull"
                };


            }
            catch (Exception ex)
            {
                await unitofWork.AbortTransactionAsync();
                throw new Exception(ex.Message);
            }
            finally
            {
                unitofWork.DisposeTransaction(); //  Đảm bảo session luôn được giải phóng
            }
        }

        public async Task<ReturnData> deleteFlashCardinStudySet(DeleteFlashcardVM deleteFlashcardVM)
        {
            try
            {
                var res=await repository.deleteFlashCard(deleteFlashcardVM);
                if(res <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete Error Id not found"
                    };
                }
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Delete Sucessful1"
                };
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RenposeFlashCard> getFlashCardById(string id)
        {
            try
            {
                var res = await repository.GetFlashcardById(id);
                if (res == null)
                {
                    return new RenposeFlashCard
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Id not found"

                    };
                }
                return new RenposeFlashCard
                {
                    ReturnCode = -1,
                    ReturnMessage = "Id not found",
                    Flashcard = res

                };

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseListFlashCardVM> getListFlashCardByStudySet(string studySetId)
        {
            if (string.IsNullOrWhiteSpace(studySetId))
            {
                return new ResponseListFlashCardVM
                {
                    ReturnCode = -1,
                    ReturnMessage = "Invalid StudySetId"
                };
            }

            try
            {
                var getListFlashCard = await repository.getListFlashCardByStudySetId(studySetId);
                if (getListFlashCard == null || !getListFlashCard.Contains("FlashcardInfor"))
                {
                    return new ResponseListFlashCardVM
                    {
                        ReturnCode = -1,
                        ReturnMessage = "No flashcards found for the given StudySetId"
                    };
                }
                //convert bsondocument to list flashcard
                var studySet = new StudySet
                {
                    Id = getListFlashCard["_id"].AsObjectId.ToString(),
                    UserId = getListFlashCard["UserId"].AsObjectId.ToString(),
                    Title = getListFlashCard["Title"].AsString ??null,
                    Language = getListFlashCard["Language"].AsString ?? null,
                    Desc = getListFlashCard["Desc"].AsString ?? null,
                    imageCountry = getListFlashCard.TryGetValue("imageCountry", out var imageCountryValue) && !imageCountryValue.IsBsonNull
                    ? imageCountryValue.ToString()
                    : null,

                    Public = getListFlashCard["Public"].AsBoolean,
                    LastPracticeDate = getListFlashCard["LastPracticeDate"].IsBsonNull ? (DateTime?)null : getListFlashCard["LastPracticeDate"].ToUniversalTime(),
                    CreatedAt = getListFlashCard["CreatedAt"].ToUniversalTime()
                };


                var flashcards = getListFlashCard["FlashcardInfor"].AsBsonArray
               .Select(bson => BsonSerializer.Deserialize<Flashcard>(bson.AsBsonDocument))
               .ToList();

                // Lấy thông tin UserName & PictureUrl
                string username = getListFlashCard.Contains("userInfo")   ? getListFlashCard["userInfo"]["UserName"].ToString() : null;

                string pictureUrl = getListFlashCard.Contains("userInfo")   ? getListFlashCard["userInfo"]["Picture"].ToString() : null;


                return new ResponseListFlashCardVM
                {
                    ReturnCode = 1,
                    ReturnMessage = "Data Response Successful !",
                    StudySet = studySet,
                    ListFlashcards = flashcards,
                    PictureUrl = pictureUrl,
                    Username = username,
            };

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

   
        public async Task<ReturnData> updateFlashCardInStudySet(UpdateFlashcardVM updateFlashcardVM)
        {

            try
            {
                //map data to do    
                var datado = mapper.Map<Flashcard>(updateFlashcardVM);

                //check valid data
                var checkValidDo = validator.Validate(datado);
                if (!checkValidDo.IsValid)
                {

                    var errorMess = checkValidDo.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                //check flashcardid and studyid

                //add to db
                var res = await repository.updateFlashCard(datado);
                if (res <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Error Id flashcard not found update failed "
                    };
                }
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Update Successul!"
                };

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
