import CountDown from "./CountDown";

const RightContent = (props) => {

    // const { dataQuiz } = props;
    const onTimeUp = () => {
        alert("endgame")
        // props.handleFinishQuiz();
    }

    
    return (
        <>
            <div className="main-timer">
                {/* <CountDown/> */}
                <CountDown
                    onTimeUp={onTimeUp}
                />
            </div>
            {/* <div className="main-question">
                {dataQuiz && dataQuiz.length > 0 
                && dataQuiz.map((item, index) => {
                    return (
                        <div key={`question-abc-${index} `}className="question">{index +1}</div>
                    )
                })
            }
        </div > */}


            <div className="main-question">
                <div className="question">B</div>
                <div className="question">A</div>

                <div className="question">B</div>
                <div className="question">A</div>

                <div className="question">B</div>
                <div className="question">A</div>
                <div className="question">A</div>
                <div className="question">A</div>
                <div className="question">A</div>
                <div className="question">A</div>
                <div className="question">A</div>
                <div className="question">A</div>
            </div>
        </>
    )

}

export default RightContent;