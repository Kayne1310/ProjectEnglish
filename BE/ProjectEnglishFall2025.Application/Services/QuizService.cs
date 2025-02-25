﻿using AutoMapper;
using CloudinaryDotNet;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Bson;
using MongoDB.Driver;
using ProjectFall2025.Application.IServices;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Infrastructure.DbContext;
using ProjectFall2025.Infrastructure.Repositories.IRepo;
using ProjectFall2025.Infrastructure.Repositories.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository quizRepository;
        private readonly IMapper mapper;
        private readonly IValidator<Quiz> validator;
        private readonly ICloudinaryService cloudinary;

        public QuizService(IQuizRepository quizRepository, IMapper mapper, IValidator<Quiz> validator, ICloudinaryService cloudinary)
        {
            this.quizRepository = quizRepository;
            this.mapper = mapper;
            this.validator = validator;
            this.cloudinary = cloudinary;
        }

        public async Task<List<Quiz>> GetAllQuizs()
        {

            var getAll = await quizRepository.GetAllQuizs();

            return getAll;
        }

        public async Task<Quiz> GetIdQuiz(DeleteQuizVM quiz)
        {
            try
            {
                var getName = await quizRepository.GetQuizById(quiz);

                var getNameMap = mapper.Map<Quiz>(getName);

                return getNameMap;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnData> AddQuiz(CreateQuizVM quiz)
        {
            try
            {

                //goi service upload len cloudiary
                string image = await cloudinary.UploadImageAsync(quiz.image,"QUIZ");

                var data = new Quiz
                {
                    name = quiz.name,
                    description = quiz.description,
                    image = image,
                    difficutly = quiz.difficutly,
                    createAt = DateTime.Now,
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
                    var addQuiz = await quizRepository.AddQuiz(data);
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

        public async Task<ReturnData> UpdateQuiz(UpdateQuizVM quiz)
        {
            try
            {
                var data = new DeleteQuizVM
                {
                    quiz_id = quiz.quiz_id,
                };

                var exitingQuiz = await quizRepository.GetQuizById(data);
                if (exitingQuiz == null)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = ("Update failed! idUserQuiz is not found")
                    };
                }

                exitingQuiz.name = quiz.name;
                exitingQuiz.description = quiz.description;
                exitingQuiz.image = quiz.image;
                exitingQuiz.difficutly = quiz.difficutly;
                exitingQuiz.updateAt = DateTime.Now;

                var validate = await validator.ValidateAsync(exitingQuiz);
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
                    var update = await quizRepository.UpdateQuiz(exitingQuiz);
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

        public async Task<ReturnData> DeleteQuiz(DeleteQuizVM quiz)
        {
            try
            {
                var delete = await quizRepository.DeleteQuiz(quiz);

                if (delete <= 0)
                {
                    return new ReturnData
                    {
                        ReturnCode = -1,
                        ReturnMessage = "Delete failed! quizId is not exist"
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

        public async Task<List<QuizzAndQuestionVM>> getCountQuestionInQuiz()
        {
            try
            {
                var bsonList = await quizRepository.getCountQuestionbyQuiz();

                var res = bsonList.Select(q => new QuizzAndQuestionVM
                {
                    quiz_id = q["_id"].ToString(),
                    name = q["name"].ToString(),
                    countQuestion = q.Contains("countQuestion") && q["countQuestion"].BsonType == BsonType.Int32
                            ? q["countQuestion"].AsInt32
                            : 0,  //  Chuyển đổi sau khi lấy dữ liệu
                    image = q["image"].ToString(),
                    description = q["description"].ToString(),
                    difficutly = q["difficutly"].ToString()
                }).ToList();

                return res;
            }
            catch(Exception ex)
            {
               
            throw new NotImplementedException();
            }
        }

        public async Task<List<QuestionAndAnswerVM>> GetQuestionsAndAnswersByQuizIdAsync(string id)
        {
            ObjectId Quizid = ObjectId.Parse(id);
            var data=await quizRepository.GetQuestionByQuizId(Quizid);
            return data
             .Where(doc => doc.Contains("QuestionInfor") && doc["QuestionInfor"].BsonType == BsonType.Array)
             .SelectMany(doc => doc["QuestionInfor"].AsBsonArray.Select(q => new QuestionAndAnswerVM
             {
                 question_id = q["_id"].ToString(),
                 description =  q["description"].ToString() ,
                 image =q["image"].ToString() ,
                 quiz_id = doc["_id"].ToString(),

                 // Thông tin Quiz
                 QuizInforVM = new QuizInforVM
                 {
                     name = doc.Contains("name") ? doc["name"].ToString() : null,
                     description = doc.Contains("description") ? doc["description"].AsString : null,
                     image = doc.Contains("image") ? doc["image"].ToString() : null,
                     difficutly = doc.Contains("difficutly") ? doc["difficutly"].AsString : null
                 },

                 // Lấy tất cả câu trả lời của câu hỏi
                 answer = q["QuestionAnswer"].BsonType == BsonType.Array
                     ? q["QuestionAnswer"].AsBsonArray.Select(a => new AnswerVM
                     {
                         idAnswered = a["_id"].ToString(),
                         descriptionAnswered =  a["desciption"].ToString() ,
                         isCorrect = a["correct_answer"].ToBoolean() ,
                     }).ToList()
                     : new List<AnswerVM>()
             })).ToList();

        }
    }
}
