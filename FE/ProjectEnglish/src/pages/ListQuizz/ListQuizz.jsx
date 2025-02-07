import React  from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";

const ListQuizz = () => {
return(
    <section class="blog_section layout_padding">
                <div class="container">
                    <div class="heading_container">
                        <h2>
                            Quizzet
                        </h2>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b1} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Flashcard
                                    </h5>
                                    <p>
                                        Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.</p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b2} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Quiz
                                    </h5>
                                    <p>
                                        Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân              </p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b3} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Tài liệu              </h5>
                                    <p>
                                        Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất              </p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
);

}

export default ListQuizz;