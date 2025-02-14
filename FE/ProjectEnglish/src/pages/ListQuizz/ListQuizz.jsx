import React from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
import { Link, Outlet, useLocation } from "react-router-dom";

const ListQuizz = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại

    return (
        <>
            {/* Kiểm tra nếu đường dẫn không phải là "/listquizz/quizlet" thì hiển thị ListQuizz */}
            {location.pathname === "/listquizz" && (
                <section className="blog_section layout_padding">
                    <div className="container">
                        <div className="heading_container">
                            <h2>Quizzet</h2>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-lg-4 mx-auto">
                                <div className="box">
                                    <div className="img-box">
                                        <img src={b1} alt="Flashcard" />
                                    </div>
                                    <div className="detail-box">
                                        <h5>Flashcard</h5>
                                        <p>Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.</p>
                                        <a href="">Read More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mx-auto">
                                <div className="box">
                                    <div className="img-box">
                                        <img src={b2} alt="Quiz" />
                                    </div>
                                    <div className="detail-box">
                                        <h5>Quiz</h5>
                                        <p>Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                                        <Link to="quizlet">Read More</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mx-auto">
                                <div className="box">
                                    <div className="img-box">
                                        <img src={b3} alt="Tài liệu" />
                                    </div>
                                    <div className="detail-box">
                                        <h5>Tài liệu</h5>
                                        <p>Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất</p>
                                        <a href="">Read More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Luôn luôn hiển thị component con */}
            <Outlet />
        </>
    );
}

export default ListQuizz;
