// QuizletForm.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams để lấy quizId từ URL
// import "../../assets/css/FlashCardQuiz/QuizletForm.css"; // Import file CSS
import test from "../../assets/image/b1.jpg";
import { getQuestionbyQuizId } from "../../service/quizService";

const QuizletForm = () => {
  const { quizId } = useParams(); // Lấy quizId từ URL (ví dụ: /quiz/:quizId)
  const [questions, setQuestions] = useState([]); // Đổi tên state cho rõ ràng hơn
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Để theo dõi câu hỏi hiện tại
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Thêm trạng thái lỗi

  useEffect(() => {
    if (!quizId) {
      setError("Không tìm thấy quiz_id trong URL!");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await getQuestionbyQuizId(quizId);
        console.log("Fetched questions:", res); // Debugging
        setQuestions(res.data || []); // Đảm bảo luôn là mảng
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Có lỗi xảy ra khi tải câu hỏi.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]); // Chỉ gọi lại khi quizId thay đổi

  // Xử lý câu hỏi và câu trả lời, kiểm tra dữ liệu rỗng
  const processedQuiz = (questions || []).map((quiz) => ({
    ...quiz,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : test,
    description:
      quiz.description && quiz.description !== "null" && quiz.description !== ""
        ? quiz.description
        : "Nội dung mặc định", // fallback cho description
    answer:
      quiz.answer && quiz.answer.length > 0
        ? quiz.answer.map((ans) => ({
            ...ans,
            descriptionAnswered:
              ans.descriptionAnswered && ans.descriptionAnswered !== "null" && ans.descriptionAnswered !== ""
                ? ans.descriptionAnswered
                : "Câu trả lời không hợp lệ",
          }))
        : [{ idAnswered: "default", descriptionAnswered: "Không có câu trả lời", isCorrect: false }], // fallback nếu không có đáp án
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

  // Hiển thị loading hoặc lỗi trước khi render form
  if (loading) return <div className="text-center">Đang tải câu hỏi...</div>;
  if (error) return <div className="text-center">{error}</div>;

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