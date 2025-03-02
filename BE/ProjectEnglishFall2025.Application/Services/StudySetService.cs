using AutoMapper;
using FluentValidation;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ProjectFall2025.Application.Services
{
    public class StudySetService : IStudySetService
    {
        private readonly IStudiSetRepository repository;
        private readonly IValidator<StudySet> validator;
        private readonly IMapper mapper;

        public StudySetService(IStudiSetRepository repository,IValidator<StudySet> validator,IMapper mapper)
        {
            this.repository = repository;
            this.validator = validator;
            this.mapper = mapper;
        }

        public async Task<ReturnData> createStudySet(CreateStudySetVM createStudySetVM)
        {
            try
            {
                var doData = mapper.Map<StudySet>(createStudySetVM);

                doData.CreatedAt = DateTime.Now;
                //check validate data
                var validdata = await validator.ValidateAsync(doData);

                if (!validdata.IsValid)
                {
                    var errorMess = validdata.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                var res = await repository.CreateStudySet(doData);
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Create StudySet Sucessful"
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            //map vm to do
    


        }

        public async Task<ReturnData> deleteStudySet(DeleteStudySetVM deleteStudySetVM)
        {
            try
            {
                //check id studySet is exits
                var checkId = await repository.getStudySetById(deleteStudySetVM.Id);
                if (checkId == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Error because id not found",
                    };
                }
                //call delete 
                var res = await repository.DeleteStudySet(deleteStudySetVM);
                if (res <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete Failed "
                    };
                }

                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Delete Sucesful !"
                };
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }

        public async Task<ReturnData> updateStudySet(EditStudySetVM editStudySetVM)
        {
            try
            {
                //check studyset id co ton tai ko
                var checkStudySetId = await repository.getStudySetById(editStudySetVM.Id);
                if (checkStudySetId == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "StudyId not found"
                    };
                }
                //map data vm to do
                var datad0 = mapper.Map<StudySet>(editStudySetVM);

                //check valid data
                var validdata = await validator.ValidateAsync(datad0);

                if (!validdata.IsValid)
                {
                    var errorMess = validdata.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                //update valid data to db
                var res = await repository.UpdateStudySet(datad0);
                if (res <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update Error"
                    };
                }
                return new ReturnData
                {
                    ReturnCode = 1,
                    ReturnMessage = "Update Sucessful !"
                };
            }
            catch(Exception ex)
            {
                throw new Exception($"{ex.Message}", ex);
            }
     

     
        }
    }
}
