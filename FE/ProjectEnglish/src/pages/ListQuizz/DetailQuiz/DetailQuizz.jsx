import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionbyQuizId } from "../../../service/quizService";
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
  //   const [isShowModalResult, setIsShowModalResult] = useState(false);
  //   const [dataModalResult, setDataModalResult] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

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
      quiz.answer && quiz.answer.length > 0
        ? quiz.answer.map((ans) => ({
          ...ans,
          descriptionAnswered:
            ans.descriptionAnswered &&
              ans.descriptionAnswered !== "null" &&
              ans.descriptionAnswered !== ""
              ? ans.descriptionAnswered
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
  const goToNextQuestion = () => {
    if (currentQuestionIndex < processedQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = processedQuiz[currentQuestionIndex];

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
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
              />
            </div>
            <div className="footer">
              <button onClick={goToPreviousQuestion} className="btn btn-secondary">
                Prev
              </button>
              <button onClick={goToNextQuestion} className="btn btn-primary">
                Next
              </button>
              <button
                onClick={() => {
                  /* Xử lý logic nộp bài */
                }}
                className="btn btn-warning"
              >
                Finish
              </button>
            </div>
          </div>
          <div className="right-content">
            <RightContent
              questions={processedQuiz}
              currentQuestionIndex={currentQuestionIndex}
            />
          </div>
          {/* <ModalResult
            show={isShowModalResult}
            setShow={setIsShowModalResult}
            dataModalResult={dataModalResult}
          /> */}
        </>
      )
      }
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
