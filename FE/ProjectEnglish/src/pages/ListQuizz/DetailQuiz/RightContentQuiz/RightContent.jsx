import CountDown from "./CountDown";

const RightContent = (props) => {
  // Sử dụng destructuring cho các props
  const { questions, currentQuestionIndex } = props;

  const onTimeUp = () => {
    alert("endgame");
    // if (handleFinishQuiz) {
    //   handleFinishQuiz();
    // }
  };

  return (
    <div>
      <div className="main-timer">
        <CountDown onTimeUp={onTimeUp} />
      </div>
      <div className="main-question">
        {questions &&
          questions.length > 0 &&
          questions.map((item, index) => {
            return (
              <div
                key={`question-abc-${index}`}
                className={`question ${index === currentQuestionIndex ? "selected" : ""}`}
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
