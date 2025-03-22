import React, { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Questions = ({ question, questionIndex, selectedAnswer, handleAnswerSelect }) => {
  if (!question) return <p>Không có câu hỏi.</p>;

  const [showFullText, setShowFullText] = useState({});
  const [open, setOpen] = useState(false);

  const truncateText = (text, maxLength) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  const toggleFullText = (ansId) => {
    setShowFullText((prev) => ({ ...prev, [ansId]: !prev[ansId] }));
  };


  return (
    <div className="question-container">
      <div className="q-image">
        <img
          src={question.image}
          alt="Question"
          style={{ cursor: "pointer", maxWidth: "200px" }}
          onClick={() => setOpen(true)}
        />
        <Lightbox open={open} close={() => setOpen(false)} slides={[{ src: question.image }]} />
      </div>

      <div className="question">
        <strong>Câu {questionIndex + 1}:</strong> {question.description}
      </div>

      <div className="answer">
        <div className="answer-options">
          {question.answers.map((ans, idx) => {
            const ansId = ans.idAnswered || idx;
            const isSelected = selectedAnswer === ansId; // Kiểm tra xem đáp án có được chọn không
            const maxLength = 40;
            const displayText = showFullText[ansId]
              ? ans.description
              : truncateText(ans.description, maxLength);

            return (
              <div className="answer-option-wrapper">
                <button
                  key={ansId}
                  className={`answer-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleAnswerSelect(question.question_id, ansId)}
                >
                  <span className="answer-number">{idx + 1}</span>
                  <span className="answer-option-text-container">
                    <span className="answer-option-text">{displayText}</span>
                    {ans.description.length > maxLength && (
                      <span
                        className="expand-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullText(ansId);
                        }}
                      >
                        {showFullText[ansId] ? " (Ẩn)" : " (Xem thêm)"}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Questions;
