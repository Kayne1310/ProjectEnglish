import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionbyQuizId, submitQuiz } from "../../../service/quizService";
import Questions from "./question";
import RightContent from "./RightContentQuiz/RightContent";
import ModalResult from "./ModalResult";
import "./DetailQuizz.scss"; // File chứa style cho cả DetailQuizz và Questions
import testImage from "../../../assets/image/b1.jpg";
import { Spin } from 'antd'; // Thêm Spin từ antd để hiển thị loading

const DetailQuizz = () => {
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

  useEffect(() => {
    const fetchQuestions = async () => {
      let timer;
      try {
        setLoading(true);
        const res = await getQuestionbyQuizId(quizId);
        // Giả sử API trả về dữ liệu trong res.data
        setQuestions(res.data || []);
        // Đảm bảo loading tối thiểu 2 giây
        timer = setTimeout(() => {
          setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
        }, 2000);
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

  // Xử lý dữ liệu nhận từ API, tương tự như QuizletForm
  const processedQuiz = (questions || []).map((quiz) => ({
    ...quiz,
    image:
      quiz.image && quiz.image !== "null" && quiz.image !== ""
        ? quiz.image
        : testImage,
    description:
      quiz.description && quiz.description !== "null" && quiz.description !== ""
        ? quiz.description
        : "Nội dung mặc định",
    answer:
      quiz.answers && quiz.answers.length > 0
        ? quiz.answers.map((ans) => ({
          ...ans,
          description:
            ans.description &&
              ans.description !== "null" &&
              ans.description !== ""
              ? ans.description
              : "Câu trả lời không hợp lệ",
        }))
        : [
          {
            idAnswered: "default",
            descriptionAnswered: "Không có câu trả lời",
            isCorrect: false,
          },
        ],
  }));

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
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="detail-quiz-container" >
          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && processedQuiz.length > 0 && (
            <>
              <div className="left-content">
                <div className="title">
                  Quiz: {processedQuiz.length > 0 ? processedQuiz[0].quizInforVM.name : quizId}
                </div>

                <hr />
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
                  <button onClick={handlePrevQuestion} className="btn btn-secondary">
                    Prev
                  </button>
                  <button onClick={handleNextQuestion} className="btn btn-primary">
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
                />
              </div>
              <ModalResult
                show={isShowModalResult}
                setShow={setIsShowModalResult}
                dataModalResult={dataModalResult}
                handleShowAnswers={handleShowAnswers}
              />
            </>
          )}
          {
            !loading && !error && processedQuiz.length === 0 && (
              <p>Không có câu hỏi nào để hiển thị.</p>
            )
          }
        </div >
      )}
    </>
  );
};

export default DetailQuizz;