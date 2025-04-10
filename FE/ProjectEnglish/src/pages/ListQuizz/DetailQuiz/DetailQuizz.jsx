import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionbyQuizId, submitQuiz } from "../../../service/quizService";
import Questions from "./question";
import RightContent from "./RightContentQuiz/RightContent";
import ModalResult from "./ModalResult";
import "./DetailQuizz.scss"; // File chứa style cho cả DetailQuizz và Questions
import testImage from "../../../assets/image/b1.jpg";
import { Modal, Tooltip } from 'antd'; // Thêm Modal và Tooltip từ antd

const DetailQuizz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams(); // Lấy đúng quizId theo route: /detailquiz/:quizId
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isShowModalResult, setIsShowModalResult] = useState(false);
  const [dataModalResult, setDataModalResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitQuiz, setIsSubmitQuiz] = useState(false);
  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(true); // State cho modal xác nhận
  const [quizInforVM, setQuizInfo] = useState(null); // State lưu thông tin quiz
  console.log("check quizInforVM", quizInforVM);
  useEffect(() => {
    const fetchQuestions = async () => {
      let timer;
      try {
        setLoading(true);
        const res = await getQuestionbyQuizId(quizId);
        console.log("API response:", res); // Thêm log để kiểm tra response
        
        // Cập nhật để sử dụng đúng cấu trúc response
        setQuestions(res.data.items || []); // Lưu toàn bộ mảng items

        // Cập nhật thông tin quiz từ item đầu tiên nếu có
        if (res.data.items && res.data.items.length > 0) {
          setQuizInfo({
            name: res.data.items[0]?.quizInforVM?.name || "N/A",
            totalQuestions: res.data.items.length,
            difficulty: res.data.items[0]?.quizInforVM?.difficulty || "Trung bình"
          });
        }

        // Đảm bảo loading tối thiểu 2 giây
        timer = setTimeout(() => {
          setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
        }, 2000);

        console.log("Questions after set:", questions);
        console.log("Processed Quiz:", processedQuiz);
      } catch (err) {
        console.error("Lỗi khi lấy câu hỏi:", err);
        setError("Có lỗi xảy ra khi tải câu hỏi.");
        setIsLoading(false); // Tắt loading nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuestions();
  }, [quizId]);

  // Sửa processedQuiz - đang tìm questions.items nhưng questions đã là mảng items 
  const processedQuiz = (questions || []).map((quiz) => ({
    ...quiz,
    question_id: quiz.question_id,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : testImage,
    description: quiz.description && quiz.description !== "null" && quiz.description !== "" ? quiz.description : "Nội dung mặc định",
    answers: (quiz.answers || []).map((ans) => ({
      idAnswered: ans.idAnswered,
      description: ans.description && ans.description !== "null" && ans.description !== "" ? ans.description : "Câu trả lời không hợp lệ",
      isCorrect: ans.correct_answer // Đổi từ isCorrect thành correct_answer
    }))
  }));

  console.log("check processedQuiz", processedQuiz);
  // Điều hướng giữa các câu hỏi
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      console.log("prev", prev);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleShowAnswers = () => {
    setIsShowAnswer(true);
  };

  const handleTimeUpdate = (currentTime) => {
    setCompletionTime(currentTime);
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, userAnswerId]) => ({
        questionId,
        userAnswerId
      }));

      const submitData = {
        quizId,
        answers: formattedAnswers
      };

      const result = await submitQuiz(quizId, submitData);
      setDataModalResult(result);
      setIsShowModalResult(true);
      setIsSubmitQuiz(true);

      // Navigate to ResultQuizz page with quiz data
      navigate(`/listquizz/detailquiz/${quizId}/result`, {
        state: {
          quizData: {
            name: processedQuiz[0]?.quizInforVM?.name || "",
            description: processedQuiz[0]?.quizInforVM?.description || ""
          },
          questions,
          userAnswers,
          completionTime: completionTime,
          submitResult: result
        }
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  // Xử lý khi người dùng hủy làm bài
  const handleCancel = () => {
    navigate('/listquizz'); // Quay lại trang danh sách quiz
  };

  // Xử lý khi người dùng xác nhận làm bài
  const handleConfirm = () => {
    setShowConfirmModal(false); // Ẩn modal và bắt đầu làm bài
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle keyboard events if not showing confirm modal
      if (showConfirmModal) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (currentQuestionIndex > 0) {
            handlePrevQuestion();
          }
          break;
        case 'ArrowRight':
          if (currentQuestionIndex < questions.length - 1) {
            handleNextQuestion();
          }
          break;
        case 'Enter':
          if (Object.keys(userAnswers).length === processedQuiz.length && !isSubmitQuiz) {
            handleSubmit();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex, questions.length, userAnswers, processedQuiz.length, isSubmitQuiz, showConfirmModal]);

  return (
    <>
      <Modal
        title={
          <div className="modal-title">
            <i className="fas fa-clipboard-check"></i>
            <span>Xác nhận làm bài kiểm tra</span>
          </div>
        }
        open={showConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText={<><i className="fas fa-play-circle"></i> Làm bài kiểm tra</>}
        cancelText={<><i className="fas fa-arrow-left"></i> Quay lại</>}
        centered
        closable={false}
        maskClosable={false}
      >
        <div className="quiz-info">
          <div className="quiz-info-item">
            <i className="fas fa-file-alt"></i>
            <Tooltip title={quizInforVM?.name} placement="top">
              <p className="quiz-name"><strong>Bài kiểm tra:</strong> <span className="quiz-name-text">{quizInforVM?.name}</span></p>
            </Tooltip>
          </div>
          <div className="quiz-info-item">
            <i className="fas fa-list-ol"></i>
            <p><strong>Số lượng câu hỏi:</strong> {quizInforVM?.totalQuestions} câu</p>
          </div>
          <div className="quiz-info-item">
            <i className="fas fa-signal"></i>
            <p><strong>Độ khó:</strong> {quizInforVM?.difficulty}</p>
          </div>
        </div>
      </Modal>

      {/* Nội dung bài kiểm tra - chỉ hiển thị khi đã xác nhận */}
      {!showConfirmModal && (
        <div className="detail-quiz-container">
          {error && <p>{error}</p>}
          {!error && processedQuiz.length > 0 && (
            <>
              <div className="left-content">
                <div className="title">
                  <Tooltip title={processedQuiz.length > 0 && processedQuiz[0].quizInforVM ? processedQuiz[0].quizInforVM.name : quizId} placement="top">
                    <span className="quiz-title-text">
                      Quiz: {processedQuiz.length > 0 && processedQuiz[0].quizInforVM ? processedQuiz[0].quizInforVM.name : quizId}
                    </span>
                  </Tooltip>
                </div>

             
                {/* Không hiển thị image ở đây */}
                <div className="q-content">
                  <Questions
                    question={questions[currentQuestionIndex]}
                    questionIndex={currentQuestionIndex}
                    userAnswers={userAnswers}
                    handleAnswerSelect={handleAnswerSelect}
                    isShowAnswer={isShowAnswer}
                    isSubmitQuiz={isSubmitQuiz}
                  />
                </div>
                <div className="footer">
                  <button
                    onClick={handlePrevQuestion}
                    className="btn btn-secondary"
                    disabled={currentQuestionIndex === 0}
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="btn btn-primary"
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </button>
                  {!isSubmitQuiz && (
                    <button
                      onClick={handleSubmit}
                      className="btn btn-warning"
                      disabled={Object.keys(userAnswers).length !== processedQuiz.length}
                    >
                      Finish
                    </button>
                  )}
                </div>
              </div>
              <div className="right-content">
                <RightContent
                  questions={processedQuiz}
                  currentQuestionIndex={currentQuestionIndex}
                  userAnswers={userAnswers}
                  setCurrentQuestionIndex={setCurrentQuestionIndex}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
              {isSubmitQuiz && (
                <ResultQuizz
                  quizData={{
                    name: processedQuiz.length > 0 ? processedQuiz[0].quizInforVM.name : "",
                    description: processedQuiz.length > 0 ? processedQuiz[0].quizInforVM.description : ""
                  }}
                  questions={questions}
                  userAnswers={userAnswers}
                  completionTime={dataModalResult?.completionTime || 0}
                  submitResult={submitResponse?.quizData || []}  // 🛠 Thêm dữ liệu chấm điểm từ API submit
                />
              )}
            </>
          )}
          {!error && processedQuiz.length === 0 && (
            <p>Không có câu hỏi nào để hiển thị.</p>
          )}
        </div>
      )}
    </>
  );
};

export default DetailQuizz;