import React, { useEffect, useState } from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";

import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

const ListQuizz = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    // Kiểm tra nếu đường dẫn có chứa "detailquiz"
    const isQuizletPage = location.pathname.includes("/listquizz/detailquiz");

    const isHomePage = location.pathname === "/";
    const { quizId } = useParams(); // Lấy quizId từ URL nếu có

    const [arrQuiz, setArrQuiz] = useState([]);

    useEffect(() => {
        // Giả lập dữ liệu thay vì gọi API
        const fakeData = [
            { id: 1, title: "Quiz 1", description: "Mô tả cho Quiz 1", image: b1 },
            { id: 2, title: "Quiz 2", description: "Mô tả cho Quiz 2", image: b2 },
            { id: 3, title: "Quiz 3", description: "Mô tả cho Quiz 3", image: b3 },
            { id: 3, title: "Quiz 3", description: "Mô tả cho Quiz 3", image: b3 },
            { id: 3, title: "Quiz 3", description: "Mô tả cho Quiz 3", image: b3 },
            { id: 3, title: "Quiz 3", description: "Mô tả cho Quiz 3", image: b3 },
            { id: 3, title: "Quiz 3", description: "Mô tả cho Quiz 3", image: b3 },
        ];
        setArrQuiz(fakeData);
    }, []);

    // Tìm quiz hiện tại theo ID (nếu có)
    // const currentQuiz = arrQuiz.find(quiz => quiz.id === Number(quizId));

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
                        <div className="row">
                            {arrQuiz && arrQuiz.length > 0 &&
                                arrQuiz.map((quiz, index) => {
                                    return (

                                        <div key={quiz.id} className="col-md-6 col-lg-4 mx-auto">
                                            <div className="box">
                                                <div className="img-box">
                                                    <img src={quiz.image} alt={`Quiz ${quiz.id}`} />
                                                    {/* <img src= {`data:image/jpeg;base64,${quiz.image}`} alt="Flashcard" /> */}
                                                </div>
                                                <div className="detail-box">
                                                    <h5>{quiz.title}</h5>
                                                    <p>{quiz.description}</p>
                                                    <Link
                                                        to={
                                                            isHomePage
                                                                ? `/listquizz/detailquiz/${quiz.id}`
                                                                : `detailquiz/${quiz.id}`
                                                        }
                                                    >
                                                        Read More
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                    )

                                }
                                )
                            }

                            {arrQuiz && arrQuiz.length === 0 && (
                                <div>You don't have any quiz now...</div>
                            )}
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