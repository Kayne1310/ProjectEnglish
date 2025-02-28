import React, { useEffect, useState } from "react";
import "../../../assets/css/Home/QuizletForm.css"; // Import file CSS
import test from "../../../assets/image/b1.jpg";
import { getQuestionbyQuizId } from "../../../service/quizService";

const quiz_id = "67b61e2096183609086a9709";

const QuizletForm = () => {
  const [getquestion, setquestion] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Để theo dõi câu hỏi hiện tại

  useEffect(() => {
    getQuestionData();
  }, []);

  const getQuestionData = async () => {
    try {
      const res = await getQuestionbyQuizId(quiz_id);
      console.log('Fetched questions:', res); // Debugging
      setquestion(res.data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error fetching questions:', error);
      setquestion([]); // Avoid errors on failure
    }
  };

  // Xử lý câu hỏi và câu trả lời, kiểm tra dữ liệu rỗng
  const processedQuiz = (getquestion || []).map(quiz => ({
    ...quiz,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : test,
    description: quiz.description && quiz.description !== "null" && quiz.description !== ""
      ? quiz.description
      : "Nội dung mặc định", // fallback cho description
    answer: (quiz.answer && quiz.answer.length > 0)
      ? quiz.answer.map(ans => ({
        ...ans,
        descriptionAnswered: ans.descriptionAnswered && ans.descriptionAnswered !== "null" && ans.descriptionAnswered !== ""
          ? ans.descriptionAnswered
          : "Câu trả lời không hợp lệ"
      }))
      : [{ idAnswered: "default", descriptionAnswered: "Không có câu trả lời", isCorrect: false }] // fallback nếu không có đáp án
  }));


  // Hàm chuyển câu hỏi tiếp theo
  const goToNextQuestion = () => {
    if (currentQuestionIndex < processedQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Hàm quay lại câu hỏi trước
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = processedQuiz[currentQuestionIndex];

  return (
    <>
      <div className="quizlet-body">
        <div className="quizlet-wrapper">
          {/* Form Quizlet */}
          <div className="quizlet-container">
            <div className="quizlet-definition-section">
              <div className="quizlet-definition-label">
                <i className="fas fa-lightbulb"></i>
              </div>
              <button className="quizlet-audio-btn" title="sound">
                <i className="fas fa-volume-up"></i>
              </button>
            </div>

            {currentQuestion && (
              <>
                <div className="quizlet-content-wrapper">
                  <div className="quizlet-question-container">
                    <p>{currentQuestion.description}</p>
                  </div>
                  <div className="quizlet-image-wrapper">
                    <div className="quizlet-image-container">
                      <img src={currentQuestion.image} alt="lôi thôi, lếch thếch" />
                    </div>
                  </div>
                </div>

                <div className="quizlet-options">
                  {currentQuestion.answer.map((ans, index) => (
                    <button key={index} className="quizlet-option">
                      <span className="answer-number">{index + 1}</span>
                      <span className="quizlet-option-text">{ans.descriptionAnswered}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="quizlet-help-link">
              <span> Bạn không biết?</span>
            </div>
          </div>

          {/* Footer */}
          <div className="quizlet-footer-navigation">
            <div className="quizlet-footer-button" onClick={goToPreviousQuestion}>
              <i className="fas fa-chevron-left"></i>
              <span>Lùi lại</span>
            </div>
            <div className="quizlet-footer-button" onClick={goToNextQuestion}>
              <span>Tiến tới</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizletForm;
