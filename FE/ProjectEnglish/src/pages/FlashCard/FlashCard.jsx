// Flashcard.js
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom"; // Lấy quiz_id từ URL
import "../../assets/css/FlashCardQuiz/flashcard.css";
import "../../assets/css/FlashCardQuiz/QuizletForm.css";
import "../../assets/css/FlashCardQuiz/listening.css";

import { flashcard as getFlashcards } from "../../service/quizService.js";
import { getQuestionbyQuizId } from "../../service/quizService.js"; // Thêm để gọi API cho Quiz
import { Card, Col, Form, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spin } from 'antd'; // Thêm Spin từ antd để hiển thị loading
import correctSound from "../../assets/sound/correct-156911.mp3";
import incorrectSound from "../../assets/sound/wrong-47985.mp3";
import { speak, stopSpeak } from '../../service/geminiService';

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
  const [pressedKey, setPressedKey] = useState(null);
  const [learnedCards, setLearnedCards] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [listeningAnswer, setListeningAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isListeningCorrect, setIsListeningCorrect] = useState(null);

  const handleSkip = () => {
    const correctAnswer = currentItem.answer.find(ans => ans.correct_answer);
    console.log("correctAnswer", correctAnswer);
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
    setIsCorrect(ans.correct_answer);

    setTimeout(() => {
      if (ans.correct_answer) {
        goToNextQuestion();
      }
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
    // Phát âm thanh tương ứng
    const audio = new Audio(ans.correct_answer ? correctSound : incorrectSound);
    audio.play();
  };

  // Tách các handlers thành các hàm riêng
  const handleFlipCard = (e) => {
    if (mode === "flashcard") {
      e.preventDefault();
      setFlipped(prev => !prev);
      playKeySound();
    }
  };

  const handleNextCard = () => {
    if (currentQuestionIndex < (mode === "flashcard" ? flashcards.length : questions.length) - 1) {
      // Đánh dấu card hiện tại là đã học
      setLearnedCards(prev => new Set([...prev, currentQuestionIndex]));
      goToNextQuestion();
      playKeySound();
    }
  };

  const handlePreviousCard = () => {
    if (currentQuestionIndex > 0) {
      goToPreviousQuestion();
      playKeySound();
    }
  };

  // Hàm phát âm thanh khi nhấn phím
  const playKeySound = () => {
    // Có thể tùy chỉnh âm thanh khác nhau cho mỗi hành động
    const audio = new Audio('/path/to/key-sound.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => { }); // Catch để tránh lỗi khi browser block autoplay
  };

  // Custom hook để xử lý keyboard events
  const useKeyboardControls = (handlers) => {
    useEffect(() => {
      const handleKeyPress = (e) => {
        // Ngăn chặn xử lý khi đang nhập liệu
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }

        // Thêm animation class
        setPressedKey(e.key);

        // Xóa class sau 200ms
        setTimeout(() => {
          setPressedKey(null);
        }, 200);

        switch (e.key) {
          case 'ArrowRight':
            handlers.onNext();
            break;
          case 'ArrowLeft':
            handlers.onPrevious();
            break;
          case ' ':
            handlers.onFlip(e);
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handlers]);
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
          setQuestions(location.state.flashcards);
          setIsQuizMode(false);
        }

        // Nếu có quizId thì fetch data từ quiz
        else if (quizId) {
          const flashcardResponse = await getFlashcards(quizId);
          if (!flashcardResponse || flashcardResponse.length === 0) {
            console.warn("Không có dữ liệu flashcard từ API!");
          } 
          else // gán dữ liệu flashcard vào flashcards
          {
            const formattedFlashcards = flashcardResponse.map((item) => ({
              question: item.questionInfo[0]?.description || "Không có câu hỏi",
              answer: item.description || "Không có câu trả lời",
              examples: item.exampleVM || [],
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
  const handleSpeak = async (text, isUKVoice = true) => {
    try {
      // Dừng audio đang phát (nếu có)
      stopSpeak();

      setIsPlaying(true);
      // Chọn giọng đọc dựa trên toggle UK/US
      const voiceType = isUKVoice ? "UK English Male" : "US English Male";

      await speak(text, voiceType);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
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
      quiz.answers && quiz.answers.length > 0
        ? quiz.answers.map((ans) => ({
          ...ans,
          description:
            ans.description && ans.description !== "null" && ans.description !== ""
              ? ans.description
              : "Câu trả lời không hợp lệ",
        }))
        : [{ idAnswered: "default", description: "Không có câu trả lời", isCorrect: false }],
  }));

  const currentItem = mode === "flashcard" ? flashcards[currentQuestionIndex] : processedQuiz[currentQuestionIndex];
  const currentItemListent = mode === "listening" ? flashcards[currentQuestionIndex] : processedQuiz[currentQuestionIndex];
  const currentItemFill = mode === "fillblank" ? flashcards[currentQuestionIndex] : processedQuiz[currentQuestionIndex];
  console.log("currentItemFill check: ", currentItemFill);
  // Sử dụng custom hook
  useKeyboardControls({
    onNext: handleNextCard,
    onPrevious: handlePreviousCard,
    onFlip: handleFlipCard
  });

  // Sửa lại cách tính tiến trình
  const calculateProgress = () => {
    const totalCards = mode === "flashcard" ? flashcards.length : questions.length;
    // Tính số card đã học (tính cả card hiện tại)
    const learned = currentQuestionIndex + 1;
    return {
      count: Math.min(learned, totalCards), // Đảm bảo không vượt quá tổng số
      percentage: totalCards > 0 ? Math.min(Math.round((learned / totalCards) * 100), 100) : 0
    };
  };

  // Reset tiến trình và quay về card đầu tiên
  const resetProgress = () => {
    setLearnedCards(new Set());
    setCurrentQuestionIndex(0);
    setFlipped(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSkipped(false);
  };

  // Reset khi đổi mode hoặc shuffle
  useEffect(() => {
    resetProgress();
  }, [mode, flashcards]); // Reset khi đổi mode hoặc shuffle cards

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, []);

  // Thêm hàm xử lý chuỗi để lấy text trước dấu ngoặc đơn
  const getTextBeforeParentheses = (text) => {
    if (!text) return '';
    const match = text.match(/^([^(]+)/);
    return match ? match[1].trim() : text.trim();
  };

  // Thêm hàm xử lý cho Listening
  const handleListeningSubmit = () => {
    if (!listeningAnswer.trim()) return;
    
    let correctAnswer;
    // if (location.pathname.includes('/practice/')) {
    //   correctAnswer = currentItemListent.description;
    // } else {
    //   correctAnswer = currentItemListent.answer;
    // }
    correctAnswer = currentItemListent.question;
    const userAnswer = listeningAnswer.trim();
    const correctAnswerWithoutParentheses = getTextBeforeParentheses(correctAnswer);
    
    // Kiểm tra cả hai trường hợp: đáp án đầy đủ hoặc chỉ phần trước dấu ngoặc
    const isCorrect = userAnswer === correctAnswer || userAnswer === correctAnswerWithoutParentheses;
    
    setIsListeningCorrect(isCorrect);
    
    // Phát âm thanh tương ứng
    const audio = new Audio(isCorrect ? correctSound : incorrectSound);
    audio.play();

    if (isCorrect) {
      setTimeout(() => {
        goToNextQuestion();
        setListeningAnswer("");
        setIsListeningCorrect(null);
        setShowAnswer(false);
      }, 2000);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Thêm hàm xử lý ExampleVM
  const getExampleWithBlank = (example, title) => {
    if (!example || !title) return '';
    
    // Tạo regex để tìm từ trong câu (có thể đứng một mình hoặc nằm trong từ ghép)
    const regex = new RegExp(`\\b${title}\\b`, 'gi');
    
    // Thay thế từ tìm được bằng dấu gạch dưới
    return example.replace(regex, '___');
  };

  // Thêm hàm lọc ví dụ có chứa từ cần tìm
  // const getMatchingExamples = (examples, title) => {
  //   if (!examples || !title) return [];
    
  //   return examples.filter(example => {
  //     const regex = new RegExp(`\\b${title}\\b`, 'gi');
  //     return regex.test(example.En) || regex.test(example.Vi);
  //   });
  // };

  // Thêm hàm kiểm tra ngôn ngữ của từ
  const isEnglishWord = (word) => {
    // Kiểm tra xem từ có chứa ký tự tiếng Việt không
    const vietnamesePattern = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return !vietnamesePattern.test(word);
  };

  // Thêm hàm lấy random example và hiển thị câu ví dụ cùng ngôn ngữ với Title
  const getRandomMatchingExample = (examples, title) => {
    if (!examples || !title || !Array.isArray(examples)) return null;
    
    // Xác định ngôn ngữ của title
    const isEnglish = isEnglishWord(title);
    
    // Lọc các ví dụ có chứa từ cần tìm trong ngôn ngữ tương ứng
    const matchingExamples = examples.filter(example => {
      const titleLower = title.toLowerCase();
      // Nếu title là tiếng Anh, tìm trong câu tiếng Anh
      if (isEnglish) {
        const enLower = example.en?.toLowerCase() || '';
        return enLower.includes(titleLower);
      }
      // Nếu title là tiếng Việt, tìm trong câu tiếng Việt
      else {
        const viLower = example.vi?.toLowerCase() || '';
        return viLower.includes(titleLower);
      }
    });
    
    if (matchingExamples.length === 0) return null;
    
    // Lấy ngẫu nhiên một ví dụ
    const randomIndex = Math.floor(Math.random() * matchingExamples.length);
    const example = matchingExamples[randomIndex];
    
    // Trả về câu ví dụ cùng ngôn ngữ với title
    return {
      displayText: isEnglish ? example.en : example.vi,
      // trans: example.Trans
    };
  };

  // Thêm hàm xử lý Fill Blank Submit
  const handleFillBlankSubmit = () => {
    if (!listeningAnswer.trim()) return;
    
    const userAnswer = listeningAnswer.trim();
    const correctAnswer = currentItemFill?.question;
    
    // So sánh đáp án (phân biệt hoa thường vì đây là từ vựng)
    const isCorrect = userAnswer === correctAnswer;
    
    setIsListeningCorrect(isCorrect);
    
    // Phát âm thanh tương ứng
    const audio = new Audio(isCorrect ? correctSound : incorrectSound);
    audio.play();

    if (isCorrect) {
      setTimeout(() => {
        goToNextQuestion();
        setListeningAnswer("");
        setIsListeningCorrect(null);
        setShowAnswer(false);
      }, 2000);
    }
  };

  if (loading) return <div className="text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center">{error}</div>;

  // JSX cho phần hiển thị phím tắt
  const KeyboardShortcuts = () => (
    <Card className="bg-white p-3 rounded-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        <kbd className={`custom-keyboard-key px-2 py-1 bg-light text-black rounded shadow-sm border ${pressedKey === 'ArrowRight' ? 'key-pressed' : ''}`}>→</kbd>
        <span className="text-secondary">Tiến tới</span>
      </div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <kbd className={`custom-keyboard-key px-2 py-1 bg-light text-black rounded shadow-sm border ${pressedKey === 'ArrowLeft' ? 'key-pressed' : ''}`}>←</kbd>
        <span className="text-secondary">Lùi lại</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <kbd className={`custom-keyboard-key px-2 py-1 bg-light text-black rounded shadow-sm border ${pressedKey === ' ' ? 'key-pressed' : ''}`}>Space</kbd>
        <span className="text-secondary">Lật thẻ</span>
      </div>
    </Card>
  );

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
                        <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={handleFlipCard}>
                          <div className="front">
                            <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint: Think about the basics!"); }}>
                              <i className="bi bi-lightbulb"></i>
                            </button>
                            <button
                              className="icon-button right"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(flashcards[currentQuestionIndex]?.question);
                              }}
                              disabled={isPlaying}
                            >
                              <i className={`bi ${isPlaying ? 'bi-volume-up-fill' : 'bi-volume-up'}`}></i>
                            </button>
                            <div className="content fw-bold">{flashcards[currentQuestionIndex]?.question}
                              <div className="transcription fs-5 mt-2 fw-normal font-italic ">{flashcards[currentQuestionIndex]?.transcription}</div>

                            </div>
                          </div>

                          <div className="back">
                            <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint for answer: Try to recall!"); }}>
                              <i className="bi bi-lightbulb"></i>
                            </button>
                            <button
                              className="icon-button right"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(flashcards[currentQuestionIndex]?.answer);
                              }}
                              disabled={isPlaying}
                            >
                              <i className={`bi ${isPlaying ? 'bi-volume-up-fill' : 'bi-volume-up'}`}></i>
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
                  {mode === "quiz" && (
                    <div className="quizlet-container bg-white p-3 rounded-3 shadow-sm d-flex flex-column border mb-4"
                      style={{
                        width: "100%",
                        maxWidth: "825px",
                        maxHeight: "450px",
                        marginTop: "20px"
                      }}>
                      {questions.length > 0 ? (
                        <div className="d-flex flex-column h-100">
                          {/* Header */}
                          <div className="d-flex justify-content-between align-items-center mb-0">
                            <div className="quizlet-definition-label">
                              <i className="fas fa-lightbulb"></i>
                            </div>
                            <button
                              className="quizlet-audio-btn"
                              title="sound"
                              onClick={() => handleSpeak(currentItem.description)}
                              disabled={isPlaying}
                            >
                              <i className={`fas ${isPlaying ? 'fa-volume-up text-primary' : 'fa-volume-up'}`}></i>
                            </button>
                          </div>

                          {/* Content */}
                          <div className="flex-grow-1 d-flex flex-column flex-md-row gap-3 mb-3">
                            <div className="question-section flex-grow-1 d-flex align-items-center justify-content-center p-3 bg-white rounded">
                              <p className="m-0 text-center">{currentItem.description}</p>
                            </div>

                            {currentItem.image && (
                              <div className="image-section d-flex align-items-center justify-content-center">
                                <div className="position-relative"
                                  style={{
                                    width: "194px",
                                    height: "194px",
                                    minWidth: "194px"
                                  }}>
                                  <img
                                    src={currentItem.image}
                                    alt="Quiz"
                                    className="rounded w-100 h-100 object-fit-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Options */}
                          <div className="options-grid row row-cols-1 row-cols-md-2 g-2 mb-3"
                            style={{ height: "100px" }}>
                            {currentItem.answer.length !== 4 ? (
                              <div className="col-12 text-center text-danger">
                                Câu hỏi này không đủ 4 câu trả lời
                              </div>
                            ) : (
                              currentItem.answer.map((ans, index) => (
                                <div className="col h-50" key={index}>
                                  <button
                                    className={`quizlet-option w-100 h-100 d-flex align-items-center ${selectedAnswer === ans.idAnswered
                                      ? (isCorrect ? "correct" : "incorrect")
                                      : ""
                                      }`}
                                    onClick={() => handleAnswerClick(ans)}
                                  >
                                    <span className="answer-number d-flex align-items-center justify-content-center"
                                      style={{ minWidth: "24px", height: "24px" }}>
                                      {selectedAnswer === ans.idAnswered ? (
                                        isCorrect ?
                                          <i className="fas fa-check-circle"></i> :
                                          <i className="fas fa-times-circle"></i>
                                      ) : (
                                        index + 1
                                      )}
                                    </span>
                                    <span className="quizlet-option-text px-2 text-truncate">
                                      {ans.description}
                                    </span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                          {/* Help Link */}
                          <div className="text-center mt-auto">
                            {skipped ? (
                              <span className="skipped-text" style={{ fontSize: "12px" }}>Đã bỏ qua</span>
                            ) : (
                              <div
                                className="skip-button text-secondary d-inline-block position-relative cursor-pointer mt-2"
                                onClick={handleSkip}
                                style={{
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                  paddingBottom: '9px',
                                  borderRadius: '20px'
                                }}
                              >
                                <span className="position-relative z-1 " style={{ fontSize: "12px" }}>Bạn không biết?</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-center">Không có dữ liệu quiz...</p>
                      )}
                    </div>
                  )}

                  {/* Listening Container */}
                  {mode === "listening" && (
                    <div className="listening-container bg-white p-3 rounded-3 shadow-sm d-flex flex-column border mb-4"
                      style={{
                        width: "100%",
                        maxWidth: "825px",
                        maxHeight: "450px",
                        marginTop: "20px"
                      }}>
                      <div className="listening-header">
                        <h2>NGHE VÀ ĐIỀN TỪ</h2>
                        <button className="listening-mode-btn">Listening</button>
                      </div>

                      <div className="audio-controls">
                        <button className="audio-btn uk-btn" onClick={() => handleSpeak(flashcards[currentQuestionIndex]?.question)}>🔊 UK</button>
                        <button className="audio-btn us-btn" onClick={() => handleSpeak(flashcards[currentQuestionIndex]?.question)}>🔊 US</button>
                      </div>

                      <div className="listening-content">
                        <div className="definition-section">
                          <h3>Định nghĩa:</h3>
                          <p>{flashcards[currentQuestionIndex]?.answer}</p>
                        </div>

                        <div className="input-section">
                          <input 
                            type="text" 
                            placeholder="Điền từ bạn nghe được"
                            className={`listening-input ${isListeningCorrect !== null ? (isListeningCorrect ? 'correct' : 'incorrect') : ''}`}
                            value={listeningAnswer}
                            onChange={(e) => setListeningAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleListeningSubmit()}
                            disabled={isListeningCorrect === true}
                          />
                          <button 
                            className="submit-btn"
                            onClick={handleListeningSubmit}
                            disabled={!listeningAnswer.trim() || isListeningCorrect === true}
                          >
                            {isListeningCorrect !== null ? (
                              isListeningCorrect ? '✓' : '✗'
                            ) : '➔'}
                          </button>
                        </div>

                        <div className="answer-section">
                          {!showAnswer && isListeningCorrect !== true && (
                            <button className="show-answer-btn" onClick={handleShowAnswer}>
                              Hiện đáp án
                            </button>
                          )}
                          {showAnswer && (
                            <div className="correct-answer">
                              Đáp án đúng: <span className="fw-bold">
                                {/* {location.pathname.includes('/practice/') 
                                  ? currentItemListent.question 
                                  : currentItemListent.question} */}
                                  {currentItemListent.question}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fill Blank Container */}
                  {mode === "fillblank" && (
                    <div className="listening-container bg-white p-3 rounded-3 shadow-sm d-flex flex-column border mb-4"
                      style={{
                        width: "100%",
                        maxWidth: "825px",
                        maxHeight: "450px",
                        marginTop: "20px"
                      }}>
                      <div className="listening-header">
                        <h2>ĐIỀN TỪ CÒN THIẾU</h2>
                        <button className="listening-mode-btn">Fill Blank</button>
                      </div>

                      <div className="listening-content">
                        <div className="definition-section">
                          <h3>Định nghĩa:</h3>
                          <p>{flashcards[currentQuestionIndex]?.answer}</p>
                        </div>

                        <div className="example-section">
                          <h3>Ví dụ:</h3>
                          {!currentItemFill?.examples || currentItemFill.examples.length === 0 ? (
                            <p className="text-danger">Hiện tại chưa có ví dụ nào!</p>
                          ) : (
                            currentItemFill?.question && currentItemFill?.examples && (
                              <>
                                {(() => {
                                  const firstExample = currentItemFill.examples[0];
                                  if (!firstExample) return null;

                                  // Hàm xử lý ẩn từ trong câu
                                  const hideWordInSentence = (sentence, wordToHide) => {
                                    if (!sentence || !wordToHide) return sentence;
                                    const regex = new RegExp(`\\b${wordToHide}\\b`, 'gi');
                                    return sentence.replace(regex, '___');
                                  };

                                  // Kiểm tra xem Title có trong En hay Vi không
                                  const title = currentItemFill.question;
                                  let displayText = '';

                                  // Nếu Title có trong En
                                  if (firstExample.en.toLowerCase().includes(title.toLowerCase())) {
                                    displayText = hideWordInSentence(firstExample.en, title);
                                  }
                                  // Nếu Title có trong Vi
                                  else if (firstExample.vi.toLowerCase().includes(title.toLowerCase())) {
                                    displayText = hideWordInSentence(firstExample.vi, title);
                                  }

                                  return displayText ? (
                                    <div className="example-item mb-3">
                                      <p className="english-example">
                                        {displayText}
                                      </p>
                                    </div>
                                  ) : null;
                                })()}
                              </>
                            )
                          )}
                        </div>

                        <div className="input-section">
                          <input 
                            type="text" 
                            placeholder="Điền từ còn thiếu"
                            className={`listening-input ${isListeningCorrect !== null ? (isListeningCorrect ? 'correct' : 'incorrect') : ''}`}
                            value={listeningAnswer}
                            onChange={(e) => setListeningAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleFillBlankSubmit()}
                            disabled={isListeningCorrect === true || !currentItemFill?.examples || currentItemFill.examples.length === 0}
                          />
                          <button 
                            className="submit-btn"
                            onClick={handleFillBlankSubmit}
                            disabled={!listeningAnswer.trim() || isListeningCorrect === true || !currentItemFill?.examples || currentItemFill.examples.length === 0}
                          >
                            {isListeningCorrect !== null ? (
                              isListeningCorrect ? '✓' : '✗'
                            ) : '➔'}
                          </button>
                        </div>

                        <div className="answer-section">
                          {!showAnswer && isListeningCorrect !== true && currentItemFill?.examples && currentItemFill.examples.length > 0 && (
                            <button className="show-answer-btn" onClick={handleShowAnswer}>
                              Hiện đáp án
                            </button>
                          )}
                          {showAnswer && (
                            <div className="correct-answer">
                              Đáp án đúng: <span className="fw-bold">{currentItemFill.question}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div className=" border rounded-3  bg-white w-100 d-flex " style={{ width: "100%", maxWidth: "825px" }}>
                    <div
                      className="flex-1  p-3 d-flex flex-column gap-2 justify-content-center align-items-center navigation-btn"
                      onClick={handlePreviousCard}
                      style={{ cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      <i className="fas fa-chevron-left"></i>
                      <p className="m-0 fs-6">Lùi lại</p>
                    </div>

                    <div
                      className="flex-1 p-3 d-flex flex-column gap-2 justify-content-center align-items-center navigation-btn"
                      onClick={handleNextCard}
                      style={{ cursor: currentQuestionIndex === (mode === "flashcard" ? flashcards.length : questions.length) - 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <i className="fas fa-chevron-right"></i>
                      <p className="m-0 fs-6">Tiến tới</p>
                    </div>
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
                    <Card className="bg-white p-3 border">
                      <Row className="align-items-center justify-content-between">
                        <Col xs="auto" className="d-flex align-items-center gap-2">
                          <span className="text">Random câu hỏi</span>
                          <Form.Check
                            type="switch"
                            id="random-switch"
                            onChange={() => shuffleFlashcards()}
                            className="mb-4"
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
                        onClick={() => setMode("listening")}
                        className={`custom-mode-btn btn ${mode === "listening" ? "btn-primary" : "btn-outline-secondary"} rounded-3`}
                      >
                        Listening
                      </button>
                      <button
                        onClick={() => setMode("fillblank")}
                        className={`custom-mode-btn btn ${mode === "fillblank" ? "btn-primary" : "btn-outline-secondary"} rounded-3`}
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
                    <div className="custom-card bg-white border p-3 rounded-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Đã học:</span>
                        <div className="d-flex align-items-center gap-2">
                          <span>{calculateProgress().count}/{mode === "flashcard" ? flashcards.length : questions.length}</span>
                          <div
                            className="border btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={resetProgress}
                            title="Reset tiến trình"
                          >
                            <i className="fas fa-redo-alt"></i>
                            <span className="d-none d-md-inline">Reset</span>
                          </div>
                        </div>
                      </div>
                      <div className="progress custom-progress">
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{
                            width: `${calculateProgress().percentage}%`,
                            transition: 'width 0.3s ease-in-out'
                          }}
                          aria-valuenow={calculateProgress().percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {/* Đã xóa {calculateProgress().percentage}% */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phím tắt */}
                  <div className="custom-shortcut-section">
                    <h2 className="custom-section-title">Phím tắt</h2>
                    <KeyboardShortcuts />
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