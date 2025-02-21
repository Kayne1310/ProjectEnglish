// import _ from "lodash";
import image from "../../../assets/image/b1.jpg"
import "./DetailQuizz.scss"
// const Questions = (props) => {
const Questions = () => {
    // const { data, index } = props;

    // const [isPreviewImage,setIsPreviewImage] = useState();

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
                    <img 
                    onclick={() => setIsPreviewImage(true)}
                    src={`data:image/jpeg;base,${data.image}`} />
                    {isPreviewImage === true &&}
                    <Lightbox
                        image={dataImagePreview.url}
                        title={dataImagePreview.title}
                        onClose={() => setIsPreviewImage(false)} 
                    >
                    </Lightbox>
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
                <div className="answer-options">
                    <button className="answer-option">
                        <span className="answer-option-text">A. Lựa chọn 1</span>
                    </button>
                    <button className="answer-option">
                        <span className="answer-option-text">B. Lựa chọn 2</span>
                    </button>
                    <button className="answer-option">
                        <span className="answer-option-text">C. Lựa chọn 3</span>
                    </button>
                    <button className="answer-option">
                        <span className="answer-option-text">D. Lựa chọn 4</span>
                    </button>
                </div>

            </div>
        </>
    )
}

export default Questions;