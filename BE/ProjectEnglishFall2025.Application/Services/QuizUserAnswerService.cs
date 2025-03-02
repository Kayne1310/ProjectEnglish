using AutoMapper;
using FluentValidation;
using MongoDB.Bson;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class QuizUserAnswerService : IQuizUserAnswerService
    {
        private readonly IQuizUserAnswerRepository quizUserAnswerRepository;
        private readonly IMapper mapper;
        private readonly IValidator<QuizUserAnswer> validator;
        private readonly IQuizAnswerRepository quizAnswerRepository;

        public QuizUserAnswerService(IQuizUserAnswerRepository quizUserAnswerRepository, IMapper mapper, IValidator<QuizUserAnswer> validator, IQuizAnswerRepository quizAnswerRepository)
        {
            this.quizUserAnswerRepository = quizUserAnswerRepository;
            this.mapper = mapper;
            this.validator = validator;
            this.quizAnswerRepository = quizAnswerRepository;
        }

        public async Task<List<QuizUserAnswer>> getAllQuizUserAnswer()
        {
            var getAll = await quizUserAnswerRepository.getAllQuizUserAnswer();

            return getAll;
        }

        public async Task<QuizUserAnswer> getQuizUserAnswerById(deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var getId = await quizUserAnswerRepository.getIdQuizUserAnswer(quizUserAnswer);

                var map = mapper.Map<QuizUserAnswer>(getId);

                return map;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> addQuizUserAnswer(createQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = new QuizUserAnswer
                {
                    user_answers = quizUserAnswer.user_answers,
                    createAt = DateTime.Now,
                    UserID = ObjectId.Parse(quizUserAnswer.UserID),
                    quiz_id = ObjectId.Parse(quizUserAnswer.quiz_id),
                    question_id = ObjectId.Parse(quizUserAnswer.question_id),
                };

                var validate = await validator.ValidateAsync(data);
                if (!validate.IsValid)
                {
                    var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                else
                {
                    var create = await quizUserAnswerRepository.addQuizUserAnswer(data);
                    return new ReturnData
                    {
                        ReturnCode = 1,
                        ReturnMessage = "Add successful!"
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> updateQuizUserAnswer(updateQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var data = new deleteQuizUserAnswerVM
                {
                    quizUserAnswer_id = quizUserAnswer.quizUserAnswer_id,
                };

                var existingQuizUserAnswer = await quizUserAnswerRepository.getIdQuizUserAnswer(data);
                if (existingQuizUserAnswer == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Update failed! quizUserAnswer_id not found"
                    };
                }
                else
                {
                    existingQuizUserAnswer.user_answers = quizUserAnswer.user_answers;
                    existingQuizUserAnswer.updateAt = DateTime.Now;
                    existingQuizUserAnswer.UserID = ObjectId.Parse(quizUserAnswer.UserID);
                    existingQuizUserAnswer.quiz_id = ObjectId.Parse(quizUserAnswer.quiz_id);
                    existingQuizUserAnswer.question_id = ObjectId.Parse(quizUserAnswer.question_id);
                }

                var validate = await validator.ValidateAsync(existingQuizUserAnswer);
                if (!validate.IsValid)
                {
                    var errorMess = validate.Errors.Select(e => e.ErrorMessage).ToList();
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = string.Join(", ", errorMess)
                    };
                }
                else
                {
                    var update = await quizUserAnswerRepository.updateQuizUserAnswer(existingQuizUserAnswer);
                    if (update <= 0)
                    {
                        return new ReturnData
                        {
                            ReturnCode = -1,
                            ReturnMessage = "Update failed! database error"
                        };
                    }
                    else
                    {
                        return new ReturnData
                        {
                            ReturnCode = 1,
                            ReturnMessage = "Update successful!"
                        };
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> deleteQuizUserAnswer(deleteQuizUserAnswerVM quizUserAnswer)
        {
            try
            {
                var delete = await quizUserAnswerRepository.deleteQuizUserAnswer(quizUserAnswer);
                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! database error"
                    };
                }
                else
                {
                    return new ReturnData
                    {
                        ReturnCode = 1,
                        ReturnMessage = "Delete successful!"
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }
        //check  exam user coorect answer
        //public async Task<ResponsExamQuizAnswerByUserVM> checkExamUserCorrectAnswer(ExamQuizAnswerByUserVM exam)
        //{
        //    //lay question va dap an dung  dua vao quizid
        //    var questionAndAnswerCorrect = await quizAnswerRepository.GetCorrectQuizAnswersAsync(exam.quiz_id);
        //    if (questionAndAnswerCorrect == null)
        //    {
        //        return new ResponsExamQuizAnswerByUserVM
        //        {
        //            returnData = new ReturnData { ReturnCode = -1, ReturnMessage = "error because quizid not found" }
        //        };
        //    }
        //    //check tiep user dap an co dung voi dap an he thong ko
        //    questionAndAnswerCorrect.ForEach(answer =>
        //    {
        //        if (answer.quizAnswer_id == exam.quiz_id)
        //        {
        //            return new ResponsExamQuizAnswerByUserVM
        //            {
        //                returnData= new ReturnData { ReturnCode = 1,ReturnMessage="Successful"},
        //                listResponsExamQuizAnswerByUserVMs=new List<listResponsExamQuizAnswerByUserVM> { }
                        
                        
        //            };
        //        }
        //    });
        //    return new ResponsExamQuizAnswerByUserVM { };

        //}

    }
}
