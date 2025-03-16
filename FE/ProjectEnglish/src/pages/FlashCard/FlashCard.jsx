// Flashcard.js
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom"; // Lấy quiz_id từ URL
import "../../assets/css/FlashCardQuiz/flashcard.css";
import "../../assets/css/FlashCardQuiz/QuizletForm.css";
import { flashcard as getFlashcards } from "../../service/quizService.js";
import { getQuestionbyQuizId } from "../../service/quizService.js"; // Thêm để gọi API cho Quiz
import { Card, Col, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin } from 'antd'; // Thêm Spin từ antd để hiển thị loading
import correctSound from "../../assets/sound/correct-156911.mp3";
import incorrectSound from "../../assets/sound/wrong-47985.mp3";

const Flashcard = () => {
  const { quizId } = useParams(); // Lấy quizId từ URL
  const [mode, setMode] = useState("flashcard"); // Quản lý chế độ: flashcard hoặc quiz
  const [flashcards, setFlashcards] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Sử dụng chung cho cả Flashcard và Quiz
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [skipped, setSkipped] = useState(false);


  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const [isQuizMode, setIsQuizMode] = useState(false);

  const handleSkip = () => {
    const correctAnswer = currentItem.answer.find(ans => ans.isCorrect);

    if (correctAnswer) {
      setSelectedAnswer(correctAnswer.idAnswered);
      setIsCorrect(true);

      // Phát âm thanh đúng
      const audio = new Audio(correctSound);
      audio.play();

      // Đổi trạng thái sau khi bỏ qua
      setTimeout(() => {
        goToNextQuestion();
      }, 2000);

      setSkipped(true); // Đánh dấu là đã bỏ qua
    }
  };
  const handleAnswerClick = (ans) => {
    setSelectedAnswer(ans.idAnswered);
    setIsCorrect(ans.isCorrect);

    setTimeout(() => {
      if (ans.isCorrect) {
        goToNextQuestion();
      }
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
    // Phát âm thanh tương ứng
    const audio = new Audio(ans.isCorrect ? correctSound : incorrectSound);
    audio.play();
  };


  useEffect(() => {
    let timer;

    window.scroll(0, 0);
    const fetchData = async () => {


      setLoading(true);
      try {
        // Gọi API cho Flashcard
        if (location.state?.flashcards) {
          setFlashcards(location.state.flashcards);
          setIsQuizMode(false);
        }
        // Nếu có quizId thì fetch data từ quiz
        else if (quizId) {
          const flashcardResponse = await getFlashcards(quizId);
          if (!flashcardResponse || flashcardResponse.length === 0) {
            console.warn("Không có dữ liệu flashcard từ API!");
          } else {
            const formattedFlashcards = flashcardResponse.map((item) => ({
              question: item.questionInfo[0]?.description || "Không có câu hỏi",
              answer: item.description || "Không có câu trả lời",
            }));
            setFlashcards(formattedFlashcards);
          }
          // Gọi API cho Quiz
          const quizResponse = await getQuestionbyQuizId(quizId);
          if (!quizResponse.data || quizResponse.data.length === 0) {
            console.warn("Không có dữ liệu quiz từ API!");
          } else {
            setQuestions(quizResponse.data);
          }
          setIsQuizMode(true);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
      timer = setTimeout(() => {
        setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
      }, 2000);
    };

    fetchData();
    // Cleanup timer nếu component unmount trước khi 2 giây trôi qua
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [quizId, location]);

  // Cập nhật flashcard hoặc question hiện tại
  const updateItem = (index) => {
    if (index >= 0 && index < (mode === "flashcard" ? flashcards.length : questions.length)) {
      setCurrentQuestionIndex(index);
      setFlipped(mode === "flashcard" ? false : false); // Chỉ reset flip cho Flashcard
    }
  };

  // Xáo trộn flashcards (chỉ áp dụng cho Flashcard)
  const shuffleFlashcards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentQuestionIndex(0);
    setFlipped(false);
  };

  // Đọc to nội dung (chỉ cho Flashcard)
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  // Hàm chuyển câu hỏi tiếp theo (chung cho cả Flashcard và Quiz)

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (mode === "flashcard" ? flashcards.length : questions.length) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Reset trạng thái khi sang câu mới
      setSelectedAnswer(null);
      setIsCorrect(null);
      setSkipped(false); // Reset trạng thái "bỏ qua"
    }
  };

  // Hàm quay lại câu hỏi trước (chung cho cả Flashcard và Quiz)
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Xử lý dữ liệu cho Quiz (tương tự QuizletForm)
  const processedQuiz = (questions || []).map((quiz) => ({
    ...quiz,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : "/default-image.jpg",
    description:
      quiz.description && quiz.description !== "null" && quiz.description !== ""
        ? quiz.description
        : "Nội dung mặc định",
    answer:
      quiz.answer && quiz.answer.length > 0
        ? quiz.answer.map((ans) => ({
          ...ans,
          descriptionAnswered:
            ans.descriptionAnswered && ans.descriptionAnswered !== "null" && ans.descriptionAnswered !== ""
              ? ans.descriptionAnswered
              : "Câu trả lời không hợp lệ",
        }))
        : [{ idAnswered: "default", descriptionAnswered: "Không có câu trả lời", isCorrect: false }],
  }));

  const currentItem = mode === "flashcard" ? flashcards[currentQuestionIndex] : processedQuiz[currentQuestionIndex];

  if (loading) return <div className="text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center">{error}</div>;

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
        <>
          <section className="about_section2 layout_padding2" >
            <div className="container">
              <Row className="mt-5">
                {/* Phần trung tâm - Form chính (Flashcard hoặc Quiz) */}
                <Col md={9} className="d-flex flex-column align-items-center mb-5">
                  {/* Flashcard Container */}
                  {mode === "flashcard" && (
                    <div className="flashcard-container" style={{ width: "100%", maxWidth: "825px" }}>
                      {flashcards.length > 0 ? (
                        <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
                          <div className="front">
                            <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint: Think about the basics!"); }}>
                              <i className="bi bi-lightbulb"></i>
                            </button>
                            <button className="icon-button right" onClick={(e) => { e.stopPropagation(); speak(flashcards[currentQuestionIndex]?.question); }}>
                              <i className="bi bi-volume-up"></i>
                            </button>
                            <div className="content">{flashcards[currentQuestionIndex]?.question}</div>
                          </div>
                          <div className="back">
                            <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint for answer: Try to recall!"); }}>
                              <i className="bi bi-lightbulb"></i>
                            </button>
                            <button className="icon-button right" onClick={(e) => { e.stopPropagation(); speak(flashcards[currentQuestionIndex]?.answer); }}>
                              <i className="bi bi-volume-up"></i>
                            </button>
                            <div className="content">{flashcards[currentQuestionIndex]?.answer}</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center">Không có dữ liệu flashcard...</p>
                      )}
                    </div>
                  )}

                  {/* Quizlet Container */}
                  {mode !== "flashcard" && (
                    <div className="quizlet-container bg-white p-0 rounded-3 shadow-sm d-flex flex-column border" style={{ width: "100%", maxWidth: "825px" }}>
                      {questions.length > 0 ? (
                        <>
                          <div className="quizlet-definition-section">
                            <div className="quizlet-definition-label">
                              <i className="fas fa-lightbulb"></i>
                            </div>
                            <button className="quizlet-audio-btn" title="sound">
                              <i className="fas fa-volume-up"></i>
                            </button>
                          </div>

                          <div className="quizlet-content-wrapper">
                            <div className="quizlet-question-container">
                              <p>{currentItem.description}</p>
                            </div>
                            <div className="quizlet-image-wrapper">
                              <div className="quizlet-image-container">
                                <img src={currentItem.image} alt="Quizlet hình ảnh" />
                              </div>
                            </div>
                          </div>

                          <div className="quizlet-options">
                            {currentItem.answer.map((ans, index) => (
                              <button
                                key={index}
                                className={`quizlet-option ${selectedAnswer === ans.idAnswered ? (isCorrect ? "correct" : "incorrect") : ""}`}
                                onClick={() => handleAnswerClick(ans)}
                              >
                                <span className="answer-number">
                                  {selectedAnswer === ans.idAnswered ? (
                                    isCorrect ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>
                                  ) : (
                                    index + 1
                                  )}
                                </span>
                                <span className="quizlet-option-text">{ans.descriptionAnswered}</span>
                              </button>
                            ))}
                          </div>

                          <div className="quizlet-help-link">
                            {skipped ? (
                              <span className="skipped-text">Đã bỏ qua</span>
                            ) : (
                              <button className="skip-button" onClick={handleSkip}>
                                Bạn không biết?
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-center">Không có dữ liệu quiz...</p>
                      )}
                    </div>
                  )}

                  {/* Footer đặt ngoài để không bị ảnh hưởng */}
                  <div className="custom-footer-navigation position-absolute bottom-0 start-50 translate-middle-x bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
                    style={{ width: "100%", maxWidth: "825px", zIndex: 1000, marginBottom: "20px" }}>
                    <button className="custom-footer-button d-flex align-items-center gap-2 btn btn-outline-secondary" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                      <i className="fas fa-chevron-left"></i>
                      <span>Lùi lại</span>
                    </button>
                    <button className="custom-footer-button d-flex align-items-center gap-2 btn btn-outline-secondary" onClick={goToNextQuestion} disabled={currentQuestionIndex === (mode === "flashcard" ? flashcards.length : questions.length) - 1}>
                      <span>Tiến tới</span>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </Col>


                {/* Sidebar - Giữ nguyên từ thiết kế trước đó */}
                <Col md={3} className="p-2 bg-white rounded-3">
                  {/* Phát âm giọng UK, US - Chỉ hiển thị khi mode là flashcard */}
                  {mode === "flashcard" && (
                    <div className="custom-audio-section mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
                          <path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
                        </svg>
                        <span className="custom-audio-label">Phát âm giọng UK, US</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked="true"
                        className="custom-switch-btn btn btn-outline-secondary rounded-pill d-flex align-items-center"
                      >
                        <span className="custom-switch-handle"></span>
                        <span className="custom-switch-inner">
                          <span className="custom-switch-inner-checked">UK</span>
                          <span className="custom-switch-inner-unchecked"></span>
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Cài đặt Random */}
                  <div className="mb-3">
                    <h2 className="fw-medium" style={{ fontSize: "medium" }}>
                      Cài đặt Random
                    </h2>
                    <Card className="bg-white p-3">
                      <Row className="align-items-center justify-content-between">
                        <Col xs="auto" className="d-flex align-items-center gap-2">
                          <span className="text-secondary">Random câu hỏi</span>
                          <Form.Check
                            type="switch"
                            id="random-switch"
                            onChange={() => shuffleFlashcards()}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </div>

                  {/* Chế độ học */}
                  <div className="custom-mode-section mb-3">
                    <h2 className="custom-section-title fw-medium" style={{ fontSize: "medium" }}>
                      Chế độ học
                    </h2>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        onClick={() => setMode("flashcard")}
                        className={`custom-mode-btn btn ${mode === "flashcard" ? "btn-primary" : "btn-outline-secondary"} rounded-3`}
                      >
                        Flashcard
                      </button>
                      <button
                        onClick={() => setMode("quiz")}
                        className={`custom-mode-btn btn ${mode === "quiz" ? "btn-primary" : "btn-outline-secondary"} rounded-3`}
                      >
                        Quiz
                      </button>
                      <button
                        onClick={() => alert("Chuyển đến Listening")}
                        className="custom-mode-btn btn btn-outline-secondary rounded-3"
                      >
                        Listening
                      </button>
                      <button
                        onClick={() => alert("Chuyển đến Fill Blank")}
                        className="custom-mode-btn btn btn-outline-secondary rounded-3"
                      >
                        Fill Blank
                      </button>
                    </div>
                  </div>

                  {/* Tiến trình */}
                  <div className="custom-progress-section mb-3">
                    <h2 className="custom-section-title fw-medium" style={{ fontSize: "medium" }}>
                      Tiến trình
                    </h2>
                    <div className="custom-card bg-light p-3 rounded-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Đã học:</span>
                        <span>0</span>
                      </div>
                      <div className="progress custom-progress">
                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: "0%" }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>

                  {/* Phím tắt */}
                  <div className="custom-shortcut-section">
                    <h2 className="custom-section-title fw-medium" style={{ fontSize: "medium" }}>
                      Phím tắt
                    </h2>
                    <Card className="bg-light p-3 rounded-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <kbd className="custom-keyboard-key px-2 py-1 bg-dark text-white rounded shadow-sm">→</kbd>
                        <span className="text-secondary">Tiến tới</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <kbd className="custom-keyboard-key px-2 py-1 bg-dark text-white rounded shadow-sm">←</kbd>
                        <span className="text-secondary">Lùi lại</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <kbd className="custom-keyboard-key px-2 py-1 bg-dark text-white rounded shadow-sm">Space</kbd>
                        <span className="text-secondary">Lật thẻ</span>
                      </div>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Flashcard;