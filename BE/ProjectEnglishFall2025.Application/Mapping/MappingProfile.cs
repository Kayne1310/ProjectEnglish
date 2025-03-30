using AutoMapper;
using MongoDB.Bson;
using ProjectFall2025.Domain.Do;
using ProjectFall2025.Domain.Do.FlashCard;
using ProjectFall2025.Domain.ViewModel.FlashCard;
using ProjectFall2025.Domain.ViewModel.ViewModel_Account;
using ProjectFall2025.Domain.ViewModel.ViewModel_AIAnswer;
using ProjectFall2025.Domain.ViewModel.ViewModel_History;
using ProjectFall2025.Domain.ViewModel.ViewModel_Quiz;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizAnswer;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizQuestion;
using ProjectFall2025.Domain.ViewModel.ViewModel_QuizUserAnswer;
using ProjectFall2025.Domain.ViewModel.ViewModel_User;
using ProjectFall2025.Domain.ViewModel.ViewModel_UserQuiz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectFall2025.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // user
            CreateMap<User, UserViewModel>().ReverseMap();
            CreateMap<User, UserVM>().ReverseMap();


            // account
            CreateMap<Account_UpdateRefeshTokenRequestData, User>().ReverseMap();


            // quiz
            CreateMap<Quiz, CreateQuizVM>().ReverseMap();

            CreateMap<Quiz, UpdateQuizVM>()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString())) // object -> string
                .ReverseMap()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id))); // string -> object

            CreateMap<Quiz, DeleteQuizVM>()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)));
            CreateMap<Quiz, QuizDto>()
               .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
               .ReverseMap()
               .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)));

            // quiz answer
            CreateMap<QuizAnswer, CreateAnswerQuestionVM>()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => src.question_id.ToString()))
                .ReverseMap()  // Tạo mapping ngược lại từ CreateAnswerQuestionVM sang QuizAnswer
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => ObjectId.Parse(src.question_id)));

            CreateMap<QuizAnswer, UpdateAnswerQuestionVM>()
                .ForMember(dest => dest.quizAnswer_id, opt => opt.MapFrom(src => src.quizAnswer_id.ToString()))
                .ReverseMap()  // Tạo mapping ngược lại từ UpdateAnswerQuestionVM sang QuizAnswer
                .ForMember(dest => dest.quizAnswer_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quizAnswer_id)));

            CreateMap<QuizAnswer, DeleteAnswerQuestionVM>()
                .ForMember(a => a.quizAnswer_id, b => b.MapFrom(src => src.quizAnswer_id.ToString()))
                .ReverseMap()  // Tạo mapping ngược lại từ DeleteAnswerQuestionVM sang QuizAnswer
                .ForMember(a => a.quizAnswer_id, b => b.MapFrom(src => ObjectId.Parse(src.quizAnswer_id)));


            // user quiz
            CreateMap<UserQuiz, CreateUserQuizVM>()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => ObjectId.Parse(src.UserID)));

            CreateMap<UserQuiz, UpdateUserQuizVM>()
                .ForMember(dest => dest.userQuiz_id, opt => opt.MapFrom(src => src.userQuiz_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.userQuiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.userQuiz_id)));

            CreateMap<UserQuiz, DeleteUserQuizVM>()
                .ForMember(a => a.userQuiz_id, b => b.MapFrom(src => src.userQuiz_id.ToString()))
                .ReverseMap()
                .ForMember(a => a.userQuiz_id, b => b.MapFrom(src => ObjectId.Parse(src.userQuiz_id)));


            // quiz question
            CreateMap<QuizQuestion, CreateQuizQuestionVM>()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)));

            CreateMap<QuizQuestion, UpdateQuizQuestionVM>()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => src.question_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => ObjectId.Parse(src.question_id)));

            CreateMap<QuizQuestion, DeleteQuizQuestionVM>()
                .ForMember(a => a.question_id, b => b.MapFrom(src => src.question_id.ToString()))
                .ReverseMap()
                .ForMember(a => a.question_id, b => b.MapFrom(src => ObjectId.Parse(src.question_id)));

            CreateMap<QuizQuestion, QuizQuestionViewModel>()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => src.question_id.ToString()))
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => ObjectId.Parse(src.question_id)))
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)));

            // history
            CreateMap<History, createHistoryVM>()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)));

            CreateMap<History, updateHistoryVM>()
                .ForMember(dest => dest.history_id, opt => opt.MapFrom(src => src.history_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.history_id, opt => opt.MapFrom(src => ObjectId.Parse(src.history_id)));

            CreateMap<History, deleteHistoryVM>()
                .ForMember(a => a.history_id, b => b.MapFrom(src => src.history_id.ToString()))
                .ReverseMap()
                .ForMember(a => a.history_id, b => b.MapFrom(src => ObjectId.Parse(src.history_id)));

            // quiz user answer
            CreateMap<QuizUserAnswer, createQuizUserAnswerVM>()
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID.ToString()))
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => src.quiz_id.ToString()))
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => src.question_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => ObjectId.Parse(src.UserID)))
                .ForMember(dest => dest.quiz_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quiz_id)))
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => ObjectId.Parse(src.question_id)));

            CreateMap<QuizUserAnswer, updateQuizUserAnswerVM>()
                .ForMember(dest => dest.quizUserAnswer_id, opt => opt.MapFrom(src => src.quizUserAnswer_id.ToString()))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.quizUserAnswer_id, opt => opt.MapFrom(src => ObjectId.Parse(src.quizUserAnswer_id)))
                .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => ObjectId.Parse(src.UserID)));

            CreateMap<QuizUserAnswer, deleteQuizUserAnswerVM>()
                .ForMember(a => a.quizUserAnswer_id, b => b.MapFrom(src => src.quizUserAnswer_id.ToString()))
                .ReverseMap()
                .ForMember(a => a.quizUserAnswer_id, b => b.MapFrom(src => ObjectId.Parse(src.quizUserAnswer_id)));

            // AI answer
            CreateMap<AIAnswer, createAIAnswerVM>()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => src.question_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.question_id, opt => opt.MapFrom(src => ObjectId.Parse(src.question_id)));

            CreateMap<AIAnswer, updateAIAnswerVM>()
                .ForMember(dest => dest.aiAnswer_id, opt => opt.MapFrom(src => src.aiAnswer_id.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.aiAnswer_id, opt => opt.MapFrom(src => ObjectId.Parse(src.aiAnswer_id)));

            CreateMap<AIAnswer, deleteAIAnswerVM>()
                .ForMember(a => a.aiAnswer_id, b => b.MapFrom(src => src.aiAnswer_id.ToString()))
                .ReverseMap()
                .ForMember(a => a.aiAnswer_id, b => b.MapFrom(src => ObjectId.Parse(src.aiAnswer_id)));


            //StudySet
            CreateMap<StudySet, CreateStudySetVM>().ReverseMap();
            CreateMap<StudySet, EditStudySetVM>().ReverseMap();
            CreateMap<StudySet, DeleteStudySetVM>().ReverseMap();

            //FlashCard
            CreateMap<Flashcard, CreateFlashcardVM>().ReverseMap();
            CreateMap<Flashcard, UpdateFlashcardVM>().ReverseMap();
            CreateMap<Flashcard, DeleteFlashcardVM>().ReverseMap();


        }
    }

}
