// import _ from "lodash";
import image from "../../assets/image/b1.jpg"
import "./DetailQuizz.scss"
// const Questions = (props) => {
const Questions = () => {
    // const { data, index } = props;
    // if (_.isEmpty(data)) {
    //     return (<></>)
    // }

    // const handleHanleCheckbox = (event, aId, qId) => {

    //     props.handleCheckbox(aId, qId)
    // }

    return (
        <>
            {/* {data.image ?
                <div className="q-image">
                    <img src={`data:image/jpeg;base,${data.image}`} />
                </div>
                :
                <div className="q-image">

                </div>
            }
            <div className="question">Question {index + 1}:{data.questionDescription}?</div>
            <div className="answer">
                {data.answers && data.answers.length && data.answers.map((a, index) => {
                    return (
                        <div
                            key={`answer-${index}`} c
                            lassName="a-child">

                            <div className="a-child">
                                <div className="form-check">

                                    <input className="form-check-input"
                                        type="checkbox"
                                        checked={a.isSelected}
                                        onChange={(event) => handleHanleCheckbox(event, a.id, data.questionId)}
                                    />
                                    <label className="form-check-label">
                                        {a.description}

                                    </label>
                                </div>
                            </div>
                        </div>
                    )
                }
                )
                }
            </div> */}

            <div className="q-image">
                <img src={image} />
            </div>
            <div className="question">
                question 1: khong co cau hoi nao?
            </div>
            <div className="answer">
                <div className="a-child">
                    <div className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label">
                        A. toi la ai
                    </label>
                </div>
                <div className="a-child">
                    <div className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label">
                        b. toi la ai
                    </label>
                </div>
                <div className="a-child">
                    <div className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label">
                        C. toi la ai
                    </label>
                </div>

                <div className="a-child">
                    <div className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label">
                        D. toi la ai
                    </label>
                </div>

            </div>
        </>
    )
}

export default Questions;