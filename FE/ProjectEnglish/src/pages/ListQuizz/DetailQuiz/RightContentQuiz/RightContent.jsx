import CountDown from "./CountDown";

const RightContent = (props) => {
  // Sử dụng destructuring cho các props
  const { questions, currentQuestionIndex, userAnswers, setCurrentQuestionIndex, onTimeUpdate } = props;

  const onTimeUp = () => {
    alert("endgame");
    // if (handleFinishQuiz) {
    //   handleFinishQuiz();
    // }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleTimeUpdate = (currentTime) => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  };

  return (
    <div>
      <div className="main-timer">
        <CountDown onTimeUp={onTimeUp} onTimeUpdate={handleTimeUpdate} />
      </div>
      <div className="main-question">
        {questions &&
          questions.length > 0 &&
          questions.map((item, index) => {
            const isAnswered = userAnswers[item.question_id] !== undefined;
            return (
              <div
                key={`question-abc-${index}`}
                // className={`question ${index === currentQuestionIndex ? "selected" : ""} ${isAnswered ? "answered" : ""}`}
                className={`question ${isAnswered ? "selected" : ""}`}
                onClick={() => handleQuestionClick(index)}
              >
                {index + 1}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RightContent;