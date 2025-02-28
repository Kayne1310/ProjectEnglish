import React, { useState } from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

const Questions = ({ question, questionIndex }) => {
  if (!question) return <p>Không có câu hỏi.</p>;

  // Hàm để cắt ngắn text nếu quá dài
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Quản lý trạng thái hiển thị toàn bộ hoặc rút gọn text
  const [showFullText, setShowFullText] = useState({});
  // Quản lý trạng thái câu trả lời được chọn
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const toggleFullText = (ansId) => {
    setShowFullText((prev) => ({
      ...prev,
      [ansId]: !prev[ansId],
    }));
  };

  const handleSelectAnswer = (ansId) => {
    setSelectedAnswer(ansId); // Chọn đáp án
    // Có thể thêm logic xử lý khác, như gửi dữ liệu lên server hoặc kiểm tra đáp án
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="question-container">
      {/* Hiển thị image trong Questions */}
      <div className="q-image">
        {/* Ảnh - Khi click vào sẽ mở Lightbox */}
        <img
          src={question.image}
          alt="Question"
          style={{ cursor: "pointer"}}
          onClick={() => setOpen(true)}
        />

        {/* Lightbox hiển thị khi open = true */}
        {open === true &&(
          <Lightbox
            image={question.image}
            title="Xem ảnh"
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      <div className="question">
        <strong>Câu {questionIndex + 1}:</strong> {question.description}
      </div>
      <div className="answer">
        <div className="answer-options">
          {question.answer.map((ans, idx) => {
            const ansId = ans.idAnswered || idx;
            const maxLength = 40; // Độ dài tối đa trước khi cắt
            const displayText = showFullText[ansId]
              ? ans.descriptionAnswered
              : truncateText(ans.descriptionAnswered, maxLength);

            return (
              <div key={ansId} className="answer-option-wrapper">
                <button
                  className={`answer-option ${showFullText[ansId] ? "expanded" : ""} ${selectedAnswer === ansId ? "selected" : ""
                    }`}
                  onClick={() => handleSelectAnswer(ansId)} // Chọn đáp án
                >
                  <span className="answer-number">{idx + 1}</span>
                  <span className="answer-option-text-container">
                    <span className="answer-option-text">
                      {displayText}
                    </span>
                    {ans.descriptionAnswered.length > maxLength && (
                      <span
                        className="expand-toggle"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan ra button
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