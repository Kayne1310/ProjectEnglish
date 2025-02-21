import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
// import {getDataQuiz, postSubmitQuiz} from "../../service/authService.jsx"
import "./DetailQuizz.scss"
import { Question } from "react-bootstrap-icons";
import Questions from "./question";
import ModalResult from "./ModalResult";
import RightContent from "./RightContentQuiz/RightContent";
// import _ from "lodash";


const DetailQuizz = () => {
    // const params = useParams();
    // const quizId = params.id;
    // const localtion = useLocation();
    // const [dataQuiz, setDataQuiz] = useState([]);
    // const [index, setIndex] = (0);

// state cho modalResult va xu ly logic goi component
    // const [isShowModalResult, setIsShowModalResult] = useState(false)
    // const [dataModalResult, setDataModalResult] = useState({})

    // useEffect(()=> {
    // fecthQuestion();
    // }, [quizId])


    // phần tùy chỉnh data gọi từ backend bằng thư viện lodash vd : gộp các câu trả lời có id bằng nhau (nếu ở backend làm chưa đúng ý)
    // ns tóm gọn là chế biến data theo ý của bên frontend (get)
    
    // const fecthQuestion = async () => {
    //     let response = await getDataQuiz();
    //     if (res && res.EC == 0) {
    //         let raw = res.DT;
    //         let data = _.chain(data)
    //             // Group the elements of Array based on `id` property
    //             .groupBy("id")
    //             // `key` is group's name (color), `value` is the array of objects
    //             .map((value, key) => {
    //                 let answers = [];
    //                 let questionDescription, image = null;

    //                 value.forEach((item, index) => {
    //                     if (index == 0){
    //                         questionDescription = item.questionDescription;
    //                         image = item.image;
    //                     }
    // item.answers.isSelected = false 
    //                     answers.push(item.answers);
    //                     console.log("item answers:", item.answers)
    //                 })
    //                 console.log('key', key, 'value', value)

    //                 return { QuestionId: key, answers: answers, questionDescription, image }
    //             }
    //             )
    //             .value();
    //         console.log(data)
    //     }

    // }

// xy ly chon answers de nhan biet chon value: true or false

    // const handleCheckbox = (answerId, questionId) =>{
    //     let dataQuizClone = __.cloneDeep(dataQuiz);
    //     let question = dataQuizClone.find(item=> +item.questionId === +questionId)
    //     if(question && question.answers){
    //         let b = question.answers.map(item =>{
    //             if (+item.id === +answerId){
    //                 item.isSelected = !item.isSelected;
    //             }
    //             return item;
    //         })
    //         question.answers = b;
    //     }
    //     let index = dataQuizClone.findIndex(item => +item.questionId === +questionId)
    //     if(index > -1) {
    //         dataQuizClone[index] = question;
    //         setDataQuiz(dataQuizClone);
    //     }
    // }

    // // nút Prev ở footer
    //     const handlePrev = () => {
    //         if (index - 1 < 0) return;
    //         setIndex(index - 1)
    //     }
    // // nút Next ở footer
    //     const handleNext = () => {
    //         if (dataQuiz && data.length > index + 1)
    //             setIndex(index + 1)
    //     }


    // build và xử lý data API khi nhấn nút finsish theo cấu trúc mong muốn bên backend
    // tóm gọn là build cấu trúc post data đúng với bên backend

     

    return (
        <>
            {/* <div className="detail-quiz-container">
                <div className="left-content">
                    <div className="title">
                        Quiz {quizId}: {localtion?.state.quizTitle}
                    </div>
                    <hr />
                    <div className="q-body">
                        <img />
                    </div>
                    <div className="q-content">
                        <Questions />
                        < Questions 
                        index ={index} 
                        handleCheckout={handleCheckbox} 
                        data= { dataQuiz[
                        dataQuiz && dataQuiz.length > 0 ?
                        dataQuiz[index]
                        : []
                    ]}/>

                    </div>
                    <div className="footer">
                        <button onClick={() => handlePrev()} className="btn btn-secondary ">Prev</button>
                        <button onClick={() => handleNext()} className="btn btn-primary ">Next</button>
                        <button onClick={() => handleFinishQuiz()} className="btn btn-Warning ">Finish</button>

                    </div>
                </div>
                <div className="right-content">
                   <RightContent 
                dataQuiz={dataQuiz}
                handleFinishQuiz= { handleFinishQuiz}
                />
                </div>

        // goi component va dinh nghia cac bien
                 <ModalResult
                show={isShowModalResult}
                setShow={setIsShowModalResult}
                dataModalResult= {dataModalResult}
            />
            </div> */}
       
            <div className="detail-quiz-container">
                <div className="left-content">
                    <div className="title">
                        Hoc nhieu co ngu di ko?
                    </div>
                    <hr />
                    <div className="q-body">
                        <img />
                    </div>
                    <div className="q-content">
                        <Questions />
                    </div>
                    <div className="footer">
                        <button className="btn btn-secondary ">Prev</button>
                        <button className="btn btn-primary ">Next</button>
                        <button className="btn btn-warning ">Finish</button>
                    </div>
                </div>
                <div className="right-content">
                <RightContent/>
                {/* <RightContent 
                dataQuiz={dataQuiz}
                handleFinishQuiz= { handleFinishQuiz}
                /> */}
                </div>
            </div>
        </>
    );
};

export default DetailQuizz;