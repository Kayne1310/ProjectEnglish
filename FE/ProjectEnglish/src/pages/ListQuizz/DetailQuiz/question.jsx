import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Questions = ({ question, questionIndex, userAnswers, handleAnswerSelect }) => {
  if (!question) return <p>Không có câu hỏi.</p>;

  const [open, setOpen] = useState(false);
  const MAX_TEXT_LENGTH = 40; // Maximum length before truncating

  const shouldTruncate = (text) => text.length > MAX_TEXT_LENGTH;
  const truncateText = (text) => {
    return text.length > MAX_TEXT_LENGTH
      ? `${text.substring(0, MAX_TEXT_LENGTH)}...`
      : text;
  };

  return (
    <div className="question-container">
      {question.image && (
        <div className="q-image">
          <img
            src={question.image}
            alt="Question"
            onClick={() => setOpen(true)}
          />
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={[{ src: question.image }]}
          />
        </div>
      )}

      <div className="question">
        <strong>Câu {questionIndex + 1}:</strong> {question.description}
      </div>

      <div className="answer">
        <div className="answer-options">
          {question.answers.map((ans, idx) => {
            const isSelected = userAnswers[question.question_id] === ans.idAnswered;

            return (
              <button
                key={ans.idAnswered || idx}
                className={`answer-option ${isSelected ? "selected" : ""}`}
                onClick={() => handleAnswerSelect(question.question_id, ans.idAnswered)}
              >
                <span className="answer-number">{idx + 1}</span>
                <div className="answer-option-text-container">
                  <span
                    className="answer-option-text"
                    data-full-text={shouldTruncate(ans.description) ? ans.description : null}
                  >
                    {truncateText(ans.description)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Questions;
