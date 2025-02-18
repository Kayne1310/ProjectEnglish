import React, { useEffect, useState } from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const ListQuizz = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const isQuizletPage = location.pathname === "/listquizz/detailquiz";
    //     const [arrQuiz, setArrQuiz] = useState([]);

    //     useEffect(() => {
    //         getQuizData();
    //     }, []);

    //     const getQuizData = async () => {
    //         const res = await getQuizByUser();
    //         if (res && res.EC === 0) {
    //             setArrQuiz(res.DT);
    //         }
    // }

    return (
        <>

            {/* Nếu không phải trang QuizletForm thì hiển thị ListQuizz */}
            {!isQuizletPage && (
                <section className="blog_section layout_padding">
                    <div className="container">
                        <div className="heading_container">
                            <h2>Quizzet</h2>
                        </div>
                        {/* <div className="row">
                            {arrQuiz && arrQuiz.length > 0 &&
                                arrQuiz.map((quiz, index) => {
                                    return (

                                        <div key={`${index}-quiz`} className="col-md-6 col-lg-4 mx-auto">
                                            <div className="box">
                                                <div className="img-box">
                                                    <img src={b1} alt="Flashcard" />
                                                    <img src= {`data:image/jpeg;base64,${quiz.image}`} alt="Flashcard" />
                                                </div>
                                                <div className="detail-box">
                                                    <h5>Quiz{index +1}</h5>
                                                    <p>{quiz.description}</p>
                                                    <Link to="quizlet">Read More</Link>
                                                </div>
                                            </div>
                                        </div>

                                    )

                                }
                                )
                            }

                            {arrQuiz && arrQuiz.length === 0}
                            <div>
                                you don't have any quiz now...
                            </div>
                        </div> */}

                        <div className="row">

                            <div className="col-md-6 col-lg-4 mx-auto">
                                <div className="box">
                                    <div className="img-box">
                                        <img src={b1} alt="Flashcard" />

                                    </div>
                                    <div className="detail-box">
                                        <h5>Quiz</h5>
                                        <p>hok nhieu len do ngu</p>
                                        <Link to="detailquiz">Read More</Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section >
            )}

            {/* Luôn luôn hiển thị component con */}
            <Outlet />
        </>
    );
}

export default ListQuizz;