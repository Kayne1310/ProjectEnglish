import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Lấy quiz_id từ URL
import "../assets/css/FlashCardQuiz/flashcard.css";
import { flashcard } from "../service/QuizService";

const Flashcard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  // Lấy quiz_id từ URL
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("quiz_id");

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!quizId) {
        console.error("Không có quiz_id trong URL!");
        return;
      }

      try {
        // Gọi API lấy danh sách câu hỏi từ quizId
        const response = await flashcard(quizId);

        console.log("Dữ liệu từ API:", response);

        if (!response || response.length === 0) {
          console.warn("Không có dữ liệu từ API!");
          return;
        }

        // Định dạng dữ liệu flashcard từ API
        const formattedFlashcards = response.map(item => ({
          question: item.questionInfo[0]?.description || "Không có câu hỏi",
          answer: item.description || "Không có câu trả lời"
        }));

        setFlashcards(formattedFlashcards);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchFlashcards();
  }, [quizId]);

  // Cập nhật flashcard hiện tại
  const updateFlashcard = (index) => {
    if (index >= 0 && index < flashcards.length) {
      setCurrentIndex(index);
      setFlipped(false);
    }
  };

  // Xáo trộn flashcards
  const shuffleFlashcards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
  };

  // Đọc to nội dung
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcard-container">
      {flashcards.length > 0 ? (
        <>
          <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
            <div className="front">
              <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint: Think about the basics!"); }}>
                <i className="bi bi-lightbulb"></i>
              </button>
              <button className="icon-button right" onClick={(e) => { e.stopPropagation(); speak(flashcards[currentIndex]?.question); }}>
                <i className="bi bi-volume-up"></i>
              </button>
              <div className="content">{flashcards[currentIndex]?.question}</div>
            </div>

            <div className="back">
              <button className="icon-button left" onClick={(e) => { e.stopPropagation(); alert("Hint for answer: Try to recall!"); }}>
                <i className="bi bi-lightbulb"></i>
              </button>
              <button className="icon-button right" onClick={(e) => { e.stopPropagation(); speak(flashcards[currentIndex]?.answer); }}>
                <i className="bi bi-volume-up"></i>
              </button>
              <div className="content">{flashcards[currentIndex]?.answer}</div>
            </div>
          </div>

          <div className="controls">
            <button onClick={() => updateFlashcard(currentIndex - 1)} disabled={currentIndex === 0}>Previous</button>
            <button onClick={shuffleFlashcards}>Shuffle</button>
            <button onClick={() => updateFlashcard(currentIndex + 1)} disabled={currentIndex === flashcards.length - 1}>Next</button>
          </div>
        </>
      ) : (
        <p>Không có dữ liệu flashcard...</p>
      )}
    </div>
  );
};

export default Flashcard;
